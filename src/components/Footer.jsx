import { useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useSpring, animated, config } from '@react-spring/web';
import '../styles/Footer.css';
import logo from '../img/logo.png';

const Footer = () => {
  const [fadeIn, setFadeIn] = useSpring(() => ({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 0, transform: 'translateY(20px)' },
    config: { ...config.gentle, duration: 500 }
  }));

  useEffect(() => {
    // Start animation immediately when component mounts
    setFadeIn({
      opacity: 1,
      transform: 'translateY(0)',
      immediate: false
    });
  }, []);

  const socialIconSpring = useSpring({
    from: { scale: 1 },
    to: { scale: 1.2 },
    config: { mass: 1, tension: 300, friction: 10 },
  });

  const buttonSpring = useSpring({
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.05)' },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const sections = [
    {
      type: 'about',
      content: (
        <>
          <img src={logo} alt="Safety Logo" className="footer-logo" />
          <p className="about-text">
            SAFETY - Giải pháp dịch vụ an toàn và đáng tin cậy hàng đầu
          </p>
          <div className="social-links">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
              <animated.a
                key={index}
                href="#"
                style={{
                  ...socialIconSpring,
                  display: 'inline-block',
                  willChange: 'transform',
                }}
                onMouseEnter={() => socialIconSpring.start({ scale: 1.2 })}
                onMouseLeave={() => socialIconSpring.start({ scale: 1 })}
              >
                <Icon />
              </animated.a>
            ))}
          </div>
        </>
      )
    },
    {
      type: 'links',
      content: (
        <>
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="/services">Dịch vụ</a></li>
            <li><a href="/support">Hỗ trợ khách hàng</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
            <li><a href="/terms">Điều khoản sử dụng</a></li>
          </ul>
        </>
      )
    },
    {
      type: 'services',
      content: (
        <>
          <h3>Dịch vụ nổi bật</h3>
          <ul>
            <li><a href="/cleaning">Dịch vụ vệ sinh</a></li>
            <li><a href="/health">Chăm sóc sức khỏe</a></li>
            <li><a href="/maintenance">Sửa chữa & bảo trì</a></li>
            <li><a href="/food">Ẩm thực & Nhà hàng</a></li>
          </ul>
        </>
      )
    },
    {
      type: 'newsletter',
      content: (
        <>
          <h3>Đăng ký nhận tin</h3>
          <p>Nhận ưu đãi độc quyền và cập nhật mới nhất từ chúng tôi!</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn..." />
            <button type="submit">Đăng ký</button>
          </form>
        </>
      )
    },
    {
      type: 'contact',
      content: (
        <>
          <h3>Liên hệ</h3>
          <p><FaMapMarkerAlt /> 123 Đường Lê Thánh Tông, TP.BMT, Việt Nam</p>
          <p><FaPhoneAlt /> (+84) 856232253</p>
          <p><FaEnvelope /> tuantai2k3bmt@gmail.com</p>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1944.4141536735461!2d108.04032227617611!3d12.685132791003787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171f7d472e23725%3A0x3a157a3d3b898a4!2zTmcuIDEyIEzDqiBEdeG6qW4sIFTDom4gTOG7o2ksIFRow6BuaCBwaOG7kSBCdcO0biBNYSBUaHXhu5l0LCDEkOG6r2sgTOG6r2ssIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710036431809!5m2!1svi!2s"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </>
      )
    }
  ];

  return (
    <animated.footer className="footer" style={fadeIn}>
      <div className="footer-content">
        {sections.map(({type, content}, index) => (
          <animated.div
            key={type}
            className={`footer-section ${type}`}
            style={{
              ...fadeIn,
              delay: 100 * index
            }}
          >
            {content}
          </animated.div>
        ))}
      </div>
      <animated.div className="footer-bottom" style={fadeIn}>
        <div className="footer-section links">
          <p>&copy; 2025 SAFETY. Mọi quyền được bảo lưu. | Thiết kế bởi DAK System</p>
        </div>
      </animated.div>
    </animated.footer>
  );
};

export default Footer;