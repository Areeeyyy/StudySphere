import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './LessonPage.css';

function LessonPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [allLessons, setAllLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current lesson
                const lessonRes = await coursesAPI.getLesson(courseId, lessonId);
                setLesson(lessonRes.data.lesson);

                // Fetch course with all lessons for sidebar
                const courseRes = await coursesAPI.getOne(courseId);
                setCourse(courseRes.data.course);
                setAllLessons(courseRes.data.lessons || []);
            } catch (err) {
                setError('Failed to load lesson');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, lessonId]);

    const handleComplete = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setCompleting(true);
        try {
            await coursesAPI.completeLesson(courseId, lessonId);
            setLesson(prev => ({ ...prev, is_completed: true }));

            // Navigate to next lesson if available
            const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
            if (currentIndex < allLessons.length - 1) {
                const nextLesson = allLessons[currentIndex + 1];
                navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
            }
        } catch (err) {
            console.error('Failed to mark as complete:', err);
        } finally {
            setCompleting(false);
        }
    };

    // Find current, previous, and next lessons
    const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    if (loading) {
        return (
            <div className="lesson-page">
                <Header />
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="lesson-page">
                <Header />
                <div className="container">
                    <div className="error-state">{error || 'Lesson not found'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="lesson-page">
            <Header />

            <div className="lesson-layout">
                {/* Sidebar with lesson list */}
                <aside className="lesson-sidebar">
                    <Link to={`/courses/${courseId}`} className="back-to-course">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Course
                    </Link>

                    <div className="lesson-list">
                        <h3 className="lesson-list-title">{course?.title}</h3>
                        {allLessons.map((l, index) => (
                            <Link
                                key={l.id}
                                to={`/courses/${courseId}/lessons/${l.id}`}
                                className={`lesson-list-item ${l.id === parseInt(lessonId) ? 'active' : ''} ${l.is_completed ? 'completed' : ''}`}
                            >
                                <span className="lesson-number">{index + 1}</span>
                                <span className="lesson-name">{l.title}</span>
                                {l.is_completed && (
                                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* Main content area */}
                <main className="lesson-main">
                    <div className="lesson-header">
                        <span className="lesson-badge">Lesson {currentIndex + 1} of {allLessons.length}</span>
                        <h1 className="lesson-title">{lesson.title}</h1>
                        {lesson.duration_minutes > 0 && (
                            <p className="lesson-duration">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {lesson.duration_minutes} minutes
                            </p>
                        )}
                    </div>

                    {/* Video placeholder */}
                    <div className="video-container">
                        <div className="video-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <p>Video content coming soon</p>
                        </div>
                    </div>

                    {/* Lesson content */}
                    <div className="lesson-content">
                        <h2>Lesson Content</h2>
                        <div className="lesson-text">
                            {lesson.content ? (
                                lesson.content.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))
                            ) : (
                                <p className="no-content">No content available for this lesson yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="lesson-navigation">
                        <div className="nav-left">
                            {prevLesson ? (
                                <Link
                                    to={`/courses/${courseId}/lessons/${prevLesson.id}`}
                                    className="btn btn-secondary nav-btn"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        <button
                            className={`btn ${lesson.is_completed ? 'btn-teal' : 'btn-primary'} complete-btn`}
                            onClick={handleComplete}
                            disabled={completing || lesson.is_completed}
                        >
                            {lesson.is_completed ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Completed
                                </>
                            ) : completing ? (
                                'Marking...'
                            ) : (
                                'Mark as Complete'
                            )}
                        </button>

                        <div className="nav-right">
                            {nextLesson ? (
                                <Link
                                    to={`/courses/${courseId}/lessons/${nextLesson.id}`}
                                    className="btn btn-primary nav-btn"
                                >
                                    Next
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    to={`/courses/${courseId}`}
                                    className="btn btn-teal nav-btn"
                                >
                                    Finish Course
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quiz link if available */}
                    {lesson.quiz_id && (
                        <div className="quiz-section">
                            <div className="quiz-card">
                                <div className="quiz-info">
                                    <h3>📝 Lesson Quiz</h3>
                                    <p>Test your knowledge of this lesson</p>
                                </div>
                                <Link to={`/quiz/${lesson.quiz_id}`} className="btn btn-primary">
                                    Take Quiz
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default LessonPage;
