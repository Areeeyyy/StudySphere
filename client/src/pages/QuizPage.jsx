import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Header from '../components/Header';
import './QuizPage.css';

function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [previousAttempt, setPreviousAttempt] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await quizAPI.getQuiz(quizId);
                setQuiz(response.data.quiz);
                setQuestions(response.data.questions);
                setPreviousAttempt(response.data.previous_attempt);
            } catch (err) {
                console.error('Failed to fetch quiz:', err);
                setError(err.response?.data?.error || 'Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleSelectAnswer = (questionId, answerId) => {
        if (result) return; // Don't allow changes after submission
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
            return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
                question_id: parseInt(questionId),
                answer_id: answerId
            }));

            const response = await quizAPI.submitQuiz(quizId, formattedAnswers);
            setResult(response.data);
        } catch (err) {
            console.error('Failed to submit quiz:', err);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetake = () => {
        setAnswers({});
        setResult(null);
    };

    if (loading) {
        return (
            <div className="quiz-page">
                <Header />
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-page">
                <Header />
                <div className="container">
                    <div className="quiz-error">
                        <div className="error-icon">⚠️</div>
                        <h2>Unable to Load Quiz</h2>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            <Header />

            <div className="container">
                <div className="quiz-container">
                    {/* Quiz Header */}
                    <div className="quiz-header">
                        <Link to="#" onClick={() => navigate(-1)} className="back-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Lesson
                        </Link>
                        <h1>{quiz.title}</h1>
                        <p className="quiz-subtitle">
                            <span className="lesson-label">{quiz.lesson_title}</span>
                            <span className="separator">•</span>
                            <span>{questions.length} Questions</span>
                            <span className="separator">•</span>
                            <span>Pass: {quiz.passing_score}%</span>
                        </p>
                    </div>

                    {/* Previous Attempt Screen - Show before quiz starts */}
                    {previousAttempt && !result && Object.keys(answers).length === 0 ? (
                        <div className="previous-attempt-screen">
                            <div className={`previous-score-card ${previousAttempt.passed ? 'passed' : 'failed'}`}>
                                <div className="previous-icon">
                                    {previousAttempt.passed ? '✅' : '📝'}
                                </div>
                                <h2>You've Already Taken This Quiz</h2>
                                <div className="previous-score">
                                    <span className="score-value">{previousAttempt.score}%</span>
                                    <span className="score-label">Your Score</span>
                                </div>
                                {previousAttempt.passed ? (
                                    <p className="previous-message success">
                                        🎉 Congratulations! You passed this quiz!
                                    </p>
                                ) : (
                                    <p className="previous-message fail">
                                        You scored below {quiz.passing_score}%. Would you like to try again?
                                    </p>
                                )}
                                <p className="attempt-date">
                                    Completed on: {new Date(previousAttempt.completed_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                <div className="previous-actions">
                                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                        Back to Lesson
                                    </button>
                                    <button className="btn btn-primary" onClick={() => setAnswers({ _started: true })}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="1 4 1 10 7 10" />
                                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                        </svg>
                                        {previousAttempt.passed ? 'Retake Quiz' : 'Try Again'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : result ? (
                        <div className="quiz-result">
                            <div className={`result-card ${result.passed ? 'passed' : 'failed'}`}>
                                <div className="result-icon">
                                    {result.passed ? '🎉' : '😕'}
                                </div>
                                <h2>{result.passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
                                <div className="result-score">
                                    <span className="score-number">{result.score}%</span>
                                    <span className="score-label">Your Score</span>
                                </div>
                                <p className="result-detail">
                                    You answered <strong>{result.correct_count}</strong> out of <strong>{result.total_questions}</strong> questions correctly.
                                </p>
                                {result.passed ? (
                                    <p className="result-message success">You passed! +10 points earned.</p>
                                ) : (
                                    <p className="result-message fail">You need {quiz.passing_score}% to pass. Try again!</p>
                                )}
                            </div>

                            {/* Show answers review */}
                            <div className="answers-review">
                                <h3>Review Your Answers</h3>
                                {questions.map((question, index) => {
                                    const questionResult = result.results.find(r => r.question_id === question.id);
                                    return (
                                        <div key={question.id} className={`review-question ${questionResult?.is_correct ? 'correct' : 'incorrect'}`}>
                                            <div className="review-header">
                                                <span className="question-number">Q{index + 1}</span>
                                                <span className={`review-badge ${questionResult?.is_correct ? 'correct' : 'incorrect'}`}>
                                                    {questionResult?.is_correct ? '✓ Correct' : '✗ Incorrect'}
                                                </span>
                                            </div>
                                            <p className="review-question-text">{question.question_text}</p>
                                            <div className="review-answers">
                                                {question.answers.map(answer => (
                                                    <div
                                                        key={answer.id}
                                                        className={`review-answer 
                                                            ${answer.id === questionResult?.correct_answer_id ? 'correct-answer' : ''} 
                                                            ${answer.id === questionResult?.selected_answer_id && !questionResult?.is_correct ? 'wrong-answer' : ''}
                                                            ${answer.id === questionResult?.selected_answer_id ? 'selected' : ''}`}
                                                    >
                                                        <span className="answer-marker">
                                                            {answer.id === questionResult?.correct_answer_id && '✓'}
                                                            {answer.id === questionResult?.selected_answer_id && answer.id !== questionResult?.correct_answer_id && '✗'}
                                                        </span>
                                                        {answer.answer_text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="result-actions">
                                <button className="btn btn-secondary" onClick={handleRetake}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="1 4 1 10 7 10" />
                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                    </svg>
                                    Retake Quiz
                                </button>
                                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                                    Back to Lesson
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Quiz Questions */
                        <>
                            <div className="quiz-questions">
                                {questions.map((question, index) => (
                                    <div key={question.id} className="question-card">
                                        <div className="question-header">
                                            <span className="question-number">Question {index + 1}</span>
                                            {answers[question.id] && (
                                                <span className="answered-badge">✓ Answered</span>
                                            )}
                                        </div>
                                        <p className="question-text">{question.question_text}</p>
                                        <div className="answer-options">
                                            {question.answers.map((answer, ansIndex) => (
                                                <label
                                                    key={answer.id}
                                                    className={`answer-option ${answers[question.id] === answer.id ? 'selected' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={answer.id}
                                                        checked={answers[question.id] === answer.id}
                                                        onChange={() => handleSelectAnswer(question.id, answer.id)}
                                                    />
                                                    <span className="option-letter">{String.fromCharCode(65 + ansIndex)}</span>
                                                    <span className="option-text">{answer.answer_text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quiz Footer */}
                            <div className="quiz-footer">
                                <div className="progress-info">
                                    <span>{Object.keys(answers).length} of {questions.length} answered</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary submit-btn"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
