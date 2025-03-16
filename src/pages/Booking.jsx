import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../style/pageCss/booking.css';
import { useSelector } from 'react-redux';



const Booking = () => {
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [busDetails, setBusDetails] = useState({
    id: 'NP-1234',
    route: 'Kathmandu to Pokhara',
    departureTime: '07:00 AM',
    arrivalTime: '01:30 PM',
    price: 1200, // In NPR
    date: '2025-03-15'
  });
  
  // Seat layout for a typical Nepali bus (typically 2+2 seating arrangement)
  // status: 'available', 'booked', 'reserved'
  const [seatLayout, setSeatLayout] = useState([
    // Driver area and front seats
    [
      { id: 'driver', type: 'driver', status: 'reserved' },
      { id: 'A1', type: 'seat', status: 'available' },
      { id: 'A2', type: 'seat', status: 'available' },
    ],
    // Regular rows (4 seats per row with aisle)
    [
      { id: 'B1', type: 'seat', status: 'available' },
      { id: 'B2', type: 'seat', status: 'available' },
      { id: 'B3', type: 'seat', status: 'booked' },
      { id: 'B4', type: 'seat', status: 'available' }
    ],
    [
      { id: 'C1', type: 'seat', status: 'booked' },
      { id: 'C2', type: 'seat', status: 'available' },
      { id: 'C3', type: 'seat', status: 'available' },
      { id: 'C4', type: 'seat', status: 'available' }
    ],
    [
      { id: 'D1', type: 'seat', status: 'available' },
      { id: 'D2', type: 'seat', status: 'booked' },
      { id: 'D3', type: 'seat', status: 'available' },
      { id: 'D4', type: 'seat', status: 'available' }
    ],
    [
      { id: 'E1', type: 'seat', status: 'available' },
      { id: 'E2', type: 'seat', status: 'available' },
      { id: 'E3', type: 'seat', status: 'booked' },
      { id: 'E4', type: 'seat', status: 'booked' }
    ],
    [
      { id: 'F1', type: 'seat', status: 'available' },
      { id: 'F2', type: 'seat', status: 'available' },
      { id: 'F3', type: 'seat', status: 'available' },
      { id: 'F4', type: 'seat', status: 'available' }
    ],
    [
      { id: 'G1', type: 'seat', status: 'available' },
      { id: 'G2', type: 'seat', status: 'available' },
      { id: 'G3', type: 'seat', status: 'available' },
      { id: 'G4', type: 'seat', status: 'available' }
    ],
    [
      { id: 'H1', type: 'seat', status: 'available' },
      { id: 'H2', type: 'seat', status: 'available' },
      { id: 'H3', type: 'seat', status: 'available' },
      { id: 'H4', type: 'seat', status: 'available' }
    ],
    // Last row (typically 5 seats in many Nepali buses)
    [
      { id: 'I1', type: 'seat', status: 'available' },
      { id: 'I2', type: 'seat', status: 'available' },
      { id: 'I3', type: 'seat', status: 'available' },
      { id: 'I4', type: 'seat', status: 'available' },
      { id: 'I5', type: 'seat', status: 'available' }
    ]
  ]);

  useEffect(() => {
    // Check if user is authenticated when component mounts
    if (!isAuthenticated) {
      // Save current location to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      toast.error('Please log in to book seats');
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);
  
  // Remove the conditional rendering since useEffect will handle the redirect

  const handleSeatSelect = (rowIndex, seatIndex) => {
    const seat = seatLayout[rowIndex][seatIndex];
    
    // Check if seat is available
    if (seat.status === 'booked' || seat.status === 'reserved') {
      toast.error(`Seat ${seat.id} is not available`);
      return;
    }

    // Toggle seat selection
    setSelectedSeats(prevSelectedSeats => {
      if (prevSelectedSeats.includes(seat.id)) {
        return prevSelectedSeats.filter(id => id !== seat.id);
      } else {
        // Check if there's a limit on how many seats can be booked
        if (prevSelectedSeats.length >= 4) {
          toast.error('You can only select up to 4 seats at a time');
          return prevSelectedSeats;
        }
        return [...prevSelectedSeats, seat.id];
      }
    });
  };

  const proceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    // In a real app, you would send this data to your backend
    toast.success(`Booking ${selectedSeats.length} seats: ${selectedSeats.join(', ')}`);
    
    // Here you would typically navigate to the payment page or checkout
    // navigate('/checkout', { state: { selectedSeats, busDetails } });
    
    console.log('Selected seats:', selectedSeats);
    console.log('Bus details:', busDetails);
    console.log('Total price:', selectedSeats.length * busDetails.price);
  };

  // In case the user wasn't redirected by the useEffect
  if (!isAuthenticated) {
    return null; // No need to render anything as we're redirecting
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h2>Select Your Seats</h2>
        <div className="bus-info">
          <div className="bus-route">{busDetails.route}</div>
          <div className="bus-schedule">
            <span>{busDetails.date}</span> • 
            <span>{busDetails.departureTime} - {busDetails.arrivalTime}</span>
          </div>
        </div>
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-icon available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-icon selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat-icon booked"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="bus-layout">
        {/* Bus front section */}
        <div className="bus-front">
          <div className="steering"></div>
          <div className="entry-door"></div>
        </div>

        {/* Seats */}
        <div className="seats-container">
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className={`seat-row ${rowIndex === 0 ? 'driver-row' : ''} ${rowIndex === seatLayout.length - 1 ? 'last-row' : ''}`}>
              {row.map((seat, seatIndex) => {
                if (seat.type === 'driver') {
                  return (
                    <div key={seat.id} className="driver-seat">
                      <div className="steering-wheel">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2"/>
                          <path d="M12 3V6" stroke="#333" strokeWidth="2"/>
                          <path d="M12 18V21" stroke="#333" strokeWidth="2"/>
                          <path d="M3 12H6" stroke="#333" strokeWidth="2"/>
                          <path d="M18 12H21" stroke="#333" strokeWidth="2"/>
                        </svg>
                      </div>
                      <span>Driver</span>
                    </div>
                  );
                }

                // Special class for middle seat in the last row
                const isMiddleSeatLastRow = rowIndex === seatLayout.length - 1 && seatIndex === Math.floor(row.length / 2);
                
                // Add aisle gap after the second seat in regular rows
                const isAfterAisle = rowIndex !== 0 && rowIndex !== seatLayout.length - 1 && seatIndex === 1;
                
                // Determine seat status class
                let seatStatusClass = seat.status;
                if (selectedSeats.includes(seat.id)) {
                  seatStatusClass = 'selected';
                }

                return (
                  <React.Fragment key={seat.id}>
                    <div 
                      className={`seat ${seatStatusClass} ${isMiddleSeatLastRow ? 'middle-seat' : ''}`}
                      onClick={() => handleSeatSelect(rowIndex, seatIndex)}
                    >
                      {seat.id}
                    </div>
                    {isAfterAisle && <div className="aisle"></div>}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="booking-summary">
        <div className="summary-details">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Bus Fare ({selectedSeats.length} seats)</span>
            <span>NPR {(selectedSeats.length * busDetails.price).toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Service Fee</span>
            <span>NPR {(selectedSeats.length > 0 ? 50 * selectedSeats.length : 0).toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>NPR {(selectedSeats.length > 0 ? (busDetails.price + 50) * selectedSeats.length : 0).toLocaleString()}</span>
          </div>
          <div className="selected-seats-summary">
            <span>Selected Seats:</span>
            <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
          </div>
        </div>
        
        <button 
          className="book-button"
          disabled={selectedSeats.length === 0}
          onClick={proceedToCheckout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Booking;