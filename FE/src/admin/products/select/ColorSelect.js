import React, { useEffect, useState } from 'react';
import { getColors } from '../service/ColorService';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

const ColorSelect = ({ colorIds, setColorIds }) => {
    const [colorOptions, setColorOptions] = useState([]);

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

    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Màu sắc:</label>
                <div className="col-sm-9">
                    <Select
                        isMulti
                        options={colorOptions}
                        value={colorIds || []}
                        onChange={(selected) => setColorIds(selected || [])}
                        classNamePrefix="react-select"
                    />
                </div>
            </Form.Group>
        </div>
    )
}

export default ColorSelect