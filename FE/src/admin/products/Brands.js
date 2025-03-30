import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { createBrand, getBrands, updateBrand } from './service/BrandService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                console.log("Đang cập nhật thương hiệu:", brandId, brandName, desc);
                await updateBrand(brandId, { brandName, description: desc })
                toast.success("Sửa thương hiệu thành công!");
            } else {
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
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brands.length > 0 ? (
                                                brands.map((brand, index) => (
                                                    <tr key={brand.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{brand.brandName}</td>
                                                        <td>{brand.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <button className="btn btn-danger btn-sm ml-2"
                                                                onClick={() => handleEditBrand(brand)}
                                                            >
                                                                <i className='mdi mdi-border-color'></i>
                                                            </button>
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
