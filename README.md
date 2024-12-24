# Next.js Login and Registration Page with MongoDB Integration  

A full-stack login and registration application built with **Next.js** for the frontend and **Node.js/Express** for the backend. This app validates email formats, checks password strength, and securely stores user credentials in **MongoDB**.  

---

## Table of Contents  
- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [API Routes](#api-routes)  
- [Screenshots](#screenshots)  
- [Security Measures](#security-measures)  
- [Troubleshooting](#troubleshooting)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features  
- **User Registration**  
  - Validates email format using regex.  
  - Displays password strength meter dynamically.  
  - User data is securely stored in MongoDB.  

- **User Login**  
  - Authenticates users via stored credentials.  
  - Provides feedback on incorrect email or password.  

- **Password Strength Meter**  
  - Visual indicator for password complexity (Weak, Medium, Strong).  

- **Session Management**  
  - Users stay logged in with session tokens.  

---

## Technologies Used  
- **Frontend**:  
  - Next.js 14  
  - CSS 
  - React Hook Forms (for validation)  

- **Backend**:  
  - Node.js  
  - Express.js  
  - MongoDB (Mongoose ORM)  

- **Authentication & Security**:  
  - bcrypt (password hashing)  
  - JWT (JSON Web Tokens) for session handling  

---

## Prerequisites  
Ensure the following are installed:  
- **Node.js** (v16 or later)  
- **MongoDB** (local or Atlas instance)  
- **Yarn** or **npm**  

---

## Installation  
1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/username/repository-name.git  
   cd repository-name  
