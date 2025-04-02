import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminRouteBusLists } from '../../api/adminApi';
import { Bus, MapPin, Info, X, ChevronLeft, Wifi, Battery, Wind } from 'lucide-react';
import Loader from '../../components/Loader';

function RouteBusLists() {
  const [data, setData] = useState([]);
  const [totalBus, setTotalBus] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async (routeId) => {
      setLoading(true);
      try {
        const response = await AdminRouteBusLists(routeId);
        if (response?.success) {
          setData(response.data);
          setTotalBus(response.total_bus);
          setSource(response.source);
          setDestination(response.destination);
        }
      } catch (error) {
        console.error('Error fetching route bus list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData(id);
  }, [id]);

  const openBusDetails = (bus) => {
    setSelectedBus(bus);
  };

  const closeBusDetails = () => {
    setSelectedBus(null);
  };

  // Feature icon mapping
  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'wifi':
        return <Wifi size={16} className="text-blue-500" />;
      case 'charging':
        return <Battery size={16} className="text-green-500" />;
      case 'ac':
        return <Wind size={16} className="text-cyan-500" />;
      default:
        return null;
    }
  };

  // Bus Details Modal Component
  const BusDetailsModal = ({ bus, onClose }) => {
    if (!bus) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">Bus Details</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4">
            {/* Bus image */}
            {bus.bus_image && (
              <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-200">
                <img 
                  src={`http://127.0.0.1:8000${bus.bus_image}`} 
                  alt={`${bus.bus_number} bus`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Bus info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {/* Removing bus number, type, and route as they're already in the table */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Seats</h4>
                  <p>
                    Available: <span className="text-emerald-600 font-medium">{bus.available_seats}</span> / 
                    Total: <span className="font-medium">{bus.total_seats}</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Staff</h4>
                  <div className="flex items-center">
                    {bus.staff.staff_profile && (
                      <img 
                        src={`http://127.0.0.1:8000${bus.staff.staff_profile}`}
                        alt={bus.staff.full_name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{bus.staff.full_name}</p>
                      <p className="text-sm text-gray-500">{bus.staff.phone_number}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Driver</h4>
                  <div className="flex items-center">
                    {bus.driver.driver_profile && (
                      <img 
                        src={`http://127.0.0.1:8000${bus.driver.driver_profile}`}
                        alt={bus.driver.full_name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{bus.driver.full_name}</p>
                      <p className="text-sm text-gray-500">{bus.driver.phone_number}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className={`${bus.is_active ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {bus.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Features */}
            {bus.features && bus.features.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {bus.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {getFeatureIcon(feature)}
                      <span className="ml-1 capitalize">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <ChevronLeft size={18} />
              <span className="ml-1">Back to list</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center text-gray-900">
            <Bus className="mr-3 text-indigo-600" size={24} />
            Bus List for Route
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mt-2 gap-2">
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm sm:text-base font-medium">{source} → {destination}</span>
            </div>
            <span className="hidden sm:block mx-2">·</span>
            <span className="text-sm sm:text-base">Total Buses: {totalBus}</span>
          </div>
        </div>

        {/* Bus Table */}
        {data.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus Number
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff
                    </th>
                    <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map(bus => (
                    <tr key={bus.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bus.bus_number}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {bus.bus_type.replace('_', ' ')}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="text-emerald-600">{bus.available_seats}</span> / {bus.total_seats}
                      </td>
                      <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                        {bus.staff.full_name}
                      </td>
                      <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                        {bus.driver.full_name}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          onClick={() => openBusDetails(bus)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                          <Info size={16} />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Bus className="mx-auto mb-4 text-gray-400" size={40} />
            <p className="text-gray-600">No buses available for this route.</p>
            <Link 
              to="/admin-dashboard/route-management" 
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Route Management
            </Link>
          </div>
        )}
      </div>



      {/* Bus Details Modal */}
      {selectedBus && (
        <BusDetailsModal 
          bus={selectedBus} 
          onClose={closeBusDetails} 
        />
      )}

       {/* Action Buttons */}
       <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => window.history.back()}
              >
                Back
              </button>
             
            </div>
            
    </div>
  );
}

export default RouteBusLists;