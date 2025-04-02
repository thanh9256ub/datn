import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductVariantDetail = ({ selectedVariant, setSelectedVariant, colorImages, productDetails }) => {

    const qrRef = useRef(null);

    useEffect(() => {
        if (selectedVariant && productDetails.length > 0) {
            const updatedVariant = productDetails.find(pd => pd.id === selectedVariant.id);
            if (updatedVariant) {
                setSelectedVariant(updatedVariant);
            }
        }
    }, [productDetails]);

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
            <div style={{ marginBottom: '10px' }}>
                {selectedVariant && (
                    <h4><strong>Danh sách ảnh giày màu {selectedVariant.color.colorName}:</strong></h4>
                )}
            </div>
            <hr />
            <div style={{ height: "125px" }}>
                {colorImages.length > 0 && (
                    <div style={{
                        marginBottom: "20px",
                        display: "flex",
                        gap: "10px",
                        overflowX: "auto", // Hiển thị thanh cuộn ngang nếu ảnh quá nhiều
                        whiteSpace: "nowrap", // Ngăn ảnh bị xuống dòng
                        paddingBottom: "10px"
                    }}
                    >
                        <div className="image-gallery">
                            {colorImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={image.name}
                                    style={{
                                        marginRight: '10px',
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        // margin: "5px",
                                        flexShrink: 0
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <hr />
            <h4><strong>Thông tin chi tiết biến thể:</strong></h4>
            <hr style={{ marginBottom: "50px" }} />
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
                                {selectedVariant.quantity.toLocaleString('vi-VN')}
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
                                <span className={`badge ${selectedVariant.status === 1 ? 'badge-success' : (selectedVariant.status === 0 ? 'badge-danger' : 'badge-dark')}`} style={{ padding: '7px' }}>
                                    {selectedVariant.status === 1 ? "Đang bán" : (selectedVariant.status === 0 ? "Hết hàng" : "Ngừng bán")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4" style={{ textAlign: "center" }}>
                        <label>QR code:</label>
                        <div ref={qrRef}>
                            <QRCodeCanvas value={selectedVariant?.qr ? selectedVariant.qr.toString() : "N/A"} size={100} />
                        </div>
                        <button
                            className="btn btn-link mt-2 btn-sm"
                            onClick={handleDownloadQR}
                            style={{ padding: "0px !important" }}
                        >
                            <i className='mdi mdi-download'></i>Tải xuống
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductVariantDetail
