import React, { useEffect, useState } from 'react';
import { FaBus, FaWifi, FaPlug, FaSnowflake, FaFan } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AllScheduleApi } from '../../api/homeApi';
import Loader from '../../components/Loader';
export default function BookingTicket() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await AllScheduleApi();
        if (response.success) {
          setSchedules(response.data.map(item => ({
            id: item.id,
            from: item.route.source,
            to: item.route.destination,
            duration: formatTime(item.route.estimated_time),
            price: parseFloat(item.price),
            bus_id: item.bus.id,
            image: `http://127.0.0.1:8000${item.bus.bus_image}`,
            amenities: item.bus.features,
          })));
        } else {
          setError('Failed to load schedules');
        }
      } catch (err) {
        setError('Error fetching schedules: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Loader/>
      
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center p-4 bg-white rounded-lg shadow-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
        Bus Schedules
      </h2>

      {schedules.length === 0 ? (
        <div className="text-center text-gray-600">No routes available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((route) => (
            <div 
              key={route.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-lg"
            >
              {/* Bus Image */}
              <div className="relative">
                <img
                  src={route.image}
                  alt="Bus"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <FaBus className="text-xs" /> <span>{route.duration}</span>
                </div>
              </div>

              {/* Route Details */}
              <div className="p-3">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {route.from} → {route.to}
                </h3>

                {/* Amenities */}
                <div className="flex items-center gap-2 mb-3 text-green-700">
                  {route.amenities.includes('wifi') && <FaWifi className="text-base" title="WiFi" />}
                  {route.amenities.includes('charging') && <FaPlug className="text-base" title="Charging Points" />}
                  {route.amenities.includes('ac') && <FaSnowflake className="text-base" title="Air Conditioning" />}
                  {route.amenities.includes('fan') && <FaFan className="text-base" title="Fan" />}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-green-700">NPR {route.price}</span>
                  <Link to={`/select-seat/${route.bus_id}`}>
                    <button className="px-3 py-1 text-sm bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}