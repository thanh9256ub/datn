import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { createMaterial, getMaterials, updateMaterial } from './service/MaterialService'

const Materials = () => {

    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [materialName, setMaterialName] = useState("")
    const [desc, setDesc] = useState("")
    const [materialId, setMaterialId] = useState(null)

    const fetchMaterials = async () => {
        try {
            const response = await getMaterials();
            setMaterials(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải chất liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials()
    }, [])

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!materialName.trim()) {
            alert("Vui lòng nhập tên chất liệu!");
            return;
        }

        try {
            if (materialId) {
                console.log("Đang cập nhật chất liệu:", materialId, materialName, desc);
                await updateMaterial(materialId, { materialName, description: desc })
                alert("Sửa chất liệu thành công!");
            } else {
                await createMaterial({ materialName, description: desc });
                alert("Thêm chất liệu thành công!");
            }

            setMaterialName("");
            setDesc("")
            setMaterialId(null);
            fetchMaterials();
        } catch (error) {
            console.error("Lỗi khi thêm chất liệu:", error);
            alert("Lỗi khi thêm chất liệu!");
        }
    };

    const handleEditMaterial = (material) => {
        setMaterialName(material.materialName);
        setDesc(material.description);
        setMaterialId(material.id);
    };

    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Thông tin chất liệu</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddMaterial}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên chất liệu</label>
                                    <Form.Control type="text" placeholder="Nhập tên chất liệu" size="lg"
                                        value={materialName}
                                        onChange={(e) => setMaterialName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputEmail1">Mô tả</label>
                                    <Form.Control type="text" className="form-control" placeholder="Mô tả"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                    />
                                </Form.Group>
                                <button type="submit" className="btn btn-gradient-primary mr-2">
                                    {materialId ? "Edit" : "Submit"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setMaterialName("");
                                        setDesc("");
                                        setMaterialId(null);
                                    }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách chất liệu</h4>
                            {loading ? (
                                <div>Đang tải sản phẩm...</div>
                            ) : error ? (
                                <div className="text-danger">{error}</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Tên chất liệu</th>
                                                <th>Mô tả</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materials.length > 0 ? (
                                                materials.map((material, index) => (
                                                    <tr key={material.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{material.materialName}</td>
                                                        <td>{material.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <button className="btn btn-danger btn-sm ml-2"
                                                                onClick={() => handleEditMaterial(material)}
                                                            >
                                                                <i className='mdi mdi-border-color'></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center">Không có chất liệu nào</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Materials
