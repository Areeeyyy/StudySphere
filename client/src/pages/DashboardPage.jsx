import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard';
import QuickAccess from '../components/QuickAccess';
import './Dashboard.css';

function DashboardPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await coursesAPI.getEnrolled();
                setCourses(response.data.courses || []);
            } catch (err) {
                setError('Failed to load your courses');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="dashboard-page">
            <Header />

            <main className="container">
                <div className="page-layout">
                    <div className="page-main">
                        <h1 className="section-header">My Chapters</h1>

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                            </div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : courses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"></div>
                                <h3>No courses yet</h3>
                                <p>Start your learning journey by exploring our course catalog!</p>
                                <a href="/courses" className="btn btn-primary">Browse Courses</a>
                            </div>
                        ) : (
                            <div className="course-grid">
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} enrolled={true} />
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="page-sidebar">
                        <QuickAccess />
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
