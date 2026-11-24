<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Course;
use App\Models\CourseDiscussion;
use App\Models\DirectMessage;
use App\Models\DiscussionReply;
use App\Models\LearningPath;
use App\Models\LearningPathCourse;
use App\Models\ProjectSubmission;
use App\Models\RealWorldProject;
use App\Models\Skill;
use App\Models\StudyGroup;
use App\Models\StudyGroupMember;
use App\Models\StudyGroupMessage;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\UserLearningPath;
use App\Models\UserSkill;
use Illuminate\Database\Seeder;

class ThreeLsFrameworkSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('email', 'student@temesgenlms.com')->first();
        $student2 = User::where('email', 'bethlehem@temesgenlms.com')->first();
        $instructor = User::where('email', 'instructor@temesgenlms.com')->first();
        $instructor2 = User::where('email', 'sarah@temesgenlms.com')->first();
        $admin = User::where('email', 'admin@temesgenlms.com')->first();

        $course1 = Course::find(1); // Full-Stack Laravel & React
        $course2 = Course::find(2); // UI/UX Design & Tailwind
        $course3 = Course::find(3); // Python Data Science
        $course4 = Course::find(4); // DevOps Mastery

        if (!$student || !$instructor) {
            return;
        }

        // ==========================================
        // 1. LEARN PRINCIPLE: Personalized Learning Paths
        // ==========================================
        $path1 = LearningPath::updateOrCreate(
            ['slug' => 'full-stack-enterprise-architect'],
            [
                'title' => 'Full-Stack Enterprise Cloud Architect',
                'description' => 'A structured, end-to-end pathway from database schema normalization and REST API engineering to modern reactive frontends and cloud containerization.',
                'level' => 'intermediate',
                'icon' => 'Layers',
                'color' => 'indigo',
                'estimated_weeks' => 12,
                'career_role' => 'Senior Full-Stack Engineer / Technical Lead',
                'outcomes' => [
                    'Architect production-grade Laravel 12 APIs with Sanctum tokens',
                    'Construct scalable component hierarchies in React 18 & Tailwind',
                    'Deploy high-availability containers with Docker and Kubernetes',
                ],
                'is_active' => true,
            ]
        );

        $path2 = LearningPath::updateOrCreate(
            ['slug' => 'cloud-devops-reliability-engineer'],
            [
                'title' => 'Cloud Native & DevOps Reliability Specialist',
                'description' => 'Master container orchestration, automated GitHub Actions CI/CD workflows, and production monitoring.',
                'level' => 'advanced',
                'icon' => 'Cloud',
                'color' => 'emerald',
                'estimated_weeks' => 10,
                'career_role' => 'Cloud Solutions Architect / Site Reliability Engineer',
                'outcomes' => [
                    'Build multi-stage Docker builds for minimal attack surface',
                    'Implement declarative Kubernetes ingress and secret management',
                    'Automate testing, linting, and zero-downtime deployment pipelines',
                ],
                'is_active' => true,
            ]
        );

        $path3 = LearningPath::updateOrCreate(
            ['slug' => 'ai-data-science-engineer'],
            [
                'title' => 'Applied AI & Data Science Engineering',
                'description' => 'Transform unstructured enterprise data into predictive models and actionable machine learning microservices.',
                'level' => 'all_levels',
                'icon' => 'Brain',
                'color' => 'purple',
                'estimated_weeks' => 10,
                'career_role' => 'Machine Learning Engineer / Data Scientist',
                'outcomes' => [
                    'Perform exploratory data analysis and feature engineering with Pandas',
                    'Train regression, classification, and neural models with Scikit-Learn',
                    'Serve machine learning inferences via fast RESTful endpoints',
                ],
                'is_active' => true,
            ]
        );

        $path4 = LearningPath::updateOrCreate(
            ['slug' => 'product-design-frontend-systems'],
            [
                'title' => 'Modern UI/UX Design & Reactive Systems',
                'description' => 'Bridge the gap between design vision and engineered frontends with Figma design tokens, WCAG accessibility, and Tailwind CSS.',
                'level' => 'beginner',
                'icon' => 'Palette',
                'color' => 'sky',
                'estimated_weeks' => 8,
                'career_role' => 'Design Technologist / Lead Frontend Developer',
                'outcomes' => [
                    'Craft responsive design systems and components in Figma',
                    'Enforce WCAG 2.1 AA accessibility and contrast benchmarks',
                    'Build interactive charts, gauges, and motion primitives',
                ],
                'is_active' => true,
            ]
        );

        // Associate Courses to Path 1
        if ($course1 && $course4) {
            LearningPathCourse::updateOrCreate(
                ['learning_path_id' => $path1->id, 'course_id' => $course1->id],
                ['sort_order' => 1, 'is_milestone' => true, 'milestone_title' => 'Milestone 1: Backend API & Reactive Foundation']
            );
            if ($course2) {
                LearningPathCourse::updateOrCreate(
                    ['learning_path_id' => $path1->id, 'course_id' => $course2->id],
                    ['sort_order' => 2, 'is_milestone' => false, 'milestone_title' => 'Milestone 2: Design System Integration']
                );
            }
            LearningPathCourse::updateOrCreate(
                ['learning_path_id' => $path1->id, 'course_id' => $course4->id],
                ['sort_order' => 3, 'is_milestone' => true, 'milestone_title' => 'Milestone 3: Cloud Deployment & Capstone Architecture']
            );
        }

        // Enroll Student in Path 1 with 65% progress
        UserLearningPath::updateOrCreate(
            ['user_id' => $student->id, 'learning_path_id' => $path1->id],
            [
                'progress_percentage' => 65.0,
                'status' => 'in_progress',
                'started_at' => now()->subDays(18),
            ]
        );

        // ==========================================
        // 2. LINK PRINCIPLE: Messaging, Discussions, Study Groups
        // ==========================================

        // Direct Messages
        DirectMessage::create([
            'sender_id' => $student->id,
            'recipient_id' => $instructor->id,
            'course_id' => $course1?->id,
            'subject' => 'Question regarding Sanctum Stateful Domains configuration',
            'message' => 'Hello Dr. Temesgen, I have configured SANCTUM_STATEFUL_DOMAINS for localhost:5173. What is the recommended strategy when deploying frontend to Vercel and API to an AWS EC2 domain?',
            'is_read' => true,
            'read_at' => now()->subHours(8),
            'created_at' => now()->subHours(10),
        ]);

        DirectMessage::create([
            'sender_id' => $instructor->id,
            'recipient_id' => $student->id,
            'course_id' => $course1?->id,
            'subject' => 'Re: Question regarding Sanctum Stateful Domains configuration',
            'message' => 'Hi Abebe! Excellent question. When deploying cross-domain (e.g. Vercel + EC2), you should use Sanctum Bearer Tokens rather than cookie-based session domains, with tokens stored securely in memory or secure storage. This completely avoids cross-site cookie restrictions!',
            'is_read' => false,
            'created_at' => now()->subHours(7),
        ]);

        if ($instructor2) {
            DirectMessage::create([
                'sender_id' => $instructor2->id,
                'recipient_id' => $student->id,
                'course_id' => $course2?->id,
                'subject' => 'Feedback on UI/UX Wireframe',
                'message' => 'Great work on your typography scale and spacing tokens in lesson 3! Looking forward to your final capstone project submission.',
                'is_read' => true,
                'read_at' => now()->subDays(2),
                'created_at' => now()->subDays(2),
            ]);
        }

        // Course Discussions
        if ($course1) {
            $disc1 = CourseDiscussion::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Optimizing MySQL Database Queries with Eager Loading (N+1 Problem)'],
                [
                    'user_id' => $student->id,
                    'content' => "When fetching courses with their modules and lessons, what is the best Eloquent syntax to prevent N+1 queries in the API response?\n\nI noticed that calling \$course->modules inside a loop executes a new query per row. Would Course::with(['modules.lessons']) solve this cleanly?",
                    'upvotes' => 12,
                    'is_pinned' => true,
                    'is_resolved' => true,
                    'created_at' => now()->subDays(3),
                ]
            );

            DiscussionReply::create([
                'course_discussion_id' => $disc1->id,
                'user_id' => $instructor->id,
                'content' => "Spot on, Abebe! Using `Course::with(['modules.lessons'])` reduces the queries to exactly 3 regardless of how many modules or lessons exist. Additionally, you can add selective column constraints like `'modules.lessons:id,course_module_id,title,duration_minutes'` to minimize RAM consumption.",
                'is_instructor_endorsed' => true,
                'upvotes' => 8,
                'created_at' => now()->subDays(2),
            ]);

            if ($student2) {
                DiscussionReply::create([
                    'course_discussion_id' => $disc1->id,
                    'user_id' => $student2->id,
                    'content' => "Thank you both! This was causing slow responses on my local machine. The eager loading fix made it load in under 40ms.",
                    'is_instructor_endorsed' => false,
                    'upvotes' => 4,
                    'created_at' => now()->subDay(),
                ]);
            }

            $disc2 = CourseDiscussion::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Telebirr and Chapa Webhook Verification Best Practices in Production'],
                [
                    'user_id' => $student2 ? $student2->id : $student->id,
                    'content' => "How should we handle potential network replay attacks or dropped webhook callbacks from Chapa or Telebirr? Should we check payment status via a fallback polling cron job?",
                    'upvotes' => 9,
                    'is_pinned' => false,
                    'is_resolved' => false,
                    'created_at' => now()->subDays(1),
                ]
            );

            DiscussionReply::create([
                'course_discussion_id' => $disc2->id,
                'user_id' => $instructor->id,
                'content' => "Always verify the HMAC SHA-256 signature provided in the webhook payload headers using your secret key. To handle network dropped callbacks, a scheduled Artisan command running every 10 minutes checking pending transactions against the gateway REST API ensures 100% financial consistency.",
                'is_instructor_endorsed' => true,
                'upvotes' => 5,
                'created_at' => now()->subHours(12),
            ]);
        }

        // Student Study Groups
        if ($course1) {
            $group1 = StudyGroup::updateOrCreate(
                ['name' => 'Addis Ababa Full-Stack Sprint Circle'],
                [
                    'course_id' => $course1->id,
                    'creator_id' => $student->id,
                    'description' => 'A collaborative peer study circle for students building modern enterprise applications with Laravel 12 and React 18. We conduct weekly code reviews and project demo sessions.',
                    'topic' => 'Full-Stack REST Architecture & Vite Optimization',
                    'meeting_schedule' => 'Tuesdays & Thursdays, 7:00 PM EAT',
                    'max_members' => 10,
                    'is_private' => false,
                ]
            );

            StudyGroupMember::updateOrCreate(
                ['study_group_id' => $group1->id, 'user_id' => $student->id],
                ['role' => 'leader', 'joined_at' => now()->subDays(10)]
            );

            if ($student2) {
                StudyGroupMember::updateOrCreate(
                    ['study_group_id' => $group1->id, 'user_id' => $student2->id],
                    ['role' => 'member', 'joined_at' => now()->subDays(8)]
                );
            }

            StudyGroupMember::updateOrCreate(
                ['study_group_id' => $group1->id, 'user_id' => $instructor->id],
                ['role' => 'member', 'joined_at' => now()->subDays(6)]
            );

            // Group Messages
            StudyGroupMessage::create([
                'study_group_id' => $group1->id,
                'user_id' => $student->id,
                'message' => 'Welcome to the Sprint Circle everyone! Tomorrow evening we will do a live walkthrough of our capstone project repositories and discuss database migrations.',
                'created_at' => now()->subDays(2),
            ]);

            if ($student2) {
                StudyGroupMessage::create([
                    'study_group_id' => $group1->id,
                    'user_id' => $student2->id,
                    'message' => 'Excited to join! I have finished setting up the Tailwind design tokens and will present my component library.',
                    'created_at' => now()->subDay(),
                ]);
            }

            StudyGroupMessage::create([
                'study_group_id' => $group1->id,
                'user_id' => $instructor->id,
                'message' => 'I will drop in for 15 minutes to answer questions on transaction isolation levels and token security. Keep up the great collaborative spirit!',
                'created_at' => now()->subHours(6),
            ]);
        }

        if ($course4) {
            $group2 = StudyGroup::updateOrCreate(
                ['name' => 'DevOps & Cloud Champions'],
                [
                    'course_id' => $course4->id,
                    'creator_id' => $instructor->id,
                    'description' => 'Hands-on cluster troubleshooting, CI/CD pipeline writing, and container security hardening for production environments.',
                    'topic' => 'Kubernetes Deployments, Ingress Controllers & GitHub Actions',
                    'meeting_schedule' => 'Saturdays, 3:00 PM EAT',
                    'max_members' => 12,
                    'is_private' => false,
                ]
            );

            StudyGroupMember::updateOrCreate(
                ['study_group_id' => $group2->id, 'user_id' => $instructor->id],
                ['role' => 'leader', 'joined_at' => now()->subDays(14)]
            );

            StudyGroupMember::updateOrCreate(
                ['study_group_id' => $group2->id, 'user_id' => $student->id],
                ['role' => 'member', 'joined_at' => now()->subDays(5)]
            );
        }

        // ==========================================
        // 3. LEAD PRINCIPLE: Projects, Skills, Badges
        // ==========================================

        // Real-World Capstone Projects
        if ($course1) {
            $proj1 = RealWorldProject::updateOrCreate(
                ['title' => 'Enterprise E-Commerce & Telebirr/Chapa Ledger Engine'],
                [
                    'course_id' => $course1->id,
                    'instructor_id' => $instructor->id,
                    'description' => 'Build a high-throughput enterprise commerce backend with double-entry cryptographic ledger auditing, tokenized authentication, and reactive checkout flows.',
                    'scenario' => 'A premier Ethiopian digital merchant requires a reliable billing backend capable of processing high-volume transactions via Chapa and Telebirr with automated reconciliation, invoice generation, and real-time dashboard analytics.',
                    'requirements' => [
                        'Design 3NF normalized database schema for orders, invoices, and ledger entries',
                        'Implement Laravel Sanctum token security with role policies',
                        'Build resilient webhook listeners verifying HMAC SHA-256 signatures',
                        'Construct responsive React 18 checkout modal with Tailwind CSS',
                        'Write automated PHPUnit feature tests verifying double-entry balance',
                    ],
                    'deliverables' => [
                        'GitHub repository with clean Git commit history',
                        'Live deployed URL on Vercel / Railway / AWS',
                        'Architecture documentation & Postman/OpenAPI API collection',
                    ],
                    'skills_developed' => [
                        'Backend API Engineering',
                        'Database Architecture',
                        'Reactive Frontend UI',
                        'Fintech Payment Integration',
                    ],
                    'difficulty' => 'advanced',
                    'estimated_hours' => 25,
                    'max_score' => 100,
                    'passing_score' => 75,
                ]
            );

            // Seed Student Submission & Evaluated Grade
            ProjectSubmission::updateOrCreate(
                ['project_id' => $proj1->id, 'user_id' => $student->id],
                [
                    'github_url' => 'https://github.com/Temirt/fintech-ledger-engine',
                    'live_demo_url' => 'https://fintech-ledger-demo.vercel.app',
                    'architecture_notes' => 'Implemented complete double-entry bookkeeping ledger with transactional rollbacks, HMAC webhook signature verification, and React 18 + Vite dashboard with live Recharts revenue graphs.',
                    'status' => 'graded',
                    'score' => 94,
                    'evaluation_feedback' => 'Exceptional technical execution! Your database schema normalization and error handling in transaction isolation are industry-grade. The webhook signature validation cleanly guards against replay attacks.',
                    'evaluator_id' => $instructor->id,
                    'evaluated_at' => now()->subDays(2),
                ]
            );
        }

        if ($course4) {
            RealWorldProject::updateOrCreate(
                ['title' => 'Automated Zero-Downtime CI/CD & Kubernetes Cluster'],
                [
                    'course_id' => $course4->id,
                    'instructor_id' => $instructor->id,
                    'description' => 'Architect and deploy an enterprise multi-tier application across a multi-node Kubernetes cluster with automated GitHub Actions CI/CD and rolling update strategies.',
                    'scenario' => 'An e-learning platform is migrating from a single VPS to a high-availability cloud architecture with horizontal pod autoscaling (HPA) and automated staging/production promotions.',
                    'requirements' => [
                        'Write optimized multi-stage Dockerfile for Laravel API and Vite React',
                        'Create Kubernetes manifests: Deployments, Services, ConfigMaps, Ingress',
                        'Configure Horizontal Pod Autoscaler based on CPU and memory metrics',
                        'Write GitHub Actions pipeline for automated lint, test, build, and deploy',
                    ],
                    'deliverables' => [
                        'GitHub repository containing infrastructure as code (IaC)',
                        'Publicly accessible load balancer / Ingress endpoint',
                        'Cluster architecture diagram and performance benchmark report',
                    ],
                    'skills_developed' => [
                        'Cloud Containerization',
                        'CI/CD Automation',
                        'Kubernetes Orchestration',
                        'System Reliability',
                    ],
                    'difficulty' => 'expert',
                    'estimated_hours' => 30,
                    'max_score' => 100,
                    'passing_score' => 80,
                ]
            );
        }

        // Skills Taxonomy
        $skillsData = [
            ['name' => 'Backend API Engineering', 'category' => 'Backend', 'icon' => 'Server', 'description' => 'Architecting robust, scalable RESTful APIs with Laravel and PHP 8.2+'],
            ['name' => 'Database Architecture', 'category' => 'Backend', 'icon' => 'Database', 'description' => 'Normalized 3NF relational schemas, indexing, and foreign key constraints'],
            ['name' => 'Reactive Frontend UI', 'category' => 'Frontend', 'icon' => 'Layout', 'description' => 'Building modular, stateful reactive user interfaces with React 18 & Tailwind'],
            ['name' => 'Cloud Containerization', 'category' => 'DevOps', 'icon' => 'Box', 'description' => 'Packaging applications with multi-stage Docker builds and Docker Compose'],
            ['name' => 'CI/CD Automation', 'category' => 'DevOps', 'icon' => 'GitBranch', 'description' => 'Automating build, test, and zero-downtime deployment workflows'],
            ['name' => 'Data Science & Analytics', 'category' => 'Data Science', 'icon' => 'BarChart2', 'description' => 'Data transformation, statistical analysis, and machine learning pipelines'],
            ['name' => 'UI/UX Design Systems', 'category' => 'Design', 'icon' => 'Palette', 'description' => 'Design tokens, Figma components, and WCAG accessibility standards'],
            ['name' => 'Application Security & RBAC', 'category' => 'Security', 'icon' => 'ShieldCheck', 'description' => 'Sanctum token guards, policy-level authorization, and data sanitization'],
        ];

        $skillModels = [];
        foreach ($skillsData as $s) {
            $skillModels[$s['name']] = Skill::updateOrCreate(['name' => $s['name']], $s);
        }

        // User Skills for Demo Student
        $studentProficiencies = [
            'Backend API Engineering' => ['level' => 92, 'status' => 'mastered', 'projects' => 2],
            'Database Architecture' => ['level' => 88, 'status' => 'mastered', 'projects' => 2],
            'Reactive Frontend UI' => ['level' => 84, 'status' => 'mastered', 'projects' => 1],
            'Application Security & RBAC' => ['level' => 78, 'status' => 'proficient', 'projects' => 1],
            'Cloud Containerization' => ['level' => 65, 'status' => 'proficient', 'projects' => 1],
            'UI/UX Design Systems' => ['level' => 70, 'status' => 'proficient', 'projects' => 1],
            'CI/CD Automation' => ['level' => 55, 'status' => 'developing', 'projects' => 0],
            'Data Science & Analytics' => ['level' => 40, 'status' => 'developing', 'projects' => 0],
        ];

        foreach ($studentProficiencies as $name => $prof) {
            if (isset($skillModels[$name])) {
                UserSkill::updateOrCreate(
                    ['user_id' => $student->id, 'skill_id' => $skillModels[$name]->id],
                    [
                        'proficiency_level' => $prof['level'],
                        'status' => $prof['status'],
                        'verified_projects_count' => $prof['projects'],
                    ]
                );
            }
        }

        // Achievement Badges
        $badgesData = [
            // LEARN Badges
            [
                'code' => 'learn_curriculum_conqueror',
                'name' => 'Curriculum Conqueror',
                'principle' => 'learn',
                'description' => 'Completed over 10 video and reading lessons with perfect auto-save progress.',
                'icon' => 'BookOpen',
                'color' => 'indigo',
                'criteria' => 'Complete at least 10 course lessons',
            ],
            [
                'code' => 'learn_quiz_virtuoso',
                'name' => 'Quiz Virtuoso',
                'principle' => 'learn',
                'description' => 'Achieved a score of 90% or higher on an interactive timed quiz.',
                'icon' => 'HelpCircle',
                'color' => 'purple',
                'criteria' => 'Score 90%+ on any course examination',
            ],
            [
                'code' => 'learn_pathway_pioneer',
                'name' => 'Pathway Pioneer',
                'principle' => 'learn',
                'description' => 'Enrolled in a personalized career learning path and achieved over 50% milestone progress.',
                'icon' => 'Compass',
                'color' => 'sky',
                'criteria' => 'Reach 50% on any career learning path',
            ],

            // LINK Badges
            [
                'code' => 'link_community_connector',
                'name' => 'Community Connector',
                'principle' => 'link',
                'description' => 'Started engaging course discussion threads and shared knowledge with fellow students.',
                'icon' => 'MessageSquare',
                'color' => 'emerald',
                'criteria' => 'Create 3 active discussion threads',
            ],
            [
                'code' => 'link_collaborative_peer',
                'name' => 'Collaborative Peer',
                'principle' => 'link',
                'description' => 'Joined a peer study group and actively contributed to collaborative discussions.',
                'icon' => 'Users',
                'color' => 'teal',
                'criteria' => 'Become an active member of a study group',
            ],
            [
                'code' => 'link_discussion_leader',
                'name' => 'Discussion Leader',
                'principle' => 'link',
                'description' => 'Provided a helpful forum reply that received official instructor endorsement.',
                'icon' => 'CheckCircle',
                'color' => 'blue',
                'criteria' => 'Receive an instructor endorsement on a forum reply',
            ],

            // LEAD Badges
            [
                'code' => 'lead_capstone_master',
                'name' => 'Capstone Champion',
                'principle' => 'lead',
                'description' => 'Successfully engineered and submitted a comprehensive real-world capstone project.',
                'icon' => 'Rocket',
                'color' => 'amber',
                'criteria' => 'Submit a complete real-world project with GitHub repository',
            ],
            [
                'code' => 'lead_senior_evaluator',
                'name' => 'Distinguished Honor',
                'principle' => 'lead',
                'description' => 'Earned an evaluation score of 90%+ on a real-world project assessment.',
                'icon' => 'Award',
                'color' => 'rose',
                'criteria' => 'Achieve 90%+ evaluation score on a real-world project',
            ],
            [
                'code' => 'lead_certified_specialist',
                'name' => 'Verified Specialist',
                'principle' => 'lead',
                'description' => 'Earned a cryptographically verifiable Temesgen LMS professional certificate.',
                'icon' => 'GraduationCap',
                'color' => 'amber',
                'criteria' => 'Earn a verified public completion certificate',
            ],
        ];

        foreach ($badgesData as $b) {
            $badge = Badge::updateOrCreate(['code' => $b['code']], $b);

            // Award earned badges to student
            if (in_array($b['code'], [
                'learn_curriculum_conqueror',
                'learn_pathway_pioneer',
                'link_collaborative_peer',
                'lead_capstone_master',
                'lead_senior_evaluator',
                'lead_certified_specialist'
            ])) {
                UserBadge::updateOrCreate(
                    ['user_id' => $student->id, 'badge_id' => $badge->id],
                    ['awarded_at' => now()->subDays(rand(1, 10))]
                );
            }
        }
    }
}
