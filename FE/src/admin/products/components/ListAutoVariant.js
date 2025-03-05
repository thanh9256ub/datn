import React, { useEffect, useState } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';
import { QRCodeCanvas } from "qrcode.react";

const ListAutoVariant = ({ variantList, handleInputChange, productName }) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (variantList.length > 0) {
            setLoading(true);
            const timeout = setTimeout(() => setLoading(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [variantList]);

    return (
        <div>
            {variantList.length === 0 ? (
                <Alert variant="info">
                    Vui lòng chọn ít nhất một <strong>màu sắc</strong> và một <strong>kích cỡ</strong> để tạo biến thể!
                </Alert>
            ) : loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                    <Spinner animation="border" variant="primary" />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                </div>
            ) : (
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variantList.map((variant, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{variant.color?.colorName || variant.color}</td>
                                    <td>{variant.size?.sizeName || variant.size}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={variant.quantity}
                                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        {variant.qrCode ? (
                                            <QRCodeCanvas value={variant.qrCode} size={80} />
                                        ) : (
                                            <span className="text-muted">Chưa có QR</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ListAutoVariant