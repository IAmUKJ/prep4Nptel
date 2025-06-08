import React from "react";
import { Award, TrendingUp, CheckCircle, X, Star, RefreshCw, Trophy, Target, Clock } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const Results = () => {

  const navigate = useNavigate();
  const { courseCode } = useParams();
  const location = useLocation();
  const { score, total, userAnswers, questions } = location.state || {};
  console.log("Location state:", location.state);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
          <p className="text-gray-300">No result data found for this quiz.</p>
        </div>
      </div>
    );
  }

  const percentage = ((score / total) * 100).toFixed(1);
  const isExcellent = score / total >= 0.8;
  const isGood = score / total >= 0.6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto py-8 px-4 space-y-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl mb-6 shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Results</h1>
          <p className="text-gray-300 text-lg">Your performance summary</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-4 mx-auto">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{score}/{total}</div>
              <div className="text-gray-300 font-medium">Correct Answers</div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 mx-auto">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{percentage}%</div>
              <div className="text-gray-300 font-medium">Accuracy</div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 mx-auto">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{total}</div>
              <div className="text-gray-300 font-medium">Total Questions</div>
            </div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:scale-105 ${
            isExcellent
              ? "bg-green-500/20 text-green-300 border-2 border-green-400/50"
              : isGood
              ? "bg-yellow-500/20 text-yellow-300 border-2 border-yellow-400/50"
              : "bg-red-500/20 text-red-300 border-2 border-red-400/50"
          }`}>
            <Star className="w-6 h-6 mr-3" />
            {isExcellent
              ? "🎉 Excellent Performance!"
              : isGood
              ? "👍 Good Job!"
              : "💪 Keep Practicing!"}
          </div>
        </div>

        {/* Questions Review */}
        <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <CheckCircle className="w-8 h-8 mr-3 text-purple-400" />
            Detailed Review
          </h2>
          
          <div className="space-y-8">
            {questions.map((q, qIdx) => {
              const userSelected = (userAnswers[q.question_number] || []).map(String);
              const filteredOptions = q.options.filter(opt => opt.option_text.trim() !== "");
              const allOptionNumbers = filteredOptions.map(opt => String(opt.option_number));

              let correctOptions = [];
              const correctArray = Array.isArray(q.correct_option)
                ? q.correct_option.map(String)
                : [String(q.correct_option)];

              const isCorrectEmpty = !q.correct_option || q.correct_option === "";
              const isInvalidCorrectOption = correctArray.some(c => !allOptionNumbers.includes(c));

              if (isCorrectEmpty || isInvalidCorrectOption) {
                correctOptions = allOptionNumbers;
              } else {
                correctOptions = correctArray;
              }

              const allCorrectSelected = correctOptions.every(optNum => userSelected.includes(optNum));
              const noExtraSelected = userSelected.every(optNum => correctOptions.includes(optNum));
              const isAnswerCorrect = allCorrectSelected && noExtraSelected;

              const missedCorrectOptions = correctOptions.filter(opt => !userSelected.includes(opt));
              const missedLabels = missedCorrectOptions.map(optNum => {
                const index = filteredOptions.findIndex(opt => String(opt.option_number) === optNum);
                return index >= 0 ? String.fromCharCode(65 + index) : null;
              }).filter(Boolean);

              return (
                <div key={q.question_number} className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white flex-1 pr-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg text-purple-300 font-bold mr-3 text-sm">
                        {qIdx + 1}
                      </span>
                      {q.question_text}
                    </h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isAnswerCorrect ? 'bg-green-500/20' : userSelected.length === 0 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                    }`}>
                      {isAnswerCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : userSelected.length === 0 ? (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-4">
                    {filteredOptions.map((opt, i) => {
                      const optionNum = String(opt.option_number);
                      const isUserSelected = userSelected.includes(optionNum);
                      const isCorrectOption = correctOptions.includes(optionNum);

                      let bgColor = "bg-white/5 border-white/10";
                      let textColor = "text-white";
                      let icon = null;

                      if (isAnswerCorrect) {
                        if (isUserSelected) {
                          bgColor = "bg-green-500/20 border-green-400/50";
                          textColor = "text-green-100";
                          icon = <CheckCircle className="w-5 h-5 text-green-400" />;
                        }
                      } else {
                        if (isUserSelected && isCorrectOption) {
                          bgColor = "bg-green-500/20 border-green-400/50";
                          textColor = "text-green-100";
                          icon = <CheckCircle className="w-5 h-5 text-green-400" />;
                        } else if (isUserSelected && !isCorrectOption) {
                          bgColor = "bg-red-500/20 border-red-400/50";
                          textColor = "text-red-100";
                          icon = <X className="w-5 h-5 text-red-400" />;
                        } else if (!isUserSelected && isCorrectOption) {
                          bgColor = "bg-green-500/10 border-green-400/30";
                          textColor = "text-green-200";
                          icon = <CheckCircle className="w-5 h-5 text-green-400" />;
                        }
                      }

                      return (
                        <div
                          key={optionNum}
                          className={`flex items-center p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-200 ${bgColor} ${textColor}`}
                        >
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/10 rounded-lg font-bold mr-4 text-sm">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div className="flex-1 font-medium">{opt.option_text}</div>
                          {icon && <div className="ml-4 flex-shrink-0">{icon}</div>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Tags */}
                  <div className="flex flex-wrap gap-2">
                    {userSelected.length === 0 && (
                      <div className="inline-flex items-center px-3 py-1 bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 rounded-full text-sm font-medium backdrop-blur-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        Unattempted
                      </div>
                    )}
                    {!isAnswerCorrect && missedLabels.length > 0 && userSelected.length > 0 && (
                      <div className="inline-flex items-center px-3 py-1 bg-red-500/20 border border-red-400/50 text-red-300 rounded-full text-sm font-medium backdrop-blur-sm">
                        <X className="w-4 h-4 mr-1" />
                        Missed: {missedLabels.join(", ")}
                      </div>
                    )}
                    {isAnswerCorrect && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-400/50 text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Correct
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigate(`/courses/${courseCode}/quizzes`)}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <div className="flex items-center justify-center space-x-3">
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              <span>Retake Quiz</span>
            </div>
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"></div>
          </button>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-blue-400/40 rounded-full blur-sm animate-bounce animation-delay-1000"></div>
        <div className="absolute top-1/3 left-8 w-2 h-2 bg-indigo-400/50 rounded-full animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Results;