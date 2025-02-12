import React from 'react';
import { Modal } from 'react-bootstrap';

const CartModal = ({ item, show, onClose, onSave, soLuong2, setSoLuong2 }) => {
    const handleSoLuongChange = (e) => {
        setSoLuong2(parseInt(e.target.value) || 0);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="hidden" id="lhdctId" name="lhdctId" value={item?.id || ''} />
                <div className="mb-3">
                    <label htmlFor="soLuong2" className="form-label">
                        Số lượng
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="soLuong2"
                        name="soLuong2"
                        min="0"
                        value={soLuong2}
                        onChange={handleSoLuongChange}
                    />
                </div>
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

export default CartModal;