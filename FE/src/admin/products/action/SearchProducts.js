import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import MaterialSelect from '../select/MaterialSelect';
import BrandSelect from '../select/BrandSelect';
import CategorySelect from '../select/CategorySelect';
import ReactSelect from 'react-select';

const SearchProducts = ({ filters, setFilters, fetchFilteredProducts }) => {

    const statusOptions = [
        { value: '1', label: 'Đang bán' },
        { value: '0', label: 'Hết hàng' },
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchFilteredProducts();
    }, [filters]);

    return (
        <div className="row"
            style={{
                fontSize: '13px',
                marginBottom: "20px"
            }}>
            <div className="col-md-3" style={{ padding: "0px 10px" }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm theo tên..."
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                />
            </div>
            <div className='col-md-1'></div>
            <div className="col-md-2" style={{ padding: "0px 10px" }}>
                <BrandSelect
                    brandId={filters.brandId}
                    setBrandId={(id) => setFilters(prev => ({ ...prev, brandId: id }))}
                />
            </div>
            <div className="col-md-2" style={{ padding: "0px 10px" }}>
                <CategorySelect
                    categoryId={filters.categoryId}
                    setCategoryId={(id) => setFilters(prev => ({ ...prev, categoryId: id }))}
                />
            </div>
            <div className="col-md-2" style={{ padding: "0px 10px" }}>
                <MaterialSelect
                    materialId={filters.materialId}
                    setMaterialId={(id) => setFilters(prev => ({ ...prev, materialId: id }))}
                />
            </div>
            <div className="col-md-2" style={{ padding: "0px 10px" }}>
                <ReactSelect
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === filters.status) || null}
                    onChange={(selectedOption) =>
                        setFilters(prevFilters => ({
                            ...prevFilters,
                            status: selectedOption ? selectedOption.value : ''
                        }))
                    }
                    isClearable
                    placeholder="Trạng thái..."
                />
            </div>
            {/* <div className="col-md-1" style={{ padding: "0px 10px" }}>
                <button type="button" className="btn btn-inverse-primary btn-rounded btn-icon" onClick={onSearch}>
                    <i className="mdi mdi-magnify"></i>
                </button>
            </div> */}
        </div>
    );
};

export default SearchProducts;
