import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaBus, FaMapMarkedAlt } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import '../styles/auth.css';

const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: role === 'khach' ? 'Khách' : 'Nhà xe',
    role: role,
    companyName: role === 'nha-xe' ? '' : null,
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = role === 'khach' ? [
    {
      title: "Tham gia cùng SAFETY ZONE",
      description: "Trải nghiệm dịch vụ đặt vé xe trực tuyến tiện lợi và an toàn",
      features: [
        { icon: FaBus, text: "Đa dạng lựa chọn nhà xe" },
        { icon: FaMapMarkedAlt, text: "Tìm kiếm tuyến đường dễ dàng" },
      ]
    },
    {
      title: "Đặc quyền thành viên",
      description: "Nhận ngay ưu đãi khi đăng ký thành viên",
      features: [
        { icon: FaUser, text: "Tích điểm đổi quà" },
        { icon: FaBuilding, text: "Ưu đãi độc quyền" },
      ]
    }
  ] : [
    {
      title: "Tham gia cùng SAFETY ZONE",
      description: "Trải nghiệm tốt nhất cho bạn",
      features: [
        { icon: FaUser, text: "Dịch vụ an toàn" },
        { icon: FaBuilding, text: "Dễ dàng sử dụng" },
      ]
    },
    {
      title: "Quản lý dễ dàng",
      description: "Công cụ quản lý hiện đại",
      features: [
        { icon: FaBus, text: "Theo dõi đơn hàng realtime" },
        { icon: FaMapMarkedAlt, text: "Báo cáo chi tiết" },
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      createdAt: new Date().toISOString()
    };
    
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, userData]));
    
    // Đăng nhập ngay sau khi đăng ký
    login(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-slides">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`welcome-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                
                <div className="features-list">
                  {slide.features.map((feature, fIndex) => (
                    <div key={fIndex} className="feature-item">
                      <feature.icon className="feature-icon" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="slide-indicators">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng ký {role === 'khach' ? 'Khách hàng' : 'Nhà xe'}</h2>
          <p>Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {role === 'nha-xe' && (
            <div className="form-group">
              <FaBuilding className="input-icon" />
              <input
                type="text"
                name="companyName"
                placeholder="Tên công ty"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-button">Đăng ký</button>
        </form>

        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
