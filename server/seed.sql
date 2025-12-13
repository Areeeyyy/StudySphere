-- Sample data for StudySphere E-Learning Platform
-- Run this AFTER schema.sql

-- Insert sample instructor
INSERT INTO users (email, password_hash, full_name, role, avatar_url) VALUES
('instructor@studysphere.com', '$2a$10$8K1p/b7MJCj7a/7O2kV1pOqO8SqFu.m7p1QoE8tLMD.Vqw1NzB3iy', 'Dr. Anya Sharma', 'instructor', NULL),
('prof.chen@studysphere.com', '$2a$10$8K1p/b7MJCj7a/7O2kV1pOqO8SqFu.m7p1QoE8tLMD.Vqw1NzB3iy', 'Prof. Chen', 'instructor', NULL);
-- Password for both: password123

-- Insert sample student
INSERT INTO users (email, password_hash, full_name, role, points) VALUES
('student@studysphere.com', '$2a$10$8K1p/b7MJCj7a/7O2kV1pOqO8SqFu.m7p1QoE8tLMD.Vqw1NzB3iy', 'John Student', 'student', 150);
-- Password: password123

-- Insert sample courses
INSERT INTO courses (title, description, thumbnail_url, category, difficulty, instructor_id, is_published, rating, review_count) VALUES
('Algebra Basics', 'Master the fundamentals of algebra including equations, expressions, and problem-solving techniques.', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop', 'Mathematics', 'beginner', 1, true, 4.8, 120),
('Literary Analysis', 'Learn to analyze literature, understand themes, and develop critical reading skills.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop', 'Literature', 'intermediate', 2, true, 4.6, 85),
('Chemical Reactions', 'Explore the world of chemistry through interactive lessons on chemical reactions and molecular structures.', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=200&fit=crop', 'Science', 'intermediate', 1, true, 4.7, 95),
('World History: Ancient Civilizations', 'Journey through time and discover the rise and fall of ancient civilizations.', 'https://images.unsplash.com/photo-1608425618950-a3c9a4d6e84d?w=400&h=200&fit=crop', 'History', 'beginner', 2, true, 4.9, 200),
('Calculus Mastery', 'Advanced calculus concepts including derivatives, integrals, and real-world applications.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=200&fit=crop', 'Mathematics', 'advanced', 1, true, 4.5, 60),
('Creative Writing Workshop', 'Unleash your creativity and develop your writing skills through guided exercises.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop', 'Literature', 'beginner', 2, true, 4.8, 150);

-- Insert sample lessons for Algebra Basics course
INSERT INTO lessons (course_id, title, content, duration_minutes, order_index) VALUES
(1, 'Introduction to Algebra', 'Welcome to algebra! In this lesson, we will explore what algebra is and why it matters.', 15, 1),
(1, 'Variables and Expressions', 'Learn about variables, constants, and how to write algebraic expressions.', 20, 2),
(1, 'Solving Linear Equations', 'Master the techniques for solving equations with one variable.', 25, 3),
(1, 'Graphing Linear Functions', 'Understand how to plot linear equations on a coordinate plane.', 30, 4),
(1, 'Practice Problems', 'Test your knowledge with practice problems and quizzes.', 20, 5);

-- Insert sample lessons for Literary Analysis course
INSERT INTO lessons (course_id, title, content, duration_minutes, order_index) VALUES
(2, 'What is Literary Analysis?', 'An introduction to the art of analyzing literature.', 20, 1),
(2, 'Understanding Themes', 'How to identify and analyze themes in literary works.', 25, 2),
(2, 'Character Development', 'Exploring how authors create and develop characters.', 25, 3),
(2, 'Symbolism and Imagery', 'Discover the power of symbols and imagery in literature.', 30, 4);

-- Insert sample quiz for Algebra Basics
INSERT INTO quizzes (lesson_id, title, passing_score) VALUES
(1, 'Algebra Basics Quiz', 70);

-- Insert questions for the quiz
INSERT INTO questions (quiz_id, question_text, order_index) VALUES
(1, 'What is a variable in algebra?', 1),
(1, 'Solve for x: 2x + 4 = 10', 2),
(1, 'Which expression represents "5 more than a number n"?', 3);

-- Insert answers (correct answers marked as true)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(1, 'A letter that represents an unknown value', true),
(1, 'A fixed number that never changes', false),
(1, 'A mathematical operation', false),
(1, 'The answer to an equation', false),
(2, 'x = 3', true),
(2, 'x = 7', false),
(2, 'x = 2', false),
(2, 'x = 5', false),
(3, 'n + 5', true),
(3, '5n', false),
(3, 'n - 5', false),
(3, '5 / n', false);

-- Grant the sample student enrollment in two courses
INSERT INTO enrollments (user_id, course_id, progress) VALUES
(3, 1, 40),
(3, 2, 20);

-- Grant sample achievements to the student
INSERT INTO user_achievements (user_id, achievement_id) VALUES
(3, 1),
(3, 2);
