import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { updateProductDetail } from '../service/ProductDetailService';
import Switch from 'react-switch';
import { QRCodeCanvas } from 'qrcode.react';

const ProductDetail = ({
    showModal,
    setShowModal,
    selectedProductName,
    selectedProductDetails,
    setSelectedProductDetails,
    refreshProducts
}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }, [showModal]);

    const handleStatusChange = (index) => {
        const updatedDetails = [...selectedProductDetails];
        updatedDetails[index].status = updatedDetails[index].status === 1 ? 0 : 1;
        setSelectedProductDetails(updatedDetails);

        updateProductDetail(
            updatedDetails[index].id,
            updatedDetails[index].quantity,
            updatedDetails[index].status
        );

        refreshProducts();
    };

    const handleQuantityChange = async (index, event) => {
        const updatedDetails = [...selectedProductDetails];
        updatedDetails[index].quantity = event.target.value;

        setSelectedProductDetails(updatedDetails);

        try {
            await updateProductDetail(
                updatedDetails[index].id,
                event.target.value,
                updatedDetails[index].status ?? 1
            );
            refreshProducts();
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    // const [qrCodes, setQrCodes] = useState({});

    // useEffect(() => {
    //     const generateQRCodes = async () => {
    //         const newQRCodes = {};
    //         for (const variant of selectedProductDetails) {
    //             newQRCodes[variant.id] = await QRCode.toDataURL(`https://yourwebsite.com/product/${variant.id}`);
    //         }
    //         setQrCodes(newQRCodes);
    //     };

    //     if (selectedProductDetails.length > 0) {
    //         generateQRCodes();
    //     }
    // }, [selectedProductDetails]);

    return (
        <div>
            <div className="table-responsive">
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" dialogClassName="custom-modal modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết sản phẩm: {selectedProductName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                <Spinner animation="border" variant="primary" />
                                <span className="ml-2">Đang tải dữ liệu...</span>
                            </div>
                        ) : selectedProductDetails.length > 0 ? (
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
                                        <th>QR Code</th>
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
                                            <td>{variant.quantity}</td>
                                            <td>{variant.price}</td>
                                            <td>
                                                {variant.qr ? (
                                                    <img src={`data:image/png;base64,${variant.qr}`} alt="QR Code" width="50" />
                                                ) : (
                                                    <span className="text-muted">Chưa có QR</span>
                                                )}
                                            </td>
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
