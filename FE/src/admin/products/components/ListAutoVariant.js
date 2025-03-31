import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { QRCodeCanvas } from "qrcode.react";
import { FaImage } from "react-icons/fa";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';


const ListAutoVariant = ({ variantList, setVariantList, handleInputChange, handleRemoveVariant, onImagesSelected }) => {

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (isFirstLoad && variantList.length > 0) {
            setLoading(true);
            const timeout = setTimeout(() => {
                setLoading(false);
                setIsFirstLoad(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [isFirstLoad, variantList]);

    const colorGroups = variantList.reduce((acc, variant) => {
        const colorName = typeof variant.color === "object" ? variant.color.colorName : variant.color;

        if (!colorName) {
            console.warn("Dữ liệu bị thiếu màu sắc ở biến thể:", variant);
            return acc;
        }

        if (!acc[colorName]) acc[colorName] = [];
        acc[colorName].push(variant);

        return acc;
    }, {});

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
                                <th>Danh sách ảnh</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>QR Code</th>
                                {id ? (<th></th>) : (
                                    <th>Thao tác</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(colorGroups).map(([colorName, variants]) =>
                                variants.map((variant, index) => {
                                    const originalIndex = variantList.indexOf(variant);
                                    // const originalIndex = variantList.findIndex(v => v.colorId === variant.colorId && v.sizeId === variant.sizeId);

                                    return (
                                        <tr key={`${colorName}-${index}`}>
                                            {index === 0 && (
                                                <td rowSpan={variants.length}
                                                    style={{
                                                        position: "relative",
                                                        minWidth: "300px",
                                                        opacity: variant.imageUrls && variant.imageUrls.length > 0 ? 1 : 0.5,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => document.getElementById(`file-input-${originalIndex}`).click()}
                                                >
                                                    {variant.imageUrls && variant.imageUrls.length > 0 ? (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                                            {variant.imageUrls.map((url, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={url}
                                                                    alt={`Ảnh sản phẩm ${idx}`}
                                                                    style={{
                                                                        width: "100px",
                                                                        height: "100px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "5px",
                                                                        marginRight: "5px",
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <FaImage size={80} color="#007bff" style={{ marginRight: '10px' }} />
                                                            <br />
                                                            Chọn ảnh
                                                        </div>
                                                    )}
                                                    <input
                                                        id={`file-input-${originalIndex}`}
                                                        type="file"
                                                        multiple
                                                        style={{ display: "none" }}
                                                        onChange={(e) => onImagesSelected(originalIndex, e)}
                                                    />
                                                </td>
                                            )}
                                            {/* {index === 0 && <td rowSpan={variants.length}>{colorName}</td>} */}
                                            <td>{colorName}</td>
                                            <td>{variant.size?.sizeName || variant.size}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={variant.quantity ?? ''}
                                                    min={0}
                                                    onChange={(e) => {
                                                        handleInputChange(originalIndex, 'quantity', e.target.value);
                                                    }}
                                                    style={{ width: '150px' }}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={variant.price ?? ''}
                                                    min={0}
                                                    onChange={(e) => {
                                                        handleInputChange(originalIndex, 'price', e.target.value);
                                                    }}
                                                    style={{ width: '150px' }}
                                                />
                                            </td>
                                            <td>
                                                {variant.qr ? (
                                                    <QRCodeCanvas value={variant.qr.toString()} size={50} />
                                                ) : (
                                                    <span className="text-muted">Chưa có QR</span>
                                                )}
                                            </td>
                                            {id ? (
                                                (<td></td>)
                                            ) : (
                                                <td>
                                                    <button className="btn btn-outline-dark btn-sm btn-rounded btn-icon"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveVariant(originalIndex);
                                                        }}
                                                    >
                                                        <i className='mdi mdi-delete'></i>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ListAutoVariant
