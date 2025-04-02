import React, { useState, useEffect } from "react";
import { Search, MapPin, Plus, Edit, Trash, XCircle, Eye } from "lucide-react";
import {
  AdminRouteListAPi,
  AdminRouteAddApi,
  AdminRouteUpdateApi,
  AdminRouteDeleteApi,
} from "../../api/adminApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Sidebar from "../../components/SideBar";
import { MenuLinks } from "./Link";
import { Link } from "react-router-dom"; // Fixed import

const RouteManagement = () => {
  // State management
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    distance: "",
    estimated_time: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userType = useSelector((state) => state.auth.role);

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const response = await AdminRouteListAPi();
      if (response?.data) {
        setRoutes(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch routes");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter routes based on search term
  const filteredRoutes = routes.filter(
    (route) =>
      (route.source &&
        route.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (route.destination &&
        route.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset form to default state
  const resetForm = () => {
    setSelectedRoute(null);
    setFormData({
      source: "",
      destination: "",
      distance: "",
      estimated_time: "",
    });
  };

  // Handlers
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
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        const response = await AdminRouteDeleteApi(id);
        if (response?.success) {
          setRoutes(routes.filter((route) => route.id !== id));
          toast.success("Route deleted successfully");
        } else {
          toast.error("Failed to delete route");
        }
      } catch (error) {
        toast.error("Failed to delete route");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRoute) {
        // Update existing route
        const response = await AdminRouteUpdateApi(selectedRoute.id, formData);
        if (response?.success) {
          setRoutes(
            routes.map((route) =>
              route.id === selectedRoute.id ? { ...route, ...formData } : route
            )
          );
          toast.success("Route updated successfully");
          setShowForm(false);
        } else {
          toast.error("Failed to update route");
        }
      } else {
        // Add new route
        const response = await AdminRouteAddApi(formData);
        if (response?.success) {
          fetchRoutes(); // Refresh routes to get the new one with ID
          toast.success("Route added successfully");
          setShowForm(false);
        } else {
          toast.error("Failed to add route");
        }
      }
    } catch (error) {
      toast.error("Failed to save route");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form modal component
  const FormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto ml-14">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            {selectedRoute ? "Edit Route" : "Add New Route"}
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source*
              </label>
              <input
                type="text"
                name="source"
                placeholder="Enter source location"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination*
              </label>
              <input
                type="text"
                name="destination"
                placeholder="Enter destination location"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)*
              </label>
              <input
                type="number"
                name="distance"
                placeholder="Distance in kilometers"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.distance}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time*
              </label>
              <input
                type="time"
                name="estimated_time"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.estimated_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              {selectedRoute ? "Update Route" : "Add Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Table row component
  const RouteTableRow = ({ route }) => (
    <tr key={route.id} className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap cursor-pointer relative group">
        <Link to={`/bus-lists/${route.id}`} className="block">
          <div className="text-sm font-medium text-gray-900">{route.source}</div>
        </Link>
        
        {/* Tooltip */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full 
                  hidden group-hover:block bg-gray-800 text-white text-xs 
                  rounded px-2 py-1 shadow-lg z-10">
          Show all buses
        </div>
      </td>
      
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{route.destination}</div>
      </td>
      
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{route.distance} km</div>
      </td>
      
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{route.estimated_time}</div>
      </td>
      
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2 sm:space-x-3">
          <button
            onClick={() => handleEdit(route)}
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
            aria-label="Edit route"
          >
            <Edit size={18} />
          </button>

          <button
            onClick={() => handleDelete(route.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
            aria-label="Delete route"
          >
            <Trash size={18} />
          </button>
          
          <Link
            to={`/bus-lists/${route.id}`}
            className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
            aria-label="View buses"
          >
            <Eye size={18} />
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex h-screen overflow-hidden pt-20">
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
          sidebarCollapsed ? "ml-16" : "ml-64"
        } overflow-y-auto`}
      >
        <div className="p-3 sm:p-6">
          {/* Header with Search and Add button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              Route Management
            </h1>
            
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search routes..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
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

          {/* Routes Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MapPin size={16} className="inline-block mr-1 sm:mr-2" />
                      Source
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MapPin size={16} className="inline-block mr-1 sm:mr-2" />
                      Destination
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Time
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-500">Loading routes...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRoutes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No routes found. {searchTerm ? "Try a different search term." : "Add a new route to get started."}
                      </td>
                    </tr>
                  ) : (
                    filteredRoutes.map((route) => (
                      <RouteTableRow key={route.id} route={route} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && <FormModal />}
    </div>
  );
};

export default RouteManagement;