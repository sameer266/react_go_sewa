import React, { useEffect, useState } from 'react';
import { Phone, Lock, ArrowRight, Bus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { LoginAPi } from '../api/homeApi';
import { login } from '../auth/authSlice';
import { useNavigate } from 'react-router';
import toast ,{ Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); // Changed from null to empty string
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin-dashboard'); // Prefer navigate over window.location.href
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader when submitting

    try {
      const response = await LoginAPi(phoneNumber, password);

      if (response?.success) {
        const access = response.access;
        const refresh = response.refresh;
        const user = response.user.full_name;
        const role = response.user.role;

        // Save tokens and user info in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('user', user);
        localStorage.setItem('user_type', role);

        // Dispatch login action
        dispatch(login({ user, role, access, refresh }));

        // Show success toast
        toast.success('Login successful ', {
          position: 'top-center',
          autoClose: 3000,
          onClose: () => navigate('/admin-dashboard'),
        });
      }
      
    } catch (error) {
      toast.error('Login Failed Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false); 
    }
  };

// =======  rediect to booking page when user login and come from booking page =====
  const handleSuccessfulLogin = () => {
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
    localStorage.removeItem('redirectAfterLogin');
    navigate(redirectPath);
  };

  return (
    <>
      <Toaster autoClose={3000} />

      {isLoading ? (
        <Loader /> 
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-800 p-6 text-white text-center">
              <Bus className="h-8 w-8 mx-auto" />
              <h1 className="text-2xl font-bold">Go Sewa Booking</h1>
              <p className="text-green-100">Sign in to access your account</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700" />
                  <input
                    type="number"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-700 text-white rounded-md hover:bg-green-800"
                disabled={isLoading} // Disable button while loading
              >
                Sign In <ArrowRight className="h-5 w-5" />
              </button>
            </form>
            <div className="text-center p-4">
              <p className="text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-green-700 hover:text-green-800">
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;