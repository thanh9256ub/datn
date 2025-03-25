import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateProductDetail } from '../service/ProductDetailService';
import Swal from 'sweetalert2';

const ProductVariantDetail = ({ selectedVariant, setSelectedVariant, colors, sizes, colorImages, refreshProductDetail, handleVariantClick, productDetails }) => {

    const qrRef = useRef(null);

    useEffect(() => {
        if (selectedVariant && productDetails.length > 0) {
            const updatedVariant = productDetails.find(pd => pd.id === selectedVariant.id);
            if (updatedVariant) {
                setSelectedVariant(updatedVariant);
            }
        }
    }, [productDetails]);

    // const handleUpdateVariant = async () => {
    //     if (!selectedVariant) return;

    //     const result = await Swal.fire({
    //         title: "Bạn có chắc muốn cập nhật?",
    //         text: "Thao tác này sẽ cập nhật thông tin biến thể!",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Xác nhận",
    //         cancelButtonText: "Hủy"
    //     });

    //     if (!result.isConfirmed) return;

    //     setIsSaving(true);

    //     const updateData = {
    //         quantity: selectedVariant.quantity,
    //         price: selectedVariant.price,
    //         status: selectedVariant.status,
    //         colorId: selectedVariant.color?.id,
    //         sizeId: selectedVariant.size?.id
    //     };

    //     try {
    //         const response = await updateProductDetail(selectedVariant.id, updateData);
    //         // setSelectedVariant(response.data);

    //         await refreshProductDetail();

    //         // setTimeout(() => {
    //         //     const updatedVariant = productDetails.find(pd => pd.id === selectedVariant.id);
    //         //     setSelectedVariant(updatedVariant);
    //         // }, 500);

    //         toast.success("Cập nhật biến thể thành công!");



    //     } catch (error) {
    //         console.error("Lỗi khi cập nhật biến thể:", error);
    //         alert("Có lỗi xảy ra khi cập nhật biến thể!");
    //     }
    //     setIsSaving(false);
    // };

    const handleDownloadQR = () => {
        if (!qrRef.current) return;

        const canvas = qrRef.current.querySelector('canvas'); // Lấy thẻ canvas QR
        if (!canvas) {
            toast.error("Không thể tải mã QR!");
            return;
        }

        const image = canvas.toDataURL("image/png"); // Chuyển QR thành ảnh
        const link = document.createElement("a");
        link.href = image;
        link.download = `QRCode_${selectedVariant?.qr || "default"}.png`;
        link.click();
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                {selectedVariant && (
                    <h4><strong>Danh sách ảnh giày màu {selectedVariant.color.colorName}:</strong></h4>
                )}
            </div>
            <hr />
            {colorImages.length > 0 && (
                <div style={{
                    marginBottom: "20px"
                }}
                >
                    <div className="image-gallery">
                        {colorImages.map((image, index) => (
                            <img
                                key={index}
                                src={image.image}
                                alt={image.name}
                                style={{
                                    width: '100px',
                                    marginRight: '10px',
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    margin: "5px"
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            <hr />
            <h4 style={{ marginBottom: "20px" }}><strong>Thông tin chi tiết biến thể:</strong></h4>
            <hr />
            {selectedVariant && (
                <div className="row">
                    <div className="col-lg-8">
                        <div className='row d-flex align-items-center'>
                            <label className="col-sm-4 col-form-label"><strong>Màu sắc:</strong></label>
                            <div className='col-md-8'>
                                {selectedVariant.color.colorName}
                            </div>
                        </div>
                        <div className='row d-flex align-items-center'>
                            <label className="col-sm-4 col-form-label"><strong>Kích cỡ:</strong></label>
                            <div className='col-md-8'>
                                {selectedVariant.size.sizeName}
                            </div>
                        </div>
                        <div className='row d-flex align-items-center'>
                            <label className="col-sm-4 col-form-label"><strong>Số lượng:</strong></label>
                            <div className='col-md-8'>
                                {selectedVariant.quantity}
                            </div>
                        </div>
                        <div className='row d-flex align-items-center'>
                            <label className="col-sm-4 col-form-label"><strong>Giá:</strong></label>
                            <div className='col-md-8'>
                                {selectedVariant.price.toLocaleString('vi-VN')} VND
                            </div>
                        </div>
                        <div className='row d-flex align-items-center'>
                            <label className="col-sm-4 col-form-label"><strong>Trạng thái:</strong></label>
                            <div className='col-md-8'>
                                {selectedVariant.status == 1 ? "Đang bán" : "Hết hàng"}
                            </div>
                        </div>
                        {/* <Form.Group>
                            <Form.Label>
                                <strong>Màu sắc:</strong>
                            </Form.Label>
                            <ReactSelect
                                value={
                                    selectedVariant?.color
                                        ? {
                                            value: selectedVariant.color.id,
                                            label: selectedVariant.color.colorName,
                                        }
                                        : null
                                }
                                onChange={(selectedOption) => {
                                    setSelectedVariant({
                                        ...selectedVariant,
                                        color: colors.find((c) => c.id === selectedOption.value),
                                    });
                                }}
                                options={colors.map((color) => ({
                                    value: color.id,
                                    label: color.colorName,
                                }))}
                                isDisabled={!!selectedVariant?.color?.id} // Disable nếu colorId đã tồn tại
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                <strong>Kích cỡ:</strong>
                            </Form.Label>
                            <ReactSelect
                                value={
                                    selectedVariant?.size
                                        ? {
                                            value: selectedVariant.size.id,
                                            label: selectedVariant.size.sizeName,
                                        }
                                        : null
                                }
                                onChange={(selectedOption) => {
                                    setSelectedVariant({
                                        ...selectedVariant,
                                        size: sizes.find((s) => s.id === selectedOption.value),
                                    });
                                }}
                                options={sizes.map((size) => ({
                                    value: size.id,
                                    label: size.sizeName,
                                }))}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                <strong>Số lượng:</strong>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedVariant.quantity || 0}
                                onChange={(e) =>
                                    setSelectedVariant({ ...selectedVariant, quantity: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                <strong>Giá:</strong>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedVariant.price || 0}
                                onChange={(e) =>
                                    setSelectedVariant({ ...selectedVariant, price: e.target.value })
                                }
                            />
                        </Form.Group> */}
                        {/* <button
                            type="button"
                            className="btn btn-gradient-primary btn-sm float-right"
                            onClick={handleUpdateVariant}
                            disabled={isSaving}
                        >
                            {isSaving ? "Đang lưu..." : "Sửa"}
                        </button> */}
                    </div>
                    <div className="col-lg-4" style={{ textAlign: "center" }}>
                        {/* <QRCodeCanvas value={selectedVariant?.qr ? selectedVariant.qr.toString() : "N/A"} size={100} /> */}
                        <label>QR code:</label>

                        <div ref={qrRef}>
                            <QRCodeCanvas value={selectedVariant?.qr ? selectedVariant.qr.toString() : "N/A"} size={100} />
                        </div>
                        <button
                            className="btn btn-outline-primary mt-2"
                            onClick={handleDownloadQR}
                        >
                            <i className='mdi mdi-download'></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductVariantDetail
