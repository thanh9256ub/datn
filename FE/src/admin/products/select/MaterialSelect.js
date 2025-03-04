import React, { useEffect, useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap';
import { createMaterial, getMaterials } from '../service/MaterialService';
import Select from 'react-select';

const MaterialSelect = ({ materialId, setMaterialId }) => {
    const [materialOptions, setMaterialOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newMaterialName, setNewMaterialName] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleMaterialChange = (selectedOption) => {
        setSelectedMaterial(selectedOption);
        setMaterialId(selectedOption ? selectedOption.value : "");
    };

    const fetchMaterials = async () => {
        try {
            const response = await getMaterials();
            const formattedMaterials = response.data.data.map((material) => ({
                value: material.id,
                label: material.materialName,
            }));
            setMaterialOptions(formattedMaterials);

            if (materialId) {
                setSelectedMaterial(formattedMaterials.find((b) => b.value === materialId));
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
        }
    };


    const handleAddMaterial = async () => {
        if (!newMaterialName.trim()) {
            alert("Vui lòng nhập tên chất liệu!");
            return;
        }

        try {
            const response = await createMaterial({ materialName: newMaterialName });
            alert("Thêm chất liệu thành công!");
            setShowModal(false);
            setNewMaterialName("");
            fetchMaterials();
        } catch (error) {
            console.error("Lỗi khi thêm chất liệu:", error);
            alert("Lỗi khi thêm chất liệu!");
        }
    };


    return (
        <div>
            <Form.Group className="row d-flex align-items-center">
                <label className="col-sm-3 col-form-label">Chất liệu:</label>
                <div className="col-sm-7">
                    <Select
                        options={materialOptions}
                        value={selectedMaterial}
                        onChange={handleMaterialChange}
                        isClearable
                        placeholder="Chọn thương hiệu..."
                    />
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