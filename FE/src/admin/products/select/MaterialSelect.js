import React, { useEffect, useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap';
import { createMaterial, getMaterials } from '../service/MaterialService';
import Select from 'react-select';

const MaterialSelect = ({ materialId, setMaterialId, refresh }) => {
    const [materialOptions, setMaterialOptions] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, [materialId, refresh]);

    const handleMaterialChange = (selectedOption) => {
        setSelectedMaterial(selectedOption);
        setMaterialId(selectedOption ? selectedOption.value : "");
    };

    const fetchMaterials = async () => {
        try {
            const response = await getMaterials();
            const formattedMaterials = response.data.data.map((material) => ({
                value: material.id,
                label: material.materialName,
            }));
            setMaterialOptions(formattedMaterials);

            if (materialId) {
                setSelectedMaterial(formattedMaterials.find((b) => b.value === materialId));
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu chất liệu:", error);
        }
    };

    return (
        <div>
            <Select
                options={materialOptions}
                value={selectedMaterial}
                onChange={handleMaterialChange}
                isClearable
                placeholder="Chất liệu..."
            />
        </div>
    )
}

export default MaterialSelect