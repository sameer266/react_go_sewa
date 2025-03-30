import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { BusLayoutApi } from '../api/homeApi';
import { 
  MapPin, 
  Clock,
  Wifi, 
  BatteryCharging, 
  CreditCard, 
  Bus, 
  ArrowRight,
  ChevronRight,
  Armchair,
  Users,
  Receipt,
  Tag
} from 'lucide-react';

// Simple debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const SelectSeat = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busDetails, setBusDetails] = useState(null);
  const [seatLayout, setSeatLayout] = useState([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      toast.error('Please log in to book seats');
      navigate('/sign-in');
      return;
    }

    const fetchBusLayout = async () => {
      try {
        setLoading(true);
        const response = await BusLayoutApi(id);
        if (response.success) {
          const { bus_schedule, layout } = response;
          
          setBusDetails({
            id: bus_schedule.bus.id,
            busNumber: bus_schedule.bus.bus_number,
            busType: bus_schedule.bus.bus_type,
            totalSeats: bus_schedule.bus.total_seats,
            availableSeats: bus_schedule.bus.available_seats,
            features: bus_schedule.bus.features,
            busImage: bus_schedule.bus.bus_image,
            route: bus_schedule.route,
            departureTime: bus_schedule.departure_time,
            arrivalTime: bus_schedule.arrival_time,
          });
          
          setPrice(parseFloat(bus_schedule.price));

          const { layout_data } = layout;
          
          const formattedSeatLayout = layout_data.map((row) =>
            row.map((seat) => {
              if (seat === 0) {
                return { type: 'aisle', status: 'booked' };
              }
              return {
                id: seat.seat,
                status: seat.status === 'available' ? 'available' : 'booked',
              };
            })
          );

          setSeatLayout(formattedSeatLayout);
        } else {
          toast.error('Failed to fetch bus layout');
        }
      } catch (error) {
        console.error('Error fetching bus layout:', error);
        toast.error('An error occurred while fetching bus layout');
      } finally {
        setLoading(false);
      }
    };

    fetchBusLayout();
  }, [id, isAuthenticated, navigate, location.pathname]);

  const handleSeatSelect = useCallback(debounce((seatId, status) => {
    if (status !== 'available') {
      toast.error(`Seat ${seatId} is not available`);
      return;
    }
    
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else if (prev.length >= 4) {
        toast.error('Maximum 4 seats allowed');
        return prev;
      } else {
        return [...prev, seatId];
      }
    });
  }, 300), []); // 300ms debounce delay

  const proceedToCheckout = () => {
    if (!selectedSeats.length) {
      toast.error('Select at least one seat');
      return;
    }
    
    toast.success(`Booking ${selectedSeats.join(', ')}`);
    navigate('/checkout', { 
      state: { 
        selectedSeats, 
        busDetails,
        price,
        totalPrice: selectedSeats.length * price
      } 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderFeatureIcon = (feature) => {
    switch(feature) {
      case 'wifi':
        return <Wifi size={16} className="text-green-600" />;
      case 'charging':
        return <BatteryCharging size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  if (loading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-green-800">
          <Bus size={20} className="text-green-600" />
          <span>Select Your Seats</span>
        </h2>
        
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg shadow-sm">
          <Tag size={18} className="text-green-600" />
          <span className="font-bold">NPR {price.toLocaleString()} / seat</span>
        </div>
      </div>
      
      {busDetails && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <MapPin size={16} className="text-green-500" />
              <span className="font-medium">{busDetails.route.source}</span>
              <ArrowRight size={16} className="text-green-600" />
              <span className="font-medium">{busDetails.route.destination}</span>
            </div>
            <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              {busDetails.busNumber}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-green-500" />
              <span>Departure: {formatDate(busDetails.departureTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-green-500" />
              <span>Arrival: {formatDate(busDetails.arrivalTime)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {busDetails.features.map((feature, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs text-green-700">
                {renderFeatureIcon(feature)}
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
          <span className="text-xs">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 border border-green-600 rounded" />
          <span className="text-xs">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-400 border border-gray-500 rounded" />
          <span className="text-xs">Booked</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 overflow-x-auto">
        <div className="flex justify-center items-center gap-2 mb-4 border-b pb-2">
          <div className="w-8 h-8 rounded-full border-2 border-gray-400" />
          <span className="text-xs text-gray-500">Driver</span>
          <div className="h-6 w-12 border-2 border-gray-400 rounded ml-4" />
          <span className="text-xs text-gray-500">Entry</span>
        </div>
        
        <div className="flex justify-center">
          <div className="inline-block">
            {seatLayout.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-2">
                {row.map((seat, seatIdx) => (
                  seat.type === 'aisle' ? (
                    <div key={`aisle-${rowIdx}-${seatIdx}`} className="w-6" />
                  ) : (
                    <div
                      key={`${seat.id}-${rowIdx}-${seatIdx}`}
                      className={`w-8 h-8 flex flex-col items-center justify-center rounded cursor-pointer border ${
                        selectedSeats.includes(seat.id) 
                          ? 'bg-green-500 text-white border-green-600' 
                          : seat.status === 'available' 
                            ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' 
                            : 'bg-gray-400 border-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => handleSeatSelect(seat.id, seat.status)}
                    >
                      <Armchair size={12} />
                      <span className="text-xs font-bold">{seat.id}</span>
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
          <Receipt size={18} className="text-green-600" />
          <span>Booking Summary</span>
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1">
              <Users size={14} className="text-green-600" />
              <span>Fare ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})</span>
            </span>
            <span>NPR {(selectedSeats.length * price).toLocaleString()}</span>
          </div>
          
          <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold">
            <span>Total</span>
            <span className="text-green-700">NPR {(selectedSeats.length * price).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mb-4 text-sm">
          <span className="font-medium">Selected Seats:</span> 
          <span className="ml-1">{selectedSeats.length ? selectedSeats.join(', ') : 'None'}</span>
        </div>
        
        <button 
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium ${
            selectedSeats.length ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'
          }`}
          disabled={!selectedSeats.length} 
          onClick={proceedToCheckout}
        >
          <CreditCard size={16} />
          <span>Proceed to Checkout</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SelectSeat;