import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { AdminBusDetailsOfScheduleApi } from '../../api/adminApi';
import { Bus, MapPin, User, Armchair, DollarSign, Compass, Map, Shield } from 'lucide-react';
import Loader from '../../components/Loader';

const BusActive = () => {
  const [busData, setBusData] = useState(null);
  const [busLayout, setBusLayout] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async (busId) => {
      try {
        setIsLoading(true);
        const response = await AdminBusDetailsOfScheduleApi(busId);
        if (response?.success) {
          setBusData(response.bus_data);
          setBusLayout(response.bus_layout);
          setTotalAmount(response.total_amount);
          setBookingData(response.booking_data || []);
        }
      } catch (error) {
        console.error('Error fetching bus details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData(id);
  }, [id]);

  // Create a mapping of seat to booked user and booking ID
  const getSeatBookingMap = () => {
    const seatMap = {};
    bookingData.forEach(booking => {
      booking.seat.forEach(seat => {
        seatMap[seat] = {
          userName: booking.user.full_name,
          bookingId: booking.id // Assuming booking has an id field
        };
      });
    });
    return seatMap;
  };

  const seatBookingMap = getSeatBookingMap();

  const renderSeatLayout = () => {
    if (!busLayout || !busLayout.layout_data) return null;

    return (
      <div className="space-y-2 relative">
        <div className="absolute top-0 right-0 flex items-center gap-1 text-gray-600">
          <Compass size={16} />
          <span className="text-xs font-medium">East</span>
        </div>
        {busLayout.layout_data.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((seat, colIndex) => {
              if (seat === 0) {
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="w-10 h-10 md:w-12 md:h-12 m-0.5"
                  />
                );
              }
              
              const isBooked = seat.status === 'booked';
              const bookingInfo = isBooked ? seatBookingMap[seat.seat] : null;
              const bookedBy = bookingInfo ? bookingInfo.userName : 'Unknown';
              const bookingId = bookingInfo ? bookingInfo.bookingId : null;
              
              const seatContent = (
                <>
                  <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    {seat.seat}
                  </span>
                  
                  {isBooked && (
                    <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10 transition-opacity duration-200">
                      Booked by: {bookedBy}
                    </div>
                  )}
                </>
              );
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-10 h-10 md:w-12 md:h-12 m-0.5 flex items-center justify-center rounded-md text-white font-medium text-xs md:text-sm relative group
                    ${isBooked ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                    transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  {isBooked && bookingId ? (
                    <Link to={`/userbooking-details/${bookingId}`} className="absolute inset-0 flex items-center justify-center">
                      {seatContent}
                    </Link>
                  ) : (
                    seatContent
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
    <Loader/>
    );
  }

  if (!busData) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Bus className="mx-auto mb-4 text-gray-400" size={40} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bus Details</h1>
          <p className="text-gray-600">No bus data available for this schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center text-gray-900">
            <Bus className="mr-3 text-indigo-600 hidden sm:block" size={28} />
            <span>{busData.bus_number}</span>
            <span className="ml-auto text-sm md:text-base bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              {busData.bus_type.replace('_', ' ').toUpperCase()}
            </span>
          </h1>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm md:text-base">{busData.route.source} → {busData.route.destination}</span>
            <span className="mx-2">·</span>
            <span className="text-sm md:text-base">{busData.route.distance} km</span>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bus Details Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-40 md:h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`http://127.0.0.1:8000/${busData.bus_image}`}
                    alt={busData.bus_number}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="text-xl font-bold">{busData.bus_number}</div>
                  <div className="flex items-center text-sm">
                    <span className="capitalize">{busData.bus_type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Bus Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Map className="mt-0.5 mr-3 text-indigo-500 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Route</div>
                      <div className="font-medium">{busData.route.source} → {busData.route.destination}</div>
                      <div className="text-sm text-gray-500">{busData.route.distance} km</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Armchair className="mt-0.5 mr-3 text-indigo-500 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Seats</div>
                      <div className="font-medium">
                        <span className="text-emerald-600">{busData.available_seats}</span> available / {busData.total_seats} total
                      </div>
                      <div className="text-sm text-gray-500">
                        {busData.total_seats - busData.available_seats} booked
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <DollarSign className="mt-0.5 mr-3 text-indigo-500 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Earnings</div>
                      <div className="font-medium">NPR {totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Shield className="mt-0.5 mr-3 text-indigo-500 flex-shrink-0" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Features</div>
                      <div className="font-medium">
                        {busData.features.slice(0, 3).join(', ')}
                        {busData.features.length > 3 && (
                          <span className="text-sm text-indigo-600"> +{busData.features.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Layout Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Armchair className="mr-2 text-indigo-500" size={20} /> Seat Layout
                </h2>
                
                {busLayout ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <span className="px-2 py-1 bg-white rounded-md shadow-sm">Rows: {busLayout.rows}</span>
                      <span className="px-2 py-1 bg-white rounded-md shadow-sm">Columns: {busLayout.column}</span>
                      <span className="px-2 py-1 bg-white rounded-md shadow-sm">Aisle: Column {busLayout.aisle_column}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg relative overflow-auto">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-800 text-white rounded-lg px-3 py-1 text-sm font-medium shadow-sm">
                          Driver
                        </div>
                      </div>
                      {renderSeatLayout()}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs md:text-sm">
                      <span className="flex items-center">
                        <div className="w-4 h-4 bg-emerald-500 rounded-md mr-2"></div> Available
                      </span>
                      <span className="flex items-center">
                        <div className="w-4 h-4 bg-rose-500 rounded-md mr-2"></div> Booked
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                    <p>No seat layout available for this bus.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Staff Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 text-indigo-500" size={20} /> Staff
                </h2>
                
                <div className="flex items-center">
                  {busData.staff.staff_profile ? (
                    <img
                      src={`http://127.0.0.1:8000/${busData.staff.staff_profile}`}
                      alt={busData.staff.full_name}
                      className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-4">
                      <User size={24} />
                    </div>
                  )}
                  
                  <div>
                    <div className="font-medium text-gray-900">{busData.staff.full_name}</div>
                    <div className="text-sm text-gray-600">{busData.staff.phone_number}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Driver Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 text-indigo-500" size={20} /> Driver
                </h2>
                
                <div className="flex items-center">
                  <img
                    src={`http://127.0.0.1:8000/${busData.driver.driver_profile}`}
                    alt={busData.driver.full_name}
                    className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-indigo-100"
                  />
                  
                  <div>
                    <div className="font-medium text-gray-900">{busData.driver.full_name}</div>
                    <div className="text-sm text-gray-600">{busData.driver.phone_number}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusActive;