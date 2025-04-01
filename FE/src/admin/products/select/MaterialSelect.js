import React, { useEffect, useState } from 'react';
import { getActive, getMaterials } from '../service/MaterialService';
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
            const activeResponse = await getActive();
            const activeMaterials = activeResponse.data.data.map((material) => ({
                value: material.id,
                label: material.materialName,
            }));

            let updatedSelectedMaterial = null;
            let finalMaterialOptions = [...activeMaterials];

            if (materialId) {
                const isActive = activeMaterials.some((b) => b.value === materialId);

                if (!isActive) {
                    const allResponse = await getMaterials();
                    const allMaterials = allResponse.data.data;
                    const currentMaterial = allMaterials.find((b) => b.id === materialId);

                    if (currentMaterial) {
                        updatedSelectedMaterial = {
                            value: currentMaterial.id,
                            label: `${currentMaterial.materialName} (Ngừng hoạt động)`,
                            isDisabled: true,
                        };

                        finalMaterialOptions.push(updatedSelectedMaterial);
                    }
                } else {
                    updatedSelectedMaterial = activeMaterials.find((b) => b.value === materialId);
                }
            }

            setMaterialOptions(finalMaterialOptions);
            setSelectedMaterial(updatedSelectedMaterial);
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
    );
};

export default MaterialSelect;