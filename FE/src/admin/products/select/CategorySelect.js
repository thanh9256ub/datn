import React, { useEffect, useState } from 'react'
import { createCategory, getCategories } from '../service/CategoryService';
import { Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';

const CategorySelect = ({ categoryId, setCategoryId }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategorys();
    }, [categoryId]);

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setCategoryId(selectedOption ? selectedOption.value : "");
    };

    const fetchCategorys = async () => {
        try {
            const response = await getCategories();
            const formattedCategorys = response.data.data.map((category) => ({
                value: category.id,
                label: category.categoryName,
            }));
            setCategoryOptions(formattedCategorys);

            if (categoryId) {
                setSelectedCategory(formattedCategorys.find((b) => b.value === categoryId));
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
        }
    };

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
            fetchCategorys();
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
                    <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        isClearable
                        placeholder="Chọn danh mục..."
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