import React, { useEffect, useState } from 'react'
import { getCategories } from '../service/CategoryService';
import Select from 'react-select';

const CategorySelect = ({ categoryId, setCategoryId, refresh }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategorys();
    }, [categoryId, refresh]);

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

    return (
        <div>
            <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                isClearable
                placeholder="Danh mục..."
            />
        </div>
    )
}

export default CategorySelect
