import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import driverAvatar from '../img/driver-avatar.png';  
import carIcon from '../img/avttaixe.png';  
import '../styles/DriverStatus.css';

const DriverStatus = ({ bookingDetails, onComplete }) => {
  const [driverLocation, setDriverLocation] = useState({ lat: 0, lng: 0 });
  const [driverInfo] = useState({
    name: "Nguyễn Văn A",
    rating: 4.8,
    vehicleNumber: "47A-12345",
    phone: "0123456789",
    avatar: driverAvatar
  });
  const [status, setStatus] = useState('searching');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [route, setRoute] = useState(null);
  const moveIntervalRef = useRef(null);
  const routePointsRef = useRef([]);
  const currentPointIndexRef = useRef(0);
  const [tripStatus, setTripStatus] = useState('finding'); // finding -> picking -> driving -> completed
  const [currentRoute, setCurrentRoute] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // Custom icon for driver
  const customIcon = L.icon({
    iconUrl: carIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });

  // Calculate route points
  const calculateRoute = async (startPoint, endPoint) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        return {
          points: data.routes[0].geometry.coordinates.map(coord => ({
            lat: coord[1],
            lng: coord[0]
          })),
          distance: data.routes[0].distance,
          duration: data.routes[0].duration
        };
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
    return null;
  };

  // Initialize driver and start movement
  useEffect(() => {
    const initializeDriver = async () => {
      // Initial driver position (1km away from pickup)
      const startPoint = {
        lat: bookingDetails.pickupLocation.lat + 0.01,
        lng: bookingDetails.pickupLocation.lng + 0.01
      };

      // Calculate route points
      const routePoints = await calculateRoute(startPoint, bookingDetails.pickupLocation);
      if (routePoints) {
        routePointsRef.current = routePoints.points;
        setDriverLocation(routePoints.points[0]);
        setStatus('found');
        showNotification('Đã tìm thấy tài xế', `${driverInfo.name} sẽ đến đón bạn trong 5 phút`);

        // Start driver movement
        moveIntervalRef.current = setInterval(() => {
          currentPointIndexRef.current += 1;
          
          if (currentPointIndexRef.current >= routePointsRef.current.length) {
            // Driver has arrived
            clearInterval(moveIntervalRef.current);
            setStatus('arrived');
            setShowConfirmation(true);
            showNotification('Tài xế đã đến', 'Tài xế đã đến điểm đón, vui lòng xác nhận');
          } else {
            // Update driver location
            setDriverLocation(routePointsRef.current[currentPointIndexRef.current]);
          }
        }, 1000); // Move every second
      }
    };

    initializeDriver();

    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [bookingDetails]);

  const showNotification = (title, body) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  };

  const handleConfirmPickup = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    
    try {
      setShowConfirmation(false);
      setTripStatus('driving');
      
      // Calculate route to destination
      const destinationRoute = await calculateRoute(
        bookingDetails.pickupLocation,
        bookingDetails.dropoffLocation
      );
      
      if (destinationRoute) {
        setCurrentRoute(destinationRoute.points);
        moveAlongRoute(destinationRoute.points, () => {
          setTripStatus('completed');
          showNotification('Chuyến đi hoàn thành', 'Cảm ơn bạn đã sử dụng dịch vụ');
          setTimeout(() => setShowRating(true), 2000);
        });
      }
    } catch (error) {
      console.error('Error confirming pickup:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const moveAlongRoute = (points, onComplete) => {
    let currentIndex = 0;
    moveIntervalRef.current = setInterval(() => {
      if (currentIndex >= points.length - 1) {
        clearInterval(moveIntervalRef.current);
        onComplete();
        return;
      }

      setDriverLocation(points[currentIndex]);
      // Update remaining distance and time
      const remainingPoints = points.slice(currentIndex);
      setRemainingDistance(calculateRemainingDistance(remainingPoints));
      setEstimatedTime(calculateEstimatedTime(remainingPoints));
      
      currentIndex++;
    }, 1000);
  };

  const stopMovement = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }
  };

  // Helper functions for distance and time calculations
  const calculateRemainingDistance = (points) => {
    // ... distance calculation logic
  };

  const calculateEstimatedTime = (points) => {
    // ... time calculation logic
  };

  const handleRatingSubmit = () => {
    // Handle rating submission logic
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    setShowRating(false);
    onComplete();
  };

  // Thêm kiểm tra dữ liệu
  if (!bookingDetails || !bookingDetails.pickupLocation) {
    return (
      <div className="driver-status-container">
        <div className="status-header">
          <h2>Đã xảy ra lỗi. Vui lòng thử lại.</h2>
        </div>
      </div>
    );
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`star ${rating >= star ? 'selected' : ''}`}
        onClick={() => setRating(star)}
        style={{ 
          cursor: 'pointer',
          fontSize: '24px',
          color: rating >= star ? '#ffd700' : '#ccc',
          transition: 'color 0.2s'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="driver-tracking-container">
      <div className="driver-tracking-layout">
        {/* Map column */}
        <div className="driver-tracking-map">
          <MapContainer
            center={[bookingDetails.pickupLocation.lat, bookingDetails.pickupLocation.lng]}
            zoom={15}
            className="driver-map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker 
                position={[bookingDetails.pickupLocation.lat, bookingDetails.pickupLocation.lng]}
                icon={L.divIcon({
                  className: 'pickup-marker',
                  html: '📍',
                  iconSize: [30, 30],
                  iconAnchor: [15, 30]
                })}
              >
                <Popup>Điểm đón</Popup>
              </Marker>

              {status !== 'searching' && driverLocation.lat !== 0 && (
                <Marker 
                  position={[driverLocation.lat, driverLocation.lng]} 
                  icon={customIcon}
                >
                  <Popup>Tài xế của bạn</Popup>
                </Marker>
              )}

              {/* Route polyline */}
              {route && (
                <Polyline 
                  positions={route}
                  color="#2b4cff"
                  weight={4}
                  opacity={0.6}
                />
              )}
              {/* Show current route */}
              {currentRoute && (
                <Polyline 
                  positions={currentRoute}
                  color="#2b4cff"
                  weight={4}
                  opacity={0.6}
                />
              )}
          </MapContainer>
        </div>

        {/* Info column */}
        <div className="driver-tracking-sidebar">
          <div className="tracking-status">
            <h2>{
              tripStatus === 'finding' ? 'Tài xế đang đến điểm đón...' :
              tripStatus === 'picking' ? 'Tài xế đã đến điểm đón' :
              tripStatus === 'driving' ? 'Đang trên đường đến điểm đến' :
              'Chuyến đi đã hoàn thành'
            }</h2>
          </div>

          {status !== 'searching' && (
            <div className="driver-card">
              <img src={driverInfo.avatar} alt="Driver" />
              <div className="driver-info">
                <h3>{driverInfo.name}</h3>
                <div className="driver-rating">⭐ {driverInfo.rating}</div>
                <div className="driver-vehicle">🚗 {driverInfo.vehicleNumber}</div>
                <div className="driver-phone">📞 {driverInfo.phone}</div>
              </div>
            </div>
          )}

          <div className="trip-card">
            <h3>Chi tiết chuyến đi</h3>
            <div className="trip-info-grid">
              <div className="info-row">
                <span>📍 Điểm đón</span>
                <p>{bookingDetails.pickupAddress}</p>
              </div>
              <div className="info-row">
                <span>🏁 Điểm đến</span>
                <p>{bookingDetails.dropoffAddress}</p>
              </div>
              <div className="info-row">
                <span>📏 Khoảng cách</span>
                <p>{bookingDetails.distance} km</p>
              </div>
              <div className="info-row price">
                <span>💰 Giá tiền</span>
                <p>{bookingDetails.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>

          {status === 'found' && (
            <div className="eta-badge">
              Tài xế sẽ đến trong khoảng 5 phút
            </div>
          )}
          
          {status === 'arrived' && (
            <div className="tracking-confirmation">
              <h3>Tài xế đã đến điểm đón</h3>
              <p>Vui lòng xác nhận để bắt đầu chuyến đi</p>
              <button 
                onClick={handleConfirmPickup} 
                className="confirm-btn"
                disabled={isConfirming}
              >
                {isConfirming ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          )}

          {remainingDistance && estimatedTime && tripStatus === 'driving' && (
            <div className="eta-badge">
              <p>Còn {remainingDistance.toFixed(1)} km</p>
              <p>Khoảng {Math.ceil(estimatedTime)} phút</p>
            </div>
          )}
          
          {tripStatus === 'completed' && (
            <div className="trip-completed">
              <h3>Chuyến đi hoàn thành</h3>
              <p>Cảm ơn bạn đã sử dụng dịch vụ</p>
              <button onClick={() => setShowRating(true)} className="confirm-btn">
                Đánh giá tài xế
              </button>
            </div>
          )}

          {showRating && (
            <div className="rating-overlay">
              <div className="rating-dialog">
                <h3>Đánh giá tài xế</h3>
                <div className="rating-stars">
                  {renderStars()}
                </div>
                <p style={{ marginTop: '10px' }}>
                  {rating === 1 ? 'Rất tệ' : 
                   rating === 2 ? 'Tệ' :
                   rating === 3 ? 'Bình thường' :
                   rating === 4 ? 'Tốt' :
                   rating === 5 ? 'Rất tốt' : 'Chọn đánh giá'}
                </p>
                <textarea
                  placeholder="Nhập phản hồi của bạn..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  style={{ margin: '10px 0', width: '100%', minHeight: '80px' }}
                />
                <button 
                  onClick={handleRatingSubmit} 
                  className="confirm-btn"
                  disabled={!rating}
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverStatus;
