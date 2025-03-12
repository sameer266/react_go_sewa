import React, { useState, useEffect } from "react";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { Calendar, MapPin, Search } from "lucide-react";
import MainImg from "../../assets/home-image/main.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../style/home/hero.css"; // Import the CSS file

export default function Hero() {
  const [date, setDate] = useState(new BSDate().now()); // Get current Nepali date
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    console.log("Selected Date:", selectedDate); // Logs the Nepali date
  };
  
  return (
    <section className="hero-section">
      {/* Background Image */}
      <div className="hero-background">
        <img src={MainImg} alt="Bus travel" className="hero-image" />
      </div>
      
      <div className="hero-content">
        {/* Heading */}
        <div className="hero-heading" data-aos="fade-down" data-aos-delay="100">
          <h1>Book Your Bus Tickets with Go Sewa</h1>
          <p>Fast, secure, and convenient travel across the country</p>
        </div>
        
        {/* Search Card */}
        <div className="search-card" data-aos="fade-up" data-aos-delay="200">
          <div className="search-form">
            <div className="search-grid">
              {/* From */}
              <div className="search-field">
                <label>From</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" />
                  <input type="text" placeholder="Departure City" />
                </div>
              </div>
              
              {/* To */}
              <div className="search-field">
                <label>To</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" />
                  <input type="text" placeholder="Arrival City" />
                </div>
              </div>
              
              {/* Departure Date */}
              <div className="search-field date-field">
                <label>Departure Date</label>
                <div className="input-wrapper date-wrapper">
                  <Calendar className="input-icon" />
                  <NepaliDatePicker
                    value={date}
                    format="YYYY-MM-DD"
                    onChange={handleDateChange}
                    inputClassName="date-picker"
                    className="nepali-datepicker"
                  />
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <button className="search-button">
              <Search className="button-icon" /> Search Buses
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}