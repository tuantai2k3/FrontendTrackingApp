import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import { useState, useEffect } from 'react';
import './styles/index.css';
import { UserProvider } from './context/UserContext';
import Profile from './pages/Profile';
import BookCar from './pages/BookCar';
import OrderFood from './pages/OrderFood';
import Delivery from './pages/Delivery';
import OrderHistory from './pages/OrderHistory';
import ServiceIntro from './pages/ServiceIntro'; // Thêm import cho ServiceIntro

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route path="/register" element={<RoleSelection />} />
        <Route path="/register/:role" element={<Register />} />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/book-car" 
          element={isAuthenticated ? <BookCar setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/order-food" 
          element={isAuthenticated ? <OrderFood setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/delivery" 
          element={isAuthenticated ? <Delivery setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/order-history" 
          element={isAuthenticated ? <OrderHistory setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/service-intro" 
          element={isAuthenticated ? <ServiceIntro setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </UserProvider>
  );
};

export default App;