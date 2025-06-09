import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Target, 
  AlertCircle,
  Loader2,
  Sparkles,
  BarChart3,
  GraduationCap,
  Star,
  CheckCircle2
} from 'lucide-react';
import { AuthContext } from '../Context/AuthContext';

const MyTests = () => {
  const { token, username } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchUserIdAndResults = async () => {
      setLoading(true);
      setError('');

      try {
        // First, fetch the logged-in user to get their _id
        const userRes = await axios.get('https://prep4nptel.onrender.com/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = userRes.data.find(user => user.username === username);

        if (!currentUser) {
          setError('User data not found');
          setLoading(false);
          return;
        }

        setUserId(currentUser._id);
        console.log(currentUser._id);
        // Then fetch test results for this user
        const resultsRes = await axios.get(`https://prep4nptel.onrender.com/api/tests/user/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTestResults(resultsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch test results');
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndResults();
  }, [token, username]);

  const getPerformanceColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30';
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
    return 'text-red-400 bg-red-500/20 border-red-400/30';
  };

  const getPerformanceIcon = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return <Trophy className="w-5 h-5" />;
    if (percentage >= 60) return <Target className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const calculateStats = () => {
    if (testResults.length === 0) return { totalTests: 0, averageScore: 0, bestScore: 0 };
    
    const totalTests = testResults.length;
    const totalScore = testResults.reduce((sum, test) => sum + test.score, 0);
    const totalPossible = testResults.reduce((sum, test) => sum + test.total, 0);
    const averageScore = Math.round((totalScore / totalPossible) * 100);
    const bestScore = Math.max(...testResults.map(test => Math.round((test.score / test.total) * 100)));
    
    return { totalTests, averageScore, bestScore };
  };

  const stats = calculateStats();

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-400/30">
            <User className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300">Please log in to see your tests.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-400/30">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading Your Tests</h2>
          <p className="text-gray-300">Fetching your test history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-400/30">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6 shadow-2xl">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hello, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{username}</span>
          </h1>
          <p className="text-gray-300 text-lg">Track your academic progress and achievements</p>
        </div>

        {testResults.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 mx-auto">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stats.totalTests}</div>
                  <div className="text-gray-300 font-medium">Total Tests</div>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 mx-auto">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stats.averageScore}%</div>
                  <div className="text-gray-300 font-medium">Average Score</div>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-4 mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stats.bestScore}%</div>
                  <div className="text-gray-300 font-medium">Best Score</div>
                </div>
              </div>
            </div>

            {/* Test Attempts Section */}
            <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center mb-8">
                <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Your Test Attempts</h2>
              </div>

              <div className="space-y-6">
                {testResults.map((attempt, idx) => {
                  const percentage = Math.round((attempt.score / attempt.total) * 100);
                  
                  return (
                    <div 
                      key={idx} 
                      className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left Section - Course Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{attempt.courseCode}</h3>
                              <p className="text-gray-400">Week {attempt.weekNumber}</p>
                            </div>
                          </div>
                        </div>

                        {/* Center Section - Score */}
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getPerformanceColor(attempt.score, attempt.total)}`}>
                            {getPerformanceIcon(attempt.score, attempt.total)}
                            <span className="font-bold text-lg">{attempt.score}/{attempt.total}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{percentage}%</div>
                            <div className="text-gray-400 text-sm">Score</div>
                          </div>
                        </div>

                        {/* Right Section - Date */}
                        <div className="flex justify-end">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">
                              {new Date(attempt.createdAt || attempt.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-gray-300 text-lg">You have not attempted any tests yet.</p>
          </div>
        )}
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-blue-400/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 left-8 w-2 h-2 bg-indigo-400/50 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/4 right-12 w-3 h-3 bg-pink-400/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
    </div>
  );
};

export default MyTests;