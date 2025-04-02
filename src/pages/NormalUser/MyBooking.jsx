import React, { useEffect, useState } from 'react';
import { UserBookingsApi } from '../../api/userApi';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Bus, 
  Calendar, 
  Ticket, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Loader from '../../components/Loader';
import { MenuLinks } from '../AdminDashboard/Link';
import { Sidebar } from 'lucide-react';

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'booked_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed,setSidebarCollapsed] =useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await UserBookingsApi();
        if (response?.success) {
          const allBookings = [
            ...response.booking_seat.map(b => ({ ...b, type: 'seat' })),
            ...response.booking_reserve.map(b => ({ ...b, type: 'reserve' }))
          ];
          setBookings(allBookings);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = React.useMemo(() => {
    let sortableBookings = [...bookings];
    if (sortConfig.key) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  const filteredBookings = sortedBookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.booking_status?.toLowerCase() === filter || 
           booking.status?.toLowerCase() === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case 'booked':
        return <span className={`${baseStyle} bg-green-100 text-green-800`}><CheckCircle className="w-4 h-4 mr-1" /> {status}</span>;
      case 'pending':
        return <span className={`${baseStyle} bg-yellow-100 text-yellow-800`}><Clock className="w-4 h-4 mr-1" /> {status}</span>;
      case 'cancelled':
        return <span className={`${baseStyle} bg-red-100 text-red-800`}><XCircle className="w-4 h-4 mr-1" /> {status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>{status || 'Unknown'}</span>;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'seat' ? <Ticket className="w-5 h-5 text-blue-600" /> : <Bus className="w-5 h-5 text-green-600" />;
  };

  if (loading) return <Loader />;
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <p className="text-red-500 mb-4 text-lg">Error: {error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20 mb-16">

      <Sidebar  
      collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              menuLink={MenuLinks || []}
              className="fixed h-full transition-all duration-300"
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Ticket className="w-8 h-8 text-indigo-600" />
          My Bookings
        </h1>
        
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
          >
            <option value="all">All Bookings</option>
            <option value="booked">Booked</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Filter className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12">Type</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('booked_at')}
                >
                  <div className="flex items-center gap-2">
                    Date & Time
                    {sortConfig.key === 'booked_at' && (
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        sortConfig.direction === 'asc' ? 'rotate-90' : '-rotate-90'
                      }`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('booking_status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortConfig.key === 'booking_status' && (
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        sortConfig.direction === 'asc' ? 'rotate-90' : '-rotate-90'
                      }`} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{getTypeIcon(booking.type)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {new Date(booking.booked_at || booking.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(booking.booked_at || booking.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.type === 'seat' ? (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Bus className="w-4 h-4 text-gray-500" />
                          {booking.schedule?.route?.source} 
                          <ArrowRight className="w-4 h-4" /> 
                          {booking.schedule?.route?.destination}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Bus className="w-4 h-4 text-gray-500" />
                          {booking.source} 
                          <ArrowRight className="w-4 h-4" /> 
                          {booking.destination}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {booking.type === 'seat' ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.schedule?.date).toLocaleDateString()} | 
                            {booking.schedule?.departure_time?.split('T')[1].substring(0, 5)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Ticket className="w-4 h-4" />
                            Seats: {booking.seat?.join(', ')} | Price: Rs. {booking.schedule?.price}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.start_date).toLocaleDateString()} | 
                          Duration: {booking.date} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.booking_status || booking.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No bookings found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredBookings.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} 
            of {filteredBookings.length} bookings
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === page 
                      ? 'bg-indigo-600 text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;