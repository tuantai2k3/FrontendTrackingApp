import { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/OrderHistory.css';
import { FaCar, FaUtensils, FaTruck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6; // Số đơn hàng mỗi trang
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch orders from localStorage
    const carOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const foodOrders = JSON.parse(localStorage.getItem('foodOrders')) || [];
    const deliveryOrders = JSON.parse(localStorage.getItem('deliveryOrders')) || [];

    // Combine and format all orders
    const allOrders = [
      ...carOrders.map(order => ({ ...order, type: 'car' })),
      ...foodOrders.map(order => ({ ...order, type: 'food' })),
      ...deliveryOrders.map(order => ({ ...order, type: 'delivery' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    setOrders(allOrders);
  }, []);

  // Tính toán các đơn hàng đã được lọc theo tab
  const filteredOrders = useMemo(() => {
    return activeTab === 'all' 
      ? orders 
      : orders.filter(order => order.type === activeTab);
  }, [orders, activeTab]);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Lấy các đơn hàng cho trang hiện tại
  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  // Reset về trang 1 khi chuyển tab
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOrderIcon = (type) => {
    switch (type) {
      case 'car':
        return <FaCar />;
      case 'food':
        return <FaUtensils />;
      case 'delivery':
        return <FaTruck />;
      default:
        return null;
    }
  };

  const getOrderDetails = (order) => {
    switch (order.type) {
      case 'car':
        return (
          <>
            <p><strong>Điểm đón:</strong> {order.pickupAddress}</p>
            <p><strong>Điểm đến:</strong> {order.dropoffAddress}</p>
            <p><strong>Nhà xe:</strong> {order.selectedCar}</p>
            {order.distance && (
              <p><strong>Khoảng cách:</strong> {order.distance} km</p>
            )}
            {order.price && (
              <p className="order-price">
                <strong>Giá tiền:</strong> {parseInt(order.price).toLocaleString('vi-VN')}đ
              </p>
            )}
          </>
        );
      case 'food':
        return (
          <>
            <p><strong>Nhà hàng:</strong> {order.restaurant}</p>
            <p><strong>Món ăn:</strong> {order.food}</p>
            <p><strong>Số lượng:</strong> {order.quantity}</p>
          </>
        );
      case 'delivery':
        return (
          <>
            <p><strong>Địa chỉ gửi:</strong> {order.pickupAddress}</p>
            <p><strong>Địa chỉ nhận:</strong> {order.deliveryAddress}</p>
            <p><strong>Ngày gửi:</strong> {order.deliveryDate}</p>
          </>
        );
      default:
        return null;
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const filterButtons = [
    { id: 'all', label: 'Tất cả', icon: null },
    { id: 'car', label: 'Đặt xe', icon: <FaCar /> },
    { id: 'food', label: 'Đặt đồ ăn', icon: <FaUtensils /> },
    { id: 'delivery', label: 'Vận chuyển', icon: <FaTruck /> }
  ];

  // Pagination component với chức năng mới
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisibleButtons = 3; // Số nút trang hiển thị tối đa

      if (totalPages <= maxVisibleButtons) {
        // Hiển thị tất cả các trang nếu tổng số trang nhỏ hơn hoặc bằng maxVisibleButtons
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Hiển thị trang đầu, trang hiện tại và trang cuối
        if (currentPage === 1) {
          pages.push(1, 2, '...', totalPages);
        } else if (currentPage === totalPages) {
          pages.push(1, '...', totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage, '...', totalPages);
        }
      }

      return pages.map((page, index) => {
        if (page === '...') {
          return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
        }
        return (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        );
      });
    };

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </button>
        {renderPageNumbers()}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
    );
  };

  return (
    <div className="order-history">
      <Header setIsAuthenticated={setIsAuthenticated} />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        ref={containerRef}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Lịch sử giao dịch
        </motion.h1>
        
        <motion.div 
          className="order-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filterButtons.map(button => (
            <motion.button 
              key={button.id}
              className={activeTab === button.id ? 'active' : ''}
              onClick={() => setActiveTab(button.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {button.icon && <span className="button-icon">{button.icon}</span>}
              {button.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="orders-container"
          layout
        >
          <AnimatePresence mode="wait">
            {currentOrders.length > 0 ? (
              <motion.div
                key={`${activeTab}-${currentPage}`}
                className="orders-grid"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                  exit: { opacity: 0 }
                }}
              >
                {currentOrders.map((order, index) => (
                  <motion.div
                    key={index}
                    className={`order-card ${order.type}`}
                    variants={cardVariants}
                    custom={index}
                    layout
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div 
                      className="order-icon"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {getOrderIcon(order.type)}
                    </motion.div>
                    <div className="order-info">
                      <div className="order-header">
                        <h3>{order.customerName}</h3>
                        <span className="order-date">{order.date}</span>
                      </div>
                      <motion.div
                        className="order-details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {getOrderDetails(order)}
                        <p><strong>Số điện thoại:</strong> {order.customerPhone}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                className="no-orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                Không có đơn hàng nào
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <Pagination />
      </motion.main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
