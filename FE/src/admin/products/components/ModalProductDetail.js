import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateProductDetail } from '../service/ProductDetailService';
import Switch from 'react-switch';

const ProductDetail = ({ showModal, setShowModal, selectedProductName, selectedProductDetails, setSelectedProductDetails }) => {
    const handleStatusChange = (index) => {
        const updatedDetails = [...selectedProductDetails];
        updatedDetails[index].status = updatedDetails[index].status === 1 ? 0 : 1;
        setSelectedProductDetails(updatedDetails);

        updateProductDetail(
            updatedDetails[index].id,
            updatedDetails[index].quantity,
            updatedDetails[index].status
        );
    };

    const handleQuantityChange = (index, event) => {
        const updatedDetails = [...selectedProductDetails];
        updatedDetails[index].quantity = event.target.value;
        setSelectedProductDetails(updatedDetails);

        updateProductDetail(
            updatedDetails[index].id,
            event.target.value,
            updatedDetails[index].status
        );
    };
    return (
        <div>
            <div className="table-responsive">
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết sản phẩm: {selectedProductName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedProductDetails.length > 0 ? (
                            <table className='table' style={{ tableLayout: 'fixed', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Thương hiệu</th>
                                        <th>Danh mục</th>
                                        <th>Chất liệu</th>
                                        <th>Màu sắc</th>
                                        <th>Kích cỡ</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                        <th>Trạng thái</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProductDetails.map((variant, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ textAlign: 'center' }}>{variant.product.brand.brandName}</td>
                                            <td>{variant.product.category.categoryName}</td>
                                            <td>{variant.product.material.materialName}</td>
                                            <td>{variant.color.colorName}</td>
                                            <td>{variant.size.sizeName}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={variant.quantity}
                                                    onChange={(e) => handleQuantityChange(index, e)}
                                                    style={{
                                                        width: '60px',
                                                        height: '25px',
                                                        textAlign: 'center',
                                                    }}
                                                />
                                            </td>
                                            <td>{variant.price}</td>
                                            <td>
                                                <span className={`badge ${variant.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                    {variant.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td>
                                                <Switch
                                                    checked={variant.status === 1}
                                                    onChange={() => handleStatusChange(index)}
                                                    offColor="#888"
                                                    onColor="#0d6efd"
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                    height={20}
                                                    width={40}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center">Không có biến thể nào.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ProductDetail;
