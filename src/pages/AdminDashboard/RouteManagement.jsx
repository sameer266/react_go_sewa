import React, { useState, useEffect } from 'react';
import { Search, MapPin, Plus, Edit, Trash, XCircle } from 'lucide-react';
import { AdminRouteListAPi, AdminRouteAddApi, AdminRouteUpdateApi, AdminRouteDeleteApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    distance: '',
    estimated_time: '',
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user_type = useSelector((state) => state.auth.role);

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await AdminRouteListAPi();
      console.log(response.data);
      setRoutes(response.data);
    } catch (error) {
      toast.error('Failed to fetch routes');
    }
  };

  const filteredRoutes = routes.filter(route =>
    (route.source && route.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (route.destination && route.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setSelectedRoute(null);
    setFormData({
      source: '',
      destination: '',
      distance: '',
      estimated_time: '',
    });
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setFormData({
      source: route.source,
      destination: route.destination,
      distance: route.distance,
      estimated_time: route.estimated_time,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (user_type !== 'admin') {
      toast.error('Only admins can delete routes');
      return;
    }

    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        const response = await AdminRouteDeleteApi(id);
        if (response?.success) {
          setRoutes(routes.filter(route => route.id !== id));
          toast.success('Route deleted successfully');
        } else {
          toast.error('Failed to delete route');
        }
      } catch (error) {
        toast.error('Failed to delete route');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRoute) {
        // Update existing route
        const updatedRoute = await AdminRouteUpdateApi(selectedRoute.id, formData);
        setRoutes(routes.map(route => 
          route.id === selectedRoute.id ? { ...route, ...formData } : route
        ));
        toast.success('Route updated successfully');
      } else {
        // Add new route
        const newRoute = await AdminRouteAddApi(formData);
        setRoutes([...routes, newRoute]);
        toast.success('Route added successfully');
      }
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to save route');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          {/* Header with Search and Add button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">Route Management</h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search routes..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
              >
                <Plus size={18} />
                <span>Add New Route</span>
              </button>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg md:text-xl font-bold">{selectedRoute ? 'Edit Route' : 'Add New Route'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <XCircle size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source*</label>
                      <input
                        type="text"
                        name="source"
                        placeholder="Source"
                        className="w-full p-2 border rounded-lg"
                        value={formData.source}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination*</label>
                      <input
                        type="text"
                        name="destination"
                        placeholder="Destination"
                        className="w-full p-2 border rounded-lg"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)*</label>
                      <input
                        type="number"
                        name="distance"
                        placeholder="Distance in kilometers"
                        className="w-full p-2 border rounded-lg"
                        value={formData.distance}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time*</label>
                      <input
                        type="time"
                        name="estimated_time"
                        className="w-full p-2 border rounded-lg"
                        value={formData.estimated_time}
                        onChange={handleChange}
                        required
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
                      {selectedRoute ? 'Update Route' : 'Add Route'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Routes Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MapPin size={16} className="inline-block mr-2" />
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MapPin size={16} className="inline-block mr-2" />
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance (km)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoutes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No routes found
                      </td>
                    </tr>
                  ) : (
                    filteredRoutes.map(route => (
                      <tr key={route.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{route.source}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{route.destination}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{route.distance} km</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{route.estimated_time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(route)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit size={18} />
                            </button>
                            {user_type === 'admin' && (
                              <button
                                onClick={() => handleDelete(route.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteManagement;