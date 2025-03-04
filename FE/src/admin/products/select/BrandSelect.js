import React, { useEffect, useState } from 'react';
import { createBrand, getBrands } from '../service/BrandService';
import { Button, Form, Modal } from 'react-bootstrap';
// import Select from 'react-select';

const BrandSelect = ({ brandId, setBrandId }) => {
    const [brandOptions, setBrandOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleBrandChange = (event) => {
        const value = event.target.value;
        setBrandId(value || "");
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    const fetchBrands = () => {
        getBrands()
            .then((response) => {
                setBrandOptions(response.data.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            });
    };


    const handleAddBrand = async () => {
        if (!newBrandName.trim()) {
            alert("Vui lòng nhập tên thương hiệu!");
            return;
        }

        try {
            const response = await createBrand({ brandName: newBrandName });
            alert("Thêm thương hiệu thành công!");
            setShowModal(false);
            setNewBrandName("");
            fetchBrands(); // Load lại danh sách thương hiệu
        } catch (error) {
            console.error("Lỗi khi thêm thương hiệu:", error);
            alert("Lỗi khi thêm thương hiệu!");
        }
    };


    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Thương hiệu:</label>
                <div className="col-sm-7">
                    <select
                        className="form-control"
                        value={brandId || ""}
                        onChange={handleBrandChange}
                        style={{ color: brandId ? "#000" : "#999" }}
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brandOptions.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.brandName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-2">
                    <button type="button" className="btn btn-outline-secondary btn-rounded btn-icon" onClick={() => setShowModal(true)}>
                        <i className='mdi mdi-plus'></i>
                    </button>
                </div>
            </Form.Group>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Thương Hiệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tên thương hiệu</Form.Label>
                        <Form.Control
                            type="text"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddBrand}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BrandSelect;
