import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaBus, FaMapMarkedAlt, FaClock, FaShieldAlt } from 'react-icons/fa';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { login } = useUser();  

  const slides = [
    {
      title: "Chào mừng đến với SAFETY ZONE",
      description: "Hệ thống đặt vé xe trực tuyến hàng đầu Việt Nam",
      subDescription: "Dễ dàng - Nhanh chóng - An toàn",
      features: [
        { icon: FaBus, text: "Đặt vé xe trực tuyến 24/7" },
        { icon: FaMapMarkedAlt, text: "Tra cứu lộ trình dễ dàng" },
      ]
    },
    {
      title: "Tại sao chọn SAFETY ZONE?",
      description: "Trải nghiệm dịch vụ tốt nhất",
      subDescription: "An toàn - Tiện lợi - Chuyên nghiệp",
      features: [
        { icon: FaClock, text: "Tiết kiệm thời gian di chuyển" },
        { icon: FaShieldAlt, text: "Thanh toán an toàn, bảo mật" },
      ]
    },
    {
      title: "Ưu đãi hấp dẫn",
      description: "Nhiều chương trình khuyến mãi",
      subDescription: "Giá tốt - Dịch vụ chất lượng",
      features: [
        { icon: FaBus, text: "Ưu đãi đặc biệt cho khách hàng mới" },
        { icon: FaMapMarkedAlt, text: "Tích điểm đổi quà hấp dẫn" },
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      login(user); // Sử dụng context login
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true'); 
      navigate('/home');
    } else {
      alert('Email hoặc mật khẩu không đúng!');
    }
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
                <p>{slide.subDescription}</p>
                
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
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn trở lại!</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">Đăng nhập</button>
        </form>

        <div className="auth-footer">
          <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
          <Link to="/forgot-password" className="forgot-password">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
