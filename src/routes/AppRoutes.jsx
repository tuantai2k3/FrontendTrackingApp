import { Routes, Route } from 'react-router-dom';
import RoleSelection from '../pages/RoleSelection';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home'; // Add this import

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/home" element={<Home />} /> {/* Add this route */}
    </Routes>
  );
};

export default AppRoutes;
