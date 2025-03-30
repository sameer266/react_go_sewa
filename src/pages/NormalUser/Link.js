import React from 'react';
import { useSelector } from 'react-redux';



import { 
  BarChart2, 
  UserPen, 
  Ticket, 
  Users, 

  Calendar, 
  CreditCard, 

  Bell, 
  MessageSquare 
} from 'lucide-react';

export const menuLinks = [
  { key: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={20} />, link: '/user-dashboard' },  // User dashboard route
  { key: 'userProfile', label: 'Profile', icon: <UserPen size={20} />, link: '/user-profile' },        // User profile route
  { key: 'ticketBooking', label: 'Book Ticket', icon: <Ticket size={20} />, link: '/user-book-ticket' },  // User booking ticket
  { key: 'userBookings', label: 'My Bookings', icon: <Users size={20} />, link: '/user-bookings' },     // View user's bookings
  { key: 'paymentHistory', label: 'Payment History', icon: <CreditCard size={20} />, link: '/user-payments' },  // View payment history
  { key: 'tripDetails', label: 'My Trips', icon: <Calendar size={20} />, link: '/user-trips' },       // View trips for the user
  { key: 'notifications', label: 'Notifications', icon: <Bell size={20} />, link: '/user-notifications' },  // User notifications
  { key: 'support', label: 'Support', icon: <MessageSquare size={20} />, link: '/user-support' }         // User support and feedback
];
