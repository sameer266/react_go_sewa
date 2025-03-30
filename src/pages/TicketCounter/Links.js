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
  MessageSquare ,
  LifeBuoy
} from 'lucide-react';

// Define the menuLinks array
export const menuLinks = [
  { key: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={20} />, link: '/admin-dashboard' },
  { key: 'adminProfile', label: 'Profile', icon: <UserPen size={20} />, link: '/admin-profile' },
  { key: 'driverandStaff', label: 'Driver & Staff', icon: <UserCog size={20} />, link: '/driver-staff' },
  { key: 'busManagement', label: 'Bus Management', icon: <Bus size={20} />, link: '/buses-management' },
  { key:"reservationmanagemnet", label:'Reservation Management',icon:<LifeBuoy/>, link:'/reservation-management'},
  { key: 'routeManagement', label: 'Route Management', icon: <Waypoints size={20} />, link: '/route-management' },
  { key: 'scheduleManagement', label: 'Schedule', icon: <MapPin size={20} />, link: '/schedule-management' },
  { key: 'bookingManagement', label: 'Booking Management', icon: <Calendar size={20} />, link: '/booking-management' },
  { key: 'notificationsAlerts', label: 'Notifications', icon: <Bell size={20} />, link: '/notifications' },
  
];