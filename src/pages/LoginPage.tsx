import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Lock, ArrowRight, Calendar, TrendingUp, Users } from 'lucide-react';
import useStore from '../store';

const LoginPage = () => {
  const [email, setEmail] = useState('demo@chatapp.com'); // Default for demo
  const [password, setPassword] = useState('demo123'); // Default for demo
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useStore.auth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
      navigate('/chat');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#121A24]">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#1E2A3A] border-2 border-[#FF6B2B]">
            <MessageCircle className="text-[#FF6B2B] w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white relative">
            <span className="relative z-10">ChatAI</span>
            <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FF6B2B]/20 z-0 transform -rotate-1"></span>
          </h1>
          <p className="text-[#94A3B8]">Intelligent conversations and data management</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-[#1E2A3A] rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-white">Welcome back</h2>
            <p className="text-sm text-[#94A3B8]">Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#94A3B8] mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-[#94A3B8]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-[#121A24] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/50 focus:border-[#FF6B2B] text-[#E2E8F0] placeholder-[#94A3B8]"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-[#94A3B8]">
                    Password
                  </label>
                  <span className="text-xs text-[#FF6B2B] hover:text-[#FF6B2B]/80 cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-[#94A3B8]" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-[#121A24] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/50 focus:border-[#FF6B2B] text-[#E2E8F0] placeholder-[#94A3B8]"
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#FF6B2B] focus:ring-[#FF6B2B]/50 border-gray-600 rounded bg-[#121A24]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#94A3B8]">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1E2A3A] text-[#94A3B8]">Demo credentials available</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#121A24] rounded-lg border border-gray-700">
              <p className="text-xs text-[#94A3B8] text-center">
                <span className="font-medium text-[#FF6B2B]">Demo:</span> demo@chatapp.com / demo123
              </p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-[#94A3B8] text-sm">
            Don't have an account?{' '}
            <span className="text-[#FF6B2B] font-medium hover:text-[#FF6B2B]/80 cursor-pointer">
              Create one now
            </span>
          </p>
        </div>

        {/* App Features Preview */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FF6B2B]/20 flex items-center justify-center mb-2">
              <MessageCircle className="w-5 h-5 text-[#FF6B2B]" />
            </div>
            <p className="text-xs text-[#94A3B8]">AI Chat</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FF6B2B]/20 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#FF6B2B]" />
            </div>
            <p className="text-xs text-[#94A3B8]">Data Analytics</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FF6B2B]/20 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-[#FF6B2B]" />
            </div>
            <p className="text-xs text-[#94A3B8]">Team Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;