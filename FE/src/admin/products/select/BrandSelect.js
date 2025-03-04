import React, { useEffect, useState } from 'react';
import { getBrands } from '../service/BrandService';
import { Form } from 'react-bootstrap';
// import Select from 'react-select';

const BrandSelect = ({ brandId, setBrandId }) => {
    const [brandOptions, setBrandOptions] = useState([]);

    useEffect(() => {
        getBrands()
            .then(response => {
                setBrandOptions(response.data.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            });
    }, []);

    const handleBrandChange = (event) => {
        const value = event.target.value;
        setBrandId(value || "");
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    // useEffect(() => {
    //     getBrands()
    //         .then(response => {
    //             const formattedBrands = response.data.data.map(brand => ({
    //                 value: brand.id,
    //                 label: brand.brandName
    //             }));
    //             setBrandOptions(formattedBrands);
    //         })
    //         .catch(error => {
    //             console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
    //         });
    // }, []);


    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Thương hiệu:</label>
                <div className="col-sm-9">
                    <select
                        className="form-control"
                        value={brandId || ""}
                        onChange={handleBrandChange}
                        style={{ color: brandId ? "#000" : "#999" }}
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brandOptions.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.brandName}
                            </option>
                        ))}
                    </select>
                    {/* <Select
                        options={brandOptions}
                        value={brandOptions.find(option => option.value === brandId) || null}
                        onChange={(selected) => setBrandId(selected ? selected.value : "")}
                        classNamePrefix="react-select"
                    /> */}
                </div>
            </Form.Group>
        </div>
    );
};

export default BrandSelect;
