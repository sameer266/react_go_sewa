import React, { useState, useEffect } from 'react';
import { AdminProfileApi, AdminUpdateProfile } from '../../api/adminApi';
import { ResetPasswordApi } from '../../api/homeApi';
import Loader from '../../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, X, Save, Undo, Key
} from 'lucide-react';
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

function ProfileAdmin() {
  const [profile, setProfile] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: '',
    gender: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await AdminProfileApi();
      if (response.success) {
        setProfile(response.data);
      } else {
        toast.error('Failed to fetch profile data');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await AdminUpdateProfile(profile);
    if (response?.success) {
      setProfile(response.data);
      setIsEditing(false);
      toast.success("Profile Updated Successfully");
    } else {
      toast.error('Failed to update profile');
    }
    setLoading(false);
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

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;

  return (
    <>
      <Toaster />
      <div className="mt-20 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          menuLink={MenuLinks || []}
          className="fixed h-full transition-all duration-300"
        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          } overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100`}
        >
          <div className="p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={28} /> Admin Profile
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all w-full sm:w-auto"
                    >
                      <User size={18} /> Edit Profile
                    </button>
                  )}
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all w-full sm:w-auto"
                  >
                    <Key size={18} /> Reset Password
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="flex items-center">
                    <User className="absolute left-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-100' : ''}`}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="absolute left-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-100' : ''}`}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="absolute left-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-100' : ''}`}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? 'bg-gray-100' : ''}`}
                    disabled={!isEditing}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Role */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="flex items-center">
                    <Lock className="absolute left-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="role"
                      value={profile.role}
                      className="w-full pl-10 p-3 rounded-xl border border-gray-200 bg-gray-100"
                      disabled
                    />
                  </div>
                </div>

                {/* Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all w-full sm:w-auto"
                    >
                      <Undo size={18} /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all w-full sm:w-auto"
                    >
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all"
                    >
                      <Key size={18} /> Reset Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileAdmin;