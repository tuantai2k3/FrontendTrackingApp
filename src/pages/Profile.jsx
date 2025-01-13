import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaBuilding, FaUserTag, FaPen, FaTimes, FaSave, FaHome } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Profile.css';

const Profile = () => {
  const { user, login } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = users.map(u => 
      u.email === user.email ? editedData : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    login(editedData);
    setIsEditing(false);
  };

  // Get account type from user data
  const accountTypeDisplay = user.accountType || (user.role === 'khach' ? 'Khách hàng' : 'Nhà xe');

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUser />
              <h2>{user.fullName}</h2>
              <span className="user-type">{user.userType}</span>
            </div>
          </div>

          <div className="profile-content">
            {isEditing ? (
              <form className="edit-form">
                <div className="form-group">
                  <FaUser className="field-icon" />
                  <input
                    type="text"
                    name="fullName"
                    value={editedData.fullName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên"
                  />
                </div>

                <div className="form-group">
                  <FaEnvelope className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>

                <div className="form-group">
                  <FaUserTag className="field-icon" />
                  <input
                    type="text"
                    value={user.userType}
                    disabled
                    className="disabled-input"
                  />
                </div>

                {user.role === 'nha-xe' && (
                  <div className="form-group">
                    <FaBuilding className="field-icon" />
                    <input
                      type="text"
                      name="companyName"
                      value={editedData.companyName}
                      onChange={handleInputChange}
                      placeholder="Tên nhà xe"
                    />
                  </div>
                )}
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <FaUser className="info-icon" />
                  <div className="info-content">
                    <label>Họ và tên</label>
                    <p>{user.fullName}</p>
                  </div>
                </div>

                <div className="info-group">
                  <FaEnvelope className="info-icon" />
                  <div className="info-content">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="info-group">
                  <FaUserTag className="info-icon" />
                  <div className="info-content">
                    <label>Loại tài khoản</label>
                    <p>{user.userType}</p>
                  </div>
                </div>

                {user.role === 'nha-xe' && (
                  <div className="info-group">
                    <FaBuilding className="info-icon" />
                    <div className="info-content">
                      <label>Tên nhà xe</label>
                      <p>{user.companyName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="action-button save" onClick={handleSave}>
                  <FaSave /> Lưu thay đổi
                </button>
                <button className="action-button cancel" onClick={() => setIsEditing(false)}>
                  <FaTimes /> Hủy
                </button>
              </>
            ) : (
              <button className="action-button edit" onClick={() => setIsEditing(true)}>
                <FaPen /> Chỉnh sửa
              </button>
            )}
            <button className="action-button edit" onClick={() => navigate('/home')}>
              <FaHome /> Về trang chủ
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
