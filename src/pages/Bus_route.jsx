import React, { useEffect, useState } from 'react';
import { AllRoutesBusesListApi } from '../api/homeApi';
import { useParams, useNavigate } from 'react-router-dom';
import { Bus, Clock, Users, Zap, Snowflake, MapPin } from 'lucide-react';
import Loader from '../components/Loader';
function BusRoute() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: route_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AllRoutesBusesListApi(route_id);
        setBuses(response?.success ? response.data : []);
        setError(response?.success ? null : 'Failed to fetch bus data');
      } catch {
        setError('An error occurred');
      }
      setLoading(false);
    };
    fetchData();
  }, [route_id]);

  const handleSelectSeat = (busId) => navigate(`/select-seat/${busId}`);

  if (loading) return <div><Loader/></div>;
  if (error) return <div className="mt-24 text-center text-red-500">{error}</div>;
  if (!buses.length) return <div className="mt-24 text-center text-gray-500">No buses available</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-20 mb-20">
      <h2 className="text-xl font-semibold text-center mb-4 flex justify-center">
        <Bus className="mr-2 w-5 h-5" /> Buses
      </h2>
      <div className="space-y-3">
        {buses.map((bus) => (
          <div key={bus.id} className="p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {bus.bus.bus_image && (
                  <img
                    src={`http://127.0.0.1:8000/${bus.bus.bus_image}`}
                    alt={bus.bus.bus_number}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{bus.bus.bus_number}</p>
                  <p className="text-xs text-gray-500">{bus.bus.bus_type.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-green-500" />
                    {bus.route.source} → {bus.route.destination}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1 text-yellow-500" />
                  {new Date(bus.departure_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} -
                  {new Date(bus.arrival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-gray-600">
                  <Users className="w-4 h-4 inline mr-1 text-purple-500" />
                  {bus.bus.available_seats}/{bus.bus.total_seats}
                </div>
                <div className="font-semibold text-green-600">NPR {bus.price}</div>
                <button
                  onClick={() => handleSelectSeat(bus.bus.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                >
                  Book
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {bus.bus.features.map((feature, i) => (
                <span key={i} className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700">
                  {feature === 'ac' ? <Snowflake className="w-3 h-3 text-blue-500" /> : <Zap className="w-3 h-3 text-yellow-500" />}
                  {feature.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusRoute;