<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\AssignmentFeedback;
use App\Models\AssignmentSubmission;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseObjective;
use App\Models\CourseRequirement;
use App\Models\CourseReview;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\LessonResource;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\Permission;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions
        $adminRole = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrator',
            'description' => 'Has complete system management permissions.'
        ]);
        $instructorRole = Role::create([
            'name' => 'instructor',
            'display_name' => 'Instructor',
            'description' => 'Can manage their own courses, materials, students, and assessments.'
        ]);
        $studentRole = Role::create([
            'name' => 'student',
            'display_name' => 'Student',
            'description' => 'Can access enrolled courses, quizzes, assignments, and certificates.'
        ]);

        $permissions = [
            ['name' => 'manage_users', 'display_name' => 'Manage Users', 'group' => 'admin'],
            ['name' => 'manage_courses', 'display_name' => 'Manage All Courses', 'group' => 'admin'],
            ['name' => 'manage_payments', 'display_name' => 'Manage Payments', 'group' => 'admin'],
            ['name' => 'create_course', 'display_name' => 'Create Course', 'group' => 'instructor'],
            ['name' => 'grade_assignments', 'display_name' => 'Grade Assignments', 'group' => 'instructor'],
            ['name' => 'enroll_course', 'display_name' => 'Enroll in Course', 'group' => 'student'],
            ['name' => 'take_quiz', 'display_name' => 'Take Quiz', 'group' => 'student'],
        ];
        foreach ($permissions as $p) {
            Permission::create($p);
        }

        // 2. Settings
        $settings = [
            ['key' => 'platform_name', 'value' => 'Temesgen LMS', 'group' => 'general', 'description' => 'Official Name of Platform'],
            ['key' => 'platform_tagline', 'value' => 'Learn. Grow. Achieve.', 'group' => 'general', 'description' => 'Platform Tagline'],
            ['key' => 'contact_email', 'value' => 'contact@temesgenlms.com', 'group' => 'general', 'description' => 'Official contact email'],
            ['key' => 'contact_phone', 'value' => '+251 911 234 567', 'group' => 'general', 'description' => 'Official phone number'],
            ['key' => 'currency', 'value' => 'ETB', 'group' => 'payment', 'description' => 'Default system currency'],
            ['key' => 'course_auto_approval', 'value' => '0', 'group' => 'course', 'description' => 'Auto approve instructor courses'],
            ['key' => 'enable_chapa', 'value' => '1', 'group' => 'payment', 'description' => 'Enable Chapa Gateway'],
            ['key' => 'enable_telebirr', 'value' => '1', 'group' => 'payment', 'description' => 'Enable Telebirr Gateway'],
        ];
        foreach ($settings as $s) {
            Setting::create($s);
        }

        // 3. Primary Users
        // Admin
        $admin = User::create([
            'name' => 'Temesgen Admin',
            'email' => 'admin@temesgenlms.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '+251 911 000 001',
            'headline' => 'Lead Platform Administrator & Architect',
            'bio' => 'Senior Systems Architect and Administrator for Temesgen LMS.',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $admin->roles()->attach($adminRole->id);

        // Instructors
        $instructor1 = User::create([
            'name' => 'Dr. Temesgen Abebe',
            'email' => 'instructor@temesgenlms.com',
            'password' => Hash::make('password123'),
            'role' => 'instructor',
            'phone' => '+251 912 345 678',
            'headline' => 'Full-Stack Software Engineer & AI Researcher',
            'bio' => 'Over 12 years of industry experience developing web backends, React applications, and enterprise microservices. Passionate about empowering African technologists.',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $instructor1->roles()->attach($instructorRole->id);

        $instructor2 = User::create([
            'name' => 'Sarah Jenkins',
            'email' => 'sarah@temesgenlms.com',
            'password' => Hash::make('password123'),
            'role' => 'instructor',
            'phone' => '+251 913 456 789',
            'headline' => 'Lead UI/UX Designer & Frontend Evangelist',
            'bio' => 'Former design lead with a flair for creating engaging, accessible user interfaces and modern React architectures.',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $instructor2->roles()->attach($instructorRole->id);

        // Students
        $student1 = User::create([
            'name' => 'Abebe Bikila',
            'email' => 'student@temesgenlms.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'phone' => '+251 914 567 890',
            'headline' => 'Aspiring Software Developer',
            'bio' => 'Studying computer science and learning modern web stacks to launch a career in tech.',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $student1->roles()->attach($studentRole->id);

        $student2 = User::create([
            'name' => 'Bethlehem Desta',
            'email' => 'bethlehem@temesgenlms.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'phone' => '+251 915 678 901',
            'headline' => 'Data Enthusiast',
            'bio' => 'Passionate about machine learning, analytics, and Python.',
            'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $student2->roles()->attach($studentRole->id);

        // 4. Categories
        $categoriesData = [
            [
                'name' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Master full-stack web applications with modern Laravel, React, Node.js, and databases.',
                'icon' => 'Code2',
                'is_active' => true,
            ],
            [
                'name' => 'Data Science & AI',
                'slug' => 'data-science-ai',
                'description' => 'Harness data analysis, machine learning algorithms, and deep neural architectures.',
                'icon' => 'Brain',
                'is_active' => true,
            ],
            [
                'name' => 'Mobile App Development',
                'slug' => 'mobile-development',
                'description' => 'Build high-performance native and cross-platform apps using Flutter and React Native.',
                'icon' => 'Smartphone',
                'is_active' => true,
            ],
            [
                'name' => 'Cloud & DevOps',
                'slug' => 'cloud-devops',
                'description' => 'Deploy scalable architectures using Docker, Kubernetes, CI/CD, and AWS infrastructure.',
                'icon' => 'Cloud',
                'is_active' => true,
            ],
            [
                'name' => 'UI/UX Design',
                'slug' => 'ui-ux-design',
                'description' => 'Design intuitive, human-centered products and interfaces with Figma and design systems.',
                'icon' => 'Palette',
                'is_active' => true,
            ],
            [
                'name' => 'Business & Technology',
                'slug' => 'business-technology',
                'description' => 'Lead tech startups, manage agile products, and drive digital transformation.',
                'icon' => 'Briefcase',
                'is_active' => true,
            ],
        ];

        $cats = [];
        foreach ($categoriesData as $c) {
            $cats[$c['slug']] = Category::create($c);
        }

        // 5. Courses
        // Course 1: Full-Stack Laravel 12 & React Masterclass
        $course1 = Course::create([
            'instructor_id' => $instructor1->id,
            'category_id' => $cats['web-development']->id,
            'title' => 'Full-Stack Laravel 12 & React Masterclass: Enterprise Architecture',
            'slug' => 'full-stack-laravel-12-react-masterclass',
            'subtitle' => 'Build production-ready, scalable web applications with Laravel 12 API and modern React Vite',
            'description' => 'In this comprehensive course, you will learn to construct robust enterprise applications from ground up. We cover everything from database schema normalization and Eloquent optimization to REST API design, Laravel Sanctum token security, role-based authorization, and modern reactive frontends with React 18, Vite, and Tailwind CSS.',
            'requirements' => [
                'Basic understanding of PHP and JavaScript',
                'Basic knowledge of relational databases (MySQL)',
                'A computer with PHP 8.2+ and Node.js installed'
            ],
            'objectives' => [
                'Design normalized MySQL schemas with foreign keys and indexes',
                'Architect secure RESTful APIs using Laravel 12 and Sanctum',
                'Implement Role-Based Access Control (RBAC) with Policies and Gates',
                'Construct slick frontend dashboards using React, Vite, and Tailwind CSS',
                'Integrate payment gateways and automated PDF certification'
            ],
            'target_audience' => 'Aspiring and professional developers looking to master modern full-stack web engineering.',
            'level' => 'intermediate',
            'language' => 'English',
            'price' => 2500.00,
            'is_free' => false,
            'thumbnail' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            'promo_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'status' => 'published',
            'duration_hours' => 24.5,
            'is_featured' => true,
        ]);

        // Course 2: React 18 & Modern UI Design Systems
        $course2 = Course::create([
            'instructor_id' => $instructor2->id,
            'category_id' => $cats['ui-ux-design']->id,
            'title' => 'Modern UI/UX Design & Frontend Systems with Figma and Tailwind',
            'slug' => 'modern-ui-ux-design-frontend-systems',
            'subtitle' => 'Craft beautiful, accessible web interfaces and translate Figma designs to clean React code',
            'description' => 'Learn how to think like a product designer and code like an expert frontend engineer. We cover user research, wireframing, color theory, typography, Figma component libraries, and translating design specs into Tailwind CSS and React components.',
            'requirements' => [
                'No prior design experience required',
                'Basic familiarity with HTML and CSS is helpful'
            ],
            'objectives' => [
                'Master Figma design tokens, auto-layout, and components',
                'Apply contrast ratios and WCAG accessibility standards',
                'Build flexible and reusable Tailwind CSS design systems',
                'Create responsive interactive charts and data visualizations'
            ],
            'target_audience' => 'UI designers wanting to code and developers wanting to elevate their visual craftsmanship.',
            'level' => 'beginner',
            'language' => 'English',
            'price' => 0.00,
            'is_free' => true,
            'thumbnail' => 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
            'promo_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'status' => 'published',
            'duration_hours' => 12.0,
            'is_featured' => true,
        ]);

        // Course 3: Python & Data Science Fundamentals
        $course3 = Course::create([
            'instructor_id' => $instructor1->id,
            'category_id' => $cats['data-science-ai']->id,
            'title' => 'Python for Data Science, Machine Learning & Analytics',
            'slug' => 'python-for-data-science-machine-learning',
            'subtitle' => 'Turn raw data into actionable insights using NumPy, Pandas, Scikit-Learn, and Matplotlib',
            'description' => 'Step into the high-growth realm of data science. This practical course provides end-to-end guidance from Python basics to predictive machine learning models and data visualization pipelines.',
            'requirements' => [
                'High school math basics',
                'Curiosity and enthusiasm for data'
            ],
            'objectives' => [
                'Clean, transform, and analyze datasets with Pandas',
                'Build regression and classification machine learning models',
                'Generate compelling visual analytics and dashboards',
                'Deploy machine learning models as REST APIs'
            ],
            'target_audience' => 'Professionals and students seeking a transition into Data Science and Machine Learning.',
            'level' => 'all_levels',
            'language' => 'English',
            'price' => 1800.00,
            'is_free' => false,
            'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            'promo_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'status' => 'published',
            'duration_hours' => 18.0,
            'is_featured' => true,
        ]);

        // Course 4: Cloud Engineering with Docker & Kubernetes
        $course4 = Course::create([
            'instructor_id' => $instructor1->id,
            'category_id' => $cats['cloud-devops']->id,
            'title' => 'DevOps Mastery: Docker, Kubernetes & CI/CD Pipelines',
            'slug' => 'devops-mastery-docker-kubernetes-cicd',
            'subtitle' => 'Containerize and orchestrate modern full-stack systems in high-availability cloud environments',
            'description' => 'Master containerization workflows, multi-stage Docker builds, Kubernetes cluster management, automated CI/CD pipelines, and cloud monitoring.',
            'requirements' => ['Linux command line familiarity', 'Basic web application deployment knowledge'],
            'objectives' => [
                'Create optimized Docker containers for Laravel and React',
                'Configure Kubernetes deployments, services, and ingress',
                'Build automated GitHub Actions CI/CD pipelines'
            ],
            'target_audience' => 'Developers and system admins wanting to master DevOps automation.',
            'level' => 'advanced',
            'language' => 'English',
            'price' => 3200.00,
            'is_free' => false,
            'thumbnail' => 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
            'promo_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'status' => 'published',
            'duration_hours' => 20.0,
            'is_featured' => false,
        ]);

        // 6. Modules and Lessons for Course 1
        $mod1 = CourseModule::create([
            'course_id' => $course1->id,
            'title' => 'Module 1: Architecture & Backend Foundations',
            'description' => 'Setting up the environment, architecting normalized databases, and configuring Laravel 12.',
            'sort_order' => 1,
        ]);

        $mod2 = CourseModule::create([
            'course_id' => $course1->id,
            'title' => 'Module 2: Sanctum Authentication & RBAC',
            'description' => 'Securing APIs, issuing bearer tokens, and enforcing Role-Based Access Control.',
            'sort_order' => 2,
        ]);

        $mod3 = CourseModule::create([
            'course_id' => $course1->id,
            'title' => 'Module 3: React 18 Frontend & Dashboard Integration',
            'description' => 'Connecting Vite, React Router, Tailwind CSS, and Axios to real Laravel endpoints.',
            'sort_order' => 3,
        ]);

        // Lessons for Module 1
        $lesson1_1 = Lesson::create([
            'course_id' => $course1->id,
            'module_id' => $mod1->id,
            'title' => 'Welcome to Temesgen LMS & Course Roadmap',
            'slug' => 'welcome-to-temesgen-lms-course-roadmap',
            'description' => 'An introduction to what we are building, the full-stack architecture, and learning milestones.',
            'content_type' => 'video',
            'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'duration_minutes' => 12,
            'is_preview' => true,
            'sort_order' => 1,
        ]);

        $lesson1_2 = Lesson::create([
            'course_id' => $course1->id,
            'module_id' => $mod1->id,
            'title' => 'Relational Database Design & Schema Normalization',
            'slug' => 'relational-database-design-schema-normalization',
            'description' => 'Deep dive into 3NF database normalization, foreign keys, cascade rules, and index optimization.',
            'content_type' => 'video',
            'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            'duration_minutes' => 25,
            'is_preview' => true,
            'sort_order' => 2,
        ]);

        $lesson1_3 = Lesson::create([
            'course_id' => $course1->id,
            'module_id' => $mod1->id,
            'title' => 'Laravel 12 RESTful API Architecture Best Practices',
            'slug' => 'laravel-12-restful-api-architecture',
            'description' => 'Understanding API Resource transformations, Form Requests validation, and JSON responses.',
            'content_type' => 'article',
            'article_body' => "## Architecture Principles\n\nWhen building enterprise Laravel APIs, maintain clear separation of concerns:\n\n1. **Controllers**: Slim controllers that orchestrate requests.\n2. **Form Requests**: Encapsulate all incoming validation rules.\n3. **API Resources**: Define exact JSON response shapes without leaking internal model attributes.\n4. **Eloquent Models**: Encapsulate relationships, scopes, and casts.\n\nKeep your APIs clean, idempotent, and secure.",
            'duration_minutes' => 15,
            'is_preview' => false,
            'sort_order' => 3,
        ]);

        // Lessons for Module 2
        $lesson2_1 = Lesson::create([
            'course_id' => $course1->id,
            'module_id' => $mod2->id,
            'title' => 'Laravel Sanctum: Token Authentication & Security',
            'slug' => 'laravel-sanctum-token-authentication',
            'description' => 'Implementing token issuance, token revocation, bearer headers, and CSRF protection.',
            'content_type' => 'video',
            'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            'duration_minutes' => 30,
            'is_preview' => false,
            'sort_order' => 1,
        ]);

        $lesson2_2 = Lesson::create([
            'course_id' => $course1->id,
            'module_id' => $mod2->id,
            'title' => 'Role-Based Access Control: Admin, Instructor & Student',
            'slug' => 'role-based-access-control-rbac',
            'description' => 'Enforcing granular user permissions with Laravel Gates, Policies, and middleware.',
            'content_type' => 'video',
            'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            'duration_minutes' => 28,
            'is_preview' => false,
            'sort_order' => 2,
        ]);

        // Lesson Resources
        LessonResource::create([
            'lesson_id' => $lesson1_1->id,
            'title' => 'Temesgen LMS Architecture Diagram (PDF)',
            'file_path' => 'resources/temesgen-lms-architecture.pdf',
            'file_type' => 'pdf',
            'file_size' => '2.4 MB',
            'is_downloadable' => true,
        ]);

        LessonResource::create([
            'lesson_id' => $lesson1_2->id,
            'title' => 'Database Schema SQL Reference Cheat-Sheet',
            'file_path' => 'resources/schema-normalization-guide.pdf',
            'file_type' => 'pdf',
            'file_size' => '1.1 MB',
            'is_downloadable' => true,
        ]);

        // 7. Quizzes for Course 1
        $quiz1 = Quiz::create([
            'course_id' => $course1->id,
            'module_id' => $mod1->id,
            'lesson_id' => $lesson1_2->id,
            'title' => 'Database Architecture & Normalization Assessment',
            'description' => 'Test your understanding of relational database normalization, foreign keys, and indexes.',
            'duration_minutes' => 15,
            'passing_score' => 75,
            'max_attempts' => 3,
            'randomize_questions' => true,
            'is_published' => true,
        ]);

        $q1 = Question::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'What is the primary objective of Database Normalization (3NF)?',
            'question_type' => 'multiple_choice',
            'points' => 10,
            'explanation' => 'Third normal form (3NF) reduces data redundancy and prevents insertion, update, and deletion anomalies.',
            'sort_order' => 1,
        ]);

        QuestionOption::create(['question_id' => $q1->id, 'option_text' => 'To maximize duplicate records for caching', 'is_correct' => false, 'sort_order' => 1]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => 'To reduce data redundancy and eliminate undesirable insertion/update anomalies', 'is_correct' => true, 'sort_order' => 2]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => 'To avoid using primary keys altogether', 'is_correct' => false, 'sort_order' => 3]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => 'To replace SQL queries with raw text files', 'is_correct' => false, 'sort_order' => 4]);

        $q2 = Question::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'In Laravel Sanctum, API tokens sent by single page applications (SPAs) or mobile clients should be passed via which HTTP Header?',
            'question_type' => 'multiple_choice',
            'points' => 10,
            'explanation' => 'Sanctum bearer tokens are delivered in the HTTP Authorization header: Bearer <token>.',
            'sort_order' => 2,
        ]);

        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Authorization: Bearer <token>', 'is_correct' => true, 'sort_order' => 1]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'X-User-Password: <plain_password>', 'is_correct' => false, 'sort_order' => 2]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Cookie: session_admin_only', 'is_correct' => false, 'sort_order' => 3]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Sanctum-Secret-Key: public', 'is_correct' => false, 'sort_order' => 4]);

        $q3 = Question::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Foreign key constraints in MySQL ensure referential integrity between related tables.',
            'question_type' => 'true_false',
            'points' => 5,
            'explanation' => 'Foreign keys prevent orphan records and maintain consistency between related parent and child rows.',
            'sort_order' => 3,
        ]);

        QuestionOption::create(['question_id' => $q3->id, 'option_text' => 'True', 'is_correct' => true, 'sort_order' => 1]);
        QuestionOption::create(['question_id' => $q3->id, 'option_text' => 'False', 'is_correct' => false, 'sort_order' => 2]);

        // 8. Assignments for Course 1
        $assignment1 = Assignment::create([
            'course_id' => $course1->id,
            'module_id' => $mod1->id,
            'title' => 'Design & Implement an E-Commerce Database Schema',
            'description' => 'Submit a complete SQL migration file or schema plan for an online store handling customers, orders, order items, and products. Include appropriate foreign keys, indexing on order status, and soft deletes.',
            'reference_attachment' => 'assignments/ecommerce_spec.pdf',
            'max_score' => 100,
            'due_date' => now()->addDays(14),
            'is_published' => true,
        ]);

        // 9. Enrollments & Progress for Student 1
        $enrollment1 = Enrollment::create([
            'user_id' => $student1->id,
            'course_id' => $course1->id,
            'enrollment_date' => now()->subDays(5),
            'status' => 'active',
            'progress_percentage' => 40.00,
            'last_accessed_at' => now()->subHours(2),
            'unique_enrollment_token' => 'ENR-' . strtoupper(Str::random(12)),
        ]);

        // Lesson progress
        LessonProgress::create([
            'user_id' => $student1->id,
            'course_id' => $course1->id,
            'lesson_id' => $lesson1_1->id,
            'is_completed' => true,
            'completed_at' => now()->subDays(4),
            'last_watched_second' => 720,
        ]);

        LessonProgress::create([
            'user_id' => $student1->id,
            'course_id' => $course1->id,
            'lesson_id' => $lesson1_2->id,
            'is_completed' => true,
            'completed_at' => now()->subDays(2),
            'last_watched_second' => 1500,
        ]);

        // Student 1 enrollment in Course 2 (Free course, 100% completed with Certificate!)
        $enrollment2 = Enrollment::create([
            'user_id' => $student1->id,
            'course_id' => $course2->id,
            'enrollment_date' => now()->subDays(20),
            'status' => 'completed',
            'completion_date' => now()->subDays(2),
            'progress_percentage' => 100.00,
            'last_accessed_at' => now()->subDays(2),
            'unique_enrollment_token' => 'ENR-' . strtoupper(Str::random(12)),
        ]);

        // Certificate for Student 1 on Course 2
        $certNumber = 'TLMS-2026-A89F31';
        Certificate::create([
            'certificate_number' => $certNumber,
            'user_id' => $student1->id,
            'course_id' => $course2->id,
            'enrollment_id' => $enrollment2->id,
            'issue_date' => now()->subDays(2)->toDateString(),
            'instructor_name' => $instructor2->name,
            'course_title' => $course2->title,
            'student_name' => $student1->name,
            'qr_code_path' => null,
            'pdf_path' => 'certificates/' . $certNumber . '.pdf',
            'verification_url' => 'http://localhost:5173/verify-certificate?id=' . $certNumber,
        ]);

        // Student 1 Quiz Attempt on Course 1
        $attempt1 = QuizAttempt::create([
            'user_id' => $student1->id,
            'quiz_id' => $quiz1->id,
            'attempt_number' => 1,
            'score' => 25.00,
            'total_points' => 25.00,
            'percentage' => 100.00,
            'is_passed' => true,
            'status' => 'graded',
            'instructor_feedback' => 'Outstanding mastery of database normalization concepts!',
            'started_at' => now()->subDays(2)->subMinutes(12),
            'completed_at' => now()->subDays(2),
        ]);

        // Student 1 Assignment Submission
        $sub1 = AssignmentSubmission::create([
            'assignment_id' => $assignment1->id,
            'user_id' => $student1->id,
            'submission_text' => 'Here is my complete database schema with users, orders, items, and products. Proper indexing and foreign keys have been configured as requested.',
            'file_path' => 'submissions/student1_schema_design.sql',
            'file_name' => 'student1_schema_design.sql',
            'submitted_at' => now()->subDays(1),
            'status' => 'graded',
            'grade' => 95.00,
            'instructor_id' => $instructor1->id,
            'graded_at' => now()->subHours(6),
        ]);

        AssignmentFeedback::create([
            'submission_id' => $sub1->id,
            'instructor_id' => $instructor1->id,
            'feedback_text' => 'Excellent work on the foreign key cascade rules and indexes on the status column. Keep up the high standard!',
        ]);

        // 10. Reviews
        CourseReview::create([
            'user_id' => $student1->id,
            'course_id' => $course1->id,
            'rating' => 5,
            'review' => 'One of the best full-stack courses I have ever taken! Dr. Temesgen explains architectural concepts with exceptional clarity.',
            'is_approved' => true,
        ]);

        CourseReview::create([
            'user_id' => $student2->id,
            'course_id' => $course1->id,
            'rating' => 5,
            'review' => 'Clear, professional, and practical. The Sanctum security and React integrations are top notch.',
            'is_approved' => true,
        ]);

        CourseReview::create([
            'user_id' => $student1->id,
            'course_id' => $course2->id,
            'rating' => 5,
            'review' => 'Sarah makes UI/UX design accessible and fun. Translating Figma designs to Tailwind was so smooth!',
            'is_approved' => true,
        ]);

        // 11. Payments & Transactions
        $payment1 = Payment::create([
            'user_id' => $student1->id,
            'course_id' => $course1->id,
            'amount' => 2500.00,
            'currency' => 'ETB',
            'provider' => 'chapa',
            'transaction_id' => 'TXN-CHP-' . strtoupper(Str::random(10)),
            'provider_reference' => 'CHP-REF-892348',
            'status' => 'completed',
            'payment_method' => 'Chapa Online Payment',
            'paid_at' => now()->subDays(5),
            'payload_data' => ['gateway' => 'chapa', 'bank' => 'CBE', 'status' => 'success'],
        ]);

        PaymentTransaction::create([
            'payment_id' => $payment1->id,
            'transaction_reference' => 'TXN-CHP-REF-01',
            'event_type' => 'charge.completed',
            'status' => 'success',
            'response_data' => ['code' => 200, 'message' => 'Payment verified successfully'],
        ]);

        // 12. Announcements
        Announcement::create([
            'course_id' => $course1->id,
            'instructor_id' => $instructor1->id,
            'title' => 'Live Q&A Session This Saturday at 3:00 PM EAT',
            'content' => 'Join us for a deep-dive interactive session on optimizing Eloquent queries and setting up Dockerized MySQL replicas.',
            'is_pinned' => true,
        ]);

        Announcement::create([
            'course_id' => null, // Platform-wide announcement
            'instructor_id' => $admin->id,
            'title' => 'Welcome to the New Academic Season on Temesgen LMS!',
            'content' => 'We have launched new course tracks in Cloud DevOps and UI/UX Design. Explore our featured courses and get certified!',
            'is_pinned' => false,
        ]);

        // 13. Notifications for Student 1
        Notification::create([
            'user_id' => $student1->id,
            'type' => 'assignment_graded',
            'title' => 'Assignment Graded',
            'message' => 'Your assignment "E-Commerce Database Schema" has been graded: 95/100.',
            'link' => '/student/assignments',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $student1->id,
            'type' => 'certificate_issued',
            'title' => 'Certificate Issued!',
            'message' => 'Congratulations! You earned a Certificate of Completion for "Modern UI/UX Design & Frontend Systems".',
            'link' => '/student/certificates',
            'is_read' => true,
            'read_at' => now()->subDays(1),
        ]);

        Notification::create([
            'user_id' => $student1->id,
            'type' => 'announcement',
            'title' => 'New Course Announcement',
            'message' => 'Dr. Temesgen posted: Live Q&A Session This Saturday at 3:00 PM EAT.',
            'link' => '/courses/' . $course1->slug,
            'is_read' => false,
        ]);

        // 14. Activity Logs
        ActivityLog::log('USER_LOGIN', 'User logged in successfully', $student1, $student1);
        ActivityLog::log('COURSE_ENROLL', "Enrolled in course: {$course1->title}", $course1, $student1);
        ActivityLog::log('QUIZ_SUBMIT', "Completed quiz: {$quiz1->title} with score 100%", $quiz1, $student1);
        ActivityLog::log('CERTIFICATE_GENERATE', "Generated certificate {$certNumber}", $course2, $student1);

        // 15. The 3 L's Learning Framework (LEARN, LINK, LEAD)
        $this->call(ThreeLsFrameworkSeeder::class);
    }
}
