<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('ETB');
            $table->enum('provider', ['chapa', 'telebirr', 'manual'])->default('chapa');
            $table->string('transaction_id')->unique();
            $table->string('provider_reference')->nullable()->index();
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending')->index();
            $table->string('payment_method')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('payload_data')->nullable();
            $table->timestamps();
        });

        // 2. Payment Transactions
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->onDelete('cascade');
            $table->string('transaction_reference')->index();
            $table->string('event_type');
            $table->string('status');
            $table->json('response_data')->nullable();
            $table->timestamps();
        });

        // 3. Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('enrollment_id')->constrained('enrollments')->onDelete('cascade');
            $table->date('issue_date');
            $table->string('instructor_name');
            $table->string('course_title');
            $table->string('student_name');
            $table->string('qr_code_path')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('verification_url');
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        // 4. Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->string('link')->nullable();
            $table->boolean('is_read')->default(false)->index();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        // 5. Announcements
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->longText('content');
            $table->boolean('is_pinned')->default(false)->index();
            $table->timestamps();
        });

        // 6. Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');
            $table->string('entity_type')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });

        // 7. Settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('group')->default('general');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('payment_transactions');
        Schema::dropIfExists('payments');
    }
};
