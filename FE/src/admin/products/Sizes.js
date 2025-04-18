import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { createSize, getSizes, updateSize, updateStatus } from './service/SizeService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from 'react-switch';
import Swal from 'sweetalert2';

const Sizes = () => {

    const [sizes, setSizes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sizeName, setSizeName] = useState("")
    const [desc, setDesc] = useState("")
    const [sizeId, setSizeId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchSizes = async () => {
        try {
            setLoading(true);
            const response = await getSizes();
            setSizes(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải kích cỡ.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes()
    }, [])

    const handleAddSize = async (e) => {
        e.preventDefault();
        if (!sizeName.trim()) {
            toast.error("Vui lòng nhập tên kích cỡ!");
            return;
        }

        setSubmitLoading(true);

        try {
            const sizeResp = await getSizes();
            const sizes = sizeResp.data.data;

            const sizeExists = sizes.some(
                size => size.sizeName.toLowerCase() === sizeName.toLowerCase() && size.id !== sizeId
            );

            if (sizeExists) {
                toast.error("Tên kích cỡ đã tồn tại!");
                return;
            }

            if (sizeId) {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn sửa kích cỡ này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;

                console.log("Đang cập nhật kích cỡ:", sizeId, sizeName, desc);
                await updateSize(sizeId, { sizeName, description: desc })
                toast.success("Sửa kích cỡ thành công!");
            } else {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn thêm kích cỡ không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;

                await createSize({ sizeName, description: desc });
                toast.success("Thêm kích cỡ thành công!");
            }

            setSizeName("");
            setDesc("")
            setSizeId(null);
            fetchSizes();
        } catch (error) {
            console.error("Lỗi khi thêm kích cỡ:", error);
            alert("Lỗi khi thêm kích cỡ!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditSize = (size) => {
        setSizeName(size.sizeName);
        setDesc(size.description);
        setSizeId(size.id);
    };

    const handleToggleStatus = async (sizeId, currentStatus) => {
        try {
            await updateStatus(sizeId);

            setSizes(prevSizes =>
                prevSizes.map(size =>
                    size.id === sizeId ? { ...size, status: currentStatus === 1 ? 0 : 1 } : size
                )
            );

            fetchSizes()

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái kích cỡ:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Thông tin kích cỡ</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddSize}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên kích cỡ</label>
                                    <Form.Control type="text" placeholder="Nhập tên kích cỡ" size="lg"
                                        value={sizeName}
                                        onChange={(e) => setSizeName(e.target.value)}
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
                                    ) : sizeId ? "Edit" : "Submit"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setSizeName("");
                                        setDesc("");
                                        setSizeId(null);
                                    }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách kích cỡ</h4>
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
                                                <th>Tên kích cỡ</th>
                                                <th>Mô tả</th>
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sizes.length > 0 ? (
                                                sizes.map((size, index) => (
                                                    <tr key={size.id}
                                                        onClick={() => handleEditSize(size)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>{size.sizeName}</td>
                                                        <td>{size.description}</td>
                                                        <td>
                                                            <span className={`badge ${size.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                {size.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            onClick={(event) => event.stopPropagation()}
                                                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Button variant="link"
                                                                onClick={() => handleEditSize(size)}
                                                            >
                                                                <i className='mdi mdi-pencil'></i>
                                                            </Button> */}
                                                            <Switch
                                                                checked={size.status == 1}
                                                                onChange={() => handleToggleStatus(size.id)}
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
                                                    <td colSpan="10" className="text-center">Không có kích cỡ nào</td>
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

export default Sizes
