import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  Settings,
 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/home/componentCss/sidebar.css';
import { useSelector } from 'react-redux';

const Sidebar = ({ collapsed, setCollapsed, menuLink }) => {
  const menuItems =  menuLink();
  console.log("This is menuItme",menuItems)
  const location =useLocation()

  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [isMobile, setIsMobile] = useState(false);

  const user_type=useSelector((state)=>state.auth.role)
  

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Collapse sidebar on mobile by default
      if (mobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false); // Expand by default on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {!collapsed && !isMobile && <h1 className="sidebar-title">Go Sewa</h1>}
        {!isMobile && (
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="toggle-button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        <ul className="menu-list">
          {menuItems.map((item) => (
            
            <li key={item.key} className="menu-item">
              {console.log(item)}
              <Link 
                to={item.link} 
                onClick={() => setActiveMenu(location.pathname)}
                className={`menu-item-header ${activeMenu === item.link ? 'active' : ''}`}
                title={collapsed || isMobile ? item.label : ''}
              >
                <div className="menu-item-icon-wrapper">
                  <span className="menu-item-icon">{item.icon}</span>
                  {!collapsed && !isMobile && <span className="menu-item-label">{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer */}
      {user_type==="admin" && 
      <div className="sidebar-footer">
        {!collapsed && !isMobile ? (
          <div className="user-profile-expanded">
            <Link to="/settings" className="settings-button">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </div>
        ) : (
          <div className="user-profile-collapsed">
            <Link to="/settings" className="icon-button settings-icon" title="Settings">
              <Settings size={20} />
            </Link>
          </div>
        )}
      </div>
}
    </div>
  );
};

export default Sidebar;