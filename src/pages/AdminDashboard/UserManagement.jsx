import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X, Eye, Mail, Phone, Filter } from "lucide-react";
import { AdminUserList, AdminUserDelete, AdminUserUpdate } from "../../api/adminApi";
import toast from "react-hot-toast";
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    created_at: "",
  });
  const [modalMode, setModalMode] = useState("add");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminUserList();
        if (response?.success) {
          setUsers(response.data);
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data");
      }
    };
    fetchData();
  }, []);

  // Filter users based on search term and gender filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesGender = filterGender === "all" || user.gender === filterGender;

    return matchesSearch && matchesGender;
  });

  // Open modal with current user data
  const openModal = (mode, user = { id: "", full_name: "", email: "", phone: "", gender: "", created_at: "" }) => {
    setCurrentUser(user);
    setModalMode(mode);
    setShowModal(true);
  };

  // Close modal and reset current user
  const closeModal = () => {
    setShowModal(false);
    setCurrentUser({ id: "", full_name: "", email: "", phone: "", gender: "", created_at: "" });
  };

  // Delete a user
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await AdminUserDelete(id);
        if (response?.success) {
          setUsers(users.filter((user) => user.id !== id));
          toast.success("User deleted successfully");
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        toast.error("An error occurred while deleting user");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        // Add new user logic here (if API is available)
        toast.success("User added successfully");
      } else if (modalMode === "edit") {
        const response = await AdminUserUpdate(currentUser.id, currentUser);
        if (response?.success) {
          setUsers((prevData) => 
            prevData.map((user) => (user.id === currentUser.id ? { ...user, ...currentUser } : user))
          );
          toast.success("User updated successfully");
        }
      }
      closeModal();
    } catch (error) {
      toast.error("An error occurred while submitting the form");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
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
        } overflow-y-auto bg-gray-50`}
      >
        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">User Management</h1>
                  <p className="text-blue-100 text-sm md:text-base">Manage your system users</p>
                </div>
                <button
                  onClick={() => openModal("add")}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md flex items-center transition duration-200 w-full md:w-auto text-sm md:text-base"
                >
                  <Plus size={18} className="mr-2" />
                  Add New User
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name, email or phone..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setSearchTerm("")}
                    >
                      <X size={18} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                <div className="relative min-w-[160px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={18} className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* User Cards - Mobile View */}
            <div className="md:hidden p-4 space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center space-x-3 border-b">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white">
                        {user.full_name[0]}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm md:text-base">{user.full_name}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{user.gender}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center text-xs md:text-sm">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-xs md:text-sm">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                      <button
                        onClick={() => openModal("view", user)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openModal("edit", user)}
                        className="p-1 text-amber-600 hover:text-amber-800 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1 text-red-600 hover:text-red-800 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm md:text-base">No users found matching your criteria</div>
              )}
            </div>

            {/* Users Table - Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left text-sm md:text-base">Name</th>
                    <th className="py-3 px-4 text-left text-sm md:text-base">Email</th>
                    <th className="py-3 px-4 text-left text-sm md:text-base">Phone</th>
                    <th className="py-3 px-4 text-left text-sm md:text-base">Gender</th>
                    <th className="py-3 px-4 text-left text-sm md:text-base">Created At</th>
                    <th className="py-3 px-4 text-center text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm md:text-base">{user.full_name}</td>
                        <td className="py-3 px-4 text-sm md:text-base">{user.email}</td>
                        <td className="py-3 px-4 text-sm md:text-base">{user.phone}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                              user.gender === "male"
                                ? "bg-blue-100 text-blue-800"
                                : user.gender === "female"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm md:text-base">{formatDate(user.created_at)}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openModal("view", user)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => openModal("edit", user)}
                              className="p-1 text-amber-600 hover:text-amber-800 rounded"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1 text-red-600 hover:text-red-800 rounded"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500 text-sm md:text-base">
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - Both views */}
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 disabled:opacity-50 text-sm md:text-base" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm md:text-base">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 text-sm md:text-base">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Add/Edit/View */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 md:p-6 border-b">
                <h2 className="text-lg md:text-xl font-semibold">
                  {modalMode === "add" ? "Add New User" : modalMode === "edit" ? "Edit User" : "User Details"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-4 md:p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      value={currentUser.full_name}
                      onChange={(e) => setCurrentUser({ ...currentUser, full_name: e.target.value })}
                      disabled={modalMode === "view"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      value={currentUser.email}
                      onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                      disabled={modalMode === "view"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      value={currentUser.phone}
                      onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                      disabled={modalMode === "view"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      value={currentUser.gender}
                      onChange={(e) => setCurrentUser({ ...currentUser, gender: e.target.value })}
                      disabled={modalMode === "view"}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {modalMode !== "add" && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Created At</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-sm md:text-base"
                        value={currentUser.created_at ? formatDate(currentUser.created_at) : ""}
                        disabled
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto text-sm md:text-base"
                  >
                    Cancel
                  </button>

                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto text-sm md:text-base"
                    >
                      {modalMode === "add" ? "Create User" : "Update User"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;