import React, { useEffect, useState } from 'react'
import { getCategorys } from '../service/CategoryService';
import { Form } from 'react-bootstrap';

const CategorySelect = ({ categoryId, setCategoryId }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        getCategorys()
            .then(response => {
                setCategoryOptions(response.data.data);
            })
            .catch(error => {
                console.log("Lỗi khi lấy dữ liệu danh mục:", error)
            })
    }, []);

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value || "");
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Danh mục:</label>
                <div className='col-md-9'>
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
            </Form.Group>
        </div>
    )
}

export default CategorySelect