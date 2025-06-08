import React, { useEffect, useState } from "react";
import {
  Brain, Clock, CheckCircle, X, ArrowLeft, ArrowRight, BookOpen, Target, Trophy, Calendar, ChevronDown, Loader2, Play, Award, TrendingUp, Users, Zap, Timer, Star, Award as AwardIcon
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const Quiz = () => {
  const navigate = useNavigate();
  const { courseCode } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseCode}`);
        const data = res.data;
        console.log(data.assignments);

        const weekMap = {};
        (data.assignments || []).forEach((assignment) => {
          const week = assignment.week_number || 0;
          if (!weekMap[week]) {
            weekMap[week] = {
              week_number: week,
              questions: [],
            };
          }
          if (assignment.questions?.length > 0) {
            weekMap[week].questions.push(...assignment.questions);
          }
        });
        console.log("WeekMap", weekMap);

        const combinedAssignments = Object.values(weekMap).sort((a, b) => a.week_number - b.week_number);
        setAssignments(combinedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [courseCode]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (quizStarted && timeLeft === 0) {
      handleSubmit();
    }
  }, [quizStarted, timeLeft]);

  const handleOptionToggle = (qNumber, option) => {
    setUserAnswers((prev) => {
      const prevOptions = prev[qNumber] || [];
      const newOptions = prevOptions.includes(option)
        ? prevOptions.filter((opt) => opt !== option)
        : [...prevOptions, option];
      return { ...prev, [qNumber]: newOptions };
    });
  };

  const handleWeekChange = (e) => {
    const week = parseInt(e.target.value);
    setSelectedWeek(week);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStarted(false);
    setQuizEnded(false);
    setShowResult(false);
    setScore(0);
  };

  const handleStartQuiz = (duration) => {
    setTimer(duration);
    setTimeLeft(duration * 60);
    setQuizStarted(true);
  };

  const handleSubmit = () => {
    setQuizEnded(true);
    setQuizStarted(false);
    calculateScore();
  };

  const calculateScore = async () => {
  const currentWeek = assignments.find((a) => a.week_number === selectedWeek);
  const questions = currentWeek?.questions || [];
  let score = 0;

  questions.forEach((q) => {
    const selectedOptions = (userAnswers[q.question_number] || []).map(String).sort();

    if (q.correct_option === "") {
      // "Select all" case: Get all non-empty options
      const nonEmptyOptionNumbers = q.options
        .filter(opt => opt.option_text?.trim() !== "")
        .map(opt => String(opt.option_number))
        .sort();

      if (
        selectedOptions.length === nonEmptyOptionNumbers.length &&
        JSON.stringify(selectedOptions) === JSON.stringify(nonEmptyOptionNumbers)
      ) {
        score++;
      }
    } else {
      // Normal correct option(s)
      const correctOptions = typeof q.correct_option === 'string'
        ? q.correct_option.split(',').map(opt => opt.trim()).sort()
        : Array.isArray(q.correct_option)
          ? q.correct_option.map(String).sort()
          : [String(q.correct_option)];

      if (JSON.stringify(correctOptions) === JSON.stringify(selectedOptions)) {
        score++;
      }
    }
  });

  setScore(score);
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);

  try {
    await axios.post(
      "http://localhost:5000/api/tests/save",
      {
        courseCode,
        weekNumber: selectedWeek,
        score,
        total: questions.length,
        userAnswers,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Error saving test result", err);
  }
  navigate(`/courses/${courseCode}/quizzes/results`, {
  state: {
    score,
    total: questions.length,
    questions,
    userAnswers,
  },
});

};


  const currentWeek = assignments.find((a) => a.week_number === selectedWeek);
  const currentQuestions = currentWeek?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = currentQuestions.length > 0 ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 : 0;
  const answeredQuestions = Object.keys(userAnswers).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-400/30 rounded-full animate-spin">
              <div className="absolute top-1 left-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading Your Quiz...</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-multiply animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full mix-blend-multiply animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Smart Quiz Hub
            </h1>
            <p className="text-xl text-slate-300 font-medium">
              Interactive Learning Experience • {courseCode}
            </p>
            
            {/* My Tests Button - Eye-catching */}
            <div className="mt-8">
              <Link to={`/my-tests`}>
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm animate-pulse hover:animate-none"
                  onClick={(e) => e.stopPropagation()} // prevent parent click
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    <Trophy className="w-6 h-6 animate-bounce" />
                    <span className="font-extrabold tracking-wide">🎯 MY TESTS 📊</span>
                    <Star className="w-6 h-6 animate-spin" />
                  </div>
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            </div>
          </div>

          {/* Week Selection Dropdown */}
          
          {!quizStarted && !quizEnded && (
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                
                <div className="flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-purple-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Select Your Week</h2>
                </div>
                
                <div className="max-w-md mx-auto relative">
                  <select 
                    onChange={handleWeekChange} 
                    value={selectedWeek || ''} 
                    className="w-full appearance-none bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-800 text-white">Choose Your Week</option>
                    {assignments.map((a) => (
                      <option 
                        key={a.week_number} 
                        value={a.week_number}
                        className="bg-slate-800 text-white py-2"
                      >
                        Week {a.week_number} • {a.questions.length} Questions
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400 pointer-events-none" />
                </div>

                {selectedWeek !== null && selectedWeek !== undefined && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-400 font-medium">Week {selectedWeek} Selected</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timer Selection */}
          {selectedWeek !== null && selectedWeek !== undefined && !quizStarted && !quizEnded && (
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                    <Timer className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Your Challenge</h2>
                  <p className="text-slate-300">Select the time limit that suits your pace</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { duration: 15, label: "Quick Sprint", icon: Zap, gradient: "from-yellow-500 to-orange-600", description: "Fast & Focused" },
                    { duration: 30, label: "Balanced", icon: Target, gradient: "from-blue-500 to-purple-600", description: "Perfect Balance" },
                    { duration: 60, label: "Extended", icon: Clock, gradient: "from-green-500 to-teal-600", description: "Think & Analyze" },
                    { duration: 90, label: "Marathon", icon: Trophy, gradient: "from-purple-500 to-pink-600", description: "Deep Dive" }
                  ].map(({ duration, label, icon: Icon, gradient, description }) => (
                    <button
                      key={duration}
                      onClick={() => handleStartQuiz(duration)}
                      className={`group relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20`}
                    >
                      <div className="relative z-10 text-center">
                        <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">{duration}m</div>
                        <div className="text-sm font-semibold text-white/90 mb-1">{label}</div>
                        <div className="text-xs text-white/70">{description}</div>
                      </div>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl"></div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center text-slate-300">
                    <Play className="w-5 h-5 mr-2" />
                    <span>Ready to test your knowledge?</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Interface */}
          {quizStarted && (
            <div className="space-y-8">
              {/* Progress & Timer Bar */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Timer */}
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-medium">Time Remaining</p>
                      <p className="text-3xl font-bold text-white tabular-nums">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-400 font-medium">Question Progress</span>
                      <span className="text-sm text-white font-bold">
                        {currentQuestionIndex + 1} of {currentQuestions.length}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="absolute -top-1 bg-white w-5 h-5 rounded-full shadow-lg transition-all duration-500 ease-out border-2 border-purple-500" 
                           style={{ left: `calc(${progress}% - 10px)` }}></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{answeredQuestions}</div>
                      <div className="text-xs text-slate-400">Answered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-300">{currentQuestions.length - answeredQuestions}</div>
                      <div className="text-xs text-slate-400">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2">
                      <span className="text-purple-300 font-bold text-sm">
                        QUESTION {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Multiple Choice</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed mb-4">
                    {currentQuestion?.question_text}
                  </h3>
                  
                  <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {currentQuestion?.options
                  .filter(opt => opt.option_text.trim() !== "") // filter out empty option_text
                  .map((opt, index) => {
                    const isSelected = (userAnswers[currentQuestion.question_number] || []).includes(opt.option_number);
                    const letter = String.fromCharCode(65 + index);
                    
                    return (
                      <div
                        key={opt.option_number}
                        onClick={() => handleOptionToggle(currentQuestion.question_number, opt.option_number)}
                        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-400 shadow-lg shadow-purple-500/25'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center p-6">
                          {/* Option Letter */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-6 transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                              : 'bg-white/10 text-slate-300 group-hover:bg-white/20'
                          }`}>
                            {isSelected ? <CheckCircle className="w-6 h-6" /> : letter}
                          </div>
                          
                          {/* Option Text */}
                          <div className="flex-1">
                            <span className="text-lg md:text-xl font-medium text-white leading-relaxed">
                              {opt.option_text}
                            </span>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ml-4">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Hover Effect */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          isSelected ? 'bg-white/5' : 'bg-gradient-to-r from-purple-600/10 to-blue-600/10'
                        } rounded-2xl`}></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={() => setCurrentQuestionIndex((i) => i - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="group flex items-center px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/5 shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="font-semibold">Previous</span>
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-green-400 hover:to-emerald-500 border border-green-400/20"
                >
                  Submit Quiz
                </button>

                <button
                  onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                  disabled={currentQuestionIndex === currentQuestions.length - 1}
                  className="group flex items-center px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/5 shadow-lg"
                >
                  <span className="font-semibold">Next</span>
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;