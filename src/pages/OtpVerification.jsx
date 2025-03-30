import React, { useState } from 'react';
import { Lock, ArrowRight, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from '../auth/authSlice';
import Loader from '../components/Loader';
import { VerifyOtpApi, UserConfirmPassword } from '../api/homeApi'; // Assuming you have APIs for OTP verification and setting a new password

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track if OTP is verified

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      // Validate OTP
      if (!otp || otp.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }

      setIsLoading(true);

      try {
        console.log(otp);
        const response = await VerifyOtpApi(otp);

        if (response?.success) {

          const { access, refresh, full_name ,role } = response;

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('access', access);
          localStorage.setItem('refresh', refresh);
          localStorage.setItem('user', full_name);
          localStorage.setItem('role', role);


          dispatch(login({ user: full_name, access,role, refresh }));
          
          setIsOtpVerified(true); // OTP is verified, show password fields
          toast.success('OTP verified successfully! Please set a new password.', {
            position: 'top-center',
            duration: 3000,
          });
        } else {
          toast.error('OTP verification failed. Please try again.');
        }
      } catch (error) {
        toast.error(error.message || 'OTP verification failed. Please try again.');
        console.error('OTP verification error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Validate password and confirm password
      if (!password || !confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      setIsLoading(true);

      try {
        const response = await UserConfirmPassword(password);

        if (response?.success) {
         
          toast.success('Password set successfully!', {
            position: 'top-center',
            duration: 3000,
          });

          // Redirect to dashboard or next page
          setTimeout(() => {
            navigate('/user-dashboard'); // Replace with your desired route
          }, 1000);
        } else {
          toast.error('Failed to set password. Please try again.');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to set password. Please try again.');
        console.error('Set password error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-800 p-6 text-white text-center">
              <Lock className="h-8 w-8 mx-auto" />
              <h1 className="text-2xl font-bold">
                {isOtpVerified ? 'Set New Password' : 'OTP Verification'}
              </h1>
              <p className="text-green-100">
                {isOtpVerified
                  ? 'Enter a new password for your account'
                  : 'Enter the OTP sent to your phone'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {!isOtpVerified ? (
                // OTP Field
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    OTP (6 digits)
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-5 w-5" />
                    <input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                // Password Fields
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative mt-1">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-5 w-5" />
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700 focus:border-transparent"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  {isOtpVerified && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative mt-1">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-5 w-5" />
                        <input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700 focus:border-transparent"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  isOtpVerified ? 'Setting Password...' : 'Verifying...'
                ) : (
                  <>
                    {isOtpVerified ? 'Set Password' : 'Verify OTP'} <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            {!isOtpVerified && (
              <div className="text-center p-4 border-t">
                <p className="text-sm text-gray-600">
                  Didn't receive the OTP?{' '}
                  <button
                    onClick={() => toast('Resending OTP...')}
                    className="text-green-700 hover:text-green-800 font-medium"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OTPVerification;