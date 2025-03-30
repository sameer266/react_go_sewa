import React, { useEffect, useState } from 'react';
import { 
  StaffListApi, StaffDeleteApi, StaffUpdateApi, StaffAddApi,
  DriverListApi, DriverDeleteApi, DriverUpdateApi, DriverAddApi
} from '../../api/adminApi';
import Loader from '../../components/Loader';
import { Trash2, User, Car, Edit2, X, Plus, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/SideBar';
import DefaultImage from '../../assets/home-image/default.jpg';
import { MenuLinks } from './Link';

function DriverStaff() {
  const [data, setData] = useState({ drivers: [], staff: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'add'
  const [currentItem, setCurrentItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [staffPage, setStaffPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const itemsPerPage = 5;
  const userType = useSelector((state) => state.auth.role);

  const fetchData = async () => {
    try {
      setLoading(true);
      const driversResponse = await DriverListApi();
      const staffResponse = await StaffListApi();

      if (driversResponse.success && staffResponse.success) {
        setData({ drivers: driversResponse.data, staff: staffResponse.data });
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPaginatedData = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (type, newPage) => {
    if (type === 'staff') {
      setStaffPage(newPage);
    } else {
      setDriverPage(newPage);
    }
  };

  const handleDelete = async (id, type) => {
    if (userType !== 'admin') {
      setError("You do not have permission to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      setLoading(true);
      const response = type === 'staff' ? await StaffDeleteApi(id) : await DriverDeleteApi(id);

      if (response.success) {
        fetchData();
      } else {
        setError(response.message || "Failed to delete");
      }
    } catch (error) {
      setError("Error deleting: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item, type) => {
    setCurrentItem({ ...item, type });
    setModalMode('edit');
    setModalOpen(true);

    if (type === 'staff' && item.staff_profile) {
      setImagePreview(`http://127.0.0.1:8000${item.staff_profile}`);
    } else if (type === 'driver' && item.driver_profile) {
      setImagePreview(`http://127.0.0.1:8000${item.driver_profile}`);
      if (item.license_image) {
        setLicensePreview(`http://127.0.0.1:8000${item.license_image}`);
      }
    }
  };

  const handleAdd = (type) => {
    const newItem = {
      full_name: '',
      phone_number: '',
      type: type,
    };
    setCurrentItem(newItem);
    setModalMode('add');
    setModalOpen(true);
    setImagePreview(DefaultImage);
    setLicensePreview(null);
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (imageType === 'profile') {
        setImagePreview(reader.result);
        setCurrentItem({ ...currentItem, profile_image: file });
      } else if (imageType === 'license') {
        setLicensePreview(reader.result);
        setCurrentItem({ ...currentItem, license_image_file: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const validatePhoneNumber = (phone) => {
    const nepalPhoneRegex = /^9[6-8][0-9]{8}$/;
    return nepalPhoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentItem.full_name) {
      setError("Full name is required.");
      return;
    }

    if (!currentItem.phone_number) {
      setError("Phone number is required.");
      return;
    }

    if (!validatePhoneNumber(currentItem.phone_number)) {
      setError("Please enter a valid 10-digit Nepalese phone number (e.g., 98XXXXXXXX).");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('full_name', currentItem.full_name);
      formData.append('phone_number', currentItem.phone_number);

      if (currentItem.profile_image) {
        formData.append(
          currentItem.type === 'staff' ? 'staff_profile' : 'driver_profile',
          currentItem.profile_image
        );
      }

      if (currentItem.type === 'driver' && currentItem.license_image_file) {
        formData.append('license_image', currentItem.license_image_file);
      }

      let response;
      if (modalMode === 'edit') {
        if (currentItem.type === 'staff') {
          response = await StaffUpdateApi(currentItem.id, formData);
        } else {
          response = await DriverUpdateApi(currentItem.id, formData);
        }
      } else {
        if (currentItem.type === 'staff') {
          response = await StaffAddApi(formData);
        } else {
          response = await DriverAddApi(formData);
        }
      }

      if (response.success) {
        fetchData();
        setModalOpen(false);
        setCurrentItem(null);
        setImagePreview(null);
        setLicensePreview(null);
      } else {
        setError(response.message || "Operation failed");
      }
    } catch (error) {
      setError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
    setImagePreview(null);
    setLicensePreview(null);
    setError(null);
  };

  if (loading && !modalOpen) return <Loader />;

  return (
    <div className="flex h-screen overflow-hidden mt-20">
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
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 bg-blue-600 text-white">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <User size={28} /> Driver & Staff Management
                </h1>
                <p className="text-blue-100 mt-1">Manage your team efficiently</p>
              </div>

              {/* Staff Section */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-blue-700 flex items-center gap-2">
                    <User size={24} /> Staff
                  </h2>
                  <button
                    onClick={() => handleAdd('staff')}
                    className="mt-2 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Plus size={18} /> Add Staff
                  </button>
                </div>

                {error && (
                  <div className="text-center text-red-600 bg-red-50 p-4 mb-6 rounded-lg">{error}</div>
                )}

                {data.staff && data.staff.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-left text-gray-700 font-semibold">Image</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Name</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Phone</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedData(data.staff, staffPage).map((staffMember) => (
                            <tr key={staffMember.id} className="border-b hover:bg-gray-50 transition-all">
                              <td className="p-4">
                                {staffMember.staff_profile ? (
                                  <img
                                    src={`http://127.0.0.1:8000${staffMember.staff_profile}`}
                                    alt={staffMember.full_name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <User size={20} className="text-gray-500" />
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-gray-800">{staffMember.full_name}</td>
                              <td className="p-4 text-gray-800">{staffMember.phone_number}</td>
                              <td className="p-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => handleEdit(staffMember, 'staff')}
                                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                                  >
                                    <Edit2 size={16} /> Edit
                                  </button>
                                  {userType === 'admin' && (
                                    <button
                                      onClick={() => handleDelete(staffMember.id, 'staff')}
                                      className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                                    >
                                      <Trash2 size={16} /> Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-gray-600">
                        Showing {(staffPage - 1) * itemsPerPage + 1} to {Math.min(staffPage * itemsPerPage, data.staff.length)} of {data.staff.length} staff
                      </span>
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => handlePageChange('staff', staffPage - 1)}
                          disabled={staffPage === 1}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                        >
                          Previous
                        </button>
                        {Array.from({ length: getTotalPages(data.staff) }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange('staff', i + 1)}
                            className={`px-4 py-2 rounded-lg ${staffPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange('staff', staffPage + 1)}
                          disabled={staffPage === getTotalPages(data.staff)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">No staff available</p>
                )}
              </div>

              {/* Drivers Section */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-blue-700 flex items-center gap-2">
                    <Car size={24} /> Drivers
                  </h2>
                  <button
                    onClick={() => handleAdd('driver')}
                    className="mt-2 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Plus size={18} /> Add Driver
                  </button>
                </div>

                {data.drivers && data.drivers.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-left text-gray-700 font-semibold">Image</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Name</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Phone</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">License</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedData(data.drivers, driverPage).map((driver) => (
                            <tr key={driver.id} className="border-b hover:bg-gray-50 transition-all">
                              <td className="p-4">
                                {driver.driver_profile ? (
                                  <img
                                    src={`http://127.0.0.1:8000${driver.driver_profile}`}
                                    alt={driver.full_name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <User size={20} className="text-gray-500" />
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-gray-800">{driver.full_name}</td>
                              <td className="p-4 text-gray-800">{driver.phone_number}</td>
                              <td className="p-4">
                                {driver.license_image ? (
                                  <img
                                    src={`http://127.0.0.1:8000${driver.license_image}`}
                                    alt="Driver License"
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Car size={20} className="text-gray-500" />
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => handleEdit(driver, 'driver')}
                                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                                  >
                                    <Edit2 size={16} /> Edit
                                  </button>
                                  {userType === 'admin' && (
                                    <button
                                      onClick={() => handleDelete(driver.id, 'driver')}
                                      className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                                    >
                                      <Trash2 size={16} /> Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-gray-600">
                        Showing {(driverPage - 1) * itemsPerPage + 1} to {Math.min(driverPage * itemsPerPage, data.drivers.length)} of {data.drivers.length} drivers
                      </span>
                      <div className="flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => handlePageChange('driver', driverPage - 1)}
                          disabled={driverPage === 1}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                        >
                          Previous
                        </button>
                        {Array.from({ length: getTotalPages(data.drivers) }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange('driver', i + 1)}
                            className={`px-4 py-2 rounded-lg ${driverPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange('driver', driverPage + 1)}
                          disabled={driverPage === getTotalPages(data.drivers)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">No drivers available</p>
                )}
              </div>

              {/* Modal */}
              {modalOpen && currentItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-blue-700">
                        {modalMode === 'edit'
                          ? (currentItem.type === 'staff' ? 'Edit Staff' : 'Edit Driver')
                          : (currentItem.type === 'staff' ? 'Add Staff' : 'Add Driver')}
                      </h2>
                      <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700 transition-all"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Profile Image (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={30} className="text-gray-400" />
                            )}
                          </div>
                          <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                            <Upload size={18} /> Upload Image
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'profile')}
                            />
                          </label>
                        </div>
                      </div>

                      {currentItem.type === 'driver' && (
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2">
                            License Image (Optional)
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                              {licensePreview ? (
                                <img
                                  src={licensePreview}
                                  alt="License Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Car size={30} className="text-gray-400" />
                              )}
                            </div>
                            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                              <Upload size={18} /> Upload License
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'license')}
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentItem.full_name || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, full_name: e.target.value })}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Phone Number (10-digit Nepal) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentItem.phone_number || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, phone_number: e.target.value })}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          maxLength={10}
                          placeholder="e.g., 98XXXXXXXX"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : (modalMode === 'edit' ? 'Save Changes' : 'Add')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverStaff;