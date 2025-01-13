import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Delivery.css';

const Delivery = ({ setIsAuthenticated }) => {
  return (
    <div className="delivery">
      <Header setIsAuthenticated={setIsAuthenticated} />
      <main>
        <h1>Đặt giao hàng</h1>
        <form>
          <label>Địa chỉ gửi</label>
          <input type="text" placeholder="Nhập địa chỉ gửi" required />
          <label>Địa chỉ nhận</label>
          <input type="text" placeholder="Nhập địa chỉ nhận" required />
          <label>Ngày gửi</label>
          <input type="date" required />
          <label>Thông tin người gửi</label>
          <input type="text" placeholder="Tên người gửi" required />
          <input type="text" placeholder="Số điện thoại người gửi" required />
          <label>Thông tin người nhận</label>
          <input type="text" placeholder="Tên người nhận" required />
          <input type="text" placeholder="Số điện thoại người nhận" required />
          <button type="submit">Gửi hàng</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;
