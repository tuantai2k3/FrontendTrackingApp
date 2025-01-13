import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/OrderFood.css';

const OrderFood = ({ setIsAuthenticated }) => {
  return (
    <div className="order-food">
      <Header setIsAuthenticated={setIsAuthenticated} />
      <main>
        <h1>Đặt đồ ăn</h1>
        <form>
          <label>Nhà hàng</label>
          <input type="text" placeholder="Nhập tên nhà hàng" required />
          <label>Món ăn</label>
          <input type="text" placeholder="Nhập tên món ăn" required />
          <label>Số lượng</label>
          <input type="number" min="1" required />
          <label>Thông tin người gửi</label>
          <input type="text" placeholder="Tên người gửi" required />
          <input type="text" placeholder="Số điện thoại người gửi" required />
          <label>Thông tin người nhận</label>
          <input type="text" placeholder="Tên người nhận" required />
          <input type="text" placeholder="Số điện thoại người nhận" required />
          <button type="submit">Đặt món</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFood;
