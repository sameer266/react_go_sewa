import React, { useEffect, useState } from 'react';
import { Bus, Clock, Wifi, Plug, Snowflake, Fan } from 'lucide-react'; // Lucide React icons
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AllScheduleApi } from '../api/homeApi';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });

    const fetchSchedules = async () => {
      try {
        const response = await AllScheduleApi();
        if (response.success) {
          setSchedules(
            response.data.map((item) => ({
              id: item.id,
              from: item.route.source,
              to: item.route.destination,
              duration: formatTime(item.route.estimated_time),
              price: parseFloat(item.price),
              bus_id: item.bus.id,
              image: `http://127.0.0.1:8000${item.bus.bus_image}`,
              amenities: item.bus.features,
            }))
          );
        } else {
          setError('Failed to load schedules');
        }
      } catch (err) {
        setError('Error fetching schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return `${hour}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 mt-20 mb-16">
      {/* Hero Section */}
      <div
        className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg mx-4 mb-8"
        data-aos="fade-in"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Bus Schedules</h1>
        <p className="text-lg md:text-xl">Explore available routes and book your trip</p>
      </div>

      {/* Schedule List */}
      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-500 text-lg" data-aos="fade-in">
            {error}
          </p>
        ) : schedules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                data-aos="fade-up"
              >
                <img
                  src={route.image}
                  alt="Bus"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {route.from} → {route.to}
                  </h3>
                  <p className="flex items-center text-gray-600 mb-3">
                    <Clock className="mr-2 h-4 w-4" /> {route.duration}
                  </p>
                  <div className="flex gap-3 text-gray-500 mb-3">
                    {route.amenities.includes('wifi') && <Wifi className="h-4 w-4" />}
                    {route.amenities.includes('charging') && <Plug className="h-4 w-4" />}
                    {route.amenities.includes('ac') && <Snowflake className="h-4 w-4" />}
                    {route.amenities.includes('fan') && <Fan className="h-4 w-4" />}
                  </div>
                  <div className="flex justify-between items-center mt-auto border-t pt-3">
                    <span className="text-green-600 font-bold">
                      NPR {route.price.toLocaleString()}
                    </span>
                    <Link to={`/select-seat/${route.bus_id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        Book
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg" data-aos="fade-in">
            No schedules available
          </p>
        )}
      </div>
    </div>
  );
}