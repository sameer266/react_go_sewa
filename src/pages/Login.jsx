import React, { useEffect, useState } from 'react';
import { Phone, Lock, ArrowRight, Bus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { LoginAPi } from '../api/homeApi';
import { login } from '../auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user_type = useSelector((state) => state.auth.user_type);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      let routeTo = "";
      if (user_type === "admin") {
        routeTo = "/admin-dashboard";
      } else if (user_type === "customer") {
        routeTo = "/user-dashboard";
      }
      
      if (routeTo) {
        navigate(routeTo);
      }
    }
  }, [isAuthenticated, user_type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await LoginAPi(phoneNumber, password);

      if (!response?.success) {
      throw new Error(response?.message || 'Login failed');
      }

      const { access, refresh, user } = response;
      const { full_name, role } = user;

      // Store in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', full_name);
      localStorage.setItem('role', role);

      // Dispatch login action
      dispatch(login({ user: full_name, role, access, refresh }));

      // Show success toast and handle redirect after toast
      toast.success('Login successful', {
      position: 'top-center',
      duration: 2000,
      });

      // Handle redirect after a delay to allow toast to be seen
      setTimeout(() => {
        let destination = "";
        if (role === "admin") {
          destination = "/admin-dashboard";
        } else if (role === "customer") {
          destination = "/user-dashboard";
        }
        else if(role==="sub_admin"){
          destination="/counter-dashboard"
        }
        
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        if (redirectAfterLogin) {
          destination = redirectAfterLogin;
          localStorage.removeItem('redirectAfterLogin');
        }

        if (destination) {
          navigate(destination);
        }
      }, 1000);
      
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 p-4">
          <div className="w-full max-w-md transform transition-all hover:scale-[1.01] duration-300">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-800 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bus className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Go Sewa Booking</h1>
                  <p className="text-green-100 text-sm">Your journey begins here</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5 transition-colors group-hover:text-green-700" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5 transition-colors group-hover:text-green-700" />
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transform transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : (
                    <>
                      Sign In <ArrowRight className="h-5 w-5 animate-pulse" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;