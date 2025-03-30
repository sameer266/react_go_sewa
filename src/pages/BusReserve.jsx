import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { AllVechicleTypeList, VechicleList } from "../api/homeApi";
import Loader from "../components/Loader";
import { Wifi, Plug, Snowflake, Fan, Filter } from "lucide-react";

const BusReserve = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Fetch vehicle types
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const typeResponse = await AllVechicleTypeList();
        if (typeResponse.success) {
          setVehicleTypes(typeResponse.data);
        } else {
          setError("Failed to fetch vehicle types");
        }
      } catch (error) {
        setError("An error occurred while fetching vehicle types");
      }
    };

    fetchVehicleTypes();
  }, []);

  // Fetch buses based on selected vehicle type
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const busResponse = await VechicleList(selectedType || null);
        if (busResponse.success) {
          setBuses(busResponse.data);
        } else {
          setError("Failed to fetch buses");
        }
      } catch (error) {
        setError("An error occurred while fetching buses");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [selectedType]);

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 " style={{marginTop:"90px",marginBottom:"80px"}}>
      <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
        Available Buses
      </h2>

      {/* Vehicle Type Filter */}
      <div className="flex justify-center mb-8" data-aos="fade-up">
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
          <Filter className="text-green-600" size={24} />
          <div className="flex gap-4">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white"
                }`}
              >
                {type.name}
              </button>
            ))}
            <button
              onClick={() => handleTypeChange(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !selectedType
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white"
              }`}
            >
              View All
            </button>
          </div>
        </div>
      </div>

      {/* Bus List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.length ? (
          buses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              data-aos="fade-up"
            >
              {/* Bus Image */}
              {bus.image && (
                <img
                  src={`http://127.0.0.1:8000${bus.image}`}
                  alt={bus.vechicle_number}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Bus Details */}
              <h3 className="text-xl font-semibold text-green-800">{bus.vechicle_number}</h3>
              <p className="text-sm text-gray-500 mb-2">{bus.type?.name || "Unknown Type"}</p>

              {/* <p className="text-gray-700">Driver: {bus.driver?.full_name || "N/A"}</p>
              <p className="text-gray-700">Staff: {bus.staff?.full_name || "N/A"}</p> */}
              <p className="text-gray-700">Price: Rs. {bus.price || "N/A"}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-4">
                {bus.features?.includes("wifi") && <Feature icon={Wifi} text="WiFi" />}
                {bus.features?.includes("charging") && <Feature icon={Plug} text="Charging" />}
                {bus.features?.includes("ac") && <Feature icon={Snowflake} text="AC" />}
                {bus.features?.includes("fan") && <Feature icon={Fan} text="Fan" />}
              </div>

              {/* Reserve Button */}
              <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Reserve Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">No available buses</p>
        )}
      </div>
    </div>
  );
};

// Feature Component
const Feature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1" title={text}>
    <Icon className="text-green-600" size={20} />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

export default BusReserve;