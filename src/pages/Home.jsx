import Slider from 'react-slick';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/App.css';
import '../styles/services.css';
import '../styles/Home.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { FaGooglePlay, FaApple, FaCar, FaMoneyBillWave, FaClock, FaUserFriends } from 'react-icons/fa';
import qrCode from '../img/qr-code.png';

// Import images
import slide1 from '../img/slide1.png';
import slide2 from '../img/slide2.png'; 
import slide3 from '../img/slide3.png'; 
import baidang1 from '../img/baidang1.png';
import baidang2 from '../img/baidang2.jpg';
import baidang3 from '../img/baidang3.png';
import dathang from '../img/dathang.png';
import giaohangnhanh from '../img/giaohangnhanh.png';
import datxethongminh from '../img/datxethongminh.png';
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [isAuthenticated, navigate]);

  // Nếu không xác thực, trả về null nhưng vẫn render component
  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, margin: "-100px" },
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    }
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -10,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.1)"
    }
  };

  const services = [
    {
      title: "Đặt đồ ăn nhanh chóng",
      description: ["Giao đồ ăn trong 30 phút", "Đa dạng nhà hàng", "Ưu đãi hấp dẫn mỗi ngày"],
      icon: "🍽️",
      image: dathang 
    },
    {
      title: "Giao hàng siêu tốc",
      description: ["Giao hàng 24/7", "Theo dõi đơn hàng trực tiếp", "Đảm bảo an toàn"],
      icon: "🚚",
      image: giaohangnhanh 
    },
    {
      title: "Đặt xe thông minh",
      description: ["Tài xế chuyên nghiệp", "Đa dạng phương tiện", "Giá cả cạnh tranh"],
      icon: "🚗",
      image: datxethongminh 
    }
  ];

  return (
    <div className="home">
      <Header />
      <main>
        <div className="hero-section">
          <div className="slider-container">
            <Slider {...settings}>
              <div>
                <img src={slide1} alt="Slide 1" />
              </div>
              <div>
                <img src={slide2} alt="Slide 2" />
              </div>
              <div>
                <img src={slide3} alt="Slide 3" />
              </div>
            </Slider>
          </div>

          <div className="download-app">
            <h2>Tải ứng dụng ngay!</h2>
            <p>Trải nghiệm dịch vụ tốt nhất với ứng dụng của chúng tôi</p>
            <div className="download-buttons">
              <button className="download-button">
                <FaGooglePlay /> Google Play
              </button>
              <button className="download-button">
                <FaApple /> App Store
              </button>
            </div>
            <div className="qr-code-container">
              <p>Hoặc quét mã QR</p>
              <img src={qrCode} alt="QR Code" className="qr-code" />
            </div>
          </div>
        </div>

        {/* Add this after the Slider section */}
        <div className="marquee-container">
          <div className="marquee-wrapper">
            <span className="marquee-text">
              🚀 Ưu đãi đặc biệt - Giảm 30% cho đơn hàng đầu tiên 
            </span>
            <span className="marquee-text">
              🎉 Miễn phí giao hàng trong ngày hôm nay 
            </span>
            <span className="marquee-text">
              💫 Tải ứng dụng ngay - Nhận thêm ưu đãi
            </span>
            {/* Duplicate the text for seamless looping */}
            <span className="marquee-text">
              🚀 Ưu đãi đặc biệt - Giảm 30% cho đơn hàng đầu tiên 
            </span>
            <span className="marquee-text">
              🎉 Miễn phí giao hàng trong ngày hôm nay 
            </span>
            <span className="marquee-text">
              💫 Tải ứng dụng ngay - Nhận thêm ưu đãi
            </span>
          </div>
        </div>

        {/* Updated Services Section */}
        <motion.section
          className="services"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h2 
            className='h2services'
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Các dịch vụ nổi bật
          </motion.h2>
          <div className="service-cards">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                variants={serviceVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  if (index === 2) { // Nếu là card "Đặt xe thông minh"
                    navigate('/service-intro');
                  }
                  // Thêm điều hướng cho các dịch vụ khác nếu cần
                }}
              >
                <motion.span
                  className="service-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2, type: "spring" }}
                >
                  {service.icon}
                </motion.span>
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                />
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                >
                  {service.title}
                </motion.h3>
                <motion.div
                  className="service-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.4 }}
                >
                  {service.description.map((item, i) => (
                    <motion.p
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                    >
                      {item}
                    </motion.p>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Latest News */}
        <motion.section
          className="latest-news"
          {...fadeInUp}
        >
          <h2>Tin tức mới nhất</h2>
          <div className="news-grid">
            <div className="news-card">
              <img src={baidang1} alt="Bài đăng 1" />
              <h3>Ra mắt dịch vụ giao hàng siêu tốc</h3>
              <p>Chúng tôi vừa triển khai dịch vụ giao hàng trong vòng 30 phút tại khu vực nội thành...</p>
              <span className="news-date">15/03/2024</span>
              <a href="#" className="read-more">Đọc thêm</a>
            </div>
            <div className="news-card">
              <img src={baidang2} alt="Bài đăng 2" />
              <h3>Mở rộng đối tác</h3>
              <p>Hợp tác với thêm 100 đối tác mới, mang đến nhiều lựa chọn hơn cho khách hàng...</p>
              <span className="news-date">12/03/2024</span>
              <a href="#" className="read-more">Đọc thêm</a>
            </div>
            <div className="news-card">
              <img src={baidang3} alt="Bài đăng 3" />
              <h3>Chương trình khuyến mãi tháng 3</h3>
              <p>Giảm giá 30% cho tất cả đơn hàng khi sử dụng mã code MARCH2024...</p>
              <span className="news-date">01/03/2024</span>
              <a href="#" className="read-more">Đọc thêm</a>
            </div>
          </div>
        </motion.section>

        

        {/* Add this before Footer */}
        <motion.section 
          className="driver-recruitment"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
        >
          <div className="recruitment-content">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Tham Gia Cộng Đồng Tài Xế
            </motion.h2>
            
            <motion.p 
              className="recruitment-subtitle"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Tự do - Linh hoạt - Thu nhập cao
            </motion.p>

            <div className="benefits-grid">
              {[
                { icon: <FaCar />, title: "Làm Chủ Thời Gian", description: "Tự do lựa chọn giờ làm việc phù hợp" },
                { icon: <FaMoneyBillWave />, title: "Thu Nhập Hấp Dẫn", description: "Kiếm thêm thu nhập lên đến 15 triệu/tháng" },
                { icon: <FaClock />, title: "Thanh Toán Nhanh Chóng", description: "Nhận tiền hàng ngày, không cần chờ đợi" },
                { icon: <FaUserFriends />, title: "Cộng Đồng Lớn Mạnh", description: "Tham gia cộng đồng tài xế chuyên nghiệp" }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-card"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <span className="benefit-icon">{benefit.icon}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="cta-container"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button className="register-button">
                Đăng Ký Ngay
                <span className="arrow">→</span>
              </button>
              <p className="contact-info">
                Hoặc gọi: <a href="tel:1900xxxx">1900 xxxx</a>
              </p>
            </motion.div>
          </div>
        </motion.section>
        {/* Updated Testimonials section */}
        <motion.section
          className="testimonials"
          {...fadeInUp}
        >
          <h2>Khách hàng nói gì về chúng tôi</h2>
          <Slider {...testimonialSettings}>
            <div className="testimonial-card">
              <p>"Dịch vụ rất tuyệt vời!"</p>
              <h4>Trương Anh Quân</h4>
            </div>
            <div className="testimonial-card">
              <p>"Giao hàng nhanh chóng, đúng hẹn"</p>
              <h4>Trần Thị Yến</h4>
            </div>
            <div className="testimonial-card">
              <p>"Ứng dụng dễ sử dụng"</p>
              <h4>Phạm Ngọc Hoàng Nam</h4>
            </div>
          </Slider>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;