import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  // Query state from searchParams
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const priceFilter = searchParams.get('price') || '';
  const levelFilter = searchParams.get('level') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Local search input
  const [searchInput, setSearchInput] = useState(search);

  // Fetch categories once
  useEffect(() => {
    api.get('/courses/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch courses on filter/page change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          per_page: 9,
          search: search || undefined,
          category: selectedCategory || undefined,
          price: priceFilter || undefined,
          level: levelFilter || undefined,
          sort: sort || undefined,
        };

        const res = await api.get('/courses', { params });
        setCourses(res.data.data || []);
        setPagination({
          currentPage: res.data.current_page || 1,
          lastPage: res.data.last_page || 1,
          total: res.data.total || 0,
        });
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, selectedCategory, priceFilter, levelFilter, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] tracking-tight">
          Explore Our Courses
        </h1>
        <p className="text-sm text-slate-500">
          Discover comprehensive training from foundational programming to enterprise cloud and UI/UX design.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        {/* Search input & Sort */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by title, keywords, or topics..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Title: A to Z</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          <button
            onClick={() => updateParam('category', '')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-[#14213D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#6C63FF] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name} ({cat.courses_count || 0})
            </button>
          ))}
        </div>

        {/* Secondary Filters: Price and Level */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          {/* Price options */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Price:</span>
            {['', 'free', 'paid'].map((p) => (
              <button
                key={p}
                onClick={() => updateParam('price', p)}
                className={`capitalize px-2.5 py-1 rounded-lg transition-colors ${
                  priceFilter === p ? 'bg-[#6C63FF]/10 text-[#6C63FF] font-bold' : 'hover:text-[#14213D]'
                }`}
              >
                {p === '' ? 'All Prices' : p}
              </button>
            ))}
          </div>

          {/* Level options */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Level:</span>
            {['', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => updateParam('level', lvl)}
                className={`capitalize px-2.5 py-1 rounded-lg transition-colors ${
                  levelFilter === lvl ? 'bg-[#3B82F6]/10 text-[#3B82F6] font-bold' : 'hover:text-[#14213D]'
                }`}
              >
                {lvl === '' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          {/* Result Count */}
          <div className="text-slate-400 font-normal">
            Showing <strong className="text-slate-700">{pagination.total}</strong> courses
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <LoadingSpinner text="Loading courses..." />
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#14213D]">No courses found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, clearing filters, or browsing other categories.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="px-5 py-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-[#6C63FF] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
