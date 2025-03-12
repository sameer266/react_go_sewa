import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import { 
  Users, 
  Bus, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Calendar,
  Sliders,
  ChevronDown,
  Bell,
  Ticket
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Sample data for dashboard
  const stats = [
    { title: 'Total Users', value: '5,628', icon: <Users size={20} />, color: 'bg-blue-500' },
    { title: 'Active Buses', value: '124', icon: <Bus size={20} />, color: 'bg-green-500' },
    { title: 'Today\'s Revenue', value: '$12,456', icon: <CreditCard size={20} />, color: 'bg-purple-500' },
    { title: 'Pending Bookings', value: '28', icon: <Clock size={20} />, color: 'bg-yellow-500' },
    { title: 'Completed Trips', value: '684', icon: <CheckCircle size={20} />, color: 'bg-indigo-500' },
    { title: 'Ticket Sales', value: '1,267', icon: <Ticket size={20} />, color: 'bg-pink-500' },
  ];

  const recentBookings = [
    { id: 'B-7891', customer: 'John Doe', route: 'New York to Boston', date: '12 Mar 2025', status: 'Confirmed', amount: '$45.00' },
    { id: 'B-7892', customer: 'Jane Smith', route: 'Chicago to Detroit', date: '12 Mar 2025', status: 'Pending', amount: '$38.00' },
    { id: 'B-7893', customer: 'Robert Johnson', route: 'Los Angeles to San Diego', date: '11 Mar 2025', status: 'Confirmed', amount: '$42.00' },
    { id: 'B-7894', customer: 'Emily Wilson', route: 'Dallas to Houston', date: '11 Mar 2025', status: 'Canceled', amount: '$35.00' },
    { id: 'B-7895', customer: 'Michael Brown', route: 'Seattle to Portland', date: '10 Mar 2025', status: 'Confirmed', amount: '$50.00' },
  ];

  const activeTrips = [
    { id: 'T-4501', route: 'New York to Boston', departure: '08:00 AM', arrival: '12:30 PM', bus: 'Bus-101', booked: '42/48', status: 'On Time' },
    { id: 'T-4502', route: 'Chicago to Detroit', departure: '09:15 AM', arrival: '01:45 PM', bus: 'Bus-234', booked: '38/48', status: 'Delayed' },
    { id: 'T-4503', route: 'Los Angeles to San Diego', departure: '10:30 AM', arrival: '12:45 PM', bus: 'Bus-305', booked: '36/42', status: 'On Time' },
  ];

  const alertNotifications = [
    { id: 1, message: 'Bus-101 is running 15 minutes late on route New York to Boston', time: '15 minutes ago', type: 'warning' },
    { id: 2, message: 'New support ticket from customer Jane Smith regarding refund', time: '1 hour ago', type: 'support' },
    { id: 3, message: 'Bus-305 needs maintenance after current trip', time: '2 hours ago', type: 'maintenance' },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} flex-1`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Welcome back, Admin User</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              {/* Date Picker */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar size={18} />
                <span>Today</span>
                <ChevronDown size={16} />
              </button>
              
              {/* Notification */}
              <div className="relative">
                <button className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                </button>
              </div>
              
              {/* Filter */}
              <button className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50">
                <Sliders size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <div className={`${stat.color} p-4 rounded-lg mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Booking ID</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Route</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{booking.id}</td>
                        <td className="py-3 px-4">{booking.customer}</td>
                        <td className="py-3 px-4">{booking.route}</td>
                        <td className="py-3 px-4">{booking.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Alerts & Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Alerts & Notifications</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
              </div>
              
              <div className="space-y-4">
                {alertNotifications.map((alert) => (
                  <div key={alert.id} className="border-l-4 p-4 rounded-r-lg bg-gray-50 flex items-start gap-3
                    ${alert.type === 'warning' ? 'border-yellow-500' : 
                      alert.type === 'support' ? 'border-blue-500' : 'border-orange-500'}">
                    <div className={`p-2 rounded-full 
                      ${alert.type === 'warning' ? 'bg-yellow-100 text-yellow-500' : 
                        alert.type === 'support' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500'}`}>
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="text-gray-800">{alert.message}</p>
                      <p className="text-gray-500 text-sm">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Active Trips */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Active Trips</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Trips</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Trip ID</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Route</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Departure</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Arrival</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Bus</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Booked Seats</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTrips.map((trip, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{trip.id}</td>
                      <td className="py-3 px-4">{trip.route}</td>
                      <td className="py-3 px-4">{trip.departure}</td>
                      <td className="py-3 px-4">{trip.arrival}</td>
                      <td className="py-3 px-4">{trip.bus}</td>
                      <td className="py-3 px-4">{trip.booked}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${trip.status === 'On Time' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">View</button>
                          <button className="p-1 text-yellow-600 hover:text-yellow-800">Update</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="bg-blue-600 rounded-xl shadow-sm p-6 text-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-700 transition-colors">
              <Ticket size={28} className="mb-3" />
              <h3 className="font-bold text-lg">Ticket Counter</h3>
              <p className="text-blue-100 mt-1">Issue tickets quickly</p>
            </div>
            <div className="bg-green-600 rounded-xl shadow-sm p-6 text-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-700 transition-colors">
              <Bus size={28} className="mb-3" />
              <h3 className="font-bold text-lg">Add New Bus</h3>
              <p className="text-green-100 mt-1">Register a new vehicle</p>
            </div>
            <div className="bg-purple-600 rounded-xl shadow-sm p-6 text-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-700 transition-colors">
              <Users size={28} className="mb-3" />
              <h3 className="font-bold text-lg">Add User</h3>
              <p className="text-purple-100 mt-1">Create new account</p>
            </div>
            <div className="bg-indigo-600 rounded-xl shadow-sm p-6 text-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-700 transition-colors">
              <TrendingUp size={28} className="mb-3" />
              <h3 className="font-bold text-lg">View Reports</h3>
              <p className="text-indigo-100 mt-1">Analytics & statistics</p>
            </div>
          </div>
        </main>
        
      
      </div>
    </div>
  );
};

export default Dashboard;