import React, { useState } from 'react';
import { Table, Button } from "react-bootstrap";

// Dữ liệu mẫu cho sản phẩm
const productData = [
    { id: 1, name: 'Sản phẩm 1', price: '100.000đ' },
    { id: 2, name: 'Sản phẩm 2', price: '200.000đ' },
    { id: 3, name: 'Sản phẩm 3', price: '300.000đ' }
];

const Products = () => {
    const [products, setProducts] = useState(productData);

    const handleEdit = (id) => {
        alert(`Chỉnh sửa sản phẩm có ID: ${id}`);
    };

    const handleDelete = (id) => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
    };

    return (
        <div>
            <h2><strong>Quản lý sản phẩm</strong></h2><br />
            <h4>Danh sách sản phẩm</h4>
            <Button variant="success" className="mb-3">
                Thêm mới
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(product.id)}>Chỉnh sửa</Button>
                                <Button className='ms-3' variant="warning" onClick={() => handleDelete(product.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Products;
