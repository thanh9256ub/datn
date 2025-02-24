import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { getColors } from '../service/ColorService';
import { getSizes } from '../service/SizeService';
import { getBrands } from '../service/BrandService';
import { getCategorys } from '../service/CategoryService';
import { getMaterials } from '../service/MaterialService';

const CreateProduct = () => {
    const [selectedColors, setSelectedColors] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);

    const [selectedSizes, setSelectSizes] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);

    const [selectedBrands, setSelectedBrands] = useState("");
    const [brandOptions, setBrandOptions] = useState([]);

    const [selectedCategorys, setSelectedCategorys] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [selectedMaterials, setSelectedMaterials] = useState("");
    const [materialOptions, setMaterialOptions] = useState([]);

    useEffect(() => {
        getColors()
            .then(response => {
                const formattedColors = response.data.data.map(color => ({
                    value: color.id,
                    label: color.colorName
                }));
                setColorOptions(formattedColors);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu màu:", error);
            });
    }, []);

    useEffect(() => {
        getSizes()
            .then(response => {
                const formattedSizes = response.data.data.map(size => ({
                    value: size.id,
                    label: size.sizeName
                }));
                setSizeOptions(formattedSizes);
            })
            .catch(error => {
                console.log("Lỗi khi lấy dữ liệu cỡ:", error)
            })
    }, []);

    useEffect(() => {
        getBrands()
            .then(response => {
                setBrandOptions(response.data.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
            });
    }, []);

    useEffect(() => {
        getCategorys()
            .then(response => {
                setCategoryOptions(response.data.data);
            })
            .catch(error => {
                console.log("Lỗi khi lấy dữ liệu danh mục:", error)
            })
    })

    useEffect(() => {
        getMaterials()
            .then(response => {
                setMaterialOptions(response.data.data);
            })
            .catch(error => {
                console.log("Lỗi khi lấy dữ liệu chất liệu:", error)
            })
    })

    const handleColorChange = (selectedOptions) => {
        setSelectedColors(selectedOptions);
    };

    const handleSizeChange = (selectedOptions) => {
        setSelectSizes(selectedOptions);
    }

    const handleBrandChange = (event) => {
        setSelectedBrands(event.target.value);
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    const handleCategoryChange = (event) => {
        setSelectedCategorys(event.target.value);
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    const handleMaterialChange = (event) => {
        setSelectedMaterials(event.target.value);
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };

    return (
        <div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Thêm mới sản phẩm</h3>
                            <hr />
                            <div style={{ marginBottom: '50px' }}></div>
                            <form className="form-sample">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Tên sản phẩm:</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" />
                                            </div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Mô tả:</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Thương hiệu:</label>
                                            <div className="col-sm-9">
                                                <select
                                                    className={`form-control`}
                                                    value={selectedBrands}
                                                    onChange={handleBrandChange}
                                                >
                                                    <option value="" >Chọn thương hiệu</option>
                                                    {brandOptions.map((brand) => (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.brandName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Danh mục:</label>
                                            <div className='col-md-9'>
                                                <select
                                                    className={`form-control`}
                                                    value={selectedCategorys}
                                                    onChange={handleCategoryChange}
                                                >
                                                    <option value="">Chọn danh mục</option>
                                                    {categoryOptions.map(category => (
                                                        <option key={category.id} value={category.categoryName}>
                                                            {category.categoryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Chất liệu:</label>
                                            <div className="col-sm-9">
                                                <select
                                                    className={`form-control`}
                                                    value={selectedMaterials}
                                                    onChange={handleMaterialChange}
                                                >
                                                    <option value="">Chọn chất liệu</option>
                                                    {materialOptions.map(material => (
                                                        <option key={material.id} value={material.materialName}>
                                                            {material.materialName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                                <h6><span>Chọn các biến thể:</span></h6>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Màu sắc:</label>
                                            <div className="col-sm-9">
                                                <Select
                                                    isMulti
                                                    options={colorOptions}
                                                    value={selectedColors}
                                                    onChange={handleColorChange}
                                                    getOptionLabel={(e) => e.label}
                                                    getOptionValue={(e) => e.value}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Kích cỡ:</label>
                                            <div className="col-sm-9">
                                                <Select
                                                    isMulti
                                                    options={sizeOptions}
                                                    value={selectedSizes}
                                                    onChange={handleSizeChange}
                                                    getOptionLabel={(e) => e.label}
                                                    getOptionValue={(e) => e.value}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;
