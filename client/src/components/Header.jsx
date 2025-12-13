import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
    const { user, isAuthenticated, isInstructor, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">StudySphere</span>
                        <span className="logo-tagline">Unlock Your Learning Universe</span>
                    </div>
                </Link>

                <nav className="header-nav">
                    {isAuthenticated ? (
                        <>
                            <Link to="/courses" className="nav-link">Courses</Link>
                            <Link to="/dashboard" className="nav-link">My Learning</Link>
                            {isInstructor && (
                                <Link to="/instructor" className="nav-link nav-link-instructor">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                    Instructor
                                </Link>
                            )}

                            <div className="header-icons">
                                <button className="icon-btn" title="Notifications">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </button>
                                <Link to="/messages" className="icon-btn" title="Messages">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="user-menu">
                                <span className="user-name">{user?.full_name}</span>
                                <Link to="/profile" className="avatar-wrapper" title="Profile Settings">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.full_name} className="avatar" />
                                    ) : (
                                        <div className="avatar avatar-placeholder">
                                            {user?.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                                <button className="icon-btn logout-btn" onClick={handleLogout} title="Logout">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;

