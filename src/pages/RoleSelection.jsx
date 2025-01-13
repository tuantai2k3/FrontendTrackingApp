import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaBus, FaArrowLeft } from 'react-icons/fa';
import '../styles/auth.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container role-selection">
      <div className="auth-card role-select-card">
        <div className="auth-header">
          <h2>Bắt đầu với SAFETY ZONE</h2>
          <p>Chọn loại tài khoản phù hợp với bạn</p>
        </div>

        <div className="role-options">
          <div className="role-option passenger" onClick={() => navigate('/register/khach')}>
            <div className="role-icon">
              <FaUserAlt />
            </div>
            <h3>Dành cho hành khách</h3>
            <ul className="role-features">
              <li>Đặt vé xe dễ dàng</li>
              <li>Theo dõi lịch trình</li>
              <li>Ưu đãi đặc biệt</li>
            </ul>
          </div>

          <div className="role-option company" onClick={() => navigate('/register/nha-xe')}>
            <div className="role-icon">
              <FaBus />
            </div>
            <h3>Dành cho nhà xe</h3>
            <ul className="role-features">
              <li>Quản lý đội xe</li>
              <li>Theo dõi doanh thu</li>
              <li>Tối ưu lịch trình</li>
            </ul>
          </div>
        </div>

        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
