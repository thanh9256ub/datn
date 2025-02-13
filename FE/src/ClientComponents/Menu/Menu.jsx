import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Menu = () =>  {
  const [active, setActive] = useState("/");
  
  const menuItems = [
    { path: "/banhang", name: "Bán hàng" },
    { path: "/sanpham", name: "Quản lý sản phẩm" },
    { path: "/nhanvien", name: "Quản lý nhân viên" },
    { path: "/khachhang", name: "Quản lý khách hàng" },
    { path: "/donhang", name: "Quản lý đơn hàng" },
  ];

  return (
    <div className="bg-dark text-white p-3 vh-100 d-flex flex-column" style={{ width: "250px" }}>
      <ul className="nav flex-column flex-grow-1">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white ${active === item.path ? "active bg-primary" : ""}`}
              onClick={() => setActive(item.path)}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Menu