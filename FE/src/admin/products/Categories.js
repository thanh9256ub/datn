import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { createCategory, getCategories, updateCategory } from './service/CategoryService'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {

    const [categorys, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categoryName, setCategoryName] = useState("")
    const [desc, setDesc] = useState("")
    const [categoryId, setCategoryId] = useState(null)

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data.data);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải danh mục.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            if (categoryId) {
                console.log("Đang cập nhật danh mục:", categoryId, categoryName, desc);
                await updateCategory(categoryId, { categoryName, description: desc })
                toast.success("Sửa danh mục thành công!");
            } else {
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
        }
    };

    const handleEditCategory = (category) => {
        setCategoryName(category.categoryName);
        setDesc(category.description);
        setCategoryId(category.id);
    };

    return (
        <div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Thông tin danh mục</h4>
                            <div style={{ marginBottom: '20px' }}></div>
                            <hr />
                            <form className="forms-sample" onSubmit={handleAddCategory}>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Tên danh mục</label>
                                    <Form.Control type="text" placeholder="Nhập tên danh mục" size="lg"
                                        value={categoryName}
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
                                <button type="submit" className="btn btn-gradient-primary mr-2">
                                    {categoryId ? "Edit" : "Submit"}
                                </button>
                                <button type='button' className="btn btn-light"
                                    onClick={() => {
                                        setCategoryName("");
                                        setDesc("");
                                        setCategoryId(null);
                                    }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Danh sách danh mục</h4>
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
                                                <th>Tên danh mục</th>
                                                <th>Mô tả</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categorys.length > 0 ? (
                                                categorys.map((category, index) => (
                                                    <tr key={category.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{category.categoryName}</td>
                                                        <td>{category.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <button className="btn btn-danger btn-sm ml-2"
                                                                onClick={() => handleEditCategory(category)}
                                                            >
                                                                <i className='mdi mdi-border-color'></i>
                                                            </button>
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
