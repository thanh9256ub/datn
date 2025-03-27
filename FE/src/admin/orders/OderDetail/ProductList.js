// ProductList.js
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Image } from 'react-bootstrap';

const ProductList = ({ products, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct({ ...selectedProduct, [name]: value });
    };

    const handleSubmit = () => {
        onUpdate(selectedProduct);
        setShowModal(false);
    };

    return (
        <>
            <Card className="shadow-sm bg-white">
                <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">Danh sách sản phẩm</h5>
                </Card.Header>
                <Card.Body>
                    {products.length > 0 ? (
                        <Table responsive bordered hover className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Màu</th>
                                    <th>Kích thước</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Tổng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Image
                                                src={item.productDetail.product.mainImage}
                                                alt={item.productName}
                                                thumbnail
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                        </td>
                                        <td>{item.productDetail.product.productName}</td>
                                        <td>{item.productDetail.color.colorName}</td>
                                        <td>{item.productDetail.size.sizeName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price.toLocaleString()} VNĐ</td>
                                        <td>{item.totalPrice.toLocaleString()} VNĐ</td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleEdit(item)}>
                                                Cập nhật
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-muted">Không có sản phẩm trong đơn hàng này.</p>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control
                                type="text"
                                name="productName"
                                value={selectedProduct?.productDetail.product.productName || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formQuantity">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={selectedProduct?.quantity || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Đơn giá</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={selectedProduct?.price || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductList;