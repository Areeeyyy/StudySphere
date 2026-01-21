const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const nodemailer = require('nodemailer');

// Configure email transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email notification
const sendEmailNotification = async (contactData) => {
    const { name, email, subject, message } = contactData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `[StudySphere Contact] ${subject || 'New Message'} - from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #7c3aed, #5b21b6); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: white; margin: 0;">📩 New Contact Form Submission</h2>
                </div>
                <div style="background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                    <p><strong>Message:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                        Sent from StudySphere Contact Form
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✉️  Email notification sent successfully');
    } catch (error) {
        console.error('Failed to send email notification:', error.message);
    }
};

// POST /api/contact - Submit a contact message (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Name, email, and message are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Save to database
        const result = await pool.query(
            `INSERT INTO contact_messages (name, email, subject, message)
             VALUES ($1, $2, $3, $4)
             RETURNING id, created_at`,
            [name, email, subject || null, message]
        );

        // Send email notification (async, don't wait)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            sendEmailNotification({ name, email, subject, message });
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            id: result.rows[0].id,
            created_at: result.rows[0].created_at
        });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

// GET /api/contact - Get all messages (for admin, optional)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        res.json({ messages: result.rows });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
