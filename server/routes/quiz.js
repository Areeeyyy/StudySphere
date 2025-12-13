const express = require('express');
const pool = require('../config/db');
const { verifyToken, isInstructor } = require('../middleware/auth');

const router = express.Router();

// GET /api/quiz/:id - Get quiz with questions (hide correct answers)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Get quiz
        const quizResult = await pool.query(`
      SELECT q.*, l.course_id, l.title as lesson_title
      FROM quizzes q
      JOIN lessons l ON q.lesson_id = l.id
      WHERE q.id = $1
    `, [id]);

        if (quizResult.rows.length === 0) {
            return res.status(404).json({ error: 'Quiz not found.' });
        }

        const quiz = quizResult.rows[0];

        // Check enrollment
        const enrollmentCheck = await pool.query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
            [req.user.id, quiz.course_id]
        );

        if (enrollmentCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You must be enrolled in this course to take quizzes.' });
        }

        // Get questions with answers (WITHOUT is_correct field!)
        const questionsResult = await pool.query(`
      SELECT q.id, q.question_text, q.order_index,
             json_agg(json_build_object(
               'id', a.id,
               'answer_text', a.answer_text
             ) ORDER BY a.id) as answers
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      WHERE q.quiz_id = $1
      GROUP BY q.id
      ORDER BY q.order_index
    `, [id]);

        // Check if user already attempted this quiz
        const attemptResult = await pool.query(
            'SELECT score, passed, completed_at FROM user_quiz_results WHERE user_id = $1 AND quiz_id = $2 ORDER BY completed_at DESC LIMIT 1',
            [req.user.id, id]
        );

        res.json({
            quiz: {
                id: quiz.id,
                title: quiz.title,
                lesson_title: quiz.lesson_title,
                passing_score: quiz.passing_score
            },
            questions: questionsResult.rows,
            previous_attempt: attemptResult.rows[0] || null
        });
    } catch (err) {
        console.error('Get quiz error:', err);
        res.status(500).json({ error: 'Failed to get quiz.' });
    }
});

// POST /api/quiz/:id/submit - Submit quiz answers
router.post('/:id/submit', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // Array of { question_id, answer_id }

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'Answers are required.' });
        }

        // Get quiz
        const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
        if (quizResult.rows.length === 0) {
            return res.status(404).json({ error: 'Quiz not found.' });
        }

        const quiz = quizResult.rows[0];

        // Get all correct answers for this quiz
        const correctAnswersResult = await pool.query(`
      SELECT a.id as answer_id, a.question_id
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE q.quiz_id = $1 AND a.is_correct = true
    `, [id]);

        const correctAnswers = correctAnswersResult.rows;
        const totalQuestions = correctAnswers.length;

        // Calculate score (server-side grading!)
        let correctCount = 0;
        const results = [];

        for (const userAnswer of answers) {
            const isCorrect = correctAnswers.some(
                ca => ca.question_id === userAnswer.question_id && ca.answer_id === userAnswer.answer_id
            );
            if (isCorrect) correctCount++;

            // Find the correct answer for this question
            const correctAnswer = correctAnswers.find(ca => ca.question_id === userAnswer.question_id);
            results.push({
                question_id: userAnswer.question_id,
                selected_answer_id: userAnswer.answer_id,
                correct_answer_id: correctAnswer ? correctAnswer.answer_id : null,
                is_correct: isCorrect
            });
        }

        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= quiz.passing_score;

        // Save result
        await pool.query(`
      INSERT INTO user_quiz_results (user_id, quiz_id, score, passed)
      VALUES ($1, $2, $3, $4)
    `, [req.user.id, id, score, passed]);

        // Award points if passed
        if (passed) {
            await pool.query(
                'UPDATE users SET points = points + $1 WHERE id = $2',
                [10, req.user.id] // 10 points per passed quiz
            );
        }

        res.json({
            score,
            passed,
            correct_count: correctCount,
            total_questions: totalQuestions,
            passing_score: quiz.passing_score,
            results
        });
    } catch (err) {
        console.error('Submit quiz error:', err);
        res.status(500).json({ error: 'Failed to submit quiz.' });
    }
});

// POST /api/quiz - Create quiz for a lesson (Instructor only)
router.post('/', verifyToken, isInstructor, async (req, res) => {
    try {
        const { lesson_id, title, passing_score = 70, questions } = req.body;

        if (!lesson_id || !title) {
            return res.status(400).json({ error: 'Lesson ID and title are required.' });
        }

        // Check lesson ownership through course
        const ownerCheck = await pool.query(`
      SELECT c.instructor_id 
      FROM lessons l 
      JOIN courses c ON l.course_id = c.id 
      WHERE l.id = $1
    `, [lesson_id]);

        if (ownerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lesson not found.' });
        }

        if (ownerCheck.rows[0].instructor_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only add quizzes to your own lessons.' });
        }

        // Create quiz
        const quizResult = await pool.query(`
      INSERT INTO quizzes (lesson_id, title, passing_score)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [lesson_id, title, passing_score]);

        const quiz = quizResult.rows[0];

        // Add questions if provided
        if (questions && Array.isArray(questions)) {
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                const questionResult = await pool.query(`
          INSERT INTO questions (quiz_id, question_text, order_index)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [quiz.id, q.question_text, i + 1]);

                const questionId = questionResult.rows[0].id;

                // Add answers
                if (q.answers && Array.isArray(q.answers)) {
                    for (const a of q.answers) {
                        await pool.query(`
              INSERT INTO answers (question_id, answer_text, is_correct)
              VALUES ($1, $2, $3)
            `, [questionId, a.answer_text, a.is_correct || false]);
                    }
                }
            }
        }

        res.status(201).json({ quiz });
    } catch (err) {
        console.error('Create quiz error:', err);
        res.status(500).json({ error: 'Failed to create quiz.' });
    }
});

module.exports = router;
