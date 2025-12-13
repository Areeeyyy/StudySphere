import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './CourseDetailPage.css';

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await coursesAPI.getOne(id);
                setCourse(response.data.course);
                setLessons(response.data.lessons || []);
                setIsEnrolled(response.data.isEnrolled);
                setProgress(response.data.progress || 0);
            } catch (err) {
                setError('Failed to load course');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setEnrolling(true);
        try {
            await coursesAPI.enroll(id);
            setIsEnrolled(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    const handleStartLesson = (lessonId) => {
        if (!isEnrolled) {
            handleEnroll();
            return;
        }
        navigate(`/courses/${id}/lessons/${lessonId}`);
    };

    if (loading) {
        return (
            <div className="course-detail-page">
                <Header />
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="course-detail-page">
                <Header />
                <div className="container">
                    <div className="error-state">{error || 'Course not found'}</div>
                </div>
            </div>
        );
    }

    const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop';

    return (
        <div className="course-detail-page">
            <Header />

            <div className="course-hero" style={{ backgroundImage: `url(${course.thumbnail_url || defaultThumbnail})` }}>
                <div className="course-hero-overlay">
                    <div className="container">
                        <div className="course-hero-content">
                            {course.category && (
                                <span className="badge badge-purple">{course.category}</span>
                            )}
                            <h1 className="course-hero-title">{course.title}</h1>
                            <p className="course-hero-instructor">
                                Instructor: {course.instructor_name || 'Unknown'}
                            </p>

                            <div className="course-hero-meta">
                                {course.rating > 0 && (
                                    <div className="course-hero-rating">
                                        ⭐ {parseFloat(course.rating).toFixed(1)} ({course.review_count || 0} reviews)
                                    </div>
                                )}
                                <div className="course-hero-lessons">
                                    📚 {lessons.length} lessons
                                </div>
                                {course.difficulty && (
                                    <div className="course-hero-difficulty">
                                        🎯 {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container">
                <div className="course-detail-layout">
                    <div className="course-content-main">
                        <section className="course-section">
                            <h2 className="section-subheader">About This Course</h2>
                            <p className="course-description">
                                {course.description || 'No description available.'}
                            </p>
                        </section>

                        <section className="course-section">
                            <h2 className="section-subheader">Course Content</h2>
                            <div className="lessons-list">
                                {lessons.length === 0 ? (
                                    <p className="no-lessons">No lessons available yet.</p>
                                ) : (
                                    lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="lesson-item"
                                            onClick={() => handleStartLesson(lesson.id)}
                                        >
                                            <div className="lesson-number">{index + 1}</div>
                                            <div className="lesson-info">
                                                <h4 className="lesson-title">{lesson.title}</h4>
                                                {lesson.duration_minutes > 0 && (
                                                    <span className="lesson-duration">
                                                        {lesson.duration_minutes} min
                                                    </span>
                                                )}
                                            </div>
                                            <div className="lesson-action">
                                                {isEnrolled ? (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polygon points="5 3 19 12 5 21 5 3" />
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="course-sidebar">
                        <div className="enrollment-card">
                            {isEnrolled ? (
                                <>
                                    <div className="enrollment-status enrolled">
                                        ✓ Enrolled
                                    </div>
                                    <div className="enrollment-progress">
                                        <div className="progress-label">Your Progress</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div className="progress-text">{progress}% complete</div>
                                    </div>
                                    <button
                                        className="btn btn-teal btn-lg enrollment-btn"
                                        onClick={() => lessons[0] && handleStartLesson(lessons[0].id)}
                                    >
                                        Continue Learning
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="enrollment-cta">
                                        Start learning today and unlock your potential!
                                    </p>
                                    <button
                                        className="btn btn-primary btn-lg enrollment-btn"
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                    >
                                        {enrolling ? 'Enrolling...' : 'Enroll Now - Free'}
                                    </button>
                                </>
                            )}
                        </div>

                        {course.instructor_name && (
                            <div className="instructor-card">
                                <h3>Instructor</h3>
                                <div className="instructor-info">
                                    <div className="avatar avatar-lg avatar-placeholder">
                                        {course.instructor_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="instructor-name">{course.instructor_name}</div>
                                        <div className="instructor-title">Course Instructor</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default CourseDetailPage;
