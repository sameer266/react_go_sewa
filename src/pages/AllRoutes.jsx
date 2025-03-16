import React, { useState } from 'react';
import '../style/pageCss/allroutes.css'; // You'll need to create this CSS file with the styles

function AllRoutes() {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Sample bus data
  const availableBuses = [
    { 
      id: 1, 
      name: "Express Liner", 
      departureTime: "08:00 AM", 
      arrivalTime: "11:30 AM",
      duration: "3h 30m",
      price: 35,
      availableSeats: 28,
      rating: 4.7
    },
    { 
      id: 2, 
      name: "City Voyager", 
      departureTime: "10:15 AM", 
      arrivalTime: "02:00 PM",
      duration: "3h 45m",
      price: 28,
      availableSeats: 14,
      rating: 4.5
    },
    { 
      id: 3, 
      name: "Golden Transit", 
      departureTime: "01:30 PM", 
      arrivalTime: "04:45 PM",
      duration: "3h 15m",
      price: 32,
      availableSeats: 22,
      rating: 4.8
    }
  ];
  
  // Sample seat layout (5 rows of 8 seats)
  const seatLayout = Array(5).fill().map((_, rowIndex) => 
    Array(8).fill().map((_, seatIndex) => ({
      id: rowIndex * 8 + seatIndex + 1,
      isBooked: Math.random() > 0.7 // 30% of seats are randomly booked
    }))
  );
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to fetch buses
    console.log("Searching for buses with params:", searchParams);
  };
  
  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };
  
  const handleSeatSelect = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  
  const handleBookTickets = () => {
    console.log(`Booking ${selectedSeats.length} seats on ${selectedBus.name}`);
    // In a real app, this would call an API to book tickets
    alert(`Successfully booked ${selectedSeats.length} seats on ${selectedBus.name}!`);
    setSelectedBus(null);
    setSelectedSeats([]);
  };
  
  return (
    <div className="booking-system">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <h2 className="section-title">Find Your Bus</h2>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-group">
              <label>From</label>
              <input 
                type="text" 
                name="from" 
                value={searchParams.from} 
                onChange={handleInputChange} 
                placeholder="Departure City" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>To</label>
              <input 
                type="text" 
                name="to" 
                value={searchParams.to} 
                onChange={handleInputChange} 
                placeholder="Arrival City" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                name="date" 
                value={searchParams.date} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Passengers</label>
              <select 
                name="passengers" 
                value={searchParams.passengers} 
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search Buses
            </button>
          </form>
        </div>
      </div>
      
      {/* Results Section */}
      {!selectedBus && (
        <div className="results-section">
          <div className="results-container">
            <h2 className="section-title">Available Buses</h2>
            
            {availableBuses.map(bus => (
              <div key={bus.id} className="bus-card">
                <div className="bus-details">
                  <h3 className="bus-name">{bus.name}</h3>
                  <div className="bus-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" className="star-icon" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>{bus.rating}</span>
                  </div>
                </div>
                
                <div className="bus-schedule">
                  <div className="time-container">
                    <div className="departure">
                      <p className="time">{bus.departureTime}</p>
                      <p className="label">Departure</p>
                    </div>
                    
                    <div className="duration">
                      <div className="duration-line"></div>
                      <p>{bus.duration}</p>
                    </div>
                    
                    <div className="arrival">
                      <p className="time">{bus.arrivalTime}</p>
                      <p className="label">Arrival</p>
                    </div>
                  </div>
                </div>
                
                <div className="bus-info">
                  <div className="seats-available">
                    <svg xmlns="http://www.w3.org/2000/svg" className="seat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 5v14h14V5H5z"></path>
                      <path d="M5 11h14"></path>
                    </svg>
                    <span>{bus.availableSeats} seats left</span>
                  </div>
                  
                  <div className="price-container">
                    <p className="price">${bus.price}</p>
                    <button 
                      className="select-button"
                      onClick={() => handleSelectBus(bus)}
                    >
                      Select Bus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Seat Selection Section */}
      {selectedBus && (
        <div className="seat-selection-section">
          <div className="seat-selection-container">
            <div className="selection-header">
              <h2 className="section-title">Select Your Seats</h2>
              <button 
                className="back-button"
                onClick={() => setSelectedBus(null)}
              >
                Back to Results
              </button>
            </div>
            
            <div className="bus-info-banner">
              <h3>{selectedBus.name}</h3>
              <div className="journey-details">
                <span>{searchParams.from} to {searchParams.to}</span>
                <span>•</span>
                <span>{searchParams.date}</span>
                <span>•</span>
                <span>{selectedBus.departureTime} - {selectedBus.arrivalTime}</span>
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
              <div className="driver-section">
                <div className="steering-wheel">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <line x1="12" y1="2" x2="12" y2="4"></line>
                    <line x1="12" y1="20" x2="12" y2="22"></line>
                    <line x1="2" y1="12" x2="4" y2="12"></line>
                    <line x1="20" y1="12" x2="22" y2="12"></line>
                  </svg>
                </div>
                <p>Driver</p>
              </div>
              
              <div className="seats-container">
                {seatLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="seat-row">
                    {row.map((seat, seatIndex) => {
                      // Add aisle in the middle (after 4th seat)
                      const isAisle = seatIndex === 3;
                      
                      return (
                        <React.Fragment key={seat.id}>
                          <div 
                            className={`seat ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                            onClick={() => !seat.isBooked && handleSeatSelect(seat.id)}
                          >
                            {seat.id}
                          </div>
                          {isAisle && <div className="aisle"></div>}
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
                  <span>Bus Fare (x{selectedSeats.length})</span>
                  <span>${selectedBus.price * selectedSeats.length}</span>
                </div>
                <div className="summary-row">
                  <span>Service Fee</span>
                  <span>$2.50</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(selectedBus.price * selectedSeats.length + 2.50).toFixed(2)}</span>
                </div>
                <div className="selected-seats-summary">
                  <span>Selected Seats:</span>
                  <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                </div>
              </div>
              
              <button 
                className="book-button"
                disabled={selectedSeats.length === 0}
                onClick={handleBookTickets}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRoutes;