# Sigma Classes 🎓

**Sigma Classes** is a modern, full-stack digital platform developed for a coaching institute based in **Sasaram, Bihar**.

The platform provides a complete online ecosystem for students, faculty, and administrators — from exploring courses and enrolling in them to managing study materials, faculty content, and student information.

---

## 🌐 Overview

Sigma Classes was built to move beyond a traditional coaching institute website and provide a **complete digital learning and management platform**.

The application includes:

* 📚 Course discovery and detailed course pages
* 👨‍🎓 Student registration and authentication
* 📝 Online course enrollment
* 👨‍🏫 Faculty profiles and faculty dashboard
* 📖 Study material management
* 🎥 YouTube educational content management
* 🔐 Role-based authentication and access
* 🛠️ Admin management features
* 📊 Student dashboard
* 📱 Responsive design for mobile, tablet, and desktop
* 🔎 SEO-friendly public pages
* 🌙 Modern UI with theme support

---

## ✨ Key Features

### 👨‍🎓 Student Portal

Students can:

* Create an account
* Log in securely
* Browse available courses
* View course details and curriculum
* Enroll in courses
* Access their enrolled courses
* View available study materials
* Access educational resources
* Manage their profile

### 👨‍🏫 Faculty Portal

Faculty members have dedicated access to manage their academic content.

Faculty features include:

* Faculty authentication
* Faculty profile management
* Course management
* Student enrollment visibility
* Study material management
* YouTube content management
* Faculty-specific course information

### 🛠️ Admin Panel

Administrators can manage important platform data and control the overall system.

Admin functionality includes:

* Course management
* Faculty management
* Student management
* Enrollment management
* Study material management
* YouTube content management
* Faculty approval
* Platform content control

### 📚 Course Management

Each course can contain:

* Course title
* Description
* Course image
* Faculty information
* Curriculum
* Active/inactive status
* Student enrollments

Users can browse courses and navigate to dedicated course-detail pages.

### 📖 Study Materials

The platform supports academic resources that can be managed by faculty and accessed by students.

### 🎥 YouTube Integration

The website includes a dedicated section for educational YouTube content, allowing relevant videos to be presented directly through the platform.

### 🔐 Authentication & Authorization

The application implements separate authentication flows for:

* Students
* Faculty
* Administrators

Protected routes ensure that users can access functionality based on their role.

---

## 🏗️ Technology Stack

### Frontend

* **React.js**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**
* **React Router**

### Backend

* **Java**
* **Spring Boot**
* **Spring Data JPA**
* **REST APIs**

### Database

* **MySQL**

### Other Technologies

* WebSocket-based communication
* Media/file uploads
* RESTful API architecture
* Role-based access control
* Responsive UI
* SEO optimization

---

## 🧩 Project Architecture

The project follows a client-server architecture:

```text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                    ┌──────────▼──────────┐
                    │     Spring Boot     │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                         Spring Data JPA
                               │
                    ┌──────────▼──────────┐
                    │        MySQL        │
                    │      Database       │
                    └─────────────────────┘
```

---

## 📁 Major Frontend Components

The frontend is organized into reusable React components and pages.

Some of the major components include:

```text
Home
├── Navbar
├── Hero
├── Stats
├── WhyChooseUs
├── Courses
├── Results
├── Faculty
├── YouTubeSection
├── Testimonials
├── CTA
├── Footer
└── WhatsAppButton
```

### Student Features

```text
StudentLogin
StudentRegister
StudentDashboard
ForgotPassword
ResetPassword
CoursesPage
```

### Faculty Features

```text
FacultyAuth
FacultyPage
FacultyProfile
FacultyCourses
FacultyStudents
FacultyMaterials
FacultyYoutube
```

### Admin Features

```text
Admin
AdminAuth
```

---

## ⚙️ Backend Structure

The Spring Boot backend is organized around entities, repositories, controllers, and service logic.

### Core Entities

```text
Faculty
Course
Batch
Enrollment
Student
StudyMaterial
YoutubeContent
```

### Repository Layer

```text
FacultyRepository
CourseRepository
StudyMaterialRepository
YoutubeContentRepository
EnrollmentRepository
```

### Controller Layer

```text
CourseController
AdminCourseController
FacultyCourseController
FacultySetupController
YoutubeContentController
EnrollmentController
```

The backend exposes REST APIs consumed by the React frontend.

---

## 🔄 Application Flow

A typical student flow looks like:

```text
Visit Website
      ↓
Browse Courses
      ↓
Open Course Details
      ↓
Register / Login
      ↓
Enroll in Course
      ↓
Student Dashboard
      ↓
Access Learning Resources
```

Faculty workflow:

```text
Faculty Login
      ↓
Faculty Dashboard
      ↓
Manage Courses
      ↓
Manage Students
      ↓
Upload Study Materials
      ↓
Manage YouTube Content
```

Admin workflow:

```text
Admin Login
      ↓
Admin Dashboard
      ↓
Manage Platform Data
      ↓
Manage Faculty
      ↓
Manage Courses
      ↓
Manage Students & Enrollments
```

---

## 🔐 Environment Variables

Create the required environment/configuration files before running the application.

### Frontend

Example:

```env
VITE_API_URL=http://localhost:8080
```

### Backend

Configure your database and other sensitive credentials through your Spring Boot configuration.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sigma_classes
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> **Important:** Never commit passwords, API keys, database credentials, JWT secrets, or other sensitive information to GitHub.

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

```bash
cd YOUR_REPOSITORY
```

---

### 2. Start the Backend

Navigate to the Spring Boot backend:

```bash
cd backend
```

Run the application using Maven:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🗄️ Database Setup

Create a MySQL database:

```sql
CREATE DATABASE sigma_classes;
```

Then configure the database credentials in the Spring Boot application configuration.

The application uses **Spring Data JPA** for database interaction.

---

## 🔎 SEO

The public-facing website has been designed with SEO considerations including:

* Meaningful page titles
* Meta descriptions
* Relevant keywords
* SEO-friendly content
* Structured public pages
* Sitemap configuration
* Responsive design
* Clean URL structure

The goal is to make the platform discoverable for users searching for coaching and educational services in Sasaram.

---

## 📱 Responsive Design

The interface is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

The UI follows a centralized design system for consistent:

* Typography
* Colors
* Spacing
* Components
* Responsive breakpoints
* Theme behavior

---

## 🔮 Future Improvements

The platform is designed to be expanded with additional educational features.

Planned improvements may include:

* 📝 Online tests and examinations
* 📊 Student performance analytics
* 🏆 Results and leaderboard system
* 📈 Progress tracking
* 🔔 Advanced notifications
* 💳 Online payments
* 🎓 Certificate generation
* 📅 Batch scheduling
* 📢 Announcements
* 📚 Expanded learning resources
* 📱 Progressive Web App capabilities

---

## 🎯 Project Goals

The main objective of Sigma Classes is to provide a centralized digital platform where:

> **Students can discover courses, enroll, and access learning resources.**

> **Faculty can manage their courses and educational content.**

> **Administrators can manage the overall platform.**

This makes the system more than a simple coaching institute website — it acts as a foundation for a complete **digital education platform**.

---

## 👨‍💻 Developer

**Priyanshu Virendra**

B.Tech — Computer Science & Engineering (Data Science)

Techno Main Salt Lake, Kolkata

### Technologies

`Java` • `Spring Boot` • `React` • `JavaScript` • `MySQL` • `JPA` • `REST APIs`

---

## 📄 License

This project is developed for Sigma Classes.

All rights reserved unless otherwise specified.

---

⭐ **If you find this project interesting, consider giving the repository a star!**
