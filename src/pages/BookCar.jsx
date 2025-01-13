import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/BookCar.css';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import DriverStatus from '../components/DriverStatus';

// Khắc phục lỗi icon của marker
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Thêm hằng số cho giá cước
const PRICE_PER_KM = {
  'Xe máy': 10000,
  'Xe máy điện': 12000,
  'Taxi': 15000,
  'Taxi điện': 18000
};

const BASE_FARE = {
  'Xe máy': 15000,
  'Xe máy điện': 18000,
  'Taxi': 25000,
  'Taxi điện': 29000
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const BookCar = ({ setIsAuthenticated }) => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [isSelectingPickup, setIsSelectingPickup] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [duration, setDuration] = useState(null);
  const [showDriverStatus, setShowDriverStatus] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const handleMapClick = async (latlng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` + 
      new URLSearchParams({
        lat: latlng.lat,
        lon: latlng.lng,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'vi'
      })
    );
    const data = await response.json();
    const address = data.display_name;

    if (isSelectingPickup) {
      setPickupLocation(latlng);
      setPickupAddress(address);
      setIsSelectingPickup(false);
    } else {
      setDropoffLocation(latlng);
      setDropoffAddress(address);
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        new URLSearchParams({
          q: searchQuery,
          format: 'json',
          addressdetails: 1,
          limit: 10,
          countrycodes: 'vn', // Giới hạn tìm kiếm ở Việt Nam
          'accept-language': 'vi' // Kết quả bằng tiếng Việt
        })
      );
      const data = await response.json();
      setSuggestions(data.map(item => ({
        name: item.display_name,
        center: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      })));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchResult(suggestion.center);
    if (isSelectingPickup) {
      setPickupLocation(suggestion.center);
      setPickupAddress(suggestion.name);
      setIsSelectingPickup(false);
    } else {
      setDropoffLocation(suggestion.center);
      setDropoffAddress(suggestion.name);
    }
    setSuggestions([]);
  };

  const handleConfirmBooking = () => {
    if (pickupLocation && dropoffLocation && customerName && customerPhone && selectedCar) {
      const calculatedDistance = calculateDistance(pickupLocation, dropoffLocation);
      const calculatedPrice = calculatePrice(calculatedDistance, selectedCar);

      const bookingDetails = {
        customerName,
        customerPhone,
        pickupLocation,
        dropoffLocation,
        pickupAddress,
        dropoffAddress,
        selectedCar,
        distance: calculatedDistance,
        price: calculatedPrice,
        date: new Date().toLocaleString(),
      };

      // Kiểm tra dữ liệu trước khi chuyển đổi trạng thái
      if (
        bookingDetails.pickupLocation &&
        bookingDetails.dropoffLocation &&
        bookingDetails.pickupAddress &&
        bookingDetails.dropoffAddress
      ) {
        setCurrentBooking(bookingDetails);
        setShowDriverStatus(true);

        try {
          const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
          localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, bookingDetails]));
        } catch (error) {
          console.error('Error saving order:', error);
        }
      } else {
        alert('Vui lòng chọn điểm đón và điểm đến');
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  };

  // Thêm hàm tính khoảng cách trực tiếp
  const calculateDistance = (pickup, dropoff) => {
    const R = 6371; // Radius of the Earth in km
    const lat1 = pickup.lat * Math.PI / 180;
    const lat2 = dropoff.lat * Math.PI / 180;
    const deltaLat = (dropoff.lat - pickup.lat) * Math.PI / 180;
    const deltaLon = (dropoff.lng - pickup.lng) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  // Sửa lại hàm calculatePrice
  const calculatePrice = (distanceInKm, vehicleType) => {
    console.log('Calculating price:', { distanceInKm, vehicleType });
    if (!distanceInKm || !vehicleType) return 0;
    const baseFare = BASE_FARE[vehicleType];
    const perKmRate = PRICE_PER_KM[vehicleType];
    const totalPrice = baseFare + (parseFloat(distanceInKm) * perKmRate);
    console.log('Calculated price:', totalPrice);
    return totalPrice;
  };

  useEffect(() => {
    const savedOrderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    setOrderHistory(savedOrderHistory);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Cập nhật khi thay đổi phương tiện
  useEffect(() => {
    if (distance && selectedCar) {
      setPrice(calculatePrice(parseFloat(distance), selectedCar));
    }
  }, [selectedCar, distance]);

  // Sửa lại useEffect để tự động tính toán khi có đủ thông tin
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      const calculatedDistance = calculateDistance(pickupLocation, dropoffLocation);
      setDistance(calculatedDistance);
      setDuration(Math.round(calculatedDistance * 3)); // Ước tính thời gian: 3 phút/km

      if (selectedCar) {
        const calculatedPrice = calculatePrice(calculatedDistance, selectedCar);
        setPrice(calculatedPrice);
      }
    }
  }, [pickupLocation, dropoffLocation, selectedCar]);

  // Sửa lại RouteControl component
  const RouteControl = ({ pickupLocation, dropoffLocation }) => {
    const map = useMap();

    useEffect(() => {
      if (pickupLocation && dropoffLocation) {
        console.log('Creating route between:', { pickupLocation, dropoffLocation });
        
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(pickupLocation.lat, pickupLocation.lng),
            L.latLng(dropoffLocation.lat, pickupLocation.lng)
          ],
          routeWhileDragging: false,
          lineOptions: { styles: [{ color: '#6FA1EC', weight: 4 }] },
          show: true, // Thay đổi thành true để hiển thị thông tin route
          showAlternatives: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
          const route = e.routes[0];
          const distanceInKm = (route.summary.totalDistance / 1000).toFixed(1);
          const durationInMins = Math.round(route.summary.totalTime / 60);
          
          console.log('Route found:', { distanceInKm, durationInMins });
          
          setDistance(distanceInKm);
          setDuration(durationInMins);
          
          if (selectedCar) {
            const calculatedPrice = calculatePrice(distanceInKm, selectedCar);
            console.log('Setting price:', calculatedPrice);
            setPrice(calculatedPrice);
          }
        });

        return () => map.removeControl(routingControl);
      }
    }, [map, pickupLocation, dropoffLocation, selectedCar]); // Thêm selectedCar vào dependencies

    return null;
  };

  // Thêm useEffect để tự động tính lại giá khi chọn xe hoặc khoảng cách thay đổi
  useEffect(() => {
    if (distance && selectedCar) {
      const newPrice = calculatePrice(distance, selectedCar);
      console.log('Updating price:', newPrice);
      setPrice(newPrice);
    }
  }, [selectedCar, distance]);

  const handleTripComplete = () => {
    setShowDriverStatus(false);
    // Reset form or redirect to another page
  };

  return (
    <div className="book-car">
      <Header setIsAuthenticated={setIsAuthenticated} />
      {!showDriverStatus ? (
        // Booking section
        <main>
          <div className="left-section">
            <div className="map-container">
              <MapContainer center={[21.0285, 105.8542]} zoom={13}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onMapClick={handleMapClick} />
                {pickupLocation && (
                  <Marker 
                    position={[pickupLocation.lat, pickupLocation.lng]}
                    icon={L.divIcon({ className: 'pickup-marker', html: '📍 Điểm đón' })}
                  />
                )}
                {dropoffLocation && (
                  <Marker 
                    position={[dropoffLocation.lat, dropoffLocation.lng]}
                    icon={L.divIcon({ className: 'dropoff-marker', html: '🏁 Điểm đến' })}
                  />
                )}
                {searchResult && (
                  <Marker 
                    position={[searchResult.lat, searchResult.lng]}
                    icon={L.divIcon({ className: 'search-result-marker', html: '🔍 Kết quả tìm kiếm' })}
                  />
                )}
                {showRoute && pickupLocation && dropoffLocation && (
                  <RouteControl pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
                )}
              </MapContainer>
            </div>
          </div>

          <div className="right-section">
            <h1>Đặt xe</h1>
            <div className="search-container">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder={isSelectingPickup ? 
                  "Nhập địa chỉ điểm đón" : 
                  "Nhập địa chỉ điểm đến"
                } 
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="booking-instructions">
              <p>{isSelectingPickup ? 'Chọn điểm đón' : 'Chọn điểm đến'}</p>
              {pickupAddress && !dropoffAddress && (
                <p>Điểm đón: {pickupAddress}</p>
              )}
              {dropoffAddress && (
                <p>Điểm đến: {dropoffAddress}</p>
              )}
            </div>

            {distance && duration && (
              <div className="trip-info">
                <h3>Thông tin chuyến đi</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Khoảng cách:</span>
                    <span className="info-value">{distance} km</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Thời gian ước tính:</span>
                    <span className="info-value">{duration} phút</span>
                  </div>
                  {price && (
                    <div className="info-item price">
                      <span className="info-label">Giá ước tính:</span>
                      <span className="info-value">
                        {price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form className="booking-form">
              <label>
                Tên khách hàng:
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                />
              </label>
              <label>
                Số điện thoại:
                <input 
                  type="text" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)} 
                  required 
                />
              </label>
              <label>
                Chọn dịch vụ:
                <select 
                  value={selectedCar} 
                  onChange={(e) => setSelectedCar(e.target.value)} 
                  required
                >
                  <option value="">Chọn phương tiện</option>
                  <option value="Xe máy">Xe máy</option>
                  <option value="Xe máy điện">Xe máy điện</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Taxi điện">Taxi điện</option>
                </select>
              </label>
              <div className="booking-actions">
                <button type="button" onClick={() => {
                  setPickupLocation(null);
                  setDropoffLocation(null);
                  setPickupAddress('');
                  setDropoffAddress('');
                  setIsSelectingPickup(true);
                  setShowRoute(false);
                  setSearchResult(null);
                  setSearchQuery('');
                  setSuggestions([]);
                  setCustomerName('');
                  setCustomerPhone('');
                  setSelectedCar('');
                }}>
                  Đặt lại điểm
                </button>
                {pickupLocation && dropoffLocation && !showRoute && (
                  <button type="button" onClick={handleConfirmBooking}>
                    Xác nhận đặt xe
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      ) : (
        // Driver status section with its own layout
        <DriverStatus 
          bookingDetails={currentBooking}
          onComplete={handleTripComplete}
        />
      )}
      <Footer />
    </div>
  );
};

export default BookCar;
