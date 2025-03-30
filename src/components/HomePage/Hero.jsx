import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, MapPin, Search, Bus, AlertTriangle, ChevronRight } from 'lucide-react';
import MainImg from '../../assets/home-image/main.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

import { FilterSchedule,AllRoutesApi } from '../../api/homeApi';

const Hero = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [routes, setRoutes] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoize unique sources and destinations
  const { uniqueSources, uniqueDestinations } = useMemo(() => {
    const sources = new Set(routes.map(route => route.source));
    const destinations = new Set(routes.map(route => route.destination));
    return {
      uniqueSources: Array.from(sources),
      uniqueDestinations: Array.from(destinations)
    };
  }, [routes]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await AllRoutesApi();
        if (response?.success) {
          setRoutes(response.data);
        } else {
          setError('Failed to fetch routes.');
        }
      } catch (err) {
        setError('Error fetching routes.');
        console.error('Routes fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleSearch = useCallback(async () => {
    setError('');
    if (!source || !destination || !date) {
      setError('Please select source, destination, and date.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      setError('Cannot search for past dates.');
      return;
    }

    try {
      setLoading(true);
      const response = await FilterSchedule(source, destination, date);
      if (response?.success && response.data.length) {
        setSchedules(response.data);
      } else {
        setError(response?.error || 'No buses found.');
        setSchedules([]);
      }
    } catch (err) {
      setError('Error fetching schedules.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [source, destination, date]);

  return (
    <div className="relative min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={MainImg}
          alt="Hero Background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center text-white mb-12" data-aos="fade-up">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight mt-10">
              Your Journey, <span className="text-green-400">Our Priority</span>
            </h1>
          <p className="text-lg md:text-xl opacity-90">
            Travel comfortably with our premium bus service
          </p>
        </div>

        {/* Search Form */}
        <div 
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 hover:shadow-3xl"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Source */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Source</option>
                  {uniqueSources.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Destination</option>
                  {uniqueDestinations.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <div className="relative flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Buses
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {schedules.length > 0 && (
          <div 
            className="max-w-4xl mx-auto mt-8"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Available Buses</h2>
                <div className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-all duration-200"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{schedule.bus.bus_type}</h3>
                          <p className="text-sm text-gray-600">
                            {schedule.bus.bus_number}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {schedule.bus.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            NPR {schedule.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {schedule.bus.available_seats} seats available
                          </p>
                          <Link
                            to={`/select-seat/${schedule.bus.id}`}
                            className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700"
                          >
                            Select Seats
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Hero);