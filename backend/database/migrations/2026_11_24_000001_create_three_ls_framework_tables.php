<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for the 3 L's Learning Framework:
     * 1. LEARN (Personalized Learning Paths)
     * 2. LINK (Messaging, Discussions, Study Groups)
     * 3. LEAD (Real-World Projects, Skill Tracking, Badges)
     */
    public function up(): void
    {
        // ==========================================
        // 1. LEARN PRINCIPLE TABLES
        // ==========================================

        Schema::create('learning_paths', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('level', ['beginner', 'intermediate', 'advanced', 'all_levels'])->default('intermediate');
            $table->string('icon')->default('Compass');
            $table->string('color')->default('indigo'); // indigo, emerald, purple, sky, amber
            $table->integer('estimated_weeks')->default(8);
            $table->string('career_role')->nullable(); // e.g. Full-Stack Architect, AI Engineer
            $table->json('outcomes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('learning_path_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_path_id')->constrained('learning_paths')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->integer('sort_order')->default(1);
            $table->boolean('is_milestone')->default(false);
            $table->string('milestone_title')->nullable();
            $table->timestamps();
        });

        Schema::create('user_learning_paths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('learning_path_id')->constrained('learning_paths')->cascadeOnDelete();
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->enum('status', ['enrolled', 'in_progress', 'completed'])->default('enrolled');
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'learning_path_id']);
        });

        // ==========================================
        // 2. LINK PRINCIPLE TABLES
        // ==========================================

        // Direct Messages between Students & Instructors
        Schema::create('direct_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recipient_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['sender_id', 'recipient_id']);
        });

        // Course Discussion Forums & Threads
        Schema::create('course_discussions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->string('title');
            $table->text('content');
            $table->integer('upvotes')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });

        // Discussion Thread Replies
        Schema::create('discussion_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_discussion_id')->constrained('course_discussions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_instructor_endorsed')->default(false);
            $table->integer('upvotes')->default(0);
            $table->timestamps();
        });

        // Student Study Groups
        Schema::create('study_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->text('description');
            $table->string('topic');
            $table->string('meeting_schedule')->nullable(); // e.g. "Wednesdays & Sundays 7:00 PM"
            $table->integer('max_members')->default(8);
            $table->boolean('is_private')->default(false);
            $table->timestamps();
        });

        // Study Group Members
        Schema::create('study_group_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_group_id')->constrained('study_groups')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('role', ['leader', 'member'])->default('member');
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();

            $table->unique(['study_group_id', 'user_id']);
        });

        // Study Group Collaboration Messages
        Schema::create('study_group_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_group_id')->constrained('study_groups')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->string('attachment_url')->nullable();
            $table->timestamps();
        });

        // ==========================================
        // 3. LEAD PRINCIPLE TABLES
        // ==========================================

        // Real-World Capstone / Industry Projects
        Schema::create('real_world_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->text('scenario'); // Real-world context
            $table->json('requirements'); // Step-by-step specifications
            $table->json('deliverables'); // Expected submissions
            $table->json('skills_developed'); // Skill tags awarded
            $table->enum('difficulty', ['intermediate', 'advanced', 'expert'])->default('advanced');
            $table->integer('estimated_hours')->default(20);
            $table->integer('max_score')->default(100);
            $table->integer('passing_score')->default(75);
            $table->timestamps();
        });

        // Real-World Project Submissions
        Schema::create('project_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('real_world_projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('github_url');
            $table->string('live_demo_url')->nullable();
            $table->text('architecture_notes')->nullable();
            $table->enum('status', ['submitted', 'under_review', 'graded', 'revision_requested'])->default('submitted');
            $table->integer('score')->nullable();
            $table->text('evaluation_feedback')->nullable();
            $table->foreignId('evaluator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('evaluated_at')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
        });

        // Skills Taxonomy
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('category'); // e.g. Frontend, Backend, DevOps, Data Science, UI/UX
            $table->string('icon')->default('Award');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // User Skill Development Tracking
        Schema::create('user_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->integer('proficiency_level')->default(20); // 0 - 100
            $table->enum('status', ['developing', 'proficient', 'mastered'])->default('developing');
            $table->integer('verified_projects_count')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'skill_id']);
        });

        // Achievement Badges
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->enum('principle', ['learn', 'link', 'lead'])->default('learn');
            $table->text('description');
            $table->string('icon'); // Lucide icon name
            $table->string('color')->default('amber'); // amber, indigo, emerald, purple, rose, sky
            $table->string('criteria');
            $table->timestamps();
        });

        // User Badges Earned
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('badge_id')->constrained('badges')->cascadeOnDelete();
            $table->timestamp('awarded_at')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'badge_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('user_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('project_submissions');
        Schema::dropIfExists('real_world_projects');
        Schema::dropIfExists('study_group_messages');
        Schema::dropIfExists('study_group_members');
        Schema::dropIfExists('study_groups');
        Schema::dropIfExists('discussion_replies');
        Schema::dropIfExists('course_discussions');
        Schema::dropIfExists('direct_messages');
        Schema::dropIfExists('user_learning_paths');
        Schema::dropIfExists('learning_path_courses');
        Schema::dropIfExists('learning_paths');
    }
};
