import React, { useEffect, useState } from 'react';
import { getBrands } from '../service/BrandService';
import { Form } from 'react-bootstrap';

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

    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Thương hiệu:</label>
                <div className="col-sm-9">
                    <select
                        className="form-control"
                        value={brandId || ""}
                        onChange={handleBrandChange}
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brandOptions.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.brandName}
                            </option>
                        ))}
                    </select>
                </div>
            </Form.Group>
        </div>
    );
};

export default BrandSelect;
