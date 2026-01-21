import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './ProfilePage.css';

function ProfilePage() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        avatar_url: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await usersAPI.getProfile();
                setProfile(response.data.user);
                setStats(response.data.stats);
                setFormData({
                    full_name: response.data.user.full_name || '',
                    avatar_url: response.data.user.avatar_url || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await usersAPI.updateProfile(formData);
            setProfile(response.data.user);
            if (updateUser) {
                updateUser(response.data.user);
            }
            setEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            full_name: profile?.full_name || '',
            avatar_url: profile?.avatar_url || ''
        });
        setEditing(false);
        setError('');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="profile-page">
                <Header />
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Header />

            <div className="container">
                <div className="profile-container">
                    <h1 className="page-title">Profile Settings</h1>

                    {/* Success/Error Messages */}
                    {success && (
                        <div className="alert alert-success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="profile-grid">
                        {/* Profile Card */}
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="avatar-section">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name} className="avatar-large" />
                                    ) : (
                                        <div className="avatar-placeholder-large">
                                            {getInitials(profile?.full_name)}
                                        </div>
                                    )}
                                    <span className={`role-badge ${profile?.role}`}>
                                        {profile?.role === 'instructor' ? '👨‍🏫 Instructor' :
                                            profile?.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                                    </span>
                                </div>
                                <div className="profile-info">
                                    <h2>{profile?.full_name}</h2>
                                    <p className="email">{profile?.email}</p>
                                    <p className="member-since">Member since {formatDate(profile?.created_at)}</p>
                                </div>
                            </div>

                            <div className="points-display">
                                <div className="points-icon">🏆</div>
                                <div className="points-info">
                                    <span className="points-value">{profile?.points || 0}</span>
                                    <span className="points-label">Total Points</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon courses"></div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.enrolled_courses || 0}</span>
                                    <span className="stat-label">Enrolled Courses</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon completed"></div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.completed_courses || 0}</span>
                                    <span className="stat-label">Completed</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon quizzes">📝</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.quizzes_passed || 0}</span>
                                    <span className="stat-label">Quizzes Passed</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon achievements">🏅</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.achievements_earned || 0}</span>
                                    <span className="stat-label">Achievements</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Section */}
                    <div className="edit-section">
                        <div className="section-header">
                            <h3>Edit Profile</h3>
                            {!editing && (
                                <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="full_name">Full Name</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="disabled-field"
                                />
                                <span className="field-note">Email cannot be changed</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="avatar_url">Avatar URL</label>
                                <input
                                    type="url"
                                    id="avatar_url"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                                <span className="field-note">Enter a URL to your profile picture</span>
                            </div>

                            {editing && (
                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div className="quick-links">
                        <h3>Quick Links</h3>
                        <div className="links-grid">
                            <button onClick={() => navigate('/dashboard')} className="link-card">
                                <span className="link-icon">📊</span>
                                <span>My Dashboard</span>
                            </button>
                            <button onClick={() => navigate('/courses')} className="link-card">
                                <span className="link-icon"></span>
                                <span>Browse Courses</span>
                            </button>
                            {(profile?.role === 'instructor' || profile?.role === 'admin') && (
                                <button onClick={() => navigate('/instructor')} className="link-card">
                                    <span className="link-icon">👨‍🏫</span>
                                    <span>Instructor Dashboard</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
