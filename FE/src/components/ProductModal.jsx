import React from 'react';
import { Modal } from 'react-bootstrap';

const ProductModal = ({ product, show, onClose, onSave, soLuong, setSoLuong }) => {
    const handleSoLuongChange = (e) => {
        setSoLuong(parseInt(e.target.value) || 1);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {product && ( // Kiểm tra product tồn tại trước khi render
                    <div>
                        <p>Tên sản phẩm: {product.ten_san_pham}</p>
                        <p>Mã sản phẩm: {product.ma_san_pham}</p>
                        <p>Giá bán: {product.gia_ban}</p>
                        <p>Số lượng tồn: {product.so_luong_ton}</p>
                        <input type="hidden" id="lctspId" name="lctspId" value={product.id} />
                        <div className="mb-3">
                            <label htmlFor="soLuong" className="form-label">
                                Số lượng
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="soLuong"
                                name="soLuong"
                                min="1"
                                max={product.so_luong_ton} // Giới hạn số lượng mua tối đa
                                value={soLuong}
                                onChange={handleSoLuongChange}
                            />
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Đóng
                </button>
                <button type="button" className="btn btn-primary" onClick={onSave}>
                    Lưu
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductModal;