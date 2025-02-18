import React, { useState, useEffect } from 'react';
import { Table, Button } from "react-bootstrap";
import { getProducts } from '../service/ProductService';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProduct()
    }, [])

    function getAllProduct() {
        getProducts()
            .then((response) => {
                console.log("Products data:", response.data);  // Kiểm tra cấu trúc dữ liệu
                setProducts(response.data.data);  // Nếu dữ liệu nằm trong response.data.data
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
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
                        <th>Ten san pham</th>
                        <th>Hang</th>
                        <th>Danh muc</th>
                        <th>Chat lieu</th>
                        <th>Anh chinh</th>
                        <th>Tong so luong</th>
                        <th>Ngay tao</th>
                        <th>Ngay cap nhat</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productCode}</td>
                            <td>{product.productName}</td>
                            <td>{product.brand.brandName}</td>
                            <td>{product.category.categoryName}</td>
                            <td>{product.material.materialName}</td>
                            <td>{product.mainImage}</td>
                            <td>{product.totalQuantity}</td>
                            <td>{new Date(product.createdAt).toLocaleString()}</td>  {/* Định dạng lại ngày */}
                            <td>{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "Chưa cập nhật"}</td>  {/* Kiểm tra giá trị null */}
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
