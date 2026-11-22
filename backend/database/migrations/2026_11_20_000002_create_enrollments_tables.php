<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Enrollments
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamp('enrollment_date')->useCurrent();
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active')->index();
            $table->timestamp('completion_date')->nullable();
            $table->decimal('progress_percentage', 5, 2)->default(0.00);
            $table->timestamp('last_accessed_at')->nullable();
            $table->string('unique_enrollment_token')->unique();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        // 2. Lesson Progress
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->boolean('is_completed')->default(false)->index();
            $table->timestamp('completed_at')->nullable();
            $table->integer('last_watched_second')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
        });

        // 3. Course Reviews
        Schema::create('course_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('review')->nullable();
            $table->boolean('is_approved')->default(true)->index();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_reviews');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('enrollments');
    }
};
