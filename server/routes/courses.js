const express = require('express');
const pool = require('../config/db');
const { verifyToken, isInstructor, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - Get all published courses
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { category, difficulty, search, page = 1, limit = 12 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
      SELECT c.*, u.full_name as instructor_name, u.avatar_url as instructor_avatar,
             COUNT(e.id) as enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.is_published = true
    `;
        const params = [];
        let paramCount = 0;

        if (category) {
            paramCount++;
            query += ` AND c.category = $${paramCount}`;
            params.push(category);
        }

        if (difficulty) {
            paramCount++;
            query += ` AND c.difficulty = $${paramCount}`;
            params.push(difficulty);
        }

        if (search) {
            paramCount++;
            query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ` GROUP BY c.id, u.full_name, u.avatar_url ORDER BY c.created_at DESC`;

        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(limit);

        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(offset);

        const result = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM courses WHERE is_published = true';
        const countParams = [];
        let countParamNum = 0;

        if (category) {
            countParamNum++;
            countQuery += ` AND category = $${countParamNum}`;
            countParams.push(category);
        }
        if (difficulty) {
            countParamNum++;
            countQuery += ` AND difficulty = $${countParamNum}`;
            countParams.push(difficulty);
        }
        if (search) {
            countParamNum++;
            countQuery += ` AND (title ILIKE $${countParamNum} OR description ILIKE $${countParamNum})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalCourses = parseInt(countResult.rows[0].count);

        res.json({
            courses: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCourses,
                totalPages: Math.ceil(totalCourses / limit)
            }
        });
    } catch (err) {
        console.error('Get courses error:', err);
        res.status(500).json({ error: 'Failed to get courses.' });
    }
});

// GET /api/courses/enrolled - Get user's enrolled courses
router.get('/enrolled', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT c.*, e.progress, e.enrolled_at, u.full_name as instructor_name,
             (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as lesson_count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
    `, [req.user.id]);

        res.json({ courses: result.rows });
    } catch (err) {
        console.error('Get enrolled courses error:', err);
        res.status(500).json({ error: 'Failed to get enrolled courses.' });
    }
});

// GET /api/courses/:id - Get course details with lessons
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Get course
        const courseResult = await pool.query(`
      SELECT c.*, u.full_name as instructor_name, u.avatar_url as instructor_avatar
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = $1
    `, [id]);

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        const course = courseResult.rows[0];

        // Get lessons
        const lessonsResult = await pool.query(`
      SELECT id, title, duration_minutes, order_index
      FROM lessons
      WHERE course_id = $1
      ORDER BY order_index ASC
    `, [id]);

        // Check if user is enrolled (if authenticated)
        let isEnrolled = false;
        let progress = 0;
        if (req.user) {
            const enrollmentResult = await pool.query(
                'SELECT progress FROM enrollments WHERE user_id = $1 AND course_id = $2',
                [req.user.id, id]
            );
            if (enrollmentResult.rows.length > 0) {
                isEnrolled = true;
                progress = enrollmentResult.rows[0].progress;
            }
        }

        res.json({
            course,
            lessons: lessonsResult.rows,
            isEnrolled,
            progress
        });
    } catch (err) {
        console.error('Get course error:', err);
        res.status(500).json({ error: 'Failed to get course.' });
    }
});

// POST /api/courses - Create new course (Instructor only)
router.post('/', verifyToken, isInstructor, async (req, res) => {
    try {
        const { title, description, thumbnail_url, category, difficulty = 'beginner' } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Course title is required.' });
        }

        const result = await pool.query(`
      INSERT INTO courses (title, description, thumbnail_url, category, difficulty, instructor_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, thumbnail_url, category, difficulty, req.user.id]);

        res.status(201).json({ course: result.rows[0] });
    } catch (err) {
        console.error('Create course error:', err);
        res.status(500).json({ error: 'Failed to create course.' });
    }
});

// PUT /api/courses/:id - Update course (Instructor only)
router.put('/:id', verifyToken, isInstructor, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnail_url, category, difficulty, is_published } = req.body;

        // Check ownership
        const ownerCheck = await pool.query(
            'SELECT instructor_id FROM courses WHERE id = $1',
            [id]
        );

        if (ownerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        if (ownerCheck.rows[0].instructor_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only edit your own courses.' });
        }

        const result = await pool.query(`
      UPDATE courses 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          thumbnail_url = COALESCE($3, thumbnail_url),
          category = COALESCE($4, category),
          difficulty = COALESCE($5, difficulty),
          is_published = COALESCE($6, is_published),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [title, description, thumbnail_url, category, difficulty, is_published, id]);

        res.json({ course: result.rows[0] });
    } catch (err) {
        console.error('Update course error:', err);
        res.status(500).json({ error: 'Failed to update course.' });
    }
});

// POST /api/courses/:id/enroll - Enroll in a course
router.post('/:id/enroll', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course exists
        const courseCheck = await pool.query('SELECT id FROM courses WHERE id = $1', [id]);
        if (courseCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        // Check if already enrolled
        const enrollmentCheck = await pool.query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
            [req.user.id, id]
        );

        if (enrollmentCheck.rows.length > 0) {
            return res.status(400).json({ error: 'You are already enrolled in this course.' });
        }

        // Create enrollment
        const result = await pool.query(`
      INSERT INTO enrollments (user_id, course_id)
      VALUES ($1, $2)
      RETURNING *
    `, [req.user.id, id]);

        res.status(201).json({
            message: 'Successfully enrolled in course.',
            enrollment: result.rows[0]
        });
    } catch (err) {
        console.error('Enroll error:', err);
        res.status(500).json({ error: 'Failed to enroll in course.' });
    }
});

// POST /api/courses/:id/lessons - Add lesson to course (Instructor only)
router.post('/:id/lessons', verifyToken, isInstructor, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, video_url, duration_minutes = 0 } = req.body;

        // Check ownership
        const ownerCheck = await pool.query(
            'SELECT instructor_id FROM courses WHERE id = $1',
            [id]
        );

        if (ownerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        if (ownerCheck.rows[0].instructor_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only add lessons to your own courses.' });
        }

        // Get next order index
        const orderResult = await pool.query(
            'SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM lessons WHERE course_id = $1',
            [id]
        );
        const order_index = orderResult.rows[0].next_order;

        const result = await pool.query(`
      INSERT INTO lessons (course_id, title, content, video_url, duration_minutes, order_index)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, title, content, video_url, duration_minutes, order_index]);

        res.status(201).json({ lesson: result.rows[0] });
    } catch (err) {
        console.error('Add lesson error:', err);
        res.status(500).json({ error: 'Failed to add lesson.' });
    }
});

// GET /api/courses/:courseId/lessons/:lessonId - Get lesson details
router.get('/:courseId/lessons/:lessonId', verifyToken, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        // Check enrollment
        const enrollmentCheck = await pool.query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
            [req.user.id, courseId]
        );

        if (enrollmentCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You must be enrolled in this course to view lessons.' });
        }

        // Get lesson
        const lessonResult = await pool.query(`
      SELECT l.*, 
             (SELECT id FROM quizzes WHERE lesson_id = l.id LIMIT 1) as quiz_id
      FROM lessons l
      WHERE l.id = $1 AND l.course_id = $2
    `, [lessonId, courseId]);

        if (lessonResult.rows.length === 0) {
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        // Check/create lesson progress
        await pool.query(`
      INSERT INTO user_lesson_progress (user_id, lesson_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, lesson_id) DO NOTHING
    `, [req.user.id, lessonId]);

        res.json({ lesson: lessonResult.rows[0] });
    } catch (err) {
        console.error('Get lesson error:', err);
        res.status(500).json({ error: 'Failed to get lesson.' });
    }
});

// POST /api/courses/:courseId/lessons/:lessonId/complete - Mark lesson complete
router.post('/:courseId/lessons/:lessonId/complete', verifyToken, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        // Update lesson progress
        await pool.query(`
      UPDATE user_lesson_progress 
      SET completed = true, completed_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND lesson_id = $2
    `, [req.user.id, lessonId]);

        // Calculate and update course progress
        const progressResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM lessons WHERE course_id = $1) as total_lessons,
        (SELECT COUNT(*) FROM user_lesson_progress ulp
         JOIN lessons l ON ulp.lesson_id = l.id
         WHERE ulp.user_id = $2 AND l.course_id = $1 AND ulp.completed = true) as completed_lessons
    `, [courseId, req.user.id]);

        const { total_lessons, completed_lessons } = progressResult.rows[0];
        const progress = Math.round((completed_lessons / total_lessons) * 100);

        await pool.query(`
      UPDATE enrollments SET progress = $1 WHERE user_id = $2 AND course_id = $3
    `, [progress, req.user.id, courseId]);

        res.json({
            message: 'Lesson marked as complete.',
            progress,
            completed_lessons: parseInt(completed_lessons),
            total_lessons: parseInt(total_lessons)
        });
    } catch (err) {
        console.error('Complete lesson error:', err);
        res.status(500).json({ error: 'Failed to mark lesson complete.' });
    }
});

module.exports = router;
