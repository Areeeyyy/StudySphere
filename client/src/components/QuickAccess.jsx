import { Link } from 'react-router-dom';
import './QuickAccess.css';

function QuickAccess() {
    return (
        <div className="quick-access">
            <h3 className="quick-access-title">Quick Access</h3>

            <nav className="quick-access-nav">
                <Link to="/dashboard" className="quick-access-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-access-icon">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Calendar</span>
                </Link>

                <Link to="/assignments" className="quick-access-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-access-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>Assignments</span>
                </Link>

                <Link to="/discussions" className="quick-access-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-access-icon">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Study Groups</span>
                </Link>
            </nav>

            <div className="daily-challenge">
                <h4 className="daily-challenge-title">Daily Challenge</h4>
                <Link to="/challenge" className="daily-challenge-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Start Challenge!</span>
                </Link>
            </div>
        </div>
    );
}

export default QuickAccess;
