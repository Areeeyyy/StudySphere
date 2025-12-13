const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile - Get current user profile with stats
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Get user info
        const userResult = await pool.query(`
      SELECT id, email, full_name, role, avatar_url, points, created_at
      FROM users WHERE id = $1
    `, [req.user.id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = userResult.rows[0];

        // Get stats
        const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM enrollments WHERE user_id = $1) as enrolled_courses,
        (SELECT COUNT(*) FROM enrollments WHERE user_id = $1 AND progress = 100) as completed_courses,
        (SELECT COUNT(*) FROM user_achievements WHERE user_id = $1) as achievements_earned,
        (SELECT COUNT(*) FROM user_quiz_results WHERE user_id = $1 AND passed = true) as quizzes_passed
    `, [req.user.id]);

        res.json({
            user,
            stats: statsResult.rows[0]
        });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ error: 'Failed to get profile.' });
    }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { full_name, avatar_url } = req.body;

        const result = await pool.query(`
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          avatar_url = COALESCE($2, avatar_url)
      WHERE id = $3
      RETURNING id, email, full_name, role, avatar_url, points
    `, [full_name, avatar_url, req.user.id]);

        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// GET /api/users/achievements - Get user achievements
router.get('/achievements', verifyToken, async (req, res) => {
    try {
        // Get earned achievements
        const earnedResult = await pool.query(`
      SELECT a.*, ua.earned_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
      ORDER BY ua.earned_at DESC
    `, [req.user.id]);

        // Get all achievements (for showing locked ones)
        const allResult = await pool.query('SELECT * FROM achievements ORDER BY points DESC');

        const earned = earnedResult.rows;
        const earnedIds = earned.map(e => e.id);
        const locked = allResult.rows.filter(a => !earnedIds.includes(a.id));

        // Calculate total points from achievements
        const totalPoints = earned.reduce((sum, a) => sum + a.points, 0);

        res.json({
            earned,
            locked,
            total_earned: earned.length,
            total_available: allResult.rows.length,
            total_points: totalPoints
        });
    } catch (err) {
        console.error('Get achievements error:', err);
        res.status(500).json({ error: 'Failed to get achievements.' });
    }
});

// GET /api/users/messages - Get user messages
router.get('/messages', verifyToken, async (req, res) => {
    try {
        // Get conversations (grouped by sender/receiver)
        const result = await pool.query(`
      SELECT DISTINCT ON (other_user_id)
        CASE 
          WHEN sender_id = $1 THEN receiver_id 
          ELSE sender_id 
        END as other_user_id,
        u.full_name as other_user_name,
        u.avatar_url as other_user_avatar,
        m.content as last_message,
        m.sent_at as last_message_time,
        (SELECT COUNT(*) FROM messages 
         WHERE receiver_id = $1 AND sender_id = 
           CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
         AND is_read = false) as unread_count
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY other_user_id, m.sent_at DESC
    `, [req.user.id]);

        res.json({ conversations: result.rows });
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Failed to get messages.' });
    }
});

// GET /api/users/messages/:userId - Get messages with specific user
router.get('/messages/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(`
      SELECT m.*, 
             sender.full_name as sender_name, sender.avatar_url as sender_avatar
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.sent_at ASC
    `, [req.user.id, userId]);

        // Mark messages as read
        await pool.query(`
      UPDATE messages SET is_read = true 
      WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
    `, [req.user.id, userId]);

        res.json({ messages: result.rows });
    } catch (err) {
        console.error('Get conversation error:', err);
        res.status(500).json({ error: 'Failed to get conversation.' });
    }
});

// POST /api/users/messages - Send a message
router.post('/messages', verifyToken, async (req, res) => {
    try {
        const { receiver_id, content } = req.body;

        if (!receiver_id || !content) {
            return res.status(400).json({ error: 'Receiver and content are required.' });
        }

        const result = await pool.query(`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [req.user.id, receiver_id, content]);

        res.status(201).json({ message: result.rows[0] });
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

module.exports = router;
