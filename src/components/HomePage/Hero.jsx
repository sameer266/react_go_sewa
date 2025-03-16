import React, { useState, useEffect } from "react";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { Calendar, MapPin, Search } from "lucide-react";
import MainImg from "../../assets/home-image/main.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../style/home/hero.css"; // Keeping CSS unchanged
import { AllRoutesApi, FilterSchedule } from "../../api/homeApi";

export default function Hero() {
  const [date, setDate] = useState(new BSDate().now());
  const [routes, setRoutes] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchAllRoutes = async () => {
      const response = await AllRoutesApi();
      if (response?.success) {
        setRoutes(response.data);
      }
    };
    fetchAllRoutes();
  }, []);

  const handleSearch = async () => {
    setError("");
    if (!source || !destination || !date) {
      setError("Please select source, destination, and departure date.");
      return;
    }
  
    try {
      const response = await FilterSchedule(source, destination, date);
      if (response?.success) {
        setSchedules(response.data);
      } else {
        setError(response.error || "No buses found for the selected route.");
        setSchedules([]);
      }
    } catch (error) {
      setError("An error occurred while fetching schedules.");
      console.error("Error fetching schedules:", error);
    }
  };
  
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src={MainImg} alt="Bus travel" className="hero-image" />
      </div>

      <div className="hero-content">
        <div className="hero-heading" data-aos="fade-down">
          <h1>Book Your Bus Tickets with Go Sewa</h1>
          <p>Fast, secure, and convenient travel across the country</p>
        </div>

        <div className="search-card" data-aos="fade-up">
          <div className="search-form">
            <div className="search-grid">
              <div className="search-field">
                <label>From</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" />
                  <select value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="">Select Departure</option>
                    {routes.map((route, index) => (
                      <option key={index} value={route.source}>
                        {route.source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-field">
                <label>To</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" />
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select Destination</option>
                    {routes.map((route, index) => (
                      <option key={index} value={route.destination}>
                        {route.destination}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-field date-field">
                <label>Departure Date</label>
                <div className="input-wrapper date-wrapper">
                  <Calendar className="input-icon" />
                  <NepaliDatePicker
                    value={date}
                    format="YYYY-MM-DD"
                    onChange={setDate}
                    inputClassName="date-picker"
                    className="nepali-datepicker"
                  />
                </div>
              </div>
            </div>

            <button className="search-button" onClick={handleSearch}>
              <Search className="button-icon" /> Search Buses
            </button>

            {/* Enhanced Error Message with Tailwind */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Search Results with Tailwind */}
        <div className="search-results mt-6">
          {schedules.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {schedule.bus_name}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Departure:</span>{" "}
                      {schedule.departure_time}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Seats Available:</span>{" "}
                      <span className={schedule.available_seats > 0 ? "text-green-600" : "text-red-600"}>
                        {schedule.available_seats}
                      </span>
                    </p>
                  </div>
                  <button className="mt-3 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !error && (
              <div className="text-center py-6 px-7 bg-gray-100 rounded-md">
                <p className="text-gray-500 text-sm">
                  No buses available for the selected route.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}