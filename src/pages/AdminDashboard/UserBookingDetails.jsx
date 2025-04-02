import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bus, MapPin, Armchair, DollarSign, Calendar, User, Phone, Clock } from 'lucide-react';
import { AdminUserScheduleBookingDetailsApi } from '../../api/adminApi';
import Loader from '../../components/Loader';

const UserBookingDetails = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBookingData = async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await AdminUserScheduleBookingDetailsApi(userId);
        if (response?.success) {
          setBookingData(response.data);
        } else {
          setError('No booking data found.');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingData(id);
  }, [id]);

  const updateBookingStatus = (newStatus) => {
    setBookingData({
      ...bookingData,
      booking_status: newStatus
    });
    
    // Here you would typically also make an API call to update the status in the backend
    // Example: await updateBookingStatusApi(id, newStatus);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <Loader />;

  if (error || !bookingData) {
    return (
      <div className="p-6 max-w-3xl mx-auto mt-16">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <User className="mx-auto mb-4 text-gray-400" size={40} />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Booking Details</h1>
          <p className="text-gray-600">{error || 'No booking data available.'}</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    booked: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
   
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-20">
      <div className="max-w-3xl mx-auto">
        {/* Booking Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Booking Details</h1>
            <div className="flex items-center space-x-2 text-green-50">
              <Bus size={16} />
              <span className="font-medium">{bookingData.bus_number}</span>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-green-50">
              <MapPin size={16} />
              <span>{bookingData.source} → {bookingData.destination}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Selector */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Booking Status</div>
              <select 
                value={bookingData.booking_status}
                onChange={(e) => updateBookingStatus(e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[bookingData.booking_status] || 'bg-gray-100 text-gray-800'} border-0 cursor-pointer`}
              >
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>

              </select>
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Passenger Information</h3>
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-indigo-500 mr-3" />
                <div>
                  <span className="text-sm font-medium text-gray-500 mr-2">Name:</span>
                  <span className="text-gray-900">{bookingData.user}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-indigo-500 mr-3" />
                <div>
                  <span className="text-sm font-medium text-gray-500 mr-2">Phone:</span>
                  <span className="text-gray-900">{bookingData.user_phone}</span>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="space-y-5">
              {/* Seats */}
              <div className="flex">
                <Armchair className="w-5 h-5 text-indigo-500 mt-1 mr-4" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Seats</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {bookingData.seat.map((seat, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm font-medium">
                        {seat}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Total Seats: {bookingData.total_seat}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex">
                <DollarSign className="w-5 h-5 text-indigo-500 mt-1 mr-4" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="text-lg font-medium text-gray-900">NPR {bookingData.total_price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Price per seat: NPR {(bookingData.total_price / bookingData.total_seat).toFixed(2)}</p>
                </div>
              </div>

              {/* Booking Date */}
              <div className="flex">
                <Calendar className="w-5 h-5 text-indigo-500 mt-1 mr-4" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Booked On</h3>
                  <p className="text-gray-900">{formatDate(bookingData.booked_at)}</p>
                </div>
              </div>
              
              {/* Booking Time */}
              <div className="flex">
                <Clock className="w-5 h-5 text-indigo-500 mt-1 mr-4" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Booking Time</h3>
                  <p className="text-gray-900">{formatTime(bookingData.booked_at)}</p>
                </div>
              </div>
            </div>

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
        </div>
      </div>
    </div>
  );
};

export default UserBookingDetails;