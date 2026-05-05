# 🚀 Team Task Manager  
### Full-Stack | Role-Based Access Control | Production Deployment

<p align="center">
  <b>Manage projects, assign tasks, and track team progress with secure role-based access</b>
</p>

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![RBAC](https://img.shields.io/badge/Security-RBAC-red)
![Railway](https://img.shields.io/badge/Deployment-Railway-purple)
![Status](https://img.shields.io/badge/Status-Live-success)

## 🌐 Live Demo
🔗 https://your-frontend.up.railway.app  

## 📂 GitHub Repository
🔗 https://github.com/your-username/TeamTaskManager  

## 🎥 Demo Video
🔗 (Add your video link here)
<p align="center">
  <a href="https://your-frontend.up.railway.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=for-the-badge">
  </a>
</p>

# ⚡ Why This Project?

In real teams, lack of structured task management leads to:
- ❌ unclear ownership  
- ❌ missed deadlines  
- ❌ poor visibility  

This project solves that by introducing:
- ✅ structured workflows  
- ✅ role-based permissions  
- ✅ centralized task tracking

# 🧠 Key Highlights

- 🔐 Secure Authentication (JWT + bcrypt)  
- 🧩 Backend-Enforced RBAC (Admin / Member)  
- 📊 Task Tracking Dashboard  
- ⚙️ RESTful API Design  
- 🌐 Fully Deployed on Cloud (Railway)

# 📸 Screenshots

## 🔐 Login Page
![Login](./screenshots/login.png)

## 📊 Dashboard
![Dashboard](./screenshots/dashboard.png)

## 📁 Project Management
![Projects](./screenshots/projects.png)

## ✅ Task Management
![Tasks](./screenshots/tasks.png)

# 🏗️ Architecture Overview

Frontend (React)  
↓  
Backend API (Express)  
↓  
MongoDB Atlas (Database)

- Clean separation of concerns  
- Scalable API structure  
- Environment-based configuration

# 🔐 Role-Based Access Control

## 👨‍💼 Admin
- Create projects  
- Add/remove members  
- Assign tasks  

## 👨‍🔧 Member
- View assigned tasks  
- Update task status  

> Permissions are enforced at backend level

# 📊 Features

## 🧾 Authentication
- JWT-based login/signup  
- Password hashing using bcrypt  

## 📁 Project Management
- Create projects  
- Manage team members  

## ✅ Task Management
- Assign tasks  
- Status tracking:
  - Todo  
  - In Progress  
  - Done  

## 📈 Dashboard
- Task overview  
- Status insights  
- Overdue task highlighting

# ⚙️ Tech Stack

## Backend
- Node.js  
- Express.js  
- MongoDB (Atlas)  
- Mongoose  
- JWT  

## Frontend
- React (Vite)  
- Tailwind CSS  

## Deployment
- Railway

# 🚀 Deployment

- Backend and frontend deployed as separate services  
- Environment variables managed securely  
- Cloud database using MongoDB Atlas

# 📦 Local Setup

## Clone Repo
git clone https://github.com/your-username/TeamTaskManager
cd TeamTaskManager

## Backend
cd backend
npm install
npm start

## Frontend
cd frontend
npm install
npm run dev

# 🎯 Demo Flow

1. Login as Admin  
2. Create Project  
3. Add Member  
4. Assign Task  
5. Login as Member  
6. Update Task Status  
7. View Dashboard

# 🙌 Final Thoughts

This project demonstrates:
- Full-stack development  
- Secure authentication  
- Role-based access control  
- Production deployment  

> Built with a focus on real-world engineering practices
