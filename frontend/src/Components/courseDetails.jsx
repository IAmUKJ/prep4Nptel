import React, { useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  Play,
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Clock,
  Video,
  Star,
  Users,
  Target,
  Award,
  Bookmark,
  Download,
  Share2,
  TrendingUp,
  Globe,
  Zap,
  CheckCircle2,
  FileText,
  PlayCircle,
  Headphones
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { courseCode } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchMaterials = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/courses/${courseCode}`);
        if (!isMounted) return;

        const processedMaterials = (data.materials || []).map(({ id, title, description, weekNumber, url, type, languages }) => ({
          id,
          title,
          description,
          weekNumber: weekNumber === null ? 'General' : String(weekNumber),
          url,
          type: type || 'material',
          languages: languages || []
        }));

        const sortedMaterials = processedMaterials.sort((a, b) => {
          if (a.weekNumber === 'General') return -1;
          if (b.weekNumber === 'General') return 1;
          return parseInt(a.weekNumber) - parseInt(b.weekNumber);
        });

        setMaterials(sortedMaterials);
      } catch (err) {
        if (isMounted) setError('Failed to fetch course materials');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMaterials();

    return () => {
      isMounted = false;
    };
  }, [courseCode]);

  const groupedMaterials = materials.reduce((acc, material) => {
    const week = material.weekNumber;
    if (!acc[week]) acc[week] = [];
    acc[week].push(material);
    return acc;
  }, {});

  const weekNumbers = Object.keys(groupedMaterials).sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return parseInt(a) - parseInt(b);
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'interactive': return <Zap className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      case 'transcript': return <FileText className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Loading Course Materials</h3>
          <p className="text-purple-200">Please wait while we gather your content...</p>
          <div className="mt-6 w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
        <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md w-full border border-white/20">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h3>
          <p className="text-red-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/80 hover:text-white group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                      {courseCode}
                    </h1>
                    <p className="text-purple-200 text-base sm:text-lg">Course Materials & Resources</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{weekNumbers.length}</div>
                <div className="text-sm text-purple-200">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{materials.length}</div>
                <div className="text-sm text-purple-200">Materials</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {materials.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <BookOpen className="w-16 h-16 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Materials Available</h3>
            <p className="text-purple-200 max-w-md mx-auto text-lg">
              Course materials for <span className="font-semibold text-white">{courseCode}</span> are not yet available.
              Please check back later or contact your instructor.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm mb-2 font-medium">Total Weeks</p>
                    <p className="text-3xl font-bold text-white">{weekNumbers.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm mb-2 font-medium">Materials</p>
                    <p className="text-3xl font-bold text-white">{materials.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm mb-2 font-medium">Progress</p>
                    <p className="text-3xl font-bold text-white">0%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm mb-2 font-medium">Status</p>
                    <p className="text-xl font-bold text-emerald-400">Active</p>
                  </div>
                  <div className="relative">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Week Sections */}
            <div className="space-y-8">
              {weekNumbers.map((weekNumber, index) => (
                <div key={weekNumber} className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden hover:bg-white/10 transition-all duration-500 group">
                  <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold text-lg">{weekNumber === 'General' ? 'G' : weekNumber}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {weekNumber === 'General' ? 'General Resources' : `Week ${weekNumber}`}
                          </h2>
                          <p className="text-purple-100 text-sm">
                            {groupedMaterials[weekNumber].length} material
                            {groupedMaterials[weekNumber].length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-white/80">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedMaterials[weekNumber].map((material, materialIndex) => (
                        <div
                          key={material.id}
                          className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-2xl hover:scale-105"
                          style={{ animationDelay: `${materialIndex * 100}ms` }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              {getTypeIcon(material.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">
                                {material.title}
                              </h3>
                              <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                                {material.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-xs text-purple-300">
                                  <Calendar className="w-4 h-4" />
                                  <span>{weekNumber === 'General' ? 'General' : `Week ${material.weekNumber}`}</span>
                                </div>

                                {material.url ? (
                                  <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                                  >
                                    <span>View Material</span>
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                ) : material.type === 'transcript' && material.languages.length > 0 ? (
                                  <div className="mt-4">
                                    <p className="text-sm font-semibold mb-2 text-white">Available Transcripts:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                      {material.languages.map(({ language, url }) => (
                                        <li key={language}>
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-300 hover:text-white hover:underline"
                                          >
                                            {language.charAt(0).toUpperCase() + language.slice(1)}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  <span className="text-xs text-purple-400 italic">No link available</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CourseDetails;