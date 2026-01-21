const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/counter - Get current visitor count
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT count FROM site_visits WHERE id = 1');

        if (result.rows.length === 0) {
            // Initialize if not exists
            await pool.query('INSERT INTO site_visits (id, count) VALUES (1, 0) ON CONFLICT DO NOTHING');
            return res.json({ count: 0 });
        }

        res.json({ count: result.rows[0].count });
    } catch (error) {
        console.error('Error getting counter:', error);
        res.status(500).json({ error: 'Failed to get visitor count' });
    }
});

// POST /api/counter/increment - Increment visitor count
router.post('/increment', async (req, res) => {
    try {
        const result = await pool.query(
            `INSERT INTO site_visits (id, count, last_visited) 
             VALUES (1, 1, CURRENT_TIMESTAMP)
             ON CONFLICT (id) 
             DO UPDATE SET count = site_visits.count + 1, last_visited = CURRENT_TIMESTAMP
             RETURNING count`
        );

        res.json({ count: result.rows[0].count });
    } catch (error) {
        console.error('Error incrementing counter:', error);
        res.status(500).json({ error: 'Failed to increment visitor count' });
    }
});

module.exports = router;
