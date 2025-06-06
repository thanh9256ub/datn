import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { createCategory, getCategories, updateCategory, updateStatus } from './service/CategoryService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from 'react-switch';
import Swal from 'sweetalert2';

const Categories = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categoryName, setCategoryName] = useState("")
    const [desc, setDesc] = useState("")
    const [categoryId, setCategoryId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredCategories, setFilteredCategories] = useState([])

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            setCategories(response.data.data);
            setFilteredCategories(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải danh mục.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter(category =>
                category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [searchTerm, categories])

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error("Vui lòng nhập tên danh mục!");
            return;
        }

        setSubmitLoading(true);

        try {
            if (categoryId) {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn sửa danh mục này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;
                console.log("Đang cập nhật danh mục:", categoryId, categoryName, desc);
                await updateCategory(categoryId, { categoryName, description: desc })
                toast.success("Sửa danh mục thành công!");
            } else {
                const confirmResult = await Swal.fire({
                    title: "Xác nhận",
                    text: "Bạn có chắc chắn muốn thêm danh mục này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Hủy",
                });

                if (!confirmResult.isConfirmed) return;
                await createCategory({ categoryName, description: desc });
                toast.success("Thêm danh mục thành công!");
            }

            setCategoryName("");
            setDesc("")
            setCategoryId(null);
            fetchCategories();
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
            alert("Lỗi khi thêm danh mục!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditCategory = (category) => {
        setCategoryName(category.categoryName);
        setDesc(category.description);
        setCategoryId(category.id);
    };

    const handleToggleStatus = async (categoryId, currentStatus) => {
        try {
            await updateStatus(categoryId);

            setCategories(prevCategories =>
                prevCategories.map(category =>
                    category.id === categoryId ? { ...category, status: currentStatus === 1 ? 0 : 1 } : category
                )
            );

            fetchCategories()

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái danh mục:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">{categoryId ? "Sửa danh mục" : "Thêm danh mục"}</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddCategory}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên danh mục</label>
                                    <Form.Control type="text" placeholder="Nhập tên danh mục" size="lg"
                                        value={categoryName}
                                        maxLength={255}
                                        onChange={(e) => setCategoryName(e.target.value)}
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
                                    ) : categoryId ? "Sửa" : "Lưu"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setCategoryName("");
                                        setDesc("");
                                        setCategoryId(null);
                                    }}>Huỷ</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title mb-0">Danh sách danh mục</h4>
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
                                                <th>Tên danh mục</th>
                                                <th>Mô tả</th>
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCategories.length > 0 ? (
                                                filteredCategories.map((category, index) => (
                                                    <tr key={category.id}
                                                        onClick={() => handleEditCategory(category)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>{category.categoryName}</td>
                                                        <td>{category.description}</td>
                                                        <td>
                                                            <span className={`badge ${category.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                {category.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            onClick={(event) => event.stopPropagation()}
                                                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <Button variant="link"
                                                                onClick={() => handleEditCategory(category)}
                                                            >
                                                                <i className='mdi mdi-pencil'></i>
                                                            </Button> */}
                                                            <Switch
                                                                checked={category.status == 1}
                                                                onChange={() => handleToggleStatus(category.id)}
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
                                                    <td colSpan="10" className="text-center">Không có danh mục nào</td>
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

export default Categories
