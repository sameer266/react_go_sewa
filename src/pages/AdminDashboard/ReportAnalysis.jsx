import React, { useState, useEffect } from "react";
import { AdminReportlist } from "../../api/adminApi";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const ReportAnalysis = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await AdminReportlist();
      
      if (response.success) {
        setReportData(response);
      } else {
        setError("Failed to load report data");
      }
    } catch (error) {
      setError("Error connecting to server");
      console.error("Failed to fetch report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow text-center">
          <p className="text-red-600 text-lg mb-2">❌ {error}</p>
          <button 
            onClick={fetchReportData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const monthlyData = [{
    month: reportData.month,
    revenue: reportData.monthly_revenue,
    commission: reportData.monthly_commission,
  }];

  const bookingsData = [{
    month: reportData.month,
    bookings: reportData.monthly_bookings,
    cancellations: reportData.monthly_canceled,
  }];

  const topBusesData = reportData.top_buses.map(bus => ({
    name: bus.bus_number,
    bookings: bus.total_bookings,
  }));

  const topCustomersData = reportData.top_customers.map(customer => ({
    name: customer.customer,
    value: customer.total_bookings,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="flex h-screen overflow-hidden">
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
          <div className="max-w-6xl mx-auto">
            <header className="mb-10 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard Analytics</h1>
              <p className="text-gray-600 text-sm md:text-base">Monthly performance overview for {reportData.month}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
              {/* Revenue & Commission Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    Revenue & Commission
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Monthly financial performance</p>
                  <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">₹{reportData.monthly_revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Commission</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">₹{reportData.monthly_commission.toLocaleString()}</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: "8px" }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Revenue (₹)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="commission"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        name="Commission (₹)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bookings & Cancellations Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    Bookings & Cancellations
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Monthly booking metrics</p>
                  <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total Bookings</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{reportData.monthly_bookings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Cancellations</p>
                      <p className="text-xl md:text-2xl font-bold text-red-500">{reportData.monthly_canceled}</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: "8px" }} />
                      <Legend />
                      <Bar 
                        dataKey="bookings" 
                        fill="#3B82F6" 
                        name="Bookings" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="cancellations" 
                        fill="#EF4444" 
                        name="Cancellations" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Top Performing Buses Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    Top Performing Buses
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Buses with highest booking counts</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={topBusesData}
                      layout="vertical"
                      margin={{ left: 50, right: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: "8px" }} />
                      <Bar 
                        dataKey="bookings" 
                        fill="#0088FE" 
                        name="Total Bookings" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Customers Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                    Active Customers (Top 5)
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">Most frequent customers by booking volume</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topCustomersData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {topCustomersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} bookings`, "Total"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;