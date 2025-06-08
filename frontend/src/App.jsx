import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursesList from './Components/courseList';
import CourseDetails from './Components/courseDetails';
import WeeklyQuizSection from './Components/Quiz';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
import MyTests from './Components/MyTests';
import PrivateRoute from './Components/PrivateRoute';
import Results from './Components/quizResult';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CoursesList />} />
          <Route path="/courses/:courseCode" element={<CourseDetails />} />
          <Route path="/courses/:courseCode/signup" element={<SignupForm />} />
          <Route path="/courses/:courseCode/login" element={<LoginForm />} />
          <Route
            path="/courses/:courseCode/quizzes"
            element={
              <PrivateRoute>
                <WeeklyQuizSection />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/courses/:courseCode/quizzes/results"
            element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-tests"
            element={
              <PrivateRoute>
                <MyTests />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
