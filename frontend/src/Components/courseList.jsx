import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, BookOpen, Users, Clock, AlertCircle, Loader2, Star, Award, ArrowRight, ChevronLeft, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://prep4nptel.onrender.com/api/courses')
      .then(response => {
        const coursesData = response.data.courses || [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load courses');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    axios.get('https://prep4nptel.onrender.com/api/courses')
      .then(response => {
        const coursesData = response.data.courses || [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load courses');
        setLoading(false);
      });
  };

  const handleCourseClick = (course) => {
    console.log("Course clicked:", course);
    // You can navigate or open modal here if needed
    // navigate(`/courses/${course.course_code}`);
    navigate(`/courses/${course.course_code}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-purple-500/30 rounded-2xl animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin absolute top-4 left-4" />
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-700/50 rounded-xl w-48 mx-auto animate-pulse"></div>
                <div className="h-4 bg-slate-800/50 rounded-xl w-64 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md border border-slate-700/50">
              <div className="bg-red-500/20 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Something went wrong</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={handleRetry}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">NPTEL Courses</h1>
                  <p className="text-gray-400 text-sm">Course Materials & Resources</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 min-h-[180px] border border-slate-700/50 lg:col-span-2 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="text-white text-xl font-semibold">Total Courses</div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-1">{courses.length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by course name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Courses */}
        {filteredCourses.length === 0 ? (
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-16 text-center border border-slate-700/50">
            <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No courses found</h3>
            <p className="text-gray-400 text-lg">Try adjusting your search terms or browse all available courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => (
                <div 
                  key={course.course_code}
                  onClick={() => handleCourseClick(course)}
                  className="group cursor-pointer bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                          {course.course_name}
                        </h3>
                        <p className="text-gray-400 text-sm">{course.course_code}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  <div className="flex items-end justify-between mt-6">
                    {/* Go to Quiz Button (bottom left) */}
                    <Link to={`/courses/${course.course_code}/signup`}>
                      <button
                        className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-xl transition-all duration-300"
                        onClick={(e) => e.stopPropagation()} // prevent parent click
                      >
                        Go to Quiz
                      </button>
                    </Link>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default CoursesList;