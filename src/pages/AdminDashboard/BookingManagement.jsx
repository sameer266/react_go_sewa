import React, { useState, useEffect } from "react";
import { Edit2, Save, XCircle, Filter, Calendar, Search, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminBookingListApi, AdminBookingUpdateApi } from "../../api/adminApi";
import Loader from "../../components/Loader";
import Sidebar from "../../components/SideBar";
import { MenuLinks } from "./Link";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busReservations, setFilteredBusReservations] = useState([]);
  const [allBusReservations, setAllBusReservations] = useState([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [reservationPage, setReservationPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Date filtering
  const today = new Date();
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [dateFilterActive, setDateFilterActive] = useState(true);

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, startDate, endDate, dateFilterActive]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await AdminBookingListApi();
      if (response.success) {
        setBookings(response.data || []);
        setAllBusReservations(response.bus_reserve || []);
        
        // Initialize with today's data
        applyFilters();
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    // Reset pagination
    setBookingPage(1);
    setReservationPage(1);
    
    // Filter by status
    let filteredByStatus = bookings;
    if (statusFilter !== "all") {
      filteredByStatus = bookings.filter((booking) => booking.booking_status === statusFilter);
    }
    
    // Filter by date if date filter is active
    let result = filteredByStatus;
    let reserveResult = allBusReservations;
    
    if (dateFilterActive) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      // Filter bookings
      result = filteredByStatus.filter(booking => {
        const departureDate = new Date(booking.schedule.departure_time);
        return departureDate >= start && departureDate <= end;
      });
      
      // Filter bus reservations
      reserveResult = allBusReservations.filter(reservation => {
        const reserveDate = new Date(reservation.start_date);
        return reserveDate >= start && reserveDate <= end;
      });
    }
    
    setFilteredBookings(result);
    setFilteredBusReservations(reserveResult);
  };

  const resetDateFilter = () => {
    setStartDate(formatDate(today));
    setEndDate(formatDate(today));
    setDateFilterActive(true);
  };

  const getPaginatedData = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (type, newPage) => {
    if (type === "bookings") {
      setBookingPage(newPage);
    } else {
      setReservationPage(newPage);
    }
  };

  const handleEdit = (booking) => {
    setEditingBookingId(booking.id);
    setUpdatedStatus(booking.booking_status);
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
    setUpdatedStatus("");
  };

  const handleSave = async (id) => {
    try {
      const response = await AdminBookingUpdateApi(id, { booking_status: updatedStatus });
      if (response.success) {
        setBookings(
          bookings.map((booking) =>
            booking.id === id ? { ...booking, booking_status: updatedStatus } : booking
          )
        );
        toast.success("Booking status updated successfully");
        setEditingBookingId(null);
      } else {
        toast.error("Failed to update booking status");
      }
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      
    
      <div className="min-h-screen mt-6">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} menuLink={MenuLinks || []} />
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          } p-4 md:p-6`}
        >
          <div className="max-w-6xl mx-auto mt-16 mb-20">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-blue-600 text-white">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Filter size={28} /> Booking Management
                </h1>
                <p className="text-blue-100 mt-1">Manage seat bookings and bus reservations</p>
              </div>

              {/* Date Filter Section */}
              <div className="p-6 bg-blue-50 border-b border-blue-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Calendar size={20} />
                    <h3 className="font-semibold">Date Filter</h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">From:</label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">To:</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => applyFilters()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                      >
                        <Search size={16} />
                        <span>Search</span>
                      </button>
                      
                      <button 
                        onClick={resetDateFilter}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-1"
                      >
                        <RefreshCw size={16} />
                        <span>Today</span>
                      </button>
                      
                      <button 
                        onClick={() => setDateFilterActive(!dateFilterActive)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                          dateFilterActive 
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {dateFilterActive ? "Active" : "All Dates"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seat Booking Management */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-blue-700 flex items-center gap-2">
                    Seat Booking Management
                  </h2>
                  <div className="mt-2 sm:mt-0 relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="booked">Booked</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center text-gray-600 p-6 bg-gray-50 rounded-lg">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">No bookings found for the selected date range</p>
                    <p className="text-sm mt-1">Try changing your filters or selecting a different date</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">User</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Bus</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Route</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Seats</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Schedule</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Price</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Status</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedData(filteredBookings, bookingPage).map((booking) => (
                            <tr key={booking.id} className="border-b hover:bg-gray-50 transition-all">
                              <td className="p-4">#{booking.id}</td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-800">{booking.user.full_name}</span>
                                  <span className="text-sm text-gray-500">{booking.user.email || "N/A"}</span>
                                  <span className="text-sm text-gray-500">{booking.user.phone}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-800">{booking.schedule.bus.bus_number}</span>
                                  <span className="text-sm text-gray-500">{booking.schedule.bus.bus_type}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                {booking.schedule.route.source} → {booking.schedule.route.destination}
                              </td>
                              <td className="p-4">
                                <span className="text-gray-800">{booking.seat.join(", ")}</span>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="text-gray-800">
                                    Dep: {new Date(booking.schedule.departure_time).toLocaleString()}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Arr: {new Date(booking.schedule.arrival_time).toLocaleString()}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-800">NPR {booking.schedule.price}</td>
                              <td className="p-4">
                                {editingBookingId === booking.id ? (
                                  <select
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="booked">Booked</option>
                                    <option value="canceled">Canceled</option>
                                  </select>
                                ) : (
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      booking.booking_status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : booking.booking_status === "booked"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {booking.booking_status}
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                {editingBookingId === booking.id ? (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSave(booking.id)}
                                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                    >
                                      <Save size={18} />
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleEdit(booking)}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredBookings.length > 0 && (
                      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-gray-600">
                          Showing {(bookingPage - 1) * itemsPerPage + 1} to{" "}
                          {Math.min(bookingPage * itemsPerPage, filteredBookings.length)} of{" "}
                          {filteredBookings.length} bookings
                        </span>
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={() => handlePageChange("bookings", bookingPage - 1)}
                            disabled={bookingPage === 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                          >
                            Previous
                          </button>
                          {Array.from({ length: getTotalPages(filteredBookings) }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange("bookings", i + 1)}
                              className={`px-4 py-2 rounded-lg ${
                                bookingPage === i + 1
                                  ? "bg-blue-700 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange("bookings", bookingPage + 1)}
                            disabled={bookingPage === getTotalPages(filteredBookings)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bus Reservations */}
              <div className="p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
                  Bus Reservations
                </h2>
                {busReservations.length === 0 ? (
                  <div className="text-center text-gray-600 p-6 bg-gray-50 rounded-lg">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">No reservations found for the selected date range</p>
                    <p className="text-sm mt-1">Try changing your filters or selecting a different date</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">User</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Route</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Start Date</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Days</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedData(busReservations, reservationPage).map((reservation) => (
                            <tr key={reservation.id} className="border-b hover:bg-gray-50 transition-all">
                              <td className="p-4">#{reservation.id}</td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-800">{reservation.user.full_name}</span>
                                  <span className="text-sm text-gray-500">{reservation.user.email || "N/A"}</span>
                                  <span className="text-sm text-gray-500">{reservation.user.phone}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                {reservation.source} → {reservation.destination}
                              </td>
                              <td className="p-4 text-gray-800">
                                {new Date(reservation.start_date).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-gray-800">{reservation.date}</td>
                              <td className="p-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    reservation.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : reservation.status === "booked"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {reservation.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {busReservations.length > 0 && (
                      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-gray-600">
                          Showing {(reservationPage - 1) * itemsPerPage + 1} to{" "}
                          {Math.min(reservationPage * itemsPerPage, busReservations.length)} of{" "}
                          {busReservations.length} reservations
                        </span>
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={() => handlePageChange("reservations", reservationPage - 1)}
                            disabled={reservationPage === 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                          >
                            Previous
                          </button>
                          {Array.from({ length: getTotalPages(busReservations) }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange("reservations", i + 1)}
                              className={`px-4 py-2 rounded-lg ${
                                reservationPage === i + 1
                                  ? "bg-blue-700 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange("reservations", reservationPage + 1)}
                            disabled={reservationPage === getTotalPages(busReservations)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingManagement;