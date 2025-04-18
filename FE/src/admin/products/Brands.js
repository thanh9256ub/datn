import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { createBrand, getBrands, updateBrand, updateStatus } from './service/BrandService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from 'react-switch';
import Swal from 'sweetalert2';

const Brands = () => {

    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [brandName, setBrandName] = useState("")
    const [desc, setDesc] = useState("")
    const [brandId, setBrandId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await getBrands();
            setBrands(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải thương hiệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands()
    }, [])

    const handleAddBrand = async (e) => {
        e.preventDefault();
        if (!brandName.trim()) {
            toast.error("Vui lòng nhập tên thương hiệu!");
            return;
        }

        setSubmitLoading(true);

        try {
            if (brandId) {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn sửa thương hiệu này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;

                console.log("Đang cập nhật thương hiệu:", brandId, brandName, desc);
                await updateBrand(brandId, { brandName, description: desc })
                toast.success("Sửa thương hiệu thành công!");
            } else {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn thêm thương hiệu này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;
                await createBrand({ brandName, description: desc });
                toast.success("Thêm thương hiệu thành công!");
            }

            setBrandName("");
            setDesc("")
            setBrandId(null);
            fetchBrands();
        } catch (error) {
            console.error("Lỗi khi thêm thương hiệu:", error);
            alert("Lỗi khi thêm thương hiệu!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditBrand = (brand) => {
        setBrandName(brand.brandName);
        setDesc(brand.description);
        setBrandId(brand.id);
    };

    const handleToggleStatus = async (brandId, currentStatus) => {
        try {
            await updateStatus(brandId);

            setBrands(prevBrands =>
                prevBrands.map(brand =>
                    brand.id === brandId ? { ...brand, status: currentStatus === 1 ? 0 : 1 } : brand
                )
            );

            fetchBrands()

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái thương hiệu:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Thông tin thương hiệu</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddBrand}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên thương hiệu</label>
                                    <Form.Control type="text" placeholder="Nhập tên thương hiệu" size="lg"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
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
                                    ) : brandId ? "Edit" : "Submit"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setBrandName("");
                                        setDesc("");
                                        setBrandId(null);
                                    }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách thương hiệu</h4>
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
                                                <th>Tên thương hiệu</th>
                                                <th>Mô tả</th>
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brands.length > 0 ? (
                                                brands.map((brand, index) => (
                                                    <tr key={brand.id}
                                                        onClick={() => handleEditBrand(brand)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>{brand.brandName}</td>
                                                        <td>{brand.description}</td>
                                                        <td>
                                                            <span className={`badge ${brand.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                {brand.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            onClick={(event) => event.stopPropagation()}
                                                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Button variant="link"
                                                                onClick={() => handleEditBrand(brand)}
                                                            >
                                                                <i className='mdi mdi-pencil'></i>
                                                            </Button> */}
                                                            <Switch
                                                                checked={brand.status == 1}
                                                                onChange={() => handleToggleStatus(brand.id)}
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
                                                    <td colSpan="10" className="text-center">Không có thương hiệu nào</td>
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

export default Brands
