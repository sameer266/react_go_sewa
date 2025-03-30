import React, { useState, useEffect } from 'react';
import { Search, Clock, MapPin, Bus, Calendar, Edit, Trash, Plus, XCircle } from 'lucide-react';
import { AdminScheduleAddApi, AdminScheduleListApi, AdminScheduleDeleteApi, AdminScheduleUpdateApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const ScheduleRoute = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    bus: '',
    route: '',
    departure_time: '',
    arrival_time: '',
    price: '',
  });

  const user_type = useSelector((state) => state.auth.role);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await AdminScheduleListApi();
      setSchedules(response.data || []);
      setRoutes(response.all_route || []);
      setBuses(response.all_buses || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  const filteredSchedules = schedules
    .filter((schedule) => {
      const departureDate = new Date(schedule.departure_time);
      return departureDate >= today && departureDate <= tomorrow;
    })
    .filter(
      (schedule) =>
        schedule.bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSchedules.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredSchedules.length / itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedSchedule(null);
    setFormData({
      bus: '',
      route: '',
      departure_time: '',
      arrival_time: '',
      price: '',
    });
    setShowForm(true);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      bus: schedule.bus.id || '',
      route: schedule.route.id || '',
      departure_time: schedule.departure_time || '',
      arrival_time: schedule.arrival_time || '',
      price: schedule.price || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (user_type !== 'admin') {
      toast.error('Only admins can delete schedules');
      return;
    }

    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        const response = await AdminScheduleDeleteApi(id);
        if (response.success) {
          setSchedules(schedules.filter((schedule) => schedule.id !== id));
          await fetchSchedules();
          if (getPaginatedData().length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          toast.success('Schedule deleted successfully');
        } else {
          throw new Error(response.error || 'Failed to delete schedule');
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        toast.error(error.message || 'Failed to delete schedule');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSchedule) {
        const response = await AdminScheduleUpdateApi(selectedSchedule.id, formData);
        if (response.success) {
          setSchedules(schedules.map((schedule) =>
            schedule.id === selectedSchedule.id ? response.data : schedule
          ));
          await fetchSchedules();
          toast.success('Schedule updated successfully');
        } else {
          throw new Error(response.error || 'Failed to update schedule');
        }
      } else {
        const response = await AdminScheduleAddApi(formData);
        if (response.success) {
          setSchedules([...schedules, response.data]);
          await fetchSchedules();
          toast.success('Schedule added successfully');
        } else {
          throw new Error(response.error || 'Failed to add schedule');
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting schedule:', error);
      toast.error(error.message || 'Failed to save schedule');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        } overflow-y-auto`}
      >
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">Route Schedules (Today & Tomorrow)</h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search schedules..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
              >
                <Plus size={18} />
                <span>Add New Schedule</span>
              </button>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg md:text-xl font-bold">{selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <XCircle size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bus*</label>
                      <select
                        name="bus"
                        className="w-full p-2 border rounded-lg"
                        value={formData.bus}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Bus</option>
                        {buses.map((bus) => (
                          <option key={bus.id} value={bus.id}>
                            {bus.bus_number}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route*</label>
                      <select
                        name="route"
                        className="w-full p-2 border rounded-lg"
                        value={formData.route}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Route</option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.source} → {route.destination}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time*</label>
                      <input
                        type="datetime-local"
                        name="departure_time"
                        className="w-full p-2 border rounded-lg"
                        value={formData.departure_time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time*</label>
                      <input
                        type="datetime-local"
                        name="arrival_time"
                        className="w-full p-2 border rounded-lg"
                        value={formData.arrival_time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (NPR)*</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="1500.00"
                        className="w-full p-2 border rounded-lg"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {selectedSchedule ? 'Update Schedule' : 'Add Schedule'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Bus size={16} className="inline-block mr-2" />
                      Bus
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MapPin size={16} className="inline-block mr-2" />
                      Route
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Clock size={16} className="inline-block mr-2" />
                      Departure
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Clock size={16} className="inline-block mr-2" />
                      Arrival
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Calendar size={16} className="inline-block mr-2" />
                      Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (NPR)
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                        No schedules found for today or tomorrow
                      </td>
                    </tr>
                  ) : (
                    getPaginatedData().map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {schedule.bus.bus_number}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {schedule.route.source} → {schedule.route.destination}
                          </div>
                          <div className="text-sm text-gray-500">
                            {schedule.route.distance} km
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(schedule.departure_time).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(schedule.arrival_time).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(schedule.departure_time).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            NPR {schedule.price}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit size={18} />
                            </button>
                            {user_type === 'admin' && (
                              <button
                                onClick={() => handleDelete(schedule.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredSchedules.length > 0 && (
              <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of {filteredSchedules.length} schedules
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 w-full sm:w-auto"
                  >
                    Previous
                  </button>
                  {Array.from({ length: getTotalPages() }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 w-full sm:w-auto"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleRoute;