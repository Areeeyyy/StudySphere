import { useState, useEffect } from 'react';
import { coursesAPI } from '../services/api';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard';
import './CoursesPage.css';

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1
    });

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await coursesAPI.getAll({
                    ...filters,
                    page: pagination.page,
                    limit: 12
                });
                setCourses(response.data.courses || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.pagination?.totalPages || 1
                }));
            } catch (err) {
                setError('Failed to load courses');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [filters, pagination.page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const categories = ['Mathematics', 'History', 'Science', 'Literature', 'Programming'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];

    return (
        <div className="courses-page">
            <Header />

            <div className="courses-hero">
                <h1 className="hero-title">Unlock Your Potential</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        className="search-input search-input-hero"
                        placeholder="What do you want to learn?"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </button>
                </form>
            </div>

            <main className="container">
                <div className="courses-layout">
                    <aside className="filter-sidebar">
                        <h3 className="filter-sidebar-title">Filter By</h3>

                        <div className="filter-section">
                            <h4 className="filter-title">Subject</h4>
                            {categories.map(cat => (
                                <label key={cat} className="filter-option">
                                    <input
                                        type="checkbox"
                                        className="filter-checkbox"
                                        checked={filters.category === cat}
                                        onChange={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                                    />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Difficulty</h4>
                            {difficulties.map(diff => (
                                <label key={diff} className="filter-option">
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        checked={filters.difficulty === diff}
                                        onChange={() => handleFilterChange('difficulty', filters.difficulty === diff ? '' : diff)}
                                    />
                                    <span>{diff.charAt(0).toUpperCase() + diff.slice(1)}</span>
                                </label>
                            ))}
                        </div>

                        <div className="filter-section">
                            <h4 className="filter-title">Study Features</h4>
                            <label className="filter-option">
                                <input type="checkbox" className="filter-checkbox" />
                                <span>Includes Certificate</span>
                            </label>
                            <label className="filter-option">
                                <input type="checkbox" className="filter-checkbox" />
                                <span>Video Lectures</span>
                            </label>
                        </div>
                    </aside>

                    <div className="courses-main">
                        <div className="courses-header">
                            <h2 className="courses-section-title">Course Title</h2>
                            <div className="sort-dropdown">
                                <span>Sort by:</span>
                                <select className="sort-select">
                                    <option>Newest</option>
                                    <option>Popular</option>
                                    <option>Rating</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                            </div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : courses.length === 0 ? (
                            <div className="empty-state">
                                <h3>No courses found</h3>
                                <p>Try adjusting your filters or search terms</p>
                            </div>
                        ) : (
                            <>
                                <div className="course-grid">
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="pagination">
                                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`pagination-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                                                onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        {pagination.totalPages > 5 && (
                                            <>
                                                <span>...</span>
                                                <button
                                                    className="pagination-btn"
                                                    onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
                                                >
                                                    {pagination.totalPages}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CoursesPage;
