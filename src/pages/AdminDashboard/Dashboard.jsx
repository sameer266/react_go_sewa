import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users,
  Bus,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Calendar,
  Sliders,
  ChevronDown,
  Bell,
  Ticket,
} from 'lucide-react';
import Sidebar from '../../components/SideBar';
import Loader from '../../components/Loader';
import { AdminDashboardApi } from '../../api/adminApi';

import { MenuLinks } from './Link';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user || 'Admin');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminDashboardApi();
        if (response?.success) {
          setDashboardData(response);
        } else {
          throw new Error(response?.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const alertNotifications = [
    { id: 1, message: 'Bus-101 is running 15 minutes late on route Kathmandu to Pokhara', time: '15 minutes ago', type: 'warning' },
    { id: 2, message: 'New support ticket from customer Jane Smith regarding refund', time: '1 hour ago', type: 'support' },
    { id: 3, message: 'Bus-305 needs maintenance after current trip', time: '2 hours ago', type: 'maintenance' },
  ];

  const stats = dashboardData
    ? [
        { title: 'Total Users', value: dashboardData.data.total_user || 0, icon: <Users size={20} />, color: 'bg-blue-500' },
        { title: 'Active Buses', value: dashboardData.data.total_active_bus || 0, icon: <Bus size={20} />, color: 'bg-green-500' },
        { title: 'Today\'s Revenue', value: `NPR ${dashboardData.data.total_revenue?.toFixed(2) || '0.00'}`, icon: <CreditCard size={20} />, color: 'bg-purple-500' },
        { title: 'Pending Bookings', value: dashboardData.data.total_booking_pending || 0, icon: <Clock size={20} />, color: 'bg-yellow-500' },
        { title: 'Completed Trips', value: dashboardData.data.total_trip_completed || 0, icon: <CheckCircle size={20} />, color: 'bg-indigo-500' },
        { title: 'Ticket Sales', value: dashboardData.data.ticket_booked || 0, icon: <Ticket size={20} />, color: 'bg-pink-500' },
      ]
    : [];

  const recentBookings = dashboardData?.recent_booking?.map((booking) => ({
    id: `B-${booking.id}`,
    customer: booking.user?.full_name || 'Unknown',
    route: booking.schedule?.route ? `${booking.schedule.route.source} to ${booking.schedule.route.destination}` : 'N/A',
    date: booking.booked_at
      ? new Date(booking.booked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'N/A',
    status: booking.paid ? 'Confirmed' : 'Pending',
    amount: booking.schedule?.price ? `NPR ${booking.schedule.price}` : 'N/A',
  })) || [];

  const activeTrips = dashboardData?.trip_data?.map((trip) => {
    const relatedBooking = dashboardData.recent_booking?.find((b) => b.schedule?.bus?.id === trip.bus);
    const route = relatedBooking?.schedule?.route || { source: 'Unknown', destination: 'Unknown' };
    return {
      id: `T-${trip.id}`,
      route: `${route.source} to ${route.destination}`,
      departure: trip.scheduled_departure
        ? new Date(trip.scheduled_departure).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : 'N/A',
      arrival: trip.scheduled_arrival
        ? new Date(trip.scheduled_arrival).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : 'N/A',
      bus: trip.bus ? `Bus-${trip.bus}` : 'N/A',
      status: trip.status === 'on_time' ? 'On Time' : 'Delayed',
    };
  }) || [];

  if (loading) return <Loader />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!dashboardData) return <div className="flex justify-center items-center min-h-screen text-gray-500">No data available</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen mt-20 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} menuLink={MenuLinks || []} />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-4 md:p-6 overflow-x-hidden max-w-[calc(100vw-5rem)] md:max-w-[calc(100vw-16rem)]`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 md:p-6 rounded-lg mb-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-full">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user}!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto flex-wrap">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search bookings, trips..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0">
                <Calendar size={18} />
                <span className="hidden sm:inline">Today</span>
                <ChevronDown size={16} />
              </button>
              <button className="relative p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {alertNotifications.length}
                </span>
              </button>
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0">
                <Sliders size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 w-full">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center hover:shadow-md transition-shadow duration-300 w-full"
            >
              <div className={`${stat.color} p-3 rounded-lg text-white mr-4 shrink-0`}>{stat.icon}</div>
              <div className="overflow-hidden">
                <h3 className="text-gray-500 text-sm truncate">{stat.title}</h3>
                <p className="text-xl font-bold text-gray-800 truncate">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Bookings */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-4 mb-6 w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/booking-management" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[60px] sm:min-w-[80px]">ID</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[120px]">Customer</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px] sm:min-w-[150px]">Route</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Date</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Status</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 text-sm font-medium text-gray-900 truncate">{booking.id}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{booking.customer}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{booking.route}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{booking.date}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No recent bookings available</div>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 w-full overflow-x-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
            <button className="text-blue-600 hover:underline text-sm">Mark All Read</button>
          </div>
          <div className="space-y-4">
            {alertNotifications.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      alert.type === 'warning' ? 'bg-yellow-100' : alert.type === 'support' ? 'bg-blue-100' : 'bg-red-100'
                    }`}
                  >
                    <AlertTriangle
                      size={16}
                      className={
                        alert.type === 'warning' ? 'text-yellow-500' : alert.type === 'support' ? 'text-blue-500' : 'text-red-500'
                      }
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm text-gray-700 truncate">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Trips */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6 w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Active Trips</h2>
            <Link to="/trip-management" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {activeTrips.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[60px] sm:min-w-[80px]">Trip ID</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px] sm:min-w-[150px]">Route</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Departure</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Arrival</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Bus</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[80px] sm:min-w-[100px]">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 text-sm font-medium text-gray-900 truncate">{trip.id}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{trip.route}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{trip.departure}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{trip.arrival}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-500 truncate">{trip.bus}</td>
                      <td className="px-2 sm:px-4 py-3 text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                            trip.status === 'On Time' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No active trips available</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;