import { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

export default function GioHang() {
  const [cart, setCart] = useState([
    { name: "Giày gấu - 40 - cam", price: 400000, quantity: 3 },
    { name: "Giày mèo - 38 - xanh", price: 300000, quantity: 1 },
  ]);

  const updateQuantity = (index, quantity) => {
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-primary rounded p-3">
      <h5>Giỏ hàng</h5>
      <hr />
      <Table bordered hover>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.price.toLocaleString()}</td>
              <td>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                  className="text-center"
                />
              </td>
              <td>{(item.price * item.quantity).toLocaleString()}</td>
              <td>
                <Button variant="link" onClick={() => removeItem(index)}>
                  <Trash size={20} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
