import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users,
  Bus,
  CreditCard,
  Clock,
  CheckCircle,
  Search,
  Calendar,
  Sliders,
  ChevronDown,
  Bell,
  Ticket,
  Star,
} from 'lucide-react';
import Sidebar from '../../components/SideBar';
import Loader from '../../components/Loader';
import { UserDashboardAPi } from '../../api/userApi';
import { ResetPasswordApi } from '../../api/homeApi';
import { MenuLinks } from '../AdminDashboard/Link';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user || 'Admin');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserDashboardAPi();
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

  // Format stats data based on the new JSON structure
  const stats = dashboardData?.data
    ? [
        { title: 'Total Bookings', value: dashboardData.data.total_booking || 0, icon: <Ticket size={20} />, color: 'bg-blue-500' },
        { title: 'Total Reviews', value: dashboardData.data.total_reviews || 0, icon: <Star size={20} />, color: 'bg-green-500' },
        { title: 'Reservations', value: dashboardData.data.total_reservation || 0, icon: <Bus size={20} />, color: 'bg-purple-500' },
        { title: 'Total Payment', value: `NPR ${dashboardData.data.total_payment?.toFixed(2) || '0.00'}`, icon: <CreditCard size={20} />, color: 'bg-yellow-500' },
      ]
    : [];

  // Format recent bookings data
  const recentBookings = dashboardData?.recent_booking?.map((booking) => ({
    id: `B-${booking.id}`,
    customer: booking.user?.full_name || 'Unknown',
    route: booking.schedule?.route ? `${booking.schedule.route.source} to ${booking.schedule.route.destination}` : 'N/A',
    date: booking.booked_at
      ? new Date(booking.booked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'N/A',
    status: booking.booking_status,
    amount: booking.schedule?.price ? `NPR ${booking.schedule.price}` : 'N/A',
    seats: booking.seat?.join(', ') || 'N/A',
  })) || [];

  // Format recent reviews data
  const recentReviews = dashboardData?.recent_reviews?.map((review) => ({
    id: `R-${review.id}`,
    customer: review.user?.full_name || 'Unknown',
    route: review.route ? `${review.route.source} to ${review.route.destination}` : 'N/A',
    rating: review.rating || 0,
    comment: review.comment || 'No comment',
    date: review.created_at
      ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'N/A',
    bus: review.bus?.bus_number || 'N/A',
  })) || [];

  if (loading) return <Loader />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!dashboardData) return <div className="flex justify-center items-center min-h-screen text-gray-500">No data available</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen mt-20">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} menuLink={MenuLinks || []} />

      <main className={`flex-1 transition-all duration-300 w-full ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-4 md:p-6`}>
        <header className="bg-white shadow-sm p-4 md:p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800"> Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user}!</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search bookings, reviews..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar size={18} />
                <span className="hidden sm:inline">Today</span>
                <ChevronDown size={16} />
              </button>
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Bell size={20} />
              </button>
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Sliders size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center hover:shadow-md transition-shadow duration-300"
            >
              <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>{stat.icon}</div>
              <div>
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Bookings */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/booking-management" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{booking.customer}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{booking.route}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{booking.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{booking.seats}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No recent bookings available</div>
          )}
        </section>

        {/* Recent Reviews */}
        <section className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Reviews</h2>
            <Link to="/review-management" className="text-blue-600 hover:underline text-sm">
              View All
            </Link

>
          </div>
          {recentReviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{review.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{review.customer}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{review.route}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{review.bus}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{review.comment}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{review.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No recent reviews available</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;