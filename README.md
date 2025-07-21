🧑‍💼 Employee Management Web App
A full-stack Employee Management system built with FastAPI, PostgreSQL, and HTML/CSS/JavaScript. This web app allows users to securely register or log in, and perform full CRUD operations (Create, Read, Update, Delete) on employee records.

🚀 Features
✅ User Authentication with JWT

🧾 Register/Login functionality

📋 View Employees in a dynamic table

➕ Add New Employees

📝 Update Existing Employee Data

❌ Delete Employees

🔐 Protected routes for authenticated users only

🛠 Tech Stack
🔧 Backend
FastAPI

PostgreSQL

JWT Authentication

Postman (for testing APIs)

🎨 Frontend
HTML5

CSS3

Vanilla JavaScript

Fetch API (for making API calls to the backend)

📁 Project Structure
pgsql
Copy
Edit
project-root/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── routes/
│   └── auth/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── styles.css
│   └── script.js
├── requirements.txt
└── README.md
🔐 Authentication Flow
Users can register and log in

JWT token is generated on successful login

Token is stored in localStorage and sent in request headers to access protected routes