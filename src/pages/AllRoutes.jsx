import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AllRoutesApi } from '../api/homeApi';
import { Bus, MapPin, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react'; // Import icons from lucide-react
import Loader from '../components/Loader';


export default function AllRoutes() {
  const { busId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [busDetails, setBusDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null); // Track expanded card


  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchBusDetails();
  }, [busId]);

  const fetchBusDetails = async () => {
    setLoading(true);
    try {
      const response = await AllRoutesApi(); // Modify this API to fetch details by busId
      if (response && response.data) {
        setBusDetails(response.data);
      } else {
        setError('Failed to fetch bus details');
      }
    } catch (error) {
      setError('An error occurred while fetching bus details');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index); // Toggle expanded card
  };

  const handleShowBuses = (busId) => {
    navigate(`/buslist/${busId}`); // Redirect to the "Show Buses" page
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg text-center" style={{ marginBottom: "90px", marginTop: "90px" }}>
        <p className="text-red-500" data-aos="fade-up">{error}</p>
      </div>
    );
  }

  if (!busDetails.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg text-center" style={{ marginBottom: "90px", marginTop: "90px" }}>
        <p className="text-gray-600" data-aos="fade-up">No buses found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg" style={{ marginBottom: "90px", marginTop: "90px" }}>
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center" data-aos="fade-up">
        <Bus className="mr-2" /> Bus Details
      </h2>

      <div className="space-y-4">
        {busDetails.map((bus, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg" data-aos="fade-up">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{bus.source} → {bus.destination}</p>
                <p className="text-sm text-gray-600">{bus.distance} km · {bus.estimated_time}</p>
              </div>
              <button
                onClick={() => toggleExpand(index)}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <ChevronDown className="w-5 h-5" />
                <span className="ml-1">Show Details</span>
              </button>
            </div>

            {expandedCard === index && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="text-blue-500" />
                  <div>
                    <p className="text-gray-600">Source</p>
                    <p className="font-semibold">{bus.source}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <MapPin className="text-green-500" />
                  <div>
                    <p className="text-gray-600">Destination</p>
                    <p className="font-semibold">{bus.destination}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="text-yellow-500" />
                  <div>
                    <p className="text-gray-600">Estimated Time</p>
                    <p className="font-semibold">{bus.estimated_time}</p>
                  </div>
                </div>

               

                <button
                  onClick={() => handleShowBuses(bus.id)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Show Buses
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
