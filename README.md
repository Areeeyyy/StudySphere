<div align="center">

# 🎓 StudySphere

### E-Learning Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, full-stack e-learning platform built with the **PERN stack** (PostgreSQL, Express, React, Node.js).  
Inspired by [Ruangguru](https://www.ruangguru.com/) 🇮🇩

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-endpoints) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login/registration with role support (Student/Instructor) |
| 📚 **Course Catalog** | Browse courses with filters, search, and pagination |
| 📝 **Enrollment System** | Students can enroll in courses and track progress |
| 📊 **Progress Tracking** | Visual progress bars for lessons and course completion |
| ❓ **Quiz Engine** | Server-side graded quizzes (answers never exposed to client) |
| 🏆 **Achievements** | Badge system for gamification |
| 📱 **Responsive Design** | Works seamlessly on desktop and mobile |

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **npm** or **yarn**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/studysphere.git
cd studysphere
```

### 2️⃣ Database Setup

```bash
# Create the database
sudo -u postgres psql -c "CREATE DATABASE diploma_lms;"

# Run the schema (creates all tables)
sudo -u postgres psql -d diploma_lms -f server/schema.sql

# (Optional) Add sample data
sudo -u postgres psql -d diploma_lms -f server/seed.sql
```

### 3️⃣ Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Start the server
npm start
```

> 🟢 API running at `http://localhost:5000`

### 4️⃣ Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

> 🟢 App running at `http://localhost:5173`

---

## 📁 Project Structure

```
studysphere/
├── 📂 server/                  # Express.js Backend
│   ├── config/db.js            # PostgreSQL connection pool
│   ├── middleware/auth.js      # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── courses.js          # Course CRUD & enrollment
│   │   ├── quiz.js             # Quiz engine
│   │   └── users.js            # User profile & achievements
│   ├── schema.sql              # Database schema
│   ├── seed.sql                # Sample data
│   ├── .env.example            # Environment template
│   └── index.js                # Server entry point
│
└── 📂 client/                  # React Frontend (Vite)
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Route pages
    │   ├── context/            # Auth context (React Context API)
    │   └── services/           # API service (Axios)
    ├── index.html
    └── vite.config.js
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create new account | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### Courses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/courses` | List all courses | ❌ |
| `GET` | `/api/courses/:id` | Get course with lessons | ❌ |
| `POST` | `/api/courses` | Create course | 🔒 Instructor |
| `POST` | `/api/courses/:id/enroll` | Enroll in course | ✅ |
| `GET` | `/api/courses/enrolled` | Get enrolled courses | ✅ |

### Quiz

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/quiz/:id` | Get quiz questions | ✅ |
| `POST` | `/api/quiz/:id/submit` | Submit & grade quiz | ✅ |

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="150">

**Frontend**

</td>
<td align="center" width="150">

**Backend**

</td>
<td align="center" width="150">

**Database**

</td>
<td align="center" width="150">

**Tools**

</td>
</tr>
<tr>
<td align="center">

React 18  
React Router  
Axios  
Vite  

</td>
<td align="center">

Node.js  
Express.js  
JWT  
bcryptjs  

</td>
<td align="center">

PostgreSQL  
pg (node-postgres)  

</td>
<td align="center">

Git  
npm  
ESLint  

</td>
</tr>
</table>

---

## 🎨 Design System

The UI follows a custom **StudySphere Design System** with:

- **Primary Color**: Purple (`#6B21A8`) 
- **Accent Color**: Teal (`#14B8A6`)
- **Typography**: Inter font family
- **Components**: Cards, badges, progress bars, buttons
- **Responsive**: Mobile-first approach

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is for **educational purposes** as part of Web Programming coursework.

---

<div align="center">

Made with ❤️ for **Pemrograman Web** course

**Semester 5 - 2024/2025**

---

<sub>Built with assistance from [Antigravity](https://github.com/google-deepmind) & Claude Opus 4</sub>

</div>
