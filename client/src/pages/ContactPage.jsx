import { useState } from 'react';
import { contactAPI } from '../services/api';
import Header from '../components/Header';
import './ContactPage.css';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await contactAPI.submit(formData);
            setStatus({ type: 'success', message: response.data.message });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
            setStatus({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <Header />

            <main className="container">
                <div className="contact-layout">
                    <div className="contact-info">
                        <h1 className="contact-title">Get in Touch</h1>
                        <p className="contact-subtitle">
                            Have questions about our courses or need help?
                            We'd love to hear from you!
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>support@studysphere.com</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Location</h4>
                                    <p>Jakarta, Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <h2 className="form-title">Send us a Message</h2>

                            {status.message && (
                                <div className={`form-status ${status.type}`}>
                                    {status.type === 'success' ? '✓' : '!'} {status.message}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how we can help..."
                                    rows="5"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ContactPage;
