import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Header.css';
import logo from '../img/logo.png';
import { 
  FaHome, FaUser, FaCar, FaUtensils, 
  FaTruck, FaHistory, FaSignOutAlt, 
  FaSearch, FaAngleDown 
} from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useUser();
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsNavVisible(false);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <input type="text" placeholder="Search services..." />
          </div>
        </div>

        <nav className={`main-nav ${isNavVisible ? 'show' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item has-dropdown">
              <span onClick={() => toggleDropdown('home')}>
                <FaHome /> Home <FaAngleDown />
              </span>
              <div className={`dropdown ${activeDropdown === 'home' ? 'active' : ''}`}>
                <NavLink to="/home">Trang chủ</NavLink>
                <NavLink to="/notifications">Thông báo</NavLink>
              </div>
            </li>

            <li className="nav-item has-dropdown">
              <span onClick={() => toggleDropdown('food')}>
                <FaUtensils /> Dịch vụ <FaAngleDown />
              </span>
              <div className={`dropdown ${activeDropdown === 'food' ? 'active' : ''}`}>
                <NavLink to="/order-food">Đặt đồ ăn</NavLink>
                <NavLink to="/service-intro">Đặt xe</NavLink>
                <NavLink to="/delivery">Vận chuyển</NavLink>
              </div>
            </li>

            <li className="nav-item has-dropdown">
              <span onClick={() => toggleDropdown('user')}>
                <FaUser /> Người dùng <FaAngleDown />
              </span>
              <div className={`dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
                <NavLink to="/order-history">
                  <FaHistory /> Lịch sử giao dịch
                </NavLink>
                <NavLink to="/profile">
                  <FaUser /> Thông tin người dùng
                </NavLink>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </div>
            </li>
          </ul>
        </nav>

        <div className={`hamburger ${isNavVisible ? 'active' : ''}`} onClick={() => setIsNavVisible(!isNavVisible)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default Header;