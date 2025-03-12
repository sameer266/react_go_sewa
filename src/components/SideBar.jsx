import React, { useState } from 'react';
import { 
  Menu, 
  Users, 
  Bus, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Clipboard, 
  BarChart2, 
  Bell, 
  MessageSquare,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Ticket
} from 'lucide-react';
import '../style/home/componentCss/sidebar.css'; // Import the CSS file

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart2 size={20} />,
      link: '/dashboard'
    },
    {
      key: 'ticketCounter',
      label: 'Ticket Counter',
      icon: <Ticket size={20} />,
      link: '/ticket-counter'
    },
    {
      key: 'userManagement',
      label: 'User Management',
      icon: <Users size={20} />,
      link: '/users',
      submenu: [
        { label: 'View Users', link: '/users/view' },
        { label: 'Add User', link: '/users/add' },
        { label: 'Role Management', link: '/users/roles' }
      ]
    },
    {
      key: 'busManagement',
      label: 'Bus Management',
      icon: <Bus size={20} />,
      link: '/buses',
      submenu: [
        { label: 'View Buses', link: '/buses/view' },
        { label: 'Add Bus', link: '/buses/add' },
        { label: 'Seat Configuration', link: '/buses/seats' }
      ]
    },
    {
      key: 'routeManagement',
      label: 'Route & Schedule',
      icon: <MapPin size={20} />,
      link: '/routes',
      submenu: [
        { label: 'View Routes', link: '/routes/view' },
        { label: 'Add Route', link: '/routes/add' },
        { label: 'Schedules', link: '/routes/schedules' }
      ]
    },
    {
      key: 'bookingManagement',
      label: 'Booking Management',
      icon: <Calendar size={20} />,
      link: '/bookings',
      submenu: [
        { label: 'All Bookings', link: '/bookings/all' },
        { label: 'Pending Bookings', link: '/bookings/pending' },
        { label: 'Canceled Bookings', link: '/bookings/canceled' }
      ]
    },
    {
      key: 'paymentManagement',
      label: 'Payment & Commission',
      icon: <CreditCard size={20} />,
      link: '/payments',
      submenu: [
        { label: 'Payment History', link: '/payments/history' },
        { label: 'Commission Reports', link: '/payments/commission' }
      ]
    },
    {
      key: 'tripManagement',
      label: 'Trip & Seat',
      icon: <Clipboard size={20} />,
      link: '/trips',
      submenu: [
        { label: 'Active Trips', link: '/trips/active' },
        { label: 'Scheduled Trips', link: '/trips/scheduled' },
        { label: 'Seat Allocation', link: '/trips/seats' }
      ]
    },
    {
      key: 'reportsAnalytics',
      label: 'Reports & Analytics',
      icon: <BarChart2 size={20} />,
      link: '/reports',
      submenu: [
        { label: 'Revenue Reports', link: '/reports/revenue' },
        { label: 'Bus Performance', link: '/reports/performance' },
        { label: 'Booking Trends', link: '/reports/trends' }
      ]
    },
    {
      key: 'notificationsAlerts',
      label: 'Notifications',
      icon: <Bell size={20} />,
      link: '/notifications',
      submenu: [
        { label: 'Send Notifications', link: '/notifications/send' },
        { label: 'Alert Settings', link: '/notifications/settings' }
      ]
    },
    {
      key: 'supportFeedback',
      label: 'Support & Feedback',
      icon: <MessageSquare size={20} />,
      link: '/support',
      submenu: [
        { label: 'Support Tickets', link: '/support/tickets' },
        { label: 'Customer Feedback', link: '/support/feedback' }
      ]
    }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h1 className="sidebar-title">Bus Admin</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="toggle-button">
          <Menu size={24} />
        </button>
      </div>

      <div className="sidebar-content">
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.key} className="menu-item">
              <div 
                onClick={() => {
                  setActiveMenu(item.key);
                  if (item.submenu) {
                    toggleMenu(item.key);
                  }
                }}
                className={`menu-item-header ${activeMenu === item.key ? 'active' : ''}`}
              >
                <div className="menu-item-icon-wrapper">
                  <span className="menu-item-icon">{item.icon}</span>
                  {!collapsed && <span className="menu-item-label">{item.label}</span>}
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown
                    size={16}
                    className={`chevron-icon ${expandedMenus[item.key] ? 'rotated' : ''}`}
                  />
                )}
              </div>
              
              {!collapsed && item.submenu && expandedMenus[item.key] && (
                <ul className="submenu-list">
                  {item.submenu.map((subItem, index) => (
                    <li key={index} className="submenu-item">
                      <a href={subItem.link} className="submenu-link">
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        {!collapsed ? (
          <div className="user-profile-expanded">
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-details">
                <div className="user-name">Admin User</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
            <div className="user-actions">
              <button className="settings-button">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="logout-button">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="user-profile-collapsed">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <button className="icon-button settings-icon">
              <Settings size={20} />
            </button>
            <button className="icon-button logout-icon">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;