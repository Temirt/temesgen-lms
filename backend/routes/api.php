<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\LearningController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/featured', [CourseController::class, 'featured']);
Route::get('/courses/categories', [CourseController::class, 'categories']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

Route::get('/certificates/verify', [CertificateController::class, 'verify']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/settings/public', [AdminController::class, 'getSettings']);

/*
|--------------------------------------------------------------------------
| Protected Authenticated Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Current user profile & authentication
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Course reviews
    Route::post('/courses/{id}/reviews', [CourseController::class, 'addReview']);

    // Enrollments
    Route::post('/courses/{id}/enroll', [EnrollmentController::class, 'enroll']);
    Route::get('/enrollments/my', [EnrollmentController::class, 'myEnrollments']);
    Route::get('/courses/{id}/check-enrollment', [EnrollmentController::class, 'checkEnrollment']);

    // Learning System
    Route::get('/learning/{courseId}', [LearningController::class, 'getCourseContent']);
    Route::post('/learning/lessons/{lessonId}/complete', [LearningController::class, 'completeLesson']);
    Route::post('/learning/lessons/{lessonId}/video-progress', [LearningController::class, 'updateVideoProgress']);

    // Quizzes & Examinations
    Route::get('/courses/{courseId}/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{id}', [QuizController::class, 'show']);
    Route::post('/quizzes/{id}/attempt', [QuizController::class, 'submitAttempt']);
    Route::post('/quizzes', [QuizController::class, 'store']);

    // Assignments
    Route::get('/courses/{courseId}/assignments', [AssignmentController::class, 'index']);
    Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
    Route::post('/assignments/{id}/submit', [AssignmentController::class, 'submit']);
    Route::get('/assignments/my-submissions', [AssignmentController::class, 'mySubmissions']);
    Route::get('/instructor/submissions', [AssignmentController::class, 'instructorSubmissions']);
    Route::post('/submissions/{id}/grade', [AssignmentController::class, 'gradeSubmission']);
    Route::post('/assignments', [AssignmentController::class, 'store']);

    // Payments
    Route::post('/payments/initiate', [PaymentController::class, 'initiatePayment']);
    Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
    Route::get('/payments/history', [PaymentController::class, 'history']);

    // Certificates
    Route::get('/certificates/my', [CertificateController::class, 'myCertificates']);
    Route::get('/certificates/{id}', [CertificateController::class, 'show']);

    // Announcements
    Route::post('/announcements', [AnnouncementController::class, 'store']);

    // Student Dashboard
    Route::get('/student/dashboard', [StudentController::class, 'dashboardStats']);

    // Instructor Dashboard & Management
    Route::get('/instructor/dashboard', [InstructorController::class, 'dashboardStats']);
    Route::get('/instructor/courses', [InstructorController::class, 'myCourses']);
    Route::post('/instructor/courses', [InstructorController::class, 'createCourse']);
    Route::put('/instructor/courses/{id}', [InstructorController::class, 'updateCourse']);
    Route::post('/instructor/modules', [InstructorController::class, 'storeModule']);
    Route::post('/instructor/lessons', [InstructorController::class, 'storeLesson']);
    Route::get('/instructor/students', [InstructorController::class, 'enrolledStudents']);

    // Admin Dashboard & System Management
    Route::get('/admin/dashboard', [AdminController::class, 'dashboardStats']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
    Route::put('/admin/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/admin/courses', [AdminController::class, 'courses']);
    Route::put('/admin/courses/{id}/status', [AdminController::class, 'updateCourseStatus']);
    Route::put('/admin/courses/{id}/toggle-feature', [AdminController::class, 'toggleCourseFeature']);
    Route::delete('/admin/courses/{id}', [AdminController::class, 'deleteCourse']);
    Route::get('/admin/categories', [AdminController::class, 'categories']);
    Route::post('/admin/categories', [AdminController::class, 'storeCategory']);
    Route::put('/admin/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/admin/categories/{id}', [AdminController::class, 'deleteCategory']);
    Route::get('/admin/logs', [AdminController::class, 'activityLogs']);
    Route::get('/admin/settings', [AdminController::class, 'getSettings']);
    Route::post('/admin/settings', [AdminController::class, 'updateSettings']);
});
