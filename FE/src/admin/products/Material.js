import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { createMaterial, getMaterials, updateMaterial, updateStatus } from './service/MaterialService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from 'react-switch';
import Swal from 'sweetalert2';

const Materials = () => {

    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [materialName, setMaterialName] = useState("")
    const [desc, setDesc] = useState("")
    const [materialId, setMaterialId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredMaterials, setFilteredMaterials] = useState([])

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const response = await getMaterials();
            setMaterials(response.data.data);
            setFilteredMaterials(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải chất liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials()
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredMaterials(materials);
        } else {
            const filtered = materials.filter(material =>
                material.materialName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMaterials(filtered);
        }
    }, [searchTerm, materials])

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!materialName.trim()) {
            toast.error("Vui lòng nhập tên chất liệu!");
            return;
        }

        setSubmitLoading(true);

        try {
            if (materialId) {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn sửa chất liệu này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;
                console.log("Đang cập nhật chất liệu:", materialId, materialName, desc);
                await updateMaterial(materialId, { materialName, description: desc })
                toast.success("Sửa chất liệu thành công!");
            } else {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn thêm chất liệu này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;
                await createMaterial({ materialName, description: desc });
                toast.success("Thêm chất liệu thành công!");
            }

            setMaterialName("");
            setDesc("")
            setMaterialId(null);
            fetchMaterials();
        } catch (error) {
            console.error("Lỗi khi thêm chất liệu:", error);
            alert("Lỗi khi thêm chất liệu!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditMaterial = (material) => {
        setMaterialName(material.materialName);
        setDesc(material.description);
        setMaterialId(material.id);
    };

    const handleToggleStatus = async (materialId, currentStatus) => {
        try {
            await updateStatus(materialId);

            setMaterials(prevMaterials =>
                prevMaterials.map(material =>
                    material.id === materialId ? { ...material, status: currentStatus === 1 ? 0 : 1 } : material
                )
            );

            fetchMaterials()

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái chất liệu:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">{materialId ? "Sửa chất liệu" : "Thêm chất liệu"}</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddMaterial}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên chất liệu</label>
                                    <Form.Control type="text" placeholder="Nhập tên chất liệu" size="lg"
                                        value={materialName}
                                        maxLength={255}
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
                                <button type="submit" className="btn btn-gradient-primary mr-2" disabled={submitLoading}>
                                    {submitLoading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : materialId ? "Sửa" : "Lưu"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setMaterialName("");
                                        setDesc("");
                                        setMaterialId(null);
                                    }}>Huỷ</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title mb-0">Danh sách chất liệu</h4>
                                <Form.Group className="mb-0" style={{ width: '250px' }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm theo tên..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                    <Spinner animation="border" variant="primary" />
                                    <span className="ml-2">Đang tải dữ liệu...</span>
                                </div>
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
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMaterials.length > 0 ? (
                                                filteredMaterials.map((material, index) => (
                                                    <tr key={material.id}
                                                        onClick={() => handleEditMaterial(material)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>{material.materialName}</td>
                                                        <td>{material.description}</td>
                                                        <td>
                                                            <span className={`badge ${material.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                {material.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            onClick={(event) => event.stopPropagation()}
                                                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Button variant="link"
                                                                onClick={() => handleEditMaterial(material)}
                                                            >
                                                                <i className='mdi mdi-pencil'></i>
                                                            </Button> */}
                                                            <Switch
                                                                checked={material.status == 1}
                                                                onChange={() => handleToggleStatus(material.id)}
                                                                offColor="#888"
                                                                onColor="#ca51f0"
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                height={20}
                                                                width={40}
                                                            />
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
            <ToastContainer />
        </div >
    )
}

export default Materials
