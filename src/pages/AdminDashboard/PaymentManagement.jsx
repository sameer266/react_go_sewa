import React, { useState, useEffect } from "react";
import { AdminPaymentListApi, AdminRateUpdateApi } from "../../api/adminApi";
import { toast, Toaster } from "react-hot-toast";
import { Edit, Save, XCircle, DollarSign, Bus, Users, Calendar } from "lucide-react";
import Sidebar from '../../components/SideBar';
import { MenuLinks } from './Link';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [rate, setRate] = useState({ id: "", rate: "" });
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [commissionPage, setCommissionPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await AdminPaymentListApi();
    if (response?.success) {
      setPayments(response.payment_data || []);
      setCommissions(response.commission_data || []);
      setRate(response.rate_data || { rate: "" });
    } else {
      toast.error("Failed to load data");
    }
  };

  const handleRateUpdate = async () => {
    if (!rate.rate || parseFloat(rate.rate) < 0) {
      toast.error("Enter a valid commission rate");
      return;
    }
    const response = await AdminRateUpdateApi(rate.id, { rate: rate.rate });
    if (response?.success) {
      toast.success("Rate updated successfully");
      setIsEditingRate(false);
    } else {
      toast.error("Rate update failed");
    }
  };

  const getBusInfo = (busId) => {
    const commission = commissions.find((item) => item.bus?.id === busId);
    return commission?.bus || { bus_number: "N/A", route: { source: "N/A", destination: "N/A" } };
  };

  // Pagination
  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const paymentTotalPages = Math.ceil(payments.length / itemsPerPage);
  const commissionTotalPages = Math.ceil(commissions.length / itemsPerPage);

  const currentPayments = paginate(payments, paymentPage);
  const currentCommissions = paginate(commissions, commissionPage);

  return (
    <>
      <Toaster />
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
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <DollarSign className="text-green-600" /> Payment Management
              </h1>

              {/* Commission Rate Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Commission Rate</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {isEditingRate ? (
                    <>
                      <input
                        type="number"
                        value={rate.rate}
                        onChange={(e) => setRate({ ...rate, rate: e.target.value })}
                        className="p-2 border border-gray-300 rounded-lg w-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        placeholder="Rate"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleRateUpdate}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                        >
                          <Save size={18} /> Save
                        </button>
                        <button
                          onClick={() => setIsEditingRate(false)}
                          className="flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                        >
                          <XCircle size={18} /> Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-medium text-gray-800">{rate.rate ? `${rate.rate}%` : "Not Set"}</span>
                      <button
                        onClick={() => setIsEditingRate(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                      >
                        <Edit size={18} /> Edit Rate
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Data Table */}
              <div className="bg-white rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-700 p-6 border-b border-gray-200">Payment History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        {["Payment ID", "User", "Bus", "Route", "Price (NPR)", "Commission (NPR)", "Date"].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentPayments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No payments found</td>
                        </tr>
                      ) : (
                        currentPayments.map((payment) => {
                          const bus = getBusInfo(payment.bus);
                          return (
                            <tr key={payment.id} className="border-b hover:bg-gray-50 transition-all">
                              <td className="px-6 py-4">#{payment.id}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Users className="text-green-600" size={18} />
                                  <div>
                                    <span className="font-medium text-gray-800">{payment.user.full_name}</span>
                                    <p className="text-sm text-gray-500">{payment.user.email || "N/A"}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Bus className="text-green-600" size={18} />
                                  <span>{bus.bus_number}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">{bus.route.source} → {bus.route.destination}</td>
                              <td className="px-6 py-4 text-green-600 font-medium">NPR {payment.price}</td>
                              <td className="px-6 py-4 text-green-600 font-medium">NPR {payment.commission_deducted}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="text-green-600" size={18} />
                                  {new Date(payment.created_at).toLocaleDateString()}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {paymentTotalPages > 1 && (
                  <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={() => setPaymentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={paymentPage === 1}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50 hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">Page {paymentPage} of {paymentTotalPages}</span>
                    <button
                      onClick={() => setPaymentPage((prev) => Math.min(prev + 1, paymentTotalPages))}
                      disabled={paymentPage === paymentTotalPages}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50 hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Commission Data Table */}
              <div className="bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 p-6 border-b border-gray-200">Commission Overview</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        {["Type", "Bus", "Route", "Earnings (NPR)", "Commission (NPR)", "Reservations"].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentCommissions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No commissions found</td>
                        </tr>
                      ) : (
                        currentCommissions.map((commission) => (
                          <tr key={commission.id} className="border-b hover:bg-gray-50 transition-all">
                            <td className="px-6 py-4 capitalize">{commission.commission_type}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Bus className="text-green-600" size={18} />
                                {commission.bus ? commission.bus.bus_number : "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {commission.bus ? `${commission.bus.route.source} → ${commission.bus.route.destination}` : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-green-600 font-medium">NPR {commission.total_earnings}</td>
                            <td className="px-6 py-4 text-green-600 font-medium">NPR {commission.total_commission}</td>
                            <td className="px-6 py-4">{commission.bus_reserve || "N/A"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {commissionTotalPages > 1 && (
                  <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={() => setCommissionPage((prev) => Math.max(prev - 1, 1))}
                      disabled={commissionPage === 1}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50 hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">Page {commissionPage} of {commissionTotalPages}</span>
                    <button
                      onClick={() => setCommissionPage((prev) => Math.min(prev + 1, commissionTotalPages))}
                      disabled={commissionPage === commissionTotalPages}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50 hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentManagement;