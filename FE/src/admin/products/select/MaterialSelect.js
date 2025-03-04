import React, { useEffect, useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap';
import { createMaterial, getMaterials } from '../service/MaterialService';

const MaterialSelect = ({ materialId, setMaterialId }) => {
    const [materialOptions, setMaterialOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newMaterialName, setNewMaterialName] = useState("");

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleMaterialChange = (event) => {
        setMaterialId(event.target.value || "");
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
            const response = await createMaterial({ brandName: newMaterialName });
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
                <label className="col-sm-3 col-form-label">Chất liệu:</label>
                <div className="col-sm-7">
                    <select
                        className={`form-control`}
                        value={materialId || ""}
                        onChange={handleMaterialChange}
                        style={{ color: materialId ? "#000" : "#999" }}
                    >
                        <option value="">Chọn chất liệu</option>
                        {materialOptions.map(material => (
                            <option key={material.id} value={material.id}>
                                {material.materialName}
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
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Chất Liệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tên chất liệu</Form.Label>
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
    )
}

export default MaterialSelect