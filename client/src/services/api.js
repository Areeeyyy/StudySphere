import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses (token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Courses API
export const coursesAPI = {
    getAll: (params) => api.get('/courses', { params }),
    getOne: (id) => api.get(`/courses/${id}`),
    getEnrolled: () => api.get('/courses/enrolled'),
    getMyCourses: () => api.get('/courses/my-courses'),
    enroll: (id) => api.post(`/courses/${id}/enroll`),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
    uploadThumbnail: (id, file) => {
        const formData = new FormData();
        formData.append('thumbnail', file);
        return api.post(`/courses/${id}/thumbnail`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getCourseLessons: (courseId) => api.get(`/courses/${courseId}/lessons`),
    addLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
    getLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`),
    updateLesson: (courseId, lessonId, data) => api.put(`/courses/${courseId}/lessons/${lessonId}`, data),
    deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),
    completeLesson: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
};

// Quiz API
export const quizAPI = {
    getQuiz: (id) => api.get(`/quiz/${id}`),
    submitQuiz: (id, answers) => api.post(`/quiz/${id}/submit`, { answers }),
    createQuiz: (data) => api.post('/quiz', data),
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getAchievements: () => api.get('/users/achievements'),
    getMessages: () => api.get('/users/messages'),
    getConversation: (userId) => api.get(`/users/messages/${userId}`),
    sendMessage: (data) => api.post('/users/messages', data),
};

// Counter API (Visitor Counter)
export const counterAPI = {
    getCount: () => api.get('/counter'),
    increment: () => api.post('/counter/increment'),
};

// Contact API (Form Online)
export const contactAPI = {
    submit: (data) => api.post('/contact', data),
    getAll: () => api.get('/contact'),
};

export default api;
