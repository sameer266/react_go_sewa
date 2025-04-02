import React, { useState, useEffect, useMemo } from 'react';
import { 
  AdminVehicleReservationListApi, 
  AdminVehicleReservationAddApi, 
  AdminVehicleReservationUpdateApi, 
  AdminVehicleReservationDeleteApi 
} from '../../api/adminApi';
import { 
  Plus, Edit, Trash2, Save, X, ChevronLeft, ChevronRight, Filter, RefreshCw, Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const INITIAL_FORM_STATE = {
  name: '',
  type: '',
  vehicleNumber: '',
  vehicleModel: '',
  color: '',
  driverId: '',
  staffId: '',
  totalSeats: '',
  price: '',
  image: null // Added image field
};

const ITEMS_PER_PAGE = 5;

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [types, setTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AdminVehicleReservationListApi();
      if (response.success) {
        setReservations(response.data || []);
        setDrivers(response.unassigned_drivers || []);
        setStaff(response.unassigned_staff || []);
        const uniqueTypes = [...new Set(response.data.map(item => item.type.name))]
          .map(name => ({ name }));
        setTypes(uniqueTypes);
      } else {
        toast.error('Failed to fetch reservations');
      }
    } catch (error) {
      console.error("Data fetch error:", error);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddType = () => {
    const newType = prompt('Enter new vehicle type:');
    if (newType && !types.some(type => type.name === newType)) {
      setTypes([...types, { name: newType }]);
      setFormData(prev => ({ ...prev, type: newType }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = Object.keys(INITIAL_FORM_STATE).filter(field => field !== 'image'); // Image is optional
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const submitData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          submitData.append(key === 'vehicleNumber' ? 'vechicle_number' : key === 'vehicleModel' ? 'vechicle_model' : key, formData[key]);
        }
      }

      const apiCall = editingId 
        ? AdminVehicleReservationUpdateApi(editingId, submitData)
        : AdminVehicleReservationAddApi(submitData);

      const response = await apiCall;

      if (response.success) {
        toast.success(editingId ? 'Reservation updated successfully' : 'Reservation added successfully');
        setReservations(prev => 
          editingId 
            ? prev.map(res => res.id === editingId ? response.data : res)
            : [...prev, response.data]
        );
        setFormData(INITIAL_FORM_STATE);
        setEditingId(null);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('Error submitting reservation');
    }
  };

  const handleEdit = (reservation) => {
    setEditingId(reservation.id);
    setFormData({
      name: reservation.name,
      type: reservation.type.name,
      vehicleNumber: reservation.vechicle_number,
      vehicleModel: reservation.vechicle_model,
      color: reservation.color,
      driverId: reservation.driver.full_name,
      staffId: reservation.staff.full_name,
      totalSeats: reservation.total_seats,
      price: reservation.price,
      image: null // Reset image for new upload
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        const response = await AdminVehicleReservationDeleteApi(id);
        if (response.success) {
          setReservations(prev => prev.filter(res => res.id !== id));
          toast.success('Reservation deleted successfully');
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error('Error deleting reservation');
      }
    }
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  // Filtered and Paginated Reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => 
      (searchTerm === '' || 
        reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.vechicle_number.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (filterType === '' || reservation.type.name === filterType)
    );
  }, [reservations, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Mobile card view for reservations
  const renderMobileReservationCard = (reservation) => (
    <div 
      key={reservation.id} 
      className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-blue-500 relative"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{reservation.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(reservation)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => handleDelete(reservation.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <img 
          src={`http://127.0.0.1:8000${reservation.image}`} 
          alt={reservation.name} 
          className="w-full h-32 object-cover rounded mb-2"
          onError={(e) => e.target.src = '/fallback-image.jpg'} // Fallback image
        />
        <p><strong>Type:</strong> {reservation.type.name}</p>
        <p><strong>Vehicle Number:</strong> {reservation.vechicle_number}</p>
        <p><strong>Model:</strong> {reservation.vechicle_model}</p>
        <p><strong>Driver:</strong> {reservation.driver.full_name}</p>
      </div>
    </div>
  );

  // Desktop table view for reservations
  const renderDesktopReservationTable = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReservations.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              paginatedReservations.map(reservation => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={`http://127.0.0.1:8000${reservation.image}`} 
                      alt={reservation.name} 
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => e.target.src = '/fallback-image.jpg'} // Fallback image
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.type.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.vechicle_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.vechicle_model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.driver.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(reservation)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Vehicle Reservations</h1>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <form 
                onSubmit={handleSubmit} 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                encType="multipart/form-data"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vehicle Name"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      {types.map(type => (
                        <option key={type.name} value={type.name}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddType}
                    className="mt-6 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vehicle Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vehicle Model"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.full_name}>{driver.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                  <select
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Staff</option>
                    {staff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.full_name}>{staffMember.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                  <input
                    name="totalSeats"
                    type="number"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Total Seats"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {editingId && reservations.find(r => r.id === editingId)?.image && (
                    <img 
                      src={`http://127.0.0.1:8000${reservations.find(r => r.id === editingId).image}`} 
                      alt="Current"
                      className="mt-2 w-24 h-24 object-cover rounded"
                    />
                  )}
                </div>

                <div className="sm:col-span-2 lg:col-span-3 flex gap-4 justify-end flex-col sm:flex-row">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors w-full sm:w-auto"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  >
                    <Save size={20} />
                    {editingId ? 'Update' : 'Add'} Reservation
                  </button>
                </div>
              </form>
            </div>

            {/* Filters and Search */}
            <div className="mb-4 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search reservations..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <Filter className="absolute left-2 top-3 text-gray-400" size={20} />
                </div>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="">All Types</option>
                  {types.map(type => (
                    <option key={type.name} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={20} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Reservations List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-blue-600" size={48} />
              </div>
            ) : (
              <>
                {isMobile 
                  ? (
                    <div className="space-y-4">
                      {paginatedReservations.map(renderMobileReservationCard)}
                    </div>
                  ) 
                  : renderDesktopReservationTable()
                }

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-blue-600 text-white rounded-full disabled:bg-gray-400 w-full sm:w-auto"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-blue-600 text-white rounded-full disabled:bg-gray-400 w-full sm:w-auto"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;