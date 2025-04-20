import React, { useEffect, useState } from 'react'
import { getActive, getCategories } from '../service/CategoryService';
import Select from 'react-select';

const CategorySelect = ({ categoryId, setCategoryId, refresh, id }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [categoryId, refresh]);

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setCategoryId(selectedOption ? selectedOption.value : "");
    };

    const fetchCategories = async () => {
        try {
            const activeResponse = await getActive();
            const activeCategories = activeResponse.data.data.map((category) => ({
                value: category.id,
                label: category.categoryName,
            }));

            let updatedSelectedCategory = null;
            let finalCategoryOptions = [...activeCategories];

            if (categoryId) {
                const isActive = activeCategories.some((b) => b.value === categoryId);

                if (!isActive) {
                    const allResponse = await getCategories();
                    const allCategories = allResponse.data.data;
                    const currentCategory = allCategories.find((b) => b.id === categoryId);

                    if (currentCategory) {
                        updatedSelectedCategory = {
                            value: currentCategory.id,
                            label: `${currentCategory.categoryName} (Ngừng hoạt động)`,
                            isDisabled: true, // Không cho phép chọn lại
                        };

                        finalCategoryOptions.push(updatedSelectedCategory);
                    }
                } else {
                    updatedSelectedCategory = activeCategories.find((b) => b.value === categoryId);
                }
            }

            setCategoryOptions(finalCategoryOptions);
            setSelectedCategory(updatedSelectedCategory);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu danh mục:", error);
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
                isDisabled={id}
            />
        </div>
    )
}

export default CategorySelect
