import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';

const ListAutoVariant = ({ variantList, handleInputChange }) => {

    return (
        <div>
            {variantList.length > 0 ? (
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variantList.map((variant, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{variant.color}</td>
                                    <td>{variant.size}</td>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Alert variant="info">
                    Vui lòng chọn ít nhất một <strong>màu sắc</strong> và một <strong>kích cỡ</strong> để tạo biến thể!
                </Alert>
            )}

        </div>
    )
}

export default ListAutoVariant