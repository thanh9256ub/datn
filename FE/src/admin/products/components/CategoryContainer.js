import React, { useState } from 'react'
import { createCategory } from '../service/CategoryService';
import { Button, Form, Modal } from 'react-bootstrap';
import CategorySelect from '../select/CategorySelect';

const CategoryContainer = ({ categoryId, setCategoryId }) => {
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [refresh, setRefresh] = useState(false);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            const response = await createCategory({ categoryName: newCategoryName });
            alert("Thêm danh mục thành công!");
            setShowModal(false);
            setNewCategoryName("");
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
            alert("Lỗi khi thêm danh mục!");
        }
    };

    return (
        <div>
            <Form.Group className="row d-flex align-items-center">
                <label className="col-sm-3 col-form-label">Danh mục:</label>
                <div className='col-md-7'>
                    <CategorySelect categoryId={categoryId} setCategoryId={setCategoryId} refresh={refresh} />
                </div>
                <div className="col-sm-2">
                    <button type="button" className="btn btn-outline-secondary btn-rounded btn-icon" onClick={() => setShowModal(true)}>
                        <i className='mdi mdi-plus'></i>
                    </button>
                </div>
            </Form.Group>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Danh Mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CategoryContainer
