import React, { useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap';
import { getMaterials, createMaterial } from '../service/MaterialService';
import MaterialSelect from '../select/MaterialSelect';
import { toast } from 'react-toastify';

const MaterialContainer = ({ materialId, setMaterialId, id }) => {
    const [showModal, setShowModal] = useState(false);
    const [newMaterialName, setNewMaterialName] = useState("");
    const [refresh, setRefresh] = useState(false);

    const handleAddMaterial = async () => {
        const normalizedName = newMaterialName.trim().replace(/\s+/g, ' ');
        if (!normalizedName) {
            alert("Vui lòng nhập tên chất liệu!");
            return;
        }

        try {
            const materialResp = await getMaterials();
            const materials = materialResp.data.data;
            const materialExists = materials.some(material => material.materialName.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedName.toLowerCase());

            if (materialExists) {
                toast.error("Chất liệu đã tồn tại!");
                return;
            }
            const response = await createMaterial({ materialName: newMaterialName });
            toast.success("Thêm chất liệu thành công!");
            setShowModal(false);
            setNewMaterialName("");
            setRefresh(prev => !prev);
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
                    <MaterialSelect materialId={materialId} setMaterialId={setMaterialId} refresh={refresh} id={id} />
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

export default MaterialContainer
