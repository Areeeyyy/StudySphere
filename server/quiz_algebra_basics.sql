-- Quiz data for Algebra Basics Course (Course ID: 1)
-- Each lesson (1-5) gets its own quiz with 15 questions

-- Delete existing quizzes for these lessons to avoid duplicates
DELETE FROM quizzes WHERE lesson_id IN (1, 2, 3, 4, 5);

-- =====================================================
-- LESSON 1: Introduction to Algebra (lesson_id = 1)
-- =====================================================
INSERT INTO quizzes (lesson_id, title, passing_score) VALUES (1, 'Introduction to Algebra Quiz', 70);

-- Get the quiz_id for lesson 1 (should be the next available ID)
-- Using a DO block to handle this properly
DO $$
DECLARE
    quiz1_id INTEGER;
    quiz2_id INTEGER;
    quiz3_id INTEGER;
    quiz4_id INTEGER;
    quiz5_id INTEGER;
    q_id INTEGER;
BEGIN
    -- Create quizzes and store their IDs
    SELECT id INTO quiz1_id FROM quizzes WHERE lesson_id = 1 ORDER BY id DESC LIMIT 1;
    
    INSERT INTO quizzes (lesson_id, title, passing_score) VALUES (2, 'Variables and Expressions Quiz', 70) RETURNING id INTO quiz2_id;
    INSERT INTO quizzes (lesson_id, title, passing_score) VALUES (3, 'Solving Linear Equations Quiz', 70) RETURNING id INTO quiz3_id;
    INSERT INTO quizzes (lesson_id, title, passing_score) VALUES (4, 'Graphing Linear Functions Quiz', 70) RETURNING id INTO quiz4_id;
    INSERT INTO quizzes (lesson_id, title, passing_score) VALUES (5, 'Practice Problems Quiz', 70) RETURNING id INTO quiz5_id;

    -- =====================================================
    -- QUIZ 1: Introduction to Algebra (15 questions)
    -- =====================================================
    
    -- Q1
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which of the following best defines a "variable" in algebra?', 1) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'A fixed number that never changes.', false),
    (q_id, 'A symbol, usually a letter, used to represent an unknown or changing number.', true),
    (q_id, 'The result of a multiplication problem.', false),
    (q_id, 'A fraction with a denominator of zero.', false),
    (q_id, 'A geometric shape.', false);

    -- Q2
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'According to the order of operations (PEMDAS/BODMAS), which operation should be performed first in the expression 4 + 3 × 2?', 2) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Addition (4 + 3)', false),
    (q_id, 'Multiplication (3 × 2)', true),
    (q_id, 'Division', false),
    (q_id, 'It does not matter.', false),
    (q_id, 'Subtraction', false);

    -- Q3
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'What is the sum of -5 and -3?', 3) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-2', false),
    (q_id, '2', false),
    (q_id, '8', false),
    (q_id, '-8', true),
    (q_id, '15', false);

    -- Q4
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which property states that a + b = b + a?', 4) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Associative Property', false),
    (q_id, 'Distributive Property', false),
    (q_id, 'Commutative Property', true),
    (q_id, 'Identity Property', false),
    (q_id, 'Inverse Property', false);

    -- Q5
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'What is the value of |-7|?', 5) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-7', false),
    (q_id, '7', true),
    (q_id, '0', false),
    (q_id, '1/7', false),
    (q_id, '-1/7', false);

    -- Q6
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which of the following is an example of an integer?', 6) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1/2', false),
    (q_id, '0.75', false),
    (q_id, '-4', true),
    (q_id, 'π', false),
    (q_id, '√2', false);

    -- Q7
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'What is the result of dividing any non-zero number by zero?', 7) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '0', false),
    (q_id, '1', false),
    (q_id, 'The number itself.', false),
    (q_id, 'Undefined', true),
    (q_id, 'Infinity', false);

    -- Q8
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'In the expression 5³, what is the number 3 called?', 8) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Base', false),
    (q_id, 'Coefficient', false),
    (q_id, 'Exponent', true),
    (q_id, 'Variable', false),
    (q_id, 'Product', false);

    -- Q9
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which of the following represents the Additive Identity?', 9) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '0', true),
    (q_id, 'x', false),
    (q_id, '-1', false),
    (q_id, '10', false);

    -- Q10
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'What is the result of -6 - (-2)?', 10) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-8', false),
    (q_id, '-4', true),
    (q_id, '4', false),
    (q_id, '8', false),
    (q_id, '12', false);

    -- Q11
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which operation is the inverse of multiplication?', 11) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Addition', false),
    (q_id, 'Subtraction', false),
    (q_id, 'Division', true),
    (q_id, 'Exponentiation', false),
    (q_id, 'Absolute Value', false);

    -- Q12
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Evaluate: 2(3 + 4).', 12) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '10', false),
    (q_id, '14', true),
    (q_id, '9', false),
    (q_id, '24', false),
    (q_id, '7', false);

    -- Q13
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which of the following lists integers in order from least to greatest?', 13) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-5, -2, 0, 3', true),
    (q_id, '0, -2, 3, -5', false),
    (q_id, '3, 0, -2, -5', false),
    (q_id, '-2, -5, 0, 3', false),
    (q_id, '-5, 0, -2, 3', false);

    -- Q14
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'What is the value of 3⁰?', 14) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '0', false),
    (q_id, '1', true),
    (q_id, '3', false),
    (q_id, 'Undefined', false),
    (q_id, '30', false);

    -- Q15
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz1_id, 'Which property justifies the statement 5(x + 2) = 5x + 10?', 15) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Associative Property', false),
    (q_id, 'Commutative Property', false),
    (q_id, 'Distributive Property', true),
    (q_id, 'Identity Property', false),
    (q_id, 'Zero Product Property', false);

    -- =====================================================
    -- QUIZ 2: Variables and Expressions (15 questions)
    -- =====================================================

    -- Q1
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Evaluate the expression 3x + 5 when x = 4.', 1) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '12', false),
    (q_id, '17', true),
    (q_id, '9', false),
    (q_id, '23', false),
    (q_id, '39', false);

    -- Q2
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'What is the coefficient of x in the term 7x?', 2) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'x', false),
    (q_id, '7', true),
    (q_id, '7x', false),
    (q_id, '1', false),
    (q_id, '0', false);

    -- Q3
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Which terms are "like terms" in the expression 3x + 2y - 5x + 7?', 3) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '3x and 2y', false),
    (q_id, '2y and 7', false),
    (q_id, '3x and -5x', true),
    (q_id, '3x, 2y, and 7', false),
    (q_id, 'There are no like terms.', false);

    -- Q4
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Translate the phrase "the product of 4 and a number" into an algebraic expression.', 4) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '4 + x', false),
    (q_id, '4 - x', false),
    (q_id, '4/x', false),
    (q_id, '4x', true),
    (q_id, 'x⁴', false);

    -- Q5
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Simplify the expression: 2a + 3a + 5b.', 5) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '10ab', false),
    (q_id, '5a + 5b', true),
    (q_id, '5a² + 5b', false),
    (q_id, '10a + b', false),
    (q_id, '6a + 5b', false);

    -- Q6
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Evaluate x² - y when x = -3 and y = 5.', 6) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-14', false),
    (q_id, '-11', false),
    (q_id, '4', true),
    (q_id, '14', false),
    (q_id, '1', false);

    -- Q7
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'How many terms are in the expression 4x² + 3x - 9?', 7) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '2', false),
    (q_id, '3', true),
    (q_id, '4', false),
    (q_id, '9', false);

    -- Q8
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Translate "5 less than a number y" into an expression.', 8) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '5 - y', false),
    (q_id, 'y - 5', true),
    (q_id, '5 < y', false),
    (q_id, 'y < 5', false),
    (q_id, '5y', false);

    -- Q9
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Simplify: 3(x - 2) + 4.', 9) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '3x - 2', true),
    (q_id, '3x + 2', false),
    (q_id, '3x - 6', false),
    (q_id, '3x - 2 + 4', false),
    (q_id, '3x - 10', false);

    -- Q10
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'What is the constant term in the expression 2x² + 5x - 8?', 10) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '2', false),
    (q_id, '5', false),
    (q_id, 'x', false),
    (q_id, '-8', true),
    (q_id, '8', false);

    -- Q11
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Which expression represents the perimeter of a rectangle with length L and width W?', 11) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'L × W', false),
    (q_id, '2L + 2W', true),
    (q_id, 'L + W', false),
    (q_id, '0.5 × L × W', false),
    (q_id, 'L² + W²', false);

    -- Q12
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Evaluate 10/x when x = 2.', 12) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '5', true),
    (q_id, '20', false),
    (q_id, '12', false),
    (q_id, '8', false),
    (q_id, '0.2', false);

    -- Q13
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Simplify: x + x + x.', 13) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'x³', false),
    (q_id, '3x', true),
    (q_id, '3 + x', false),
    (q_id, 'x + 3', false),
    (q_id, '3x³', false);

    -- Q14
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Which of the following is an equation, not just an expression?', 14) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '3x + 5', false),
    (q_id, '7y - 2', false),
    (q_id, '2x = 10', true),
    (q_id, 'a + b', false),
    (q_id, '5(x-1)', false);

    -- Q15
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz2_id, 'Evaluate 2(a + b) if a = 3 and b = -1.', 15) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '4', true),
    (q_id, '5', false),
    (q_id, '6', false),
    (q_id, '8', false),
    (q_id, '2', false);

    -- =====================================================
    -- QUIZ 3: Solving Linear Equations (15 questions)
    -- =====================================================

    -- Q1
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'To solve x + 7 = 12, what operation should you perform on both sides?', 1) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Add 7', false),
    (q_id, 'Subtract 7', true),
    (q_id, 'Multiply by 7', false),
    (q_id, 'Divide by 7', false),
    (q_id, 'Square both sides', false);

    -- Q2
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve for x: 3x = 15.', 2) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'x = 3', false),
    (q_id, 'x = 5', true),
    (q_id, 'x = 12', false),
    (q_id, 'x = 18', false),
    (q_id, 'x = 45', false);

    -- Q3
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve for y: y/4 = 3.', 3) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '0.75', false),
    (q_id, '1.33', false),
    (q_id, '7', false),
    (q_id, '12', true),
    (q_id, '1', false);

    -- Q4
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'What is the first step to solve 2x + 1 = 9?', 4) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Divide by 2', false),
    (q_id, 'Subtract 1', true),
    (q_id, 'Add 1', false),
    (q_id, 'Multiply by 2', false),
    (q_id, 'Move the x', false);

    -- Q5
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve for x: 2x - 5 = 7.', 5) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '6', true),
    (q_id, '12', false),
    (q_id, '24', false),
    (q_id, '2', false);

    -- Q6
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve: -x = 5.', 6) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '5', false),
    (q_id, '-5', true),
    (q_id, '0', false),
    (q_id, 'Undefined', false),
    (q_id, '1', false);

    -- Q7
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve: 3(x + 1) = 9.', 7) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '2', true),
    (q_id, '3', false),
    (q_id, '4', false),
    (q_id, '2.6', false);

    -- Q8
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'If 5x = 0, what is x?', 8) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '5', false),
    (q_id, '1', false),
    (q_id, '0', true),
    (q_id, '-5', false),
    (q_id, 'Undefined', false);

    -- Q9
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve for x: 4x + 2x = 12.', 9) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '2', true),
    (q_id, '3', false),
    (q_id, '4', false),
    (q_id, '6', false);

    -- Q10
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'When solving 2x + 4 = 2x + 5, what is the result?', 10) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'x = 0', false),
    (q_id, 'x = 1', false),
    (q_id, 'x = 9', false),
    (q_id, 'No Solution', true),
    (q_id, 'Infinite Solutions', false);

    -- Q11
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve for a: 2a - 3 = a + 5.', 11) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '2', false),
    (q_id, '5', false),
    (q_id, '8', true),
    (q_id, '-8', false),
    (q_id, '0', false);

    -- Q12
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Which equation represents "Three times a number is equal to the number plus ten"?', 12) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '3x = x + 10', true),
    (q_id, '3 + x = x + 10', false),
    (q_id, '3x = 10x', false),
    (q_id, 'x³ = x + 10', false),
    (q_id, '3(x+10) = x', false);

    -- Q13
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'In the literal equation D = rt, how do you solve for r?', 13) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'r = Dt', false),
    (q_id, 'r = D/t', true),
    (q_id, 'r = t/D', false),
    (q_id, 'r = D - t', false),
    (q_id, 'r = D + t', false);

    -- Q14
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'Solve: (2/3)x = 6.', 14) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '4', false),
    (q_id, '9', true),
    (q_id, '12', false),
    (q_id, '3', false),
    (q_id, '18', false);

    -- Q15
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz3_id, 'What is the value of x in 10 - 2x = 4?', 15) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '3', true),
    (q_id, '-3', false),
    (q_id, '7', false),
    (q_id, '-7', false),
    (q_id, '2', false);

    -- =====================================================
    -- QUIZ 4: Graphing Linear Functions (15 questions)
    -- =====================================================

    -- Q1
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'In the Cartesian plane, the horizontal number line is called the:', 1) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'y-axis', false),
    (q_id, 'x-axis', true),
    (q_id, 'Origin', false),
    (q_id, 'Quadrant', false),
    (q_id, 'Hypotenuse', false);

    -- Q2
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'Which point represents the Origin?', 2) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '(1, 1)', false),
    (q_id, '(0, 1)', false),
    (q_id, '(1, 0)', false),
    (q_id, '(0, 0)', true),
    (q_id, '(-1, -1)', false);

    -- Q3
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'In which quadrant are both x and y coordinates negative?', 3) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Quadrant I', false),
    (q_id, 'Quadrant II', false),
    (q_id, 'Quadrant III', true),
    (q_id, 'Quadrant IV', false),
    (q_id, 'The Origin', false);

    -- Q4
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'What is the slope of the line y = 3x + 2?', 4) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'x', false),
    (q_id, '2', false),
    (q_id, '3', true),
    (q_id, '3x', false),
    (q_id, '5', false);

    -- Q5
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'What is the y-intercept of the line y = -2x + 5?', 5) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-2', false),
    (q_id, '5', true),
    (q_id, '2', false),
    (q_id, '-5', false),
    (q_id, '0', false);

    -- Q6
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'The formula for slope (m) given two points is:', 6) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '(y₂ - y₁)/(x₂ - x₁)', true),
    (q_id, '(x₂ - x₁)/(y₂ - y₁)', false),
    (q_id, '(y₂ - y₁)(x₂ - x₁)', false),
    (q_id, '(y₂ + y₁)/(x₂ + x₁)', false),
    (q_id, '√[(x₂-x₁)² + (y₂-y₁)²]', false);

    -- Q7
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'A horizontal line has a slope of:', 7) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '-1', false),
    (q_id, 'Undefined', false),
    (q_id, '0', true),
    (q_id, 'Infinity', false);

    -- Q8
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'A vertical line has a slope of:', 8) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '-1', false),
    (q_id, 'Undefined', true),
    (q_id, '0', false),
    (q_id, 'Infinity', false);

    -- Q9
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'Which equation represents a line passing through the origin with a slope of 1?', 9) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'y = x + 1', false),
    (q_id, 'y = 1', false),
    (q_id, 'x = 1', false),
    (q_id, 'y = x', true),
    (q_id, 'y = 2x', false);

    -- Q10
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'To plot the point (-2, 3), you move:', 10) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Left 2, Up 3', true),
    (q_id, 'Right 2, Up 3', false),
    (q_id, 'Left 2, Down 3', false),
    (q_id, 'Right 2, Down 3', false),
    (q_id, 'Up 2, Right 3', false);

    -- Q11
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'What is the slope between points (1, 2) and (3, 6)?', 11) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', false),
    (q_id, '2', true),
    (q_id, '3', false),
    (q_id, '4', false),
    (q_id, '0.5', false);

    -- Q12
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'The equation Ax + By = C is known as:', 12) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Slope-Intercept Form', false),
    (q_id, 'Point-Slope Form', false),
    (q_id, 'Standard Form', true),
    (q_id, 'Quadratic Form', false),
    (q_id, 'Linear Inequality', false);

    -- Q13
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'If a line goes down from left to right, the slope is:', 13) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Positive', false),
    (q_id, 'Negative', true),
    (q_id, 'Zero', false),
    (q_id, 'Undefined', false),
    (q_id, 'Imaginary', false);

    -- Q14
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'What are the coordinates of the y-intercept in y = 4x - 3?', 14) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '(4, 0)', false),
    (q_id, '(0, 4)', false),
    (q_id, '(-3, 0)', false),
    (q_id, '(0, -3)', true),
    (q_id, '(0, 0)', false);

    -- Q15
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz4_id, 'Parallel lines have slopes that are:', 15) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'Reciprocals', false),
    (q_id, 'Opposite reciprocals', false),
    (q_id, 'Equal', true),
    (q_id, 'Both zero', false),
    (q_id, 'Unrelated', false);

    -- =====================================================
    -- QUIZ 5: Practice Problems (15 questions)
    -- =====================================================

    -- Q1
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Solve: 3(x - 4) = 2(x + 1).', 1) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '6', false),
    (q_id, '10', false),
    (q_id, '12', false),
    (q_id, '14', true),
    (q_id, '-2', false);

    -- Q2
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Evaluate b² - 4ac for a=1, b=5, c=6.', 2) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '1', true),
    (q_id, '49', false),
    (q_id, '-1', false),
    (q_id, '11', false),
    (q_id, '25', false);

    -- Q3
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Find the x-intercept of 2x + 3y = 12.', 3) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '(0, 4)', false),
    (q_id, '(6, 0)', true),
    (q_id, '(4, 0)', false),
    (q_id, '(0, 6)', false),
    (q_id, '(12, 0)', false);

    -- Q4
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Simplify: -2(3x - 5) + 4x.', 4) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '-2x + 10', true),
    (q_id, '-2x - 10', false),
    (q_id, '10x + 10', false),
    (q_id, '-10x + 10', false),
    (q_id, 'x + 10', false);

    -- Q5
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'A taxi charges $3.00 plus $2.00 per mile. Which equation represents cost C for m miles?', 5) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'C = 3m + 2', false),
    (q_id, 'C = 2m + 3', true),
    (q_id, 'C = 5m', false),
    (q_id, 'm = 2C + 3', false),
    (q_id, 'C = 3m', false);

    -- Q6
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'If f(x) = 2x - 1, find f(3).', 6) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '2', false),
    (q_id, '4', false),
    (q_id, '5', true),
    (q_id, '6', false),
    (q_id, '7', false);

    -- Q7
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Which pair of lines is perpendicular?', 7) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'y = 2x and y = 2x + 1', false),
    (q_id, 'y = 3x and y = -3x', false),
    (q_id, 'y = 2x and y = -1/2x', true),
    (q_id, 'y = x and y = x', false),
    (q_id, 'y = 4 and y = 5', false);

    -- Q8
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Solve for x: 0.5x + 1.5 = 4.', 8) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '2', false),
    (q_id, '3', false),
    (q_id, '4', false),
    (q_id, '5', true),
    (q_id, '6', false);

    -- Q9
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'The sum of two consecutive integers is 11. What are the integers?', 9) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '4 and 7', false),
    (q_id, '5 and 6', true),
    (q_id, '2 and 9', false),
    (q_id, '1 and 10', false),
    (q_id, '3 and 8', false);

    -- Q10
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Rewrite y - 2 = 3(x - 1) in slope-intercept form (y=mx+b).', 10) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'y = 3x - 3', false),
    (q_id, 'y = 3x - 1', true),
    (q_id, 'y = 3x - 5', false),
    (q_id, 'y = 3x + 1', false),
    (q_id, 'y = 3x + 2', false);

    -- Q11
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Which inequality matches the graph of a solid line y=x shaded above?', 11) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, 'y > x', false),
    (q_id, 'y < x', false),
    (q_id, 'y ≥ x', true),
    (q_id, 'y ≤ x', false),
    (q_id, 'y = x', false);

    -- Q12
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'Solve: 4 - x = 7.', 12) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '3', false),
    (q_id, '-3', true),
    (q_id, '11', false),
    (q_id, '-11', false),
    (q_id, '4/7', false);

    -- Q13
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'A gym membership costs $50 to join and $20 per month. How many months (m) can you afford for $170?', 13) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '4', false),
    (q_id, '5', false),
    (q_id, '6', true),
    (q_id, '7', false),
    (q_id, '8', false);

    -- Q14
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'What is the domain of the relation {(1,2), (3,4), (5,6)}?', 14) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '{2, 4, 6}', false),
    (q_id, '{1, 3, 5}', true),
    (q_id, '{1, 2, 3, 4, 5, 6}', false),
    (q_id, 'All real numbers', false),
    (q_id, 'Positive integers', false);

    -- Q15
    INSERT INTO questions (quiz_id, question_text, order_index) VALUES (quiz5_id, 'If 3x + y = 10 and x = 2, what is y?', 15) RETURNING id INTO q_id;
    INSERT INTO answers (question_id, answer_text, is_correct) VALUES
    (q_id, '2', false),
    (q_id, '4', true),
    (q_id, '6', false),
    (q_id, '8', false),
    (q_id, '0', false);

END $$;
