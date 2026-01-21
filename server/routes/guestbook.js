const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/guestbook - Get all entries (newest first)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM guestbook_entries ORDER BY created_at DESC'
        );
        res.json({ entries: result.rows });
    } catch (error) {
        console.error('Error fetching guestbook entries:', error);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// POST /api/guestbook - Add new entry
router.post('/', async (req, res) => {
    try {
        const { name, message } = req.body;

        // Validation
        if (!name || !message) {
            return res.status(400).json({
                error: 'Name and message are required'
            });
        }

        // Limit message length
        if (message.length > 500) {
            return res.status(400).json({
                error: 'Message must be 500 characters or less'
            });
        }

        const result = await pool.query(
            `INSERT INTO guestbook_entries (name, message)
             VALUES ($1, $2)
             RETURNING *`,
            [name.trim(), message.trim()]
        );

        res.status(201).json({
            success: true,
            entry: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding guestbook entry:', error);
        res.status(500).json({ error: 'Failed to add entry' });
    }
});

module.exports = router;
