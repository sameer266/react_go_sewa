import React, { useState, useEffect } from 'react';
import { Search, Clock, MapPin, Bus, Calendar, Edit, Trash, Plus, XCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AdminScheduleAddApi, AdminScheduleListApi, AdminScheduleDeleteApi, AdminScheduleUpdateApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';
import { Link } from 'react-router';

const ScheduleRoute = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    date: '',
    route: '',
    bus: '',
    status: '', // Added status to searchParams
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('today');
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    bus: '',
    route: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    status: 'upcoming',
    transportation_company: '',
    ticket_counter: '',
  });

  const user_type = useSelector((state) => state.auth.role);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await AdminScheduleListApi();
      setSchedules(response.data || []);
      setRoutes(response.all_route || []);
      setBuses(response.all_buses || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  // Date ranges for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  const getFilteredSchedules = () => {
    let filtered = schedules;

    // Apply date filter
    if (searchParams.date) {
      filtered = filtered.filter((schedule) => {
        const scheduleDate = new Date(schedule.departure_time).toLocaleDateString();
        const searchDate = new Date(searchParams.date).toLocaleDateString();
        return scheduleDate === searchDate;
      });
    }

    // Apply route filter
    if (searchParams.route) {
      filtered = filtered.filter((schedule) =>
        `${schedule.route?.source || ''} ${schedule.route?.destination || ''}`
          .toLowerCase()
          .includes(searchParams.route.toLowerCase())
      );
    }

    // Apply bus filter
    if (searchParams.bus) {
      filtered = filtered.filter((schedule) =>
        (schedule.bus?.bus_number || '')
          .toLowerCase()
          .includes(searchParams.bus.toLowerCase())
      );
    }

    // Apply status filter
    if (searchParams.status) {
      filtered = filtered.filter((schedule) =>
        (schedule.status || 'upcoming')
          .toLowerCase()
          .includes(searchParams.status.toLowerCase())
      );
    }

    // Apply time period filter
    switch (filterOption) {
      case 'today':
        return filtered.filter((schedule) => {
          const departureDate = new Date(schedule.departure_time);
          return departureDate >= today && departureDate < tomorrow;
        });
      case 'tomorrow':
        return filtered.filter((schedule) => {
          const departureDate = new Date(schedule.departure_time);
          const tomorrowStart = new Date(tomorrow);
          tomorrowStart.setHours(0, 0, 0, 0);
          const tomorrowEnd = new Date(tomorrowStart);
          tomorrowEnd.setHours(23, 59, 59, 999);
          return departureDate >= tomorrowStart && departureDate <= tomorrowEnd;
        });
      case 'week':
        return filtered.filter((schedule) => {
          const departureDate = new Date(schedule.departure_time);
          return departureDate >= today && departureDate <= nextWeek;
        });
      case 'all':
        return filtered;
      default:
        return filtered;
    }
  };

  const filteredSchedules = getFilteredSchedules();

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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
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
      status: 'upcoming',
      transportation_company: '1',
      ticket_counter: '',
    });
    setShowForm(true);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      bus: schedule.bus?.id || '',
      route: schedule.route?.id || '',
      departure_time: schedule.departure_time || '',
      arrival_time: schedule.arrival_time || '',
      price: schedule.price || '',
      status: schedule.status || 'upcoming',
      transportation_company: schedule.transportation_company || '1',
      ticket_counter: schedule.ticket_counter || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {


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
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        toast.error('Failed to delete schedule');
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
        }
      } else {
        const response = await AdminScheduleAddApi(formData);
        if (response.success) {
          setSchedules([...schedules, response.data]);
          await fetchSchedules();
          toast.success('Schedule added successfully');
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting schedule:', error);
      toast.error('Failed to save schedule');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const StatusBadge = ({ status }) => {
    let badgeClass = "px-2 py-1 rounded-full text-xs font-medium";
    let icon = null;
    
    switch(status) {
      case 'upcoming':
        badgeClass += " bg-blue-100 text-blue-800";
        icon = <Info size={14} className="inline mr-1" />;
        break;
      case 'ongoing':
        badgeClass += " bg-yellow-100 text-yellow-800";
        icon = <AlertTriangle size={14} className="inline mr-1" />;
        break;
      case 'finished':
        badgeClass += " bg-green-100 text-green-800";
        icon = <CheckCircle size={14} className="inline mr-1" />;
        break;
      default:
        badgeClass += " bg-gray-100 text-gray-800";
        icon = <Info size={14} className="inline mr-1" />;
    }
    
    return (
      <span className={badgeClass}>
        {icon}
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  return (
    <div className="mt-20 flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        menuLink={MenuLinks || []}
        className="fixed h-full transition-all duration-300"
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } overflow-y-auto`}
      >
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">Trip Schedules</h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
              >
                <Plus size={18} />
                <span>Add New Schedule</span>
              </button>
            </div>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search by date"
              />
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <input
                type="text"
                name="route"
                value={searchParams.route}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search by route"
              />
              <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <input
                type="text"
                name="bus"
                value={searchParams.bus}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search by bus number"
              />
              <Bus className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <select
                name="status"
                value={searchParams.status}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
              </select>
              <Info className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleFilterChange('today')}
              className={`px-4 py-2 rounded-lg ${
                filterOption === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleFilterChange('tomorrow')}
              className={`px-4 py-2 rounded-lg ${
                filterOption === 'tomorrow' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => handleFilterChange('week')}
              className={`px-4 py-2 rounded-lg ${
                filterOption === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Next 7 Days
            </button>
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg ${
                filterOption === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All Schedules
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto ml-14">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                      <select
                        name="status"
                        className="w-full p-2 border rounded-lg"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="finished">Finished</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transportation Company*</label>
                      <input
                        type="text"
                        name="transportation_company"
                        placeholder="Company ID"
                        className="w-full p-2 border rounded-lg"
                        value={formData.transportation_company}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Counter</label>
                      <input
                        type="text"
                        name="ticket_counter"
                        placeholder="Counter ID (optional)"
                        className="w-full p-2 border rounded-lg"
                        value={formData.ticket_counter || ''}
                        onChange={handleChange}
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

          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                <div className="h-4 bg-blue-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-blue-200 rounded w-1/3"></div>
              </div>
            </div>
          ) : (
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
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchedules.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                          No schedules found matching your search criteria
                        </td>
                      </tr>
                    ) : (
                      getPaginatedData().map((schedule) => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                            <Link 
  to={`/bus-active/${schedule.bus.id}`} 
  className="text-blue-500 underline hover:text-blue-700"
>
  {schedule.bus?.bus_number || 'N/A'}
</Link>
                            
                            </div>
                            {schedule.bus?.bus_type && (
                              <div className="text-xs text-gray-500 capitalize">
                                {schedule.bus.bus_type.replace('_', ' ')}
                              </div>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {schedule.route?.source || 'N/A'} → {schedule.route?.destination || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {schedule.route?.distance} km
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
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={schedule.status || 'upcoming'} />
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEdit(schedule)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit Schedule"
                              >
                                <Edit size={18} />
                              </button>
                            
                                <button
                                  onClick={() => handleDelete(schedule.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Schedule"
                                >
                                  <Trash size={18} />
                                </button>
                             
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
                    Showing {Math.min(filteredSchedules.length, 1) > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of {filteredSchedules.length} schedules
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
                      disabled={currentPage === getTotalPages() || getTotalPages() === 0}
                      className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 w-full sm:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleRoute;