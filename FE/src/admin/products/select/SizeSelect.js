import React, { useEffect, useState } from 'react';
import { getSizes } from '../service/SizeService';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

const SizeSelect = ({ sizeIds, setSizeIds }) => {
    const [sizeOptions, setSizeOptions] = useState([]);

    useEffect(() => {
        getSizes().then(response => {
            const formattedSizes = response.data.data.map(size => ({
                value: size.id,
                label: size.sizeName
            }));
            setSizeOptions(formattedSizes);
        });
    }, []);

    return (
        <Form.Group className="row">
            <label className="col-sm-3 col-form-label">Kích cỡ:</label>
            <div className="col-sm-9">
                <Select
                    isMulti
                    options={sizeOptions}
                    value={sizeIds || []}
                    onChange={(selected) => setSizeIds(selected || [])}
                    classNamePrefix="react-select"
                />
            </div>
        </Form.Group>
    );
};

export default SizeSelect;
