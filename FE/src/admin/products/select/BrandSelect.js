import React, { useEffect, useState } from 'react';
import { createMaterial, getMaterials } from '../service/MaterialService';
import { Button, Form, Modal } from 'react-bootstrap';
// import Select from 'react-select';

const MaterialSelect = ({ brandId, setMaterialId }) => {
    const [brandOptions, setMaterialOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newMaterialName, setNewMaterialName] = useState("");

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleMaterialChange = (event) => {
        const value = event.target.value;
        setMaterialId(value || "");
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    const fetchMaterials = () => {
        getMaterials()
            .then((response) => {
                setMaterialOptions(response.data.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            });
    };


    const handleAddMaterial = async () => {
        if (!newMaterialName.trim()) {
            alert("Vui lòng nhập tên thương hiệu!");
            return;
        }

        try {
            const response = await createMaterial({ materialName: newMaterialName });
            alert("Thêm thương hiệu thành công!");
            setShowModal(false);
            setNewMaterialName("");
            fetchMaterials(); // Load lại danh sách thương hiệu
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
                        onChange={handleMaterialChange}
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
                            value={newMaterialName}
                            onChange={(e) => setNewMaterialName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddMaterial}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MaterialSelect;
