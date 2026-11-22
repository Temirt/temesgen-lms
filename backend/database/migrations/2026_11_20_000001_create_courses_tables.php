<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->longText('description')->nullable();
            $table->json('requirements')->nullable();
            $table->json('objectives')->nullable();
            $table->text('target_audience')->nullable();
            $table->enum('level', ['beginner', 'intermediate', 'advanced', 'all_levels'])->default('all_levels');
            $table->string('language')->default('English');
            $table->decimal('price', 10, 2)->default(0.00);
            $table->boolean('is_free')->default(true);
            $table->string('thumbnail')->nullable();
            $table->string('promo_video_url')->nullable();
            $table->enum('status', ['draft', 'pending_approval', 'published', 'rejected', 'archived'])->default('draft')->index();
            $table->text('rejection_reason')->nullable();
            $table->decimal('duration_hours', 5, 2)->default(0.00);
            $table->boolean('is_featured')->default(false)->index();
            $table->softDeletes();
            $table->timestamps();
        });

        // 3. Course Modules
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 4. Lessons
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('course_modules')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->enum('content_type', ['video', 'article', 'document'])->default('video');
            $table->string('video_url')->nullable();
            $table->string('video_storage_path')->nullable();
            $table->longText('article_body')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->boolean('is_preview')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 5. Lesson Resources
        Schema::create('lesson_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->string('title');
            $table->string('file_path');
            $table->string('file_type')->nullable();
            $table->string('file_size')->nullable();
            $table->boolean('is_downloadable')->default(true);
            $table->timestamps();
        });

        // 6. Course Requirements
        Schema::create('course_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('requirement');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 7. Course Objectives
        Schema::create('course_objectives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('objective');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_objectives');
        Schema::dropIfExists('course_requirements');
        Schema::dropIfExists('lesson_resources');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('categories');
    }
};
