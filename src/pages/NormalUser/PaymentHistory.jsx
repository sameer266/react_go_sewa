import React, { useEffect, useState } from 'react';
import { UserPaymentHistoryApi } from '../../api/userApi';
import Loader from '../../components/Loader';

function PaymentHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserPaymentHistoryApi();
        if (response?.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="p-4 mt-20 mb-16">
      <h2 className="text-2xl font-bold text-center mb-4">Payment History</h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">No payment history found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Bus</th>
              <th className="border border-gray-300 px-4 py-2">Route</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Commission</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.user.full_name} ({item.user.phone})
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.schedule.bus.bus_number}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.schedule.route.source} → {item.schedule.route.destination}
                </td>
                <td className="border border-gray-300 px-4 py-2">NRs. {item.price}</td>
                <td className="border border-gray-300 px-4 py-2">NRs. {item.commission_deducted}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentHistory;
