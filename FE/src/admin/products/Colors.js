import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { createColor, getColors, updateColor, updateStatus } from './service/ColorService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from 'react-switch';

const Colors = () => {

    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [colorName, setColorName] = useState("")
    const [desc, setDesc] = useState("")
    const [colorId, setColorId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchColors = async () => {
        try {
            setLoading(true);
            const response = await getColors();
            setColors(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải màu sắc.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColors()
    }, [])

    const handleAddColor = async (e) => {
        e.preventDefault();
        if (!colorName.trim()) {
            toast.error("Vui lòng nhập tên màu sắc!");
            return;
        }

        setSubmitLoading(true);

        try {
            if (colorId) {
                console.log("Đang cập nhật màu sắc:", colorId, colorName, desc);
                await updateColor(colorId, { colorName, description: desc })
                toast.success("Sửa màu sắc thành công!");
            } else {
                await createColor({ colorName, description: desc });
                toast.success("Thêm màu sắc thành công!");
            }

            setColorName("");
            setDesc("")
            setColorId(null);
            fetchColors();
        } catch (error) {
            console.error("Lỗi khi thêm màu sắc:", error);
            alert("Lỗi khi thêm màu sắc!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditColor = (color) => {
        setColorName(color.colorName);
        setDesc(color.description);
        setColorId(color.id);
    };

    const handleToggleStatus = async (colorId, currentStatus) => {
        try {
            await updateStatus(colorId);

            setColors(prevColors =>
                prevColors.map(color =>
                    color.id === colorId ? { ...color, status: currentStatus === 1 ? 0 : 1 } : color
                )
            );

            fetchColors()

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái màu sắc:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Thông tin màu sắc</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddColor}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên màu sắc</label>
                                    <Form.Control type="text" placeholder="Nhập tên màu sắc" size="lg"
                                        value={colorName}
                                        onChange={(e) => setColorName(e.target.value)}
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
                                    ) : colorId ? "Edit" : "Submit"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setColorName("");
                                        setDesc("");
                                        setColorId(null);
                                    }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách màu sắc</h4>
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
                                                <th>Tên màu sắc</th>
                                                <th>Mô tả</th>
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {colors.length > 0 ? (
                                                colors.map((color, index) => (
                                                    <tr key={color.id}
                                                        onClick={() => handleEditColor(color)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>{color.colorName}</td>
                                                        <td>{color.description}</td>
                                                        <td>
                                                            <span className={`badge ${color.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                {color.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            onClick={(event) => event.stopPropagation()}
                                                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Button variant="link"
                                                                onClick={() => handleEditColor(color)}
                                                            >
                                                                <i className='mdi mdi-pencil'></i>
                                                            </Button> */}
                                                            <Switch
                                                                checked={color.status == 1}
                                                                onChange={() => handleToggleStatus(color.id)}
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
                                                    <td colSpan="10" className="text-center">Không có màu sắc nào</td>
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

export default Colors
