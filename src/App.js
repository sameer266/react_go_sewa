import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";  
import About from "./pages/About";
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AllRoutes from "./pages/AllRoutes";
import Schedule from "./pages/Schedule";
import TicketCounterManagement from "./pages/AdminDashboard/TicketCounterManagement";
import UserManagement from "./pages/AdminDashboard/UserManagement";
import ProfileAdmin from "./pages/AdminDashboard/ProfileAdmin";
import BusManagement from "./pages/AdminDashboard/BusManagement";
import ScheduleRoute from "./pages/AdminDashboard/ScheduleRoute";
import RouteManagement from "./pages/AdminDashboard/RouteManagement";
import BookingManagement from "./pages/AdminDashboard/BookingManagement";
import PaymentManagement from "./pages/AdminDashboard/PaymentManagement";
import ReportAnalysis from "./pages/AdminDashboard/ReportAnalysis";
import Bus_route from "./pages/Bus_route";
import SelectSeat from "./pages/SelectSeat";
import BusReserve from "./pages/BusReserve";
import Settings from "./pages/AdminDashboard/Settings";
import BusLayout from "./pages/AdminDashboard/BusLayout";
import DriverStaff from "./pages/AdminDashboard/DriverStaff";
import UserDashboard from "./pages/NormalUser/UserDashboard";
import SignUp from "./pages/SignUp";
import OTPVerification from "./pages/OtpVerification";
import UserProfile from "./pages/NormalUser/UserProfile";
import BookTicket from "./pages/NormalUser/BookTicket";
import MyBooking from "./pages/NormalUser/MyBooking";
import PaymentHistory from "./pages/NormalUser/PaymentHistory";
import Reservation from "./pages/AdminDashboard/Reservation"
import GlobalTransition from "./components/GlobalTransition";
import CounterDashboard from "./pages/TicketCounter/ConterDashboard";
import PageNotFound from "./components/PageNotFound";






// Automatically scrolls to the top instead of staying at the bottom.
function ScrollToTop() {
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (


    <Router>
     
      <ScrollToTop />
      
      <NavBar />
    

      <Routes>
        <Route path="*" element={<PageNotFound/>}/>
      
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/schedule" element={<Schedule/>}/>
        <Route path="/services" element={<Service/>}/>
        <Route path="/bus-reserve" element={<BusReserve/>}/>
        <Route path="sign-in"  element={<LoginPage/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/otp-verification" element={<OTPVerification/>}/>

        <Route path="/all-routes" element={<AllRoutes/>}/>
        <Route path="/buslist/:id" element={<Bus_route/>}/>
        <Route path="/select-seat/:id" element={<SelectSeat/>}/>

        {/* ---- AdminDashboard ---- */}
        <Route path="/admin-dashboard" element={<Dashboard/>}/>
        <Route path="/admin-profile" element={<ProfileAdmin/>}/>
        <Route path="/ticket-counter"  element={<TicketCounterManagement/>}/>
        <Route path="/user-managemant" element={<UserManagement/>}/>
        <Route path="/buses-management" element={<BusManagement/>}/>
        <Route path="/reservation-management" element={<Reservation/>}/>
        <Route path="/driver-staff" element={<DriverStaff/>} />
        <Route path="/bus-layout" element={<BusLayout/>}/>
        <Route path="/schedule-management" element={<ScheduleRoute/>}/>
        <Route path="/route-management" element={<RouteManagement/>}/>
        <Route path="/booking-management" element={<BookingManagement/>}/>
        <Route path="/payment-management" element={<PaymentManagement/>}/>
        <Route path="/reports" element={<ReportAnalysis/>}/>
        <Route path="/settings" element={<Settings/>}/>

        {/* ==========User Dasboard ======= */}
        <Route path="/user-dashboard" element={<UserDashboard/>}/>
        <Route path="/user-profile" element={<UserProfile/>}/> 
        <Route path="/user-book-ticket" element={<BookTicket/>}/>
        <Route path="/user-bookings" element={<MyBooking/>}/>
        <Route path="/user-payments" element={<PaymentHistory/>}/>


        {/* =========== Ticket Counter ========== */}
        <Route path="/counter-dashboard"  element={<CounterDashboard/>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
