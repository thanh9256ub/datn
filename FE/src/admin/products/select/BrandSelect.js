import React, { useEffect, useState } from 'react';
import { getActive, getBrands } from '../service/BrandService';
import Select from 'react-select';

const BrandSelect = ({ brandId, setBrandId, refresh, id }) => {
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
            // Lấy danh sách các thương hiệu có status = 1
            const activeResponse = await getActive();
            const activeBrands = activeResponse.data.data.map((brand) => ({
                value: brand.id,
                label: brand.brandName,
            }));

            let updatedSelectedBrand = null;
            let finalBrandOptions = [...activeBrands];

            if (brandId) {
                // Kiểm tra xem brandId có trong danh sách active hay không
                const isActive = activeBrands.some((b) => b.value === brandId);

                if (!isActive) {
                    // Lấy danh sách tất cả thương hiệu để kiểm tra brandId
                    const allResponse = await getBrands();
                    const allBrands = allResponse.data.data;
                    const currentBrand = allBrands.find((b) => b.id === brandId);

                    if (currentBrand) {
                        updatedSelectedBrand = {
                            value: currentBrand.id,
                            label: `${currentBrand.brandName} (Ngừng hoạt động)`,
                            isDisabled: true, // Không cho phép chọn lại
                        };

                        // Chỉ thêm vào dropdown nếu đang được chọn, nhưng không thể chọn lại
                        finalBrandOptions.push(updatedSelectedBrand);
                    }
                } else {
                    // Nếu brandId là active, lấy từ danh sách active
                    updatedSelectedBrand = activeBrands.find((b) => b.value === brandId);
                }
            }

            setBrandOptions(finalBrandOptions);
            setSelectedBrand(updatedSelectedBrand);
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
                isDisabled={id}
            />
        </div>
    );
};

export default BrandSelect;