// CustomerInfo.js
import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';

const CustomerInfo = ({ customer, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(customer);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onUpdate(formData);
        setShowModal(false);
    };

    return (
        <>
            <Card className="shadow-sm h-100 bg-white">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Thông tin khách hàng</h5>
                </Card.Header>
                <Card.Body>
                    <p><strong>Tên:</strong> {customer.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {customer.phone}</p>
                    <p><strong>Địa chỉ:</strong> {customer.address}</p>
                    <p><strong>Email:</strong> {customer.customer?.email || 'N/A'}</p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Cập nhật thông tin
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCustomerName">
                            <Form.Label>Tên khách hàng</Form.Label>
                            <Form.Control
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.customer?.email || ''}
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

export default CustomerInfo;
