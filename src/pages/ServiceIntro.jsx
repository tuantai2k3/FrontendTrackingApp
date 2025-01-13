import React, { useState } from 'react'; // Thêm useState
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ServiceIntro.css';
import { FaClock, FaMoneyBillWave, FaShieldAlt, FaMapMarkedAlt } from 'react-icons/fa';

// Thêm ảnh hướng dẫn
import step1Img from '../img/step1.png';
import step2Img from '../img/step2.png';
import step3Img from '../img/step3.png';
import step4Img from '../img/step4.png';

const ServiceIntro = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);

  const steps = [
    {
      number: 1,
      title: "Chọn điểm đón",
      description: "Nhập địa chỉ đón hoặc chọn trực tiếp trên bản đồ",
      image: step1Img
    },
    {
      number: 2,
      title: "Chọn điểm đến",
      description: "Xác định điểm đến của bạn",
      image: step2Img
    },
    {
      number: 3,
      title: "Chọn loại xe",
      description: "Lựa chọn phương tiện phù hợp với nhu cầu",
      image: step3Img
    },
    {
      number: 4,
      title: "Xác nhận đặt xe",
      description: "Kiểm tra thông tin và hoàn tất đặt xe",
      image: step4Img
    }
  ];

  const handleStepClick = (stepNumber) => {
    if (selectedStep === stepNumber) {
      setSelectedStep(null);
    } else {
      setSelectedStep(stepNumber);
    }
  };

  const handleOverlayClick = () => {
    setSelectedStep(null);
  };

  const handleStartBooking = () => {
    navigate('/book-car'); // Sửa từ '/bookcar' thành '/book-car'
  };

  return (
    <div className="service-intro">
      <Header setIsAuthenticated={setIsAuthenticated} />
      <main>
        <section className="service-intro-hero"> 
          <h1 className="service-intro-title">Dịch Vụ Đặt Xe Trực Tuyến</h1>
          <p>Giải pháp di chuyển thông minh, nhanh chóng và tiện lợi</p>
        </section>

        <section className="features-section">
          <h2>Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            <div className="guide-section">
              <FaClock className="feature-icon" />
              <h3>Đặt xe nhanh chóng</h3>
              <p>Chỉ mất vài phút để đặt xe và nhận phản hồi</p>
            </div>
            <div className="guide-section">
              <FaMoneyBillWave className="feature-icon" />
              <h3>Giá cả hợp lý</h3>
              <p>Cam kết mức giá tốt nhất cho khách hàng</p>
            </div>
            <div className="guide-section">
              <FaShieldAlt className="feature-icon" />
              <h3>An toàn tin cậy</h3>
              <p>Đội ngũ tài xế chuyên nghiệp, được kiểm tra kỹ lưỡng</p>
            </div>
            <div className="guide-section">
              <FaMapMarkedAlt className="feature-icon" />
              <h3>Theo dõi hành trình</h3>
              <p>Xem vị trí xe theo thời gian thực</p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Hướng dẫn sử dụng dịch vụ</h2>
          <div className="steps-wrapper">
            <div className="steps-container">
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className={`step ${selectedStep === step.number ? 'active' : ''}`}
                  onClick={() => handleStepClick(step.number)}
                >
                  {selectedStep === step.number ? (
                    <>
                      <div className="step-content">
                        <div className="step-number">{step.number}</div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                      <div className="step-image-container">
                        <img 
                          src={step.image} 
                          alt={step.title} 
                          className="step-image"
                          loading="lazy"
                        />
                      </div>
                      <button 
                        className="close-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStep(null);
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="step-number">{step.number}</div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            {selectedStep && (
              <div 
                className="step-overlay active" 
                onClick={() => setSelectedStep(null)}
              />
            )}
          </div>
          <button className="start-booking-btn" onClick={handleStartBooking}>
            Sử dụng ngay
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceIntro;
