# Temesgen LMS — Modern Enterprise Learning Management System

> **"Learn. Grow. Achieve."**  
> A complete, production-ready, full-stack Learning Management System built with **Laravel 12 API backend**, **MySQL database**, and **React 18 + Vite + Tailwind CSS** frontend.

---

## 🌟 Executive Overview

**Temesgen LMS** is an enterprise-grade e-learning platform engineered for modern education institutions, universities, and professional corporate academies. It delivers an intuitive, fast, and accessible digital learning environment supporting **Students**, **Instructors**, and **Platform Administrators**.

---

## 🚀 Key Highlights & Architecture

- **Backend Framework**: [Laravel 12](https://laravel.com/) with PHP 8.2+
- **Frontend Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons & Charts**: [Lucide React](https://lucide.dev/) & [Recharts](https://recharts.org/)
- **Database**: [MySQL / MariaDB](https://mariadb.org/) with full normalization (3NF), foreign keys, cascades, indexes, and soft deletes
- **Security & Auth**: Laravel Sanctum token-based authentication with Role-Based Access Control (RBAC) and policy-level route guards
- **Payments**: Architecture designed for Ethiopian digital finance ecosystems (**Chapa** & **Telebirr**) with backend verification and cryptographic invoice auditing
- **Certificates**: Cryptographically verifiable public certificate verification engine (`/verify-certificate?id=TLMS-2026-A89F31`)

---

## 👥 User Roles & Demo Credentials

Each role comes pre-seeded with rich, realistic data:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@temesgenlms.com` | `password123` | Full system control, course moderation, user management, financial audits, platform settings |
| **Lead Instructor** | `instructor@temesgenlms.com` | `password123` | Curriculum builder, video lecture uploads, quiz authoring, grading submissions, student roster |
| **Senior Instructor** | `sarah@temesgenlms.com` | `password123` | Course creation, assignment reviews, student feedback |
| **Enrolled Student** | `student@temesgenlms.com` | `password123` | Interactive classroom, auto-saving lesson progress, quiz attempts, certificate generation |
| **Enrolled Student** | `bethlehem@temesgenlms.com` | `password123` | Active course enrollment, video playback |

---

## 🏛️ Comprehensive Feature Breakdown

### 1. 🌐 Public Website & Catalog
- **Modern Landing Page**: Dynamic statistics counters, hero with 1-click demo access, category showcases, featured courses, student testimonials, and value propositions.
- **Search & Filtering**: Multi-parameter search by title, category pill filters, price slider (Free vs Paid), difficulty level (Beginner, Intermediate, Advanced), and sorting options (Newest, Popular, Price Low-to-High).
- **Course Detail Pages**: Comprehensive curriculum accordion, instructor biography, course prerequisites, learning objectives, student reviews, and responsive sticky checkout card.
- **Instant Enrollment**: One-click enrollment for free courses; integrated payment modal with **Chapa** and **Telebirr** simulation for paid courses.
- **Public Certificate Verification**: Anyone (employers, academic boards) can input a certificate ID (`TLMS-2026-A89F31`) to inspect student name, course title, issue date, instructor signature, and printable verified credential.

### 2. 🎓 Student Experience & Virtual Classroom
- **Interactive Course Classroom (`/learn/:id`)**:
  - Video lecture player with playback speed and quality options.
  - Rich reading modules with code snippets and markdown rendering.
  - Expandable curriculum sidebar with visual completion indicators.
  - **Auto-save Progress Tracking**: Checkboxes instantly mark lessons as complete in MySQL and compute real-time course percentage.
  - Automatic milestone detection: 100% course completion automatically issues a verified certificate.
- **Interactive Quiz Taking (`/quiz/:id`)**:
  - Timed quiz engine with active countdown timer.
  - Interactive question navigation bubbles (Answered, Unanswered, Current).
  - Instant auto-grading breakdown displaying score, percentage, pass/fail status, and explanation notes.
- **Student Dashboard (`/student`)**:
  - Personal welcome banner and quick resume cards.
  - KPI statistics: Enrolled Courses, Completed Courses, Learning Hours, Certificates Earned.
  - Assignment submission hub with text answers and file attachments.
  - Earned certificates library with one-click print and share links.
  - Personal notification center.

### 3. 👨‍🏫 Instructor Dashboard & Course Studio
- **Multi-Step Course Creation Wizard (`/instructor/create-course`)**:
  - **Step 1 — Basic Info**: Course title, category, subtitle.
  - **Step 2 — Course Details**: Level, language, comprehensive description.
  - **Step 3 — Media & Promo**: Cover image URL, promotional video URL.
  - **Step 4 — Pricing**: Free vs Paid switch, ETB pricing, estimated duration.
  - **Step 5 — Curriculum Builder**: Modules, lessons, free preview flags.
  - **Step 6 — Publish / Draft**: Review and instant launch.
- **Curriculum Builder (`/instructor/modules`)**:
  - Add and reorder sections and modules.
  - Add video lectures, reading articles, and downloadable resources.
- **Quiz Creator (`/instructor/quizzes`)**:
  - Define passing score %, duration in minutes, and max attempts.
  - Add questions with multiple-choice radio options, point values, and correct answer flags.
- **Assignment Manager & Grading Studio (`/instructor/submissions`)**:
  - Review student submissions with submitted text and file attachments.
  - Assign marks and write constructive mentoring feedback directly notified to students.
- **Enrolled Student Roster (`/instructor/students`)**:
  - Track individual student progress bars and completion records.
- **Analytics & Revenue (`/instructor/analytics`)**:
  - Recharts bar graphs of student enrollments per course.
  - Pie charts of course completion distribution.
  - Monthly ETB revenue trends from paid enrollments.

### 4. 🛡️ Administrator System Hub
- **Executive KPI Dashboard (`/admin`)**:
  - Total users, active courses, total platform revenue, active enrollments.
  - Monthly financial growth charts and recent activity audit logs.
- **User Management (`/admin/users`)**:
  - Full CRUD operations: Create new users, filter by role (Admin, Instructor, Student), toggle active/deactivate, reset passwords, soft delete.
- **Course Moderation & Quality Control (`/admin/courses`)**:
  - Approve pending instructor courses or reject with detailed feedback.
  - Toggle featured course status for the public homepage.
- **Category Taxonomy (`/admin/categories`)**:
  - Create and manage parent categories with icons, slugs, and active toggles.
- **Financial Audit Ledger (`/admin/payments`)**:
  - Full transaction ledger showing payment methods (Chapa, Telebirr, Bank Transfer), transaction reference IDs, and ETB amounts.
- **System Activity Logs (`/admin/logs`)**:
  - Searchable audit trail recording logins, course approvals, enrollments, and grading events.
- **Platform Settings (`/admin/settings`)**:
  - Customize site name, contact email, Chapa public API keys, and Telebirr merchant credentials.

---

## 🛠️ Project Structure

```
LMS/
├── backend/                             # Laravel 12 API Application
│   ├── app/
│   │   ├── Http/Controllers/Api/       # 13 REST Controllers
│   │   │   ├── AdminController.php
│   │   │   ├── AnnouncementController.php
│   │   │   ├── AssignmentController.php
│   │   │   ├── AuthController.php
│   │   │   ├── CertificateController.php
│   │   │   ├── CourseController.php
│   │   │   ├── EnrollmentController.php
│   │   │   ├── InstructorController.php
│   │   │   ├── LearningController.php
│   │   │   ├── NotificationController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── QuizController.php
│   │   │   └── StudentController.php
│   │   └── Models/                      # 22 Eloquent Models
│   ├── database/
│   │   ├── migrations/                  # 6 Schema migration files (Normalized 3NF)
│   │   └── seeders/
│   │       └── DatabaseSeeder.php       # Complete demo seeder with courses, quizzes, certs
│   └── routes/
│       └── api.php                      # 64 RESTful API routes
│
└── frontend/                            # React 18 + Vite + Tailwind CSS
    ├── src/
    │   ├── components/                  # Navbar, Footer, Sidebar, Modal, Badge, StatCard, etc.
    │   ├── context/                     # AuthContext (JWT/Sanctum state & role helpers)
    │   ├── dashboards/
    │   │   ├── admin/                   # 11 Admin management views
    │   │   ├── instructor/              # 11 Instructor studio views & 6-step wizard
    │   │   └── student/                 # 8 Student learning views
    │   ├── layouts/                     # PublicLayout & DashboardLayout
    │   ├── pages/                       # 10 Public & Classroom learning pages
    │   ├── services/                    # Axios client with interceptors
    │   ├── App.jsx                      # React Router v7 configuration with route guards
    │   └── main.jsx                     # Application entry point
    └── tailwind.config.js               # Temesgen LMS brand theme palette
```

---

## ⚡ Getting Started & Installation

### Prerequisites
- **PHP**: `8.2+`
- **Node.js**: `v20+` & `npm`
- **Composer**: `2.x+`
- **MySQL / MariaDB**: `10.4+` or `8.0+`

---

### Step 1: Database Setup
1. Start your MySQL / MariaDB server (e.g. through XAMPP or native service).
2. Create a new database named `temesgen_lms`:
```sql
CREATE DATABASE temesgen_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Step 2: Backend Setup (Laravel 12)
1. Open a terminal and navigate to `backend`:
```bash
cd backend
```
2. Configure `.env` (or copy `.env.example`):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=temesgen_lms
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```
3. Run database migrations and seed realistic demo data:
```bash
php artisan migrate:fresh --seed --force
```
4. Start the Laravel development server:
```bash
php artisan serve --port=8000
```
Backend API will be live at `http://127.0.0.1:8000`.

---

### Step 3: Frontend Setup (React + Vite)
1. In another terminal, navigate to `frontend`:
```bash
cd frontend
```
2. Install dependencies (if not already installed):
```bash
npm install
```
3. Start the Vite development server:
```bash
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 🧪 Testing Verification & Flows

1. **Test Public Catalog & Course Detail**:
   - Visit `http://localhost:5173/courses`.
   - Filter by categories or search "Full-Stack".
   - Click on "Full-Stack Web Development Bootcamp".
2. **Test 1-Click Demo Logins**:
   - Visit `http://localhost:5173/login`.
   - Use the 1-click **Admin**, **Instructor**, or **Student** demo buttons to immediately authenticate.
3. **Test Student Classroom & Auto-Graded Quiz**:
   - Log in as Student (`student@temesgenlms.com` / `password123`).
   - Click "Resume Course" on Full-Stack Bootcamp (`/learn/1`).
   - Complete lessons by clicking checkboxes; watch the progress gauge update.
   - Go to `/quiz/1` and complete the 3 multiple-choice questions to receive an auto-graded score.
4. **Test Public Certificate Verification**:
   - Visit `http://localhost:5173/verify-certificate?id=TLMS-2026-A89F31`.
   - View the official cryptographically verified certificate.
5. **Test Instructor Multi-Step Course Creation**:
   - Log in as Instructor (`instructor@temesgenlms.com` / `password123`).
   - Navigate to `/instructor/create-course` and experience the 6-step wizard.
6. **Test Admin Dashboard**:
   - Log in as Admin (`admin@temesgenlms.com` / `password123`).
   - View system KPIs, financial charts, user accounts, and moderation actions.

---

## 🎨 Design System & Palette

| Variable | Color Hex | Usage |
| :--- | :--- | :--- |
| **Primary Navy** | `#14213D` | Navbar, Headers, Dominant Brand Elements |
| **Secondary Purple** | `#6C63FF` | Action CTAs, Highlights, Gradients |
| **Accent Blue** | `#3B82F6` | Links, Information Badges |
| **Success Emerald**| `#10B981` | Completed Milestones, Passes, Verified Credentials |
| **Warning Amber** | `#F59E0B` | In-Review Badges, Pending Actions |
| **Neutral Canvas** | `#F8FAFC` | Light Background, Card Surface Contrast |

---

## 📄 License
Temesgen LMS is developed as an open-source educational platform for academic and commercial excellence.
Distributed under the **MIT License**.
