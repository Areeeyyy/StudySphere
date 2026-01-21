import { useState, useEffect, useRef } from 'react';
import { counterAPI } from '../services/api';
import './VisitorCounter.css';

function VisitorCounter() {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasIncremented = useRef(false);

    useEffect(() => {
        // Prevent double increment in React StrictMode (dev mode)
        if (hasIncremented.current) return;
        hasIncremented.current = true;

        const incrementAndFetch = async () => {
            try {
                // Increment counter on page visit
                const response = await counterAPI.increment();
                setCount(response.data.count);
            } catch (error) {
                console.error('Failed to update visitor count:', error);
                // Try to at least get the current count
                try {
                    const fallback = await counterAPI.getCount();
                    setCount(fallback.data.count);
                } catch {
                    setCount(0);
                }
            } finally {
                setLoading(false);
            }
        };

        incrementAndFetch();
    }, []);

    if (loading) {
        return (
            <div className="visitor-counter">
                <div className="counter-loading"></div>
            </div>
        );
    }

    return (
        <div className="visitor-counter">
            <div className="counter-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </div>
            <div className="counter-content">
                <span className="counter-label">Total Visitors</span>
                <span className="counter-value">{count?.toLocaleString() || 0}</span>
            </div>
        </div>
    );
}

export default VisitorCounter;
