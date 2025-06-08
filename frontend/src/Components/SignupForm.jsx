import { useState } from 'react';
import { Eye, EyeOff, Lock, UserPlus, Sparkles, CheckCircle, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const { courseCode }=useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isValidEmail(email)) {
      return setError('Please enter a valid email address.');
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return setError('Password must be at least 8 characters long and include at least one uppercase letter and one number.');
    }

    setIsLoading(true);

    try {
      // Fetch existing users
      const res = await fetch('https://prep4nptel.onrender.com/api/auth/users');
      if (!res.ok) throw new Error('Failed to fetch existing users');
      const users = await res.json();

      // Check if user exists
      const userExists = users.some(user => user.username.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('User already exists. Please login.');
        setIsLoading(false);
        return;
      }

      // Signup new user
      const signupRes = await fetch('https://prep4nptel.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (signupRes.status === 400) {
        const data = await signupRes.json();
        setError(data.error || 'User already exists.');
        setIsLoading(false);
        return;
      }

      if (!signupRes.ok) {
        setError('Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate(`/login`), 2000);
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
            <p className="text-gray-300">Create your account and start your adventure</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-200 text-sm backdrop-blur-sm flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <span>Account created! Please login.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
              </div>
              <input
                type="email"
                placeholder="Enter your username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={success}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={success}
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={success}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Strength Indicator */}
            <div className="space-y-2">
              <div className="flex space-x-1">
                <div className={`h-1 w-full rounded-full ${password.length >= 8 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                <div className={`h-1 w-full rounded-full ${password.length >= 12 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                <div className={`h-1 w-full rounded-full ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
              </div>
              <p className="text-xs text-gray-400">
                Password strength: {
                  password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'Strong' :
                  password.length >= 8 ? 'Medium' : 'Weak'
                }
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSignup}
              disabled={isLoading || success}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-purple-200" />
                    <span>Account Created!</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Create Account</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl blur-xl"></div>
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${courseCode}/login`)}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 underline decoration-purple-400/50 hover:decoration-purple-300"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">
              By creating an account, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
