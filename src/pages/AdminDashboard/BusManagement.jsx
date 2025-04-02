import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Search, XCircle, Snowflake, Zap, Wind, WifiIcon } from 'lucide-react';
import { AdminBusListApi, AdminBusAddApi, AdminBusUpdateApi, AdminBusDeleteApi } from '../../api/adminApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Bus layout state
  const [rows, setRows] = useState(6);
  const [columns, setColumns] = useState(5);
  const [aisleAfterColumn, setAisleAfterColumn] = useState(2);
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [backRowSeats, setBackRowSeats] = useState(5);
  const [includeBackRow, setIncludeBackRow] = useState(true);

  const [formData, setFormData] = useState({
    bus_number: '',
    bus_type: 'deluxe_bus',
    features: [],
    bus_image: null,
    total_seats: 35,
    driver: '',
    staff: '',
    route: '',
    is_active: false,
   
  });

  const user_type = useSelector((state) => state.auth.role);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    generateSeatLayout();
  }, [rows, columns, aisleAfterColumn, includeBackRow, backRowSeats]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await AdminBusListApi();
      setBuses(response.data || []);
      setDrivers(response.all_driver || []);
      setStaff(response.all_staff || []);
      setRoutes(
        response.all_route.map((route, index) => ({
          ...route,
          id: index + 1,
        })) || []
      );
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const generateSeatLayout = () => {
    const layout = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < columns; c++) {
        if (c === aisleAfterColumn) {
          row.push(0);
        } else {
          let colLetter = String.fromCharCode(65 + (c > aisleAfterColumn ? c - 1 : c));
          const seatNumber = `${colLetter}${r + 1}`;
          row.push(seatNumber);
        }
      }
      layout.push(row);
    }
    if (includeBackRow) {
      const backRow = [];
      for (let c = 0; c < backRowSeats; c++) {
        const colLetter = String.fromCharCode(65 + c);
        const seatNumber = `${colLetter}${rows + 1}`;
        backRow.push(seatNumber);
      }
      layout.push(backRow);
    }
    setSeatLayout(layout);
  };

  const vehicleChoices = [
    { value: 'tourist_bus', label: 'Tourist Bus' },
    { value: 'express_bus', label: 'Express Bus' },
    { value: 'deluxe_bus', label: 'Deluxe Bus' },
    { value: 'mini_bus', label: 'Mini Bus' },
    { value: 'micro_bus', label: 'Micro Bus' },
    { value: 'electric_bus', label: 'Electric Bus' },
  ];

  const featureChoices = [
    { value: 'ac', label: 'AC', icon: <Snowflake size={16} /> },
    { value: 'charging', label: 'Charging', icon: <Zap size={16} /> },
    { value: 'fan', label: 'Fan', icon: <Wind size={16} /> },
    { value: 'wifi', label: 'Wifi', icon: <WifiIcon size={16} /> },
  ];

  const filteredBuses = buses.filter(
    (bus) =>
      bus &&
      (bus.bus_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.route?.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.route?.destination?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBuses.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredBuses.length / itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddNew = () => {
    setSelectedBus(null);
    setCurrentImageUrl(null);
    setFormData({
      bus_number: '',
      bus_type: 'deluxe_bus',
      features: [],
      bus_image: null,
      total_seats: 35,
      driver: '',
      staff: '',
      route: '',
      is_active: false,
    
    });
    setRows(6);
    setColumns(5);
    setAisleAfterColumn(2);
    setIncludeBackRow(true);
    setBackRowSeats(5);
    setSelectedSeats({});
    generateSeatLayout();
    setShowForm(true);
  };

  const handleEdit = (bus) => {
    if (!bus) return;
    setSelectedBus(bus);
    setCurrentImageUrl(bus.bus_image ? `http://127.0.0.1:8000${bus.bus_image}` : null);

    setFormData({
      bus_number: bus.bus_number || '',
      bus_type: bus.bus_type || 'deluxe_bus',
      features: bus.features || [],
      bus_image: null,
      total_seats: bus.total_seats || 35,
      driver: bus.driver?.id || '',
      staff: bus.staff?.id || '',
      route:
        routes.find((r) => r.source === bus.route?.source && r.destination === bus.route?.destination)?.id || '',
      is_active: bus.is_active || false,

    });

    if (bus.layout?.seatLayout) {
      setSeatLayout(bus.layout.seatLayout.map(row => 
        row.map(seat => typeof seat === 'object' ? seat.seat : seat)
      ));
      const hasBackRow = bus.layout.seatLayout.length > 0 && 
        bus.layout.seatLayout[bus.layout.seatLayout.length - 1].some(seat => seat && typeof seat === 'object' && seat.isBackRow);
      setIncludeBackRow(hasBackRow);
      setRows(hasBackRow ? bus.layout.seatLayout.length - 1 : bus.layout.seatLayout.length);
      setColumns(bus.layout.seatLayout[0].length);
      const aislePos = bus.layout.seatLayout[0].findIndex(seat => seat === 0);
      setAisleAfterColumn(aislePos >= 0 ? aislePos : 2);
      setBackRowSeats(hasBackRow ? bus.layout.seatLayout[bus.layout.seatLayout.length - 1].filter(seat => seat !== 0).length : 5);

      const newSelectedSeats = {};
      bus.layout.seatLayout.forEach((row, rowIndex) => {
        row.forEach((seat, colIndex) => {
          if (typeof seat === 'object' && seat.seat) {
            newSelectedSeats[`${rowIndex}-${colIndex}`] = seat.seat;
          }
        });
      });
      setSelectedSeats(newSelectedSeats);
    } else {
      setRows(6);
      setColumns(5);
      setAisleAfterColumn(2);
      setIncludeBackRow(true);
      setBackRowSeats(5);
      setSelectedSeats({});
      generateSeatLayout();
    }
    setShowForm(true);
  };

  const handleDelete = async (busId) => {
    if (user_type !== 'admin') {
      toast.error("You do not have permission to delete buses.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        const response = await AdminBusDeleteApi(busId);
        if (response?.success) {
          setBuses(buses.filter((bus) => bus?.id !== busId));
          toast.success('Bus deleted successfully');
          if (getPaginatedData().length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          toast.error(response?.error || 'Failed to delete bus');
        }
      } catch (error) {
        toast.error('Failed to delete bus');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox' && name !== 'features') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'features') {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.includes(value) ? prev.features.filter((f) => f !== value) : [...prev.features, value],
      }));
    } else if (name === 'bus_image') {
      if (files.length) {
        setCurrentImageUrl(URL.createObjectURL(files[0]));
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else if (name === 'total_seats') {
      const seats = Math.max(1, parseInt(value) || 0);
      setFormData((prev) => ({ ...prev, [name]: seats }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleSeat = (rowIndex, colIndex) => {
    const seatId = `${rowIndex}-${colIndex}`;
    const seatLabel = seatLayout[rowIndex][colIndex];
    if (seatLabel === 0) return;
    setSelectedSeats(prev => {
      const newSeats = { ...prev };
      if (newSeats[seatId]) {
        delete newSeats[seatId];
      } else {
        newSeats[seatId] = seatLabel;
      }
      return newSeats;
    });
  };

  const handleSelectAllSeats = () => {
    const allSeats = {};
    seatLayout.forEach((row, rowIndex) => {
      row.forEach((seat, colIndex) => {
        if (seat !== 0) {
          allSeats[`${rowIndex}-${colIndex}`] = seat;
        }
      });
    });
    setSelectedSeats(allSeats);
  };

  const handleDeselectAllSeats = () => {
    setSelectedSeats({});
  };

  const selectedSeatsCount = Object.keys(selectedSeats).length;

  useEffect(() => {
    setFormData(prev => ({ ...prev, total_seats: selectedSeatsCount }));
  }, [selectedSeatsCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features') {
          data.append(key, JSON.stringify(value));
        } else if (value !== null && value !== '') {
          data.append(key, value);
        }
      });
      data.append('total_seats', formData.total_seats);
      const layoutData = seatLayout.map((row, rowIndex) => 
        row.map((seat, colIndex) => {
          if (seat === 0) return 0;
          const seatId = `${rowIndex}-${colIndex}`;
          return selectedSeats[seatId] ? { seat: seat, status: "available" } : 0;
        })
      );
      const layout = {
        rows,
        columns,
        aisleAfterColumn,
        includeBackRow,
        backRowSeats,
        seatLayout: layoutData
      };
      data.append('layout', JSON.stringify(layout));

      if (selectedBus) {
        const response = await AdminBusUpdateApi(selectedBus.id, data);
        if (response?.success) {
          setBuses(buses.map((bus) => (bus?.id === selectedBus.id ? { ...bus, ...response.data } : bus)));
          toast.success('Bus updated successfully');
          setShowForm(false);
        } else if (response?.error) {
          toast.error(response.error);
        }
      } else {
        const response = await AdminBusAddApi(data);
        if (response?.success) {
          setBuses((prev) => [...prev, response.data]);
          toast.success('Bus added successfully');
          setShowForm(false);
        } else if (response?.error) {
          toast.error(response.error);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save bus');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold">Bus Management</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search buses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              >
                <Plus size={18} /> Add New Bus
              </button>
            </div>
          </div>

          {/* Modal Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto ml-14">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{selectedBus ? 'Edit Bus' : 'Add New Bus'}</h2>
                  <button onClick={() => setShowForm(false)}>
                    <XCircle size={24} className="text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number *</label>
                      <input
                        type="text"
                        name="bus_number"
                        value={formData.bus_number}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
                      <select
                        name="bus_type"
                        value={formData.bus_type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        {vehicleChoices.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                      <select
                        name="driver"
                        value={formData.driver}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                      <select
                        name="staff"
                        value={formData.staff}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Staff</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                      <select
                        name="route"
                        value={formData.route}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bus Image</label>
                      <input
                        type="file"
                        name="bus_image"
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        accept="image/*"
                      />
                      {currentImageUrl && (
                        <img src={currentImageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {featureChoices.map((feature) => (
                        <label key={feature.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="features"
                            value={feature.value}
                            checked={formData.features.includes(feature.value)}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="flex items-center gap-1">
                            {feature.icon} {feature.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seat Layout</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-600">Rows</label>
                        <input
                          type="number"
                          value={rows}
                          onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full p-2 border rounded-lg"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Columns</label>
                        <input
                          type="number"
                          value={columns}
                          onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full p-2 border rounded-lg"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Aisle After Column</label>
                        <input
                          type="number"
                          value={aisleAfterColumn}
                          onChange={(e) => setAisleAfterColumn(Math.max(0, Math.min(columns - 1, parseInt(e.target.value) || 0)))}
                          className="w-full p-2 border rounded-lg"
                          min="0"
                          max={columns - 1}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Include Back Row</label>
                        <input
                          type="checkbox"
                          checked={includeBackRow}
                          onChange={(e) => setIncludeBackRow(e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      {includeBackRow && (
                        <div>
                          <label className="block text-xs text-gray-600">Back Row Seats</label>
                          <input
                            type="number"
                            value={backRowSeats}
                            onChange={(e) => setBackRowSeats(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-2 border rounded-lg"
                            min="1"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <button
                        type="button"
                        onClick={handleSelectAllSeats}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllSeats}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Deselect All
                      </button>
                    </div>

                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                      {seatLayout.map((row, rowIndex) => (
                        row.map((seat, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => toggleSeat(rowIndex, colIndex)}
                            className={`p-2 border text-center cursor-pointer ${
                              seat === 0
                                ? 'bg-gray-200'
                                : selectedSeats[`${rowIndex}-${colIndex}`]
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {seat === 0 ? '-' : seat}
                          </div>
                        ))
                      ))}
                    </div>

                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Seats: {selectedSeatsCount}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span>Active</span>
                    </label>
                   
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {selectedBus ? 'Update Bus' : 'Add Bus'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bus Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                      Features
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBuses.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                        No buses found
                      </td>
                    </tr>
                  ) : (
                    getPaginatedData().map(
                      (bus) =>
                        bus && (
                          <tr key={bus.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {bus.bus_image && (
                                  <img
                                    src={`http://127.0.0.1:8000${bus.bus_image}`}
                                    alt="Bus"
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{bus.bus_number}</div>
                                  <div className="text-sm text-gray-500 sm:hidden">
                                    {vehicleChoices.find((v) => v.value === bus.bus_type)?.label || bus.bus_type}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-sm text-gray-900">
                                {vehicleChoices.find((v) => v.value === bus.bus_type)?.label || bus.bus_type}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="flex gap-2">
                                {bus.features?.map((feature) => {
                                  const feat = featureChoices.find((f) => f.value === feature);
                                  return feat ? (
                                    <span key={feature} className="text-gray-600" title={feat.label}>
                                      {feat.icon}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {bus.route?.source} → {bus.route?.destination}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-900">{bus.total_seats}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    bus.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {bus.is_active ? 'Active' : 'Inactive'}
                                </span>
                                
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(bus)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                {user_type === 'admin' && (
                                  <button
                                    onClick={() => handleDelete(bus.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete"
                                  >
                                    <Trash size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                    )
                  )}
                </tbody>
              </table>
            </div>
            {filteredBuses.length > 0 && (
              <div className="px-4 py-4 flex flex-col sm:flex-row justify-between items-center border-t gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBuses.length)} of {filteredBuses.length} buses
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
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
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
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

export default BusManagement;