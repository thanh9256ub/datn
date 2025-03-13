import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { QRCodeCanvas } from "qrcode.react";
import { FaImage } from "react-icons/fa";

const ListAutoVariant = ({ variantList, setVariantList, handleInputChange, handleRemoveVariant, setHasError, onImagesSelected }) => {

    const [loading, setLoading] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [errors, setErrors] = useState({
        quantity: [],
        price: []
    });

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

    const validateInput = (value, type, index) => {
        let newErrors = { ...errors };

        if (type === "quantity") {
            newErrors.quantity[index] = (value < 0 || isNaN(value) || value === "") ? "Số lượng không hợp lệ!" : "";
        } else if (type === "price") {
            newErrors.price[index] = (value < 0 || isNaN(value) || value === "") ? "Giá không hợp lệ!" : "";
        }

        setErrors(newErrors);
        const hasError = newErrors.quantity.some((error) => error) || newErrors.price.some((error) => error);
        setHasError(hasError);
    };

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

    console.log("Nhóm theo màu sắc:", colorGroups);

    const handleReplaceImage = (index) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.multiple = true; // Cho phép chọn nhiều ảnh

        fileInput.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                const imageUrls = files.map((file) => URL.createObjectURL(file));

                setVariantList((prevVariants) => {
                    const newVariants = [...prevVariants];
                    newVariants[index].imageUrls = imageUrls;
                    return newVariants;
                });
            }
        };
        fileInput.click();
    };



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
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(colorGroups).map(([colorName, variants]) =>
                                variants.map((variant, index) => {
                                    const originalIndex = variantList.indexOf(variant);

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
                                                                    alt="Ảnh sản phẩm"
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
                                            {index === 0 && <td rowSpan={variants.length}>{colorName}</td>}

                                            <td>{variant.size?.sizeName || variant.size}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={variant.quantity ?? ''}
                                                    min={0}
                                                    onChange={(e) => {
                                                        handleInputChange(originalIndex, 'quantity', e.target.value);
                                                        validateInput(e.target.value, 'quantity', originalIndex);
                                                    }}
                                                    isInvalid={errors.quantity[originalIndex]}
                                                    style={{ width: '150px' }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.quantity[originalIndex]}
                                                </Form.Control.Feedback>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={variant.price ?? ''}
                                                    min={0}
                                                    onChange={(e) => {
                                                        handleInputChange(originalIndex, 'price', e.target.value);
                                                        validateInput(e.target.value, 'price', originalIndex);
                                                    }}
                                                    isInvalid={errors.price[originalIndex]}
                                                    style={{ width: '150px' }}

                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.price[originalIndex]}
                                                </Form.Control.Feedback>
                                            </td>
                                            <td>
                                                {variant.qr ? (
                                                    <QRCodeCanvas value={variant.qrCode} size={80} />
                                                ) : (
                                                    <span className="text-muted">Chưa có QR</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-secondary btn-sm btn-rounded btn-icon"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveVariant(originalIndex);
                                                    }}
                                                >
                                                    <i className='mdi mdi-minus-circle-outline'></i>
                                                </button>
                                            </td>
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