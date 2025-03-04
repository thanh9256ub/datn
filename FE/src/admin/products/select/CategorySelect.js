import React, { useEffect, useState } from 'react'
import { createCategory, getCategorys } from '../service/CategoryService';
import { Button, Form, Modal } from 'react-bootstrap';

const CategorySelect = ({ categoryId, setCategoryId }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        fetchCategorys();
    }, []);

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value || "");
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    const fetchCategorys = () => {
        getCategorys()
            .then((response) => {
                setCategoryOptions(response.data.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            });
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            alert("Vui lòng nhập tên thương hiệu!");
            return;
        }

        try {
            const response = await createCategory({ categoryName: newCategoryName });
            alert("Thêm thương hiệu thành công!");
            setShowModal(false);
            setNewCategoryName("");
            fetchCategorys();
        } catch (error) {
            console.error("Lỗi khi thêm thương hiệu:", error);
            alert("Lỗi khi thêm thương hiệu!");
        }
    };

    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Danh mục:</label>
                <div className='col-md-7'>
                    <select
                        value={categoryId || ""}
                        className={`form-control`}
                        onChange={handleCategoryChange}
                        style={{ color: categoryId ? "#000" : "#999" }}
                    >
                        <option value="">Chọn danh mục</option>
                        {categoryOptions.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.categoryName}
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

export default CategorySelect