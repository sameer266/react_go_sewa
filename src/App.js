import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";  
import About from "./pages/About";
import Contact from "./pages/Contact";
import RoutePage from "./pages/Route";
import Service from "./pages/Service";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/AdminDashboard/Dashboard";



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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/routes" element={<RoutePage/>}/>
        <Route path="/services" element={<Service/>}/>
        <Route path="sign-in"  element={<LoginPage/>}/>

        {/* ---- AdminDashboard ---- */}
        <Route path="/admin-dashboard" element={<Dashboard/>}/>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
