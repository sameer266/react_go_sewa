import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X, Eye } from "lucide-react";
import { AdminTicketCounterApi, AdminTicketCounterAdd, AdminTicketCounterDelete, AdminTicketCounterUpdate } from "../../api/adminApi";
import toast from "react-hot-toast";
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const ITEMS_PER_PAGE = 10;

const TicketCounterManagement = () => {
  const [counters, setCounters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCounter, setCurrentCounter] = useState({
    counter_name: "",
    location: "",
    bank_account: "",
    bank_name: "",
    user: {
      full_name: "",
      phone: "",
      email: "",
      gender: "",
    },
  });
  const [modalMode, setModalMode] = useState("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await AdminTicketCounterApi();
      if (response?.success) {
        setCounters(response.data);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    }
  };

  const filteredCounters = counters.filter(
    (counter) =>
      counter.counter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counter.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counter.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counter.bank_account?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCounters.length / ITEMS_PER_PAGE);
  const paginatedCounters = filteredCounters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openModal = (mode, counter = { 
    counter_name: "", 
    location: "", 
    bank_account: "",
    bank_name: "",
    user: { full_name: "", phone: "", email: "", gender: "" } 
  }) => {
    setCurrentCounter(counter);
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCounter({ 
      counter_name: "", 
      location: "", 
      bank_account: "",
      bank_name: "",
      user: { full_name: "", phone: "", email: "", gender: "" } 
    });
  };

  const deleteCounter = async (id) => {
    if (window.confirm("Are you sure you want to delete this counter?")) {
      try {
        const response = await AdminTicketCounterDelete(id);
        if (response?.success) {
          setCounters(counters.filter((counter) => counter.id !== id));
          if (paginatedCounters.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          toast.success("Counter deleted successfully");
        } else {
          toast.error("Failed to delete counter");
        }
      } catch (error) {
        toast.error("An error occurred while deleting counter");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        counter_name: currentCounter.counter_name,
        location: currentCounter.location,
        bank_account: currentCounter.bank_account,
        bank_name: currentCounter.bank_name,
        user: currentCounter.user
      };

      if (modalMode === "add") {
        const response = await AdminTicketCounterAdd(submitData);
        if (response?.success) {
          setCounters([...counters, response.data]);
          toast.success("Counter added successfully");
        } else {
          toast.error("Failed to add counter");
        }
      } else if (modalMode === "edit") {
        const response = await AdminTicketCounterUpdate(currentCounter.id, submitData);
        if (response?.success) {
          setCounters(counters.map((c) => (c.id === currentCounter.id ? response.data : c)));
          toast.success("Counter updated successfully");
        } else {
          toast.error("Failed to update counter");
        }
      }
      closeModal();
    } catch (error) {
      toast.error("An error occurred while submitting the form");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in currentCounter.user) {
      setCurrentCounter({
        ...currentCounter,
        user: { ...currentCounter.user, [name]: value }
      });
    } else {
      setCurrentCounter({ ...currentCounter, [name]: value });
    }
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
        } overflow-y-auto bg-gray-100`}
      >
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">Ticket Counter Management</h1>
              <button
                onClick={() => openModal("add")}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition w-full sm:w-auto text-sm md:text-base"
              >
                <Plus size={18} className="mr-2" /> Add Counter
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search counters..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Counters Table */}
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md text-xs md:text-sm lg:text-base">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-2 md:px-4 text-left">Counter Name</th>
                    <th className="py-3 px-2 md:px-4 text-left">Location</th>
                    <th className="py-3 px-2 md:px-4 text-left">Bank Name</th>
                    <th className="py-3 px-2 md:px-4 text-left">Bank Account</th>
                    <th className="py-3 px-2 md:px-4 text-left">Name</th>
                    <th className="py-3 px-2 md:px-4 text-left">Phone</th>
                    <th className="py-3 px-2 md:px-4 text-left hidden md:table-cell">Email</th>
                    <th className="py-3 px-2 md:px-4 text-left hidden lg:table-cell">Gender</th>
                    <th className="py-3 px-2 md:px-4 text-left hidden xl:table-cell">Created At</th>
                    <th className="py-3 px-2 md:px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCounters.length > 0 ? (
                    paginatedCounters.map((counter) => (
                      <tr key={counter.id} className="border-t hover:bg-gray-100">
                        <td className="py-3 px-2 md:px-4">{counter.counter_name}</td>
                        <td className="py-3 px-2 md:px-4">{counter.location}</td>
                        <td className="py-3 px-2 md:px-4">{counter.bank_name || "N/A"}</td>
                        <td className="py-3 px-2 md:px-4">{counter.bank_account || "N/A"}</td>
                        <td className="py-3 px-2 md:px-4">{counter.user.full_name}</td>
                        <td className="py-3 px-2 md:px-4">{counter.user.phone}</td>
                        <td className="py-3 px-2 md:px-4 hidden md:table-cell">{counter.user.email}</td>
                        <td className="py-3 px-2 md:px-4 hidden lg:table-cell">{counter.user.gender || "N/A"}</td>
                        <td className="py-3 px-2 md:px-4 hidden xl:table-cell">{new Date(counter.created_at).toLocaleString()}</td>
                        <td className="py-3 px-2 md:px-4 flex justify-center space-x-2 md:space-x-3">
                          <button onClick={() => openModal("view", counter)} className="text-blue-600 hover:text-blue-800">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => openModal("edit", counter)} className="text-yellow-600 hover:text-yellow-800">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deleteCounter(counter.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="py-6 text-center text-gray-500">No ticket counters found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-all disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-all disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Add/Edit/View */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 md:p-6 border-b">
                <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800">
                  {modalMode === "add" ? "Add Counter" : modalMode === "edit" ? "Edit Counter" : "View Counter"}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Counter Name *</label>
                  <input
                    type="text"
                    name="counter_name"
                    value={currentCounter.counter_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={currentCounter.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={currentCounter.bank_name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bank Account</label>
                  <input
                    type="text"
                    name="bank_account"
                    value={currentCounter.bank_account || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={currentCounter.user.full_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={currentCounter.user.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={currentCounter.user.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Gender *</label>
                  <select
                    name="gender"
                    value={currentCounter.user.gender || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={modalMode === "view"}
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {modalMode !== "view" && (
                  <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full sm:w-auto"
                    >
                      {modalMode === "add" ? "Add" : "Save"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCounterManagement;