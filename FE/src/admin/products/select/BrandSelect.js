import React, { useEffect, useState } from 'react';
import { getBrands } from '../service/BrandService';
import Select from 'react-select';

const BrandSelect = ({ brandId, setBrandId, refresh }) => {
    const [brandOptions, setBrandOptions] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, [brandId, refresh]);

    const handleBrandChange = (selectedOption) => {
        setSelectedBrand(selectedOption);
        setBrandId(selectedOption ? selectedOption.value : "");
    };

    const fetchBrands = async () => {
        try {
            const response = await getBrands();
            const formattedBrands = response.data.data.map((brand) => ({
                value: brand.id,
                label: brand.brandName,
            }));
            setBrandOptions(formattedBrands);

            if (brandId) {
                setSelectedBrand(formattedBrands.find((b) => b.value === brandId));
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
        }
    };

    return (
        <div>
            <Select
                options={brandOptions}
                value={selectedBrand}
                onChange={handleBrandChange}
                isClearable
                placeholder="Thương hiệu..."
            />
        </div>
    );
};

export default BrandSelect;
