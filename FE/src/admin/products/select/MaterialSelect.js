import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import { getMaterials } from '../service/MaterialService';

const MaterialSelect = ({ materialId, setMaterialId }) => {
    const [materialOptions, setMaterialOptions] = useState([]);

    useEffect(() => {
        getMaterials()
            .then(response => {
                setMaterialOptions(response.data.data);
            })
            .catch(error => {
                console.log("Lỗi khi lấy dữ liệu chất liệu:", error)
            })
    }, []);

    const handleMaterialChange = (event) => {
        setMaterialId(event.target.value || "");
        event.target.value ? event.target.style.color = "#000" : event.target.style.color = "#999";
    };


    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Chất liệu:</label>
                <div className="col-sm-9">
                    <select
                        className={`form-control`}
                        value={materialId || ""}
                        onChange={handleMaterialChange}
                        style={{ color: materialId ? "#000" : "#999" }}
                    >
                        <option value="">Chọn chất liệu</option>
                        {materialOptions.map(material => (
                            <option key={material.id} value={material.id}>
                                {material.materialName}
                            </option>
                        ))}
                    </select>
                </div>
            </Form.Group>
        </div>
    )
}

export default MaterialSelect