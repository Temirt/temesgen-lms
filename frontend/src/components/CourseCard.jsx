import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Users, Award } from 'lucide-react';
import Badge from './Badge';

export default function CourseCard({ course }) {
  if (!course) return null;

  const levelColorMap = {
    beginner: 'emerald',
    intermediate: 'blue',
    advanced: 'purple',
    all_levels: 'default',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.is_featured && (
            <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5" /> Featured
            </span>
          )}
          {course.category && (
            <span className="bg-[#14213D]/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {course.category.name}
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          {course.is_free || Number(course.price) === 0 ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
              FREE
            </span>
          ) : (
            <span className="bg-[#14213D] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700">
              {Number(course.price).toLocaleString()} ETB
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Level and rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <Badge variant={levelColorMap[course.level] || 'default'} size="sm">
              {course.level?.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.average_rating || 5.0}</span>
              <span className="text-slate-400 font-normal">({course.reviews_count || 0})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/courses/${course.slug || course.id}`}>
            <h3 className="text-base font-bold text-[#14213D] line-clamp-2 hover:text-[#6C63FF] transition-colors leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Subtitle / Description excerpt */}
          {course.subtitle && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {course.subtitle}
            </p>
          )}

          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <img
                src={course.instructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-medium text-slate-700 truncate">{course.instructor.name}</span>
            </div>
          )}
        </div>

        {/* Footer stats & Enroll button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration_hours || 10}h
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {course.total_lessons_count || 12} lessons
            </span>
          </div>

          <Link
            to={`/courses/${course.slug || course.id}`}
            className="text-xs font-bold text-[#6C63FF] hover:text-[#3B82F6] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
