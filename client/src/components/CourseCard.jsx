import { Link } from 'react-router-dom';
import './CourseCard.css';

function CourseCard({ course, enrolled = false }) {
    const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop';

    return (
        <Link to={`/courses/${course.id}`} className="course-card">
            <img
                src={course.thumbnail_url || defaultThumbnail}
                alt={course.title}
                className="course-thumbnail"
            />

            {course.category && (
                <span className="course-category badge badge-purple">{course.category}</span>
            )}

            <div className="course-content">
                <h3 className="course-title">{course.title}</h3>

                {course.instructor_name && (
                    <p className="course-instructor">
                        Instructor: {course.instructor_name}
                    </p>
                )}

                {enrolled && typeof course.progress !== 'undefined' && (
                    <div className="course-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                        <span className="progress-text">Progress: {course.progress}%</span>
                    </div>
                )}

                <div className="course-meta">
                    {course.rating > 0 && (
                        <div className="course-rating">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="star-icon">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{parseFloat(course.rating).toFixed(1)}</span>
                            {course.review_count > 0 && (
                                <span className="review-count">({course.review_count} reviews)</span>
                            )}
                        </div>
                    )}

                    <button className={`btn btn-sm ${enrolled ? 'btn-teal' : 'btn-primary'}`}>
                        {enrolled ? 'Continue' : 'View'}
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default CourseCard;
