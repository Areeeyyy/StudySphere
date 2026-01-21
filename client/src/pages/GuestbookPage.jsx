import { useState, useEffect } from 'react';
import { guestbookAPI } from '../services/api';
import Header from '../components/Header';
import './GuestbookPage.css';

function GuestbookPage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await guestbookAPI.getAll();
            setEntries(response.data.entries || []);
        } catch (err) {
            console.error('Failed to fetch entries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await guestbookAPI.addEntry(formData);
            // Add new entry to top of list
            setEntries(prev => [response.data.entry, ...prev]);
            setFormData({ name: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post message');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="guestbook-page">
            <Header />

            <main className="container">
                <div className="guestbook-header">
                    <h1 className="guestbook-title">Guestbook</h1>
                    <p className="guestbook-subtitle">Leave a message for us!</p>
                </div>

                <div className="guestbook-layout">
                    <div className="guestbook-form-section">
                        <form className="guestbook-form" onSubmit={handleSubmit}>
                            <h3>Sign the Guestbook</h3>

                            {error && <div className="form-error">{error}</div>}

                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows="4"
                                    maxLength={500}
                                    required
                                />
                                <span className="char-count">{formData.message.length}/500</span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Posting...' : 'Post Message'}
                            </button>
                        </form>
                    </div>

                    <div className="guestbook-entries-section">
                        <h3>Recent Messages ({entries.length})</h3>

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="empty-state">
                                <p>No messages yet. Be the first to sign!</p>
                            </div>
                        ) : (
                            <div className="entries-list">
                                {entries.map(entry => (
                                    <div key={entry.id} className="entry-card">
                                        <div className="entry-header">
                                            <div className="entry-avatar">
                                                {entry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="entry-meta">
                                                <span className="entry-name">{entry.name}</span>
                                                <span className="entry-date">{formatDate(entry.created_at)}</span>
                                            </div>
                                        </div>
                                        <p className="entry-message">{entry.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default GuestbookPage;
