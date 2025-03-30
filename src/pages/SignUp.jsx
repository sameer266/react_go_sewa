import React, { useState } from 'react';
import { User, Phone, Lock, ArrowRight, Bus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';
import { ResgisterApi } from '../api/homeApi'; // Assuming you have a SignUp API

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!fullName || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate phone number (10 digits and starts with 98 or 97)
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit Nepalese phone number starting with 98 or 97');
      return;
    }

    setIsLoading(true);

    try {
      
      
      
      const response = await ResgisterApi(fullName, phoneNumber);
      if (response?.success) {
        navigate('/otp-verification');
      }
      else{
        toast.error(response?.error)
      }
    
    } catch (error) {
      toast.error(error || 'Sign up failed. Please try again.');
      console.error('Sign up error:', error.response);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 mb-19">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-800 p-6 text-white text-center">
              <Bus className="h-8 w-8 mx-auto" />
              <h1 className="text-2xl font-bold">Go Sewa Booking</h1>
              <p className="text-green-100">Create a new account</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-5 w-5" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 h-5 w-5" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-green-700 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : (
                  <>
                    Sign Up <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            <div className="text-center p-4 border-t">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-green-700 hover:text-green-800 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;