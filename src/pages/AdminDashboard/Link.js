import React from 'react';

import { 
  BarChart2, 
  UserPen, 
  Ticket, 
  Users, 
  UserCog, 
  Bus, 
  Waypoints, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Clipboard, 
  Bell, 
  LifeBuoy,
  
} from 'lucide-react';
import { useSelector } from 'react-redux';

export const MenuLinks = () => {
  const user_type = useSelector((state) => state.auth.role);

  if (user_type === "admin") {
    return [
      { key: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={20} />, link: '/admin-dashboard' },
      { key: 'adminProfile', label: 'Profile', icon: <UserPen size={20} />, link: '/admin-profile' },
      { key: 'ticketCounter', label: 'Ticket Counter', icon: <Ticket size={20} />, link: '/ticket-counter' },
      { key: 'userManagement', label: 'User Management', icon: <Users size={20} />, link: '/user-managemant' },
      { key: 'driverandStaff', label: 'Driver & Staff', icon: <UserCog size={20} />, link: '/driver-staff' },
      { key: 'busManagement', label: 'Bus Management', icon: <Bus size={20} />, link: '/buses-management' },
      { key: "reservationmanagemnet", label: 'Reservation Management', icon: <LifeBuoy />, link: '/reservation-management' },
      { key: 'routeManagement', label: 'Route Management', icon: <Waypoints size={20} />, link: '/route-management' },
      { key: 'scheduleManagement', label: 'Schedule', icon: <MapPin size={20} />, link: '/schedule-management' },
      { key: 'bookingManagement', label: 'Booking Management', icon: <Calendar size={20} />, link: '/booking-management' },
      { key: 'paymentManagement', label: 'Payment & Commission', icon: <CreditCard size={20} />, link: '/payment-management' },
      { key: 'tripManagement', label: 'Trip & Seat', icon: <Clipboard size={20} />, link: '/trips' },
      { key: 'reportsAnalytics', label: 'Reports & Analytics', icon: <BarChart2 size={20} />, link: '/reports' },
      { key: 'notificationsAlerts', label: 'Notifications', icon: <Bell size={20} />, link: '/notifications' },
    ];
  } else if(user_type=='sub_admin') {
    return [
      { key: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={20} />, link: '/admin-dashboard' },
      { key: 'adminProfile', label: 'Profile', icon: <UserPen size={20} />, link: '/admin-profile' },
      { key: 'driverandStaff', label: 'Driver & Staff', icon: <UserCog size={20} />, link: '/driver-staff' },
      { key: 'busManagement', label: 'Bus Management', icon: <Bus size={20} />, link: '/buses-management' },
      { key: "reservationmanagemnet", label: 'Reservation Management', icon: <LifeBuoy />, link: '/reservation-management' },
      { key: 'routeManagement', label: 'Route Management', icon: <Waypoints size={20} />, link: '/route-management' },
      { key: 'scheduleManagement', label: 'Schedule', icon: <MapPin size={20} />, link: '/schedule-management' },
      { key: 'bookingManagement', label: 'Booking Management', icon: <Calendar size={20} />, link: '/booking-management' },
      { key: 'notificationsAlerts', label: 'Notifications', icon: <Bell size={20} />, link: '/notifications' },
    ];
  }

  else{

    return [
      { key: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={20} />, link: '/user-dashboard' },  // User dashboard route
      { key: 'userProfile', label: 'Profile', icon: <UserPen size={20} />, link: '/user-profile' },        // User profile route
      { key: 'ticketBooking', label: 'Book Ticket', icon: <Ticket size={20} />, link: '/user-book-ticket' },  // User booking ticket
      { key: 'userBookings', label: 'My Bookings', icon: <Users size={20} />, link: '/user-bookings' },     // View user's bookings
      { key: 'paymentHistory', label: 'Payment History', icon: <CreditCard size={20} />, link: '/user-payments' },  // View payment history
      { key: 'tripDetails', label: 'My Trips', icon: <Calendar size={20} />, link: '/user-trips' },       // View trips for the user
      { key: 'notifications', label: 'Notifications', icon: <Bell size={20} />, link: '/user-notifications' },  // User notifications

    ];
  }
};