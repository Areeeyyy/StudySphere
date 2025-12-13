import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import './InstructorDashboard.css';

// Icons
const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ImageIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
    </svg>
);

const LayersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 2,7 12,12 22,7 12,2" />
        <polyline points="2,17 12,22 22,17" />
        <polyline points="2,12 12,17 22,12" />
    </svg>
);

const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12,19 5,12 12,5" />
    </svg>
);

const FileTextIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const AlertIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const API_BASE = 'http://localhost:5000';

export default function InstructorDashboardPage() {
    const navigate = useNavigate();
    const { user, isInstructor } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [lessonsLoading, setLessonsLoading] = useState(false);

    // Modal states
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    // Form states
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        is_published: false
    });
    const [lessonForm, setLessonForm] = useState({
        title: '',
        content: '',
        video_url: '',
        duration_minutes: 0
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    // Redirect non-instructors
    useEffect(() => {
        if (!isInstructor) {
            navigate('/dashboard');
        }
    }, [isInstructor, navigate]);

    // Fetch instructor's courses
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            console.log('Fetching instructor courses...');
            const response = await coursesAPI.getMyCourses();
            console.log('My courses response:', response.data);
            setCourses(response.data.courses || []);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            console.error('Error response:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async (courseId) => {
        try {
            setLessonsLoading(true);
            const response = await coursesAPI.getCourseLessons(courseId);
            setLessons(response.data.lessons || []);
        } catch (error) {
            console.error('Failed to fetch lessons:', error);
        } finally {
            setLessonsLoading(false);
        }
    };

    // Course handlers
    const handleOpenCourseModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setCourseForm({
                title: course.title || '',
                description: course.description || '',
                category: course.category || '',
                difficulty: course.difficulty || 'beginner',
                is_published: course.is_published || false
            });
            setThumbnailPreview(course.thumbnail_url ? `${API_BASE}${course.thumbnail_url}` : null);
        } else {
            setEditingCourse(null);
            setCourseForm({
                title: '',
                description: '',
                category: '',
                difficulty: 'beginner',
                is_published: false
            });
            setThumbnailPreview(null);
        }
        setThumbnailFile(null);
        setShowCourseModal(true);
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        if (!courseForm.title.trim()) return;

        try {
            setSaving(true);
            let savedCourse;

            if (editingCourse) {
                console.log('Updating course:', editingCourse.id, courseForm);
                const response = await coursesAPI.update(editingCourse.id, courseForm);
                console.log('Update response:', response.data);
                savedCourse = response.data.course;
            } else {
                console.log('Creating course:', courseForm);
                const response = await coursesAPI.create(courseForm);
                console.log('Create response:', response.data);
                savedCourse = response.data.course;
            }

            // Upload thumbnail if selected
            if (thumbnailFile && savedCourse) {
                console.log('Uploading thumbnail for course:', savedCourse.id);
                await coursesAPI.uploadThumbnail(savedCourse.id, thumbnailFile);
            }

            console.log('Refreshing courses list...');
            await fetchCourses();
            setShowCourseModal(false);
        } catch (error) {
            console.error('Failed to save course:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to save course: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCourse = async () => {
        if (!deleteTarget) return;

        try {
            setSaving(true);
            await coursesAPI.delete(deleteTarget.id);
            await fetchCourses();
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
            if (selectedCourse?.id === deleteTarget.id) {
                setSelectedCourse(null);
                setLessons([]);
            }
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSelectCourse = async (course) => {
        setSelectedCourse(course);
        await fetchLessons(course.id);
    };

    // Lesson handlers
    const handleOpenLessonModal = (lesson = null) => {
        if (lesson) {
            setEditingLesson(lesson);
            setLessonForm({
                title: lesson.title || '',
                content: lesson.content || '',
                video_url: lesson.video_url || '',
                duration_minutes: lesson.duration_minutes || 0
            });
        } else {
            setEditingLesson(null);
            setLessonForm({
                title: '',
                content: '',
                video_url: '',
                duration_minutes: 0
            });
        }
        setShowLessonModal(true);
    };

    const handleSaveLesson = async (e) => {
        e.preventDefault();
        if (!lessonForm.title.trim() || !selectedCourse) return;

        try {
            setSaving(true);

            if (editingLesson) {
                await coursesAPI.updateLesson(selectedCourse.id, editingLesson.id, lessonForm);
            } else {
                await coursesAPI.addLesson(selectedCourse.id, lessonForm);
            }

            await fetchLessons(selectedCourse.id);
            await fetchCourses(); // Refresh course data (lesson count)
            setShowLessonModal(false);
        } catch (error) {
            console.error('Failed to save lesson:', error);
            alert('Failed to save lesson. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLesson = async () => {
        if (!deleteTarget || !selectedCourse) return;

        try {
            setSaving(true);
            await coursesAPI.deleteLesson(selectedCourse.id, deleteTarget.id);
            await fetchLessons(selectedCourse.id);
            await fetchCourses();
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete lesson:', error);
            alert('Failed to delete lesson. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const confirmDelete = (target, type) => {
        setDeleteTarget({ ...target, type });
        setShowDeleteConfirm(true);
    };

    // Stats
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.is_published).length;
    const totalEnrollments = courses.reduce((sum, c) => sum + parseInt(c.enrollment_count || 0), 0);

    if (loading) {
        return (
            <div className="instructor-dashboard">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading your courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="instructor-dashboard">
            <div className="container">
                {/* Back to Courses */}
                <button className="back-button" onClick={() => navigate('/courses')}>
                    <ArrowLeftIcon /> Back to Courses
                </button>

                {/* Header */}
                <div className="instructor-header">
                    <h1><BookIcon /> Instructor Dashboard</h1>
                    <button className="btn btn-primary" onClick={() => handleOpenCourseModal()}>
                        <PlusIcon /> Create Course
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon purple"><BookIcon /></div>
                        <div className="stat-info">
                            <h3>{totalCourses}</h3>
                            <p>Total Courses</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon teal"><LayersIcon /></div>
                        <div className="stat-info">
                            <h3>{publishedCourses}</h3>
                            <p>Published</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon gold"><UsersIcon /></div>
                        <div className="stat-info">
                            <h3>{totalEnrollments}</h3>
                            <p>Total Enrollments</p>
                        </div>
                    </div>
                </div>

                {/* Course Grid or Selected Course */}
                {selectedCourse ? (
                    <div className="lesson-panel">
                        <div className="lesson-panel-header">
                            <h2>
                                <LayersIcon />
                                Lessons for: {selectedCourse.title}
                            </h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-sm" onClick={() => handleOpenLessonModal()}>
                                    <PlusIcon /> Add Lesson
                                </button>
                                <button className="btn btn-sm" onClick={() => { setSelectedCourse(null); setLessons([]); }}>
                                    <CloseIcon /> Close
                                </button>
                            </div>
                        </div>
                        <div className="lesson-list">
                            {lessonsLoading ? (
                                <div className="loading-container" style={{ minHeight: '200px' }}>
                                    <div className="spinner"></div>
                                </div>
                            ) : lessons.length === 0 ? (
                                <div className="no-lessons">
                                    <FileTextIcon />
                                    <p>No lessons yet. Add your first lesson!</p>
                                </div>
                            ) : (
                                lessons.map((lesson) => (
                                    <div key={lesson.id} className="lesson-item">
                                        <div className="lesson-order">{lesson.order_index}</div>
                                        <div className="lesson-info">
                                            <h4>{lesson.title}</h4>
                                            <p>
                                                <ClockIcon />
                                                {lesson.duration_minutes} min
                                                {lesson.video_url && ' • Has video'}
                                            </p>
                                        </div>
                                        <div className="lesson-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleOpenLessonModal(lesson)}
                                                title="Edit Lesson"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => confirmDelete(lesson, 'lesson')}
                                                title="Delete Lesson"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="empty-state">
                        <BookIcon style={{ width: 64, height: 64 }} />
                        <h3>No Courses Yet</h3>
                        <p>Create your first course to start teaching!</p>
                        <button className="btn btn-primary" onClick={() => handleOpenCourseModal()}>
                            <PlusIcon /> Create Your First Course
                        </button>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map((course) => (
                            <div key={course.id} className="instructor-course-card">
                                <div className="course-card-thumbnail">
                                    {course.thumbnail_url ? (
                                        <img
                                            src={`${API_BASE}${course.thumbnail_url}`}
                                            alt={course.title}
                                        />
                                    ) : (
                                        <div className="thumbnail-placeholder">
                                            <BookIcon />
                                        </div>
                                    )}
                                    <span className={`course-status-badge ${course.is_published ? 'published' : 'draft'}`}>
                                        {course.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className="course-card-content">
                                    <h3>{course.title}</h3>
                                    <div className="course-card-meta">
                                        {course.category && (
                                            <span className="meta-badge">{course.category}</span>
                                        )}
                                        <span className="meta-badge">{course.difficulty}</span>
                                    </div>
                                    <div className="course-card-stats">
                                        <div className="course-stat">
                                            <LayersIcon />
                                            {course.lesson_count || 0} lessons
                                        </div>
                                        <div className="course-stat">
                                            <UsersIcon />
                                            {course.enrollment_count || 0} students
                                        </div>
                                    </div>
                                    <div className="course-card-actions">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleSelectCourse(course)}
                                        >
                                            <LayersIcon /> Lessons
                                        </button>
                                        <button
                                            className="btn-icon edit"
                                            onClick={() => handleOpenCourseModal(course)}
                                            title="Edit Course"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="btn-icon delete"
                                            onClick={() => confirmDelete(course, 'course')}
                                            title="Delete Course"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Course Modal */}
            {showCourseModal && (
                <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                            <button className="modal-close" onClick={() => setShowCourseModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handleSaveCourse}>
                            <div className="modal-body">
                                {/* Thumbnail Upload */}
                                <div className="form-group">
                                    <label>Course Thumbnail</label>
                                    <label className={`thumbnail-upload ${thumbnailPreview ? 'has-preview' : ''}`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                        />
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Preview" className="thumbnail-preview" />
                                        ) : (
                                            <>
                                                <ImageIcon />
                                                <p>Click to upload thumbnail<br /><span>PNG, JPG up to 5MB</span></p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {/* Title */}
                                <div className="form-group">
                                    <label htmlFor="courseTitle">Course Title *</label>
                                    <input
                                        type="text"
                                        id="courseTitle"
                                        value={courseForm.title}
                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                        placeholder="Enter course title"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label htmlFor="courseDesc">Description</label>
                                    <textarea
                                        id="courseDesc"
                                        value={courseForm.description}
                                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                        placeholder="Describe your course..."
                                    />
                                </div>

                                {/* Category & Difficulty */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="courseCategory">Category</label>
                                        <select
                                            id="courseCategory"
                                            value={courseForm.category}
                                            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                        >
                                            <option value="">Select category</option>
                                            <option value="Science">Science</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="History">History</option>
                                            <option value="Language">Language</option>
                                            <option value="Business">Business</option>
                                            <option value="Art">Art</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="courseDifficulty">Difficulty</label>
                                        <select
                                            id="courseDifficulty"
                                            value={courseForm.difficulty}
                                            onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Publish Toggle */}
                                <div className="toggle-wrapper">
                                    <span>Publish Course</span>
                                    <div
                                        className={`toggle ${courseForm.is_published ? 'active' : ''}`}
                                        onClick={() => setCourseForm({ ...courseForm, is_published: !courseForm.is_published })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowCourseModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {showLessonModal && (
                <div className="modal-overlay" onClick={() => setShowLessonModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>
                            <button className="modal-close" onClick={() => setShowLessonModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handleSaveLesson}>
                            <div className="modal-body">
                                {/* Title */}
                                <div className="form-group">
                                    <label htmlFor="lessonTitle">Lesson Title *</label>
                                    <input
                                        type="text"
                                        id="lessonTitle"
                                        value={lessonForm.title}
                                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        placeholder="Enter lesson title"
                                        required
                                    />
                                </div>

                                {/* Content */}
                                <div className="form-group">
                                    <label htmlFor="lessonContent">Content</label>
                                    <textarea
                                        id="lessonContent"
                                        value={lessonForm.content}
                                        onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                        placeholder="Write your lesson content here..."
                                        style={{ minHeight: '200px' }}
                                    />
                                </div>

                                {/* Video URL & Duration */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="lessonVideo">Video URL</label>
                                        <input
                                            type="url"
                                            id="lessonVideo"
                                            value={lessonForm.video_url}
                                            onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lessonDuration">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            id="lessonDuration"
                                            value={lessonForm.duration_minutes}
                                            onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 0 })}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowLessonModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Add Lesson')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && deleteTarget && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="confirm-dialog">
                            <AlertIcon />
                            <h3>Delete {deleteTarget.type === 'course' ? 'Course' : 'Lesson'}?</h3>
                            <p>
                                Are you sure you want to delete "{deleteTarget.title}"?
                                {deleteTarget.type === 'course' && ' This will also delete all lessons and enrollments.'}
                                This action cannot be undone.
                            </p>
                            <div className="btn-group">
                                <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={deleteTarget.type === 'course' ? handleDeleteCourse : handleDeleteLesson}
                                    disabled={saving}
                                >
                                    {saving ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
