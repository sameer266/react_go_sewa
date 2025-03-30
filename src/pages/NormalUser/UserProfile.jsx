import React, { useState, useEffect } from 'react';
import { UserProfileApi, UserProfileUpdateApi } from '../../api/userApi';
import { ResetPasswordApi } from '../../api/homeApi';
import toast, { Toaster } from 'react-hot-toast';
import {
  User, Mail, Phone, Calendar, VenetianMask, Hash, Edit, Save, X,
  Key, Lock, Eye, EyeOff
} from 'lucide-react';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    gender: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserProfileApi();
        if (response.success) {
          setProfile(response.data);
          setFormData({
            full_name: response.data.full_name,
            phone: response.data.phone,
            gender: response.data.gender || '',
          });
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        setError('An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await UserProfileUpdateApi(formData);
      if (response.success) {
        setProfile({ ...profile, ...formData });
        setEditMode(false);
        toast.success('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    }
  };

  const validatePassword = (password) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;
    const upperCaseRegex = /[A-Z]/;
    return password.length >= 8 && 
           specialCharRegex.test(password) && 
           numberRegex.test(password) && 
           upperCaseRegex.test(password);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (!validatePassword(passwordData.newPassword)) {
      setPasswordError('Password must be 8+ characters with uppercase, number, and special character');
      return;
    }
    try {
      const response = await ResetPasswordApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response?.success) {
        setShowResetModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Password reset successfully!');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to reset password');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto p-6 bg-red-50 rounded-2xl shadow-lg mt-10">
      <div className="text-red-600 text-center font-medium">{error}</div>
    </div>
  );

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 font-sans">
        <div className="max-w-2xl mx-auto mt-10 md:mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <User size={28} /> User Profile
              </h2>
              <p className="text-blue-100 mt-1">Manage your personal information</p>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {!editMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: Hash, label: 'User ID', value: profile.id },
                      { icon: VenetianMask, label: 'Role', value: profile.role, capitalize: true },
                      { icon: User, label: 'Full Name', value: profile.full_name || 'Not set' },
                      { icon: Mail, label: 'Email', value: profile.email, breakAll: true },
                      { icon: Phone, label: 'Phone', value: profile.phone || 'Not set' },
                      { icon: VenetianMask, label: 'Gender', value: profile.gender || 'Not specified', capitalize: true },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <item.icon className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className={`font-medium ${item.breakAll ? 'break-all' : ''} ${item.capitalize ? 'capitalize' : ''}`}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all"
                    >
                      <Edit size={18} /> Edit Profile
                    </button>
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all"
                    >
                      <Key size={18} /> Reset Password
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: User, label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Enter your full name' },
                      { icon: Phone, label: 'Phone', name: 'phone', type: 'tel', placeholder: 'Enter your phone number' },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <field.icon className="text-gray-400" size={18} />
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="pl-10 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={field.placeholder}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <VenetianMask className="text-gray-400" size={18} />
                        </div>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition-all"
                    >
                      <X size={18} /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Reset Password Modal */}
          {showResetModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Key size={24} /> Reset Password
                  </h2>
                  <button onClick={() => setShowResetModal(false)}><X size={24} /></button>
                </div>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                    <div key={field} className="relative">
                      <label className="block text-gray-700 mb-1 capitalize">{field.split(/(?=[A-Z])/).join(' ')}</label>
                      <div className="flex items-center">
                        <Lock className="absolute left-3 text-gray-400" size={20} />
                        <input
                          type={showPassword[field.split('Password')[0]] ? 'text' : 'password'}
                          value={passwordData[field]}
                          onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                          className="w-full pl-10 pr-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword({ ...showPassword, [field.split('Password')[0]]: !showPassword[field.split('Password')[0]] })}
                        >
                          {showPassword[field.split('Password')[0]] ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Key size={18} /> Reset Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;