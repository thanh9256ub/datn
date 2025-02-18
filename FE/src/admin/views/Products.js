import React, { useState, useEffect } from 'react';
import { Table, Button } from "react-bootstrap";
import { getProducts } from '../service/ProductService';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProduct()
    }, [])

    function getAllProduct() {
        getProducts().then((response) => {
            setProducts(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

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
                        <th>Ma san pham</th>
                        <th>Ten san</th>
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
                                {/* <Button variant="warning" onClick={() => handleEdit(product.id)}>Chỉnh sửa</Button>
                                <Button className='ms-3' variant="warning" onClick={() => handleDelete(product.id)}>Xóa</Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Products;
