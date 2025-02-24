import React from 'react';
import { Table, Form } from 'react-bootstrap';

const ProductTable = ({ filteredItems, handleQuantityChange, handleRemoveItem }) => {
  return (
    <div className="table-responsive">
      <Table hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price.toLocaleString()} VND</td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  style={{ width: "100px" }}
                />
              </td>
              <td>{item.total.toLocaleString()} VND</td>
              <td>
                <i
                  className="mdi mdi-cart-off" 
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                  onClick={() => handleRemoveItem(item.id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;
