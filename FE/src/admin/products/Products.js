import React, { useEffect, useState } from 'react';
import { getProducts, searchProducts, updateStatus } from './service/ProductService';
import { useHistory } from 'react-router-dom';
import { Alert, Modal, Pagination, Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchProducts from './action/SearchProducts';
import Swal from 'sweetalert2';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const [filters, setFilters] = useState({
        name: '',
        brandId: '',
        categoryId: '',
        materialId: '',
        status: ''
    });

    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const fetchProducts = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProducts(page, size);
            const data = response.data?.data;

            setProducts(data?.content || []);
            setTotalPages(data?.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
            setError("Đã xảy ra lỗi khi tải sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, pageSize);

        const message = localStorage.getItem("successMessage");
        if (message) {
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            localStorage.removeItem("successMessage");
        }

        history.push(`/admin/products?page=${currentPage}&size=${pageSize}`);
    }, [currentPage, pageSize]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            fetchProducts(page);
            history.push(`/admin/products?page=${page}&size=${pageSize}`);
        }
    };

    const pageSizeOptions = [
        { value: 5, label: "5 sản phẩm" },
        { value: 10, label: "10 sản phẩm" },
        { value: 20, label: "20 sản phẩm" },
        { value: 50, label: "50 sản phẩm" }
    ];

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setCurrentPage(0);
    };

    const handleAddProduct = () => {
        history.push('/admin/products/add');
    }

    const handleProductDetail = (id, productName) => {
        history.push(
            `/admin/products/${id}/detail`
        );
    }

    const handleToggleStatus = async (productId, currentStatus, totalQuantity) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn ngừng bán sản phẩm này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
                footer: "<p style='color: red;'>Lưu ý: Nếu đồng ý sản phẩm sẽ không thể bán trên quầy hàng và website!</p>",
            });

            if (!result.isConfirmed) return;

            let newStatus;

            if (currentStatus === 2) {
                newStatus = totalQuantity > 0 ? 1 : 0;
            } else {
                newStatus = 2;
            }

            await updateStatus(productId, newStatus);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? { ...product, status: newStatus } : product
                )
            );

            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
        }
    };

    const handleShowImageModal = (imageUrl) => {
        setImageUrl(imageUrl);
        setShowImageModal(true);
    };

    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            const response = await searchProducts(filters, currentPage, pageSize);
            setProducts(response.data?.data?.content || []);
            setTotalPages(response.data?.data?.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi tìm kiếm sản phẩm.');
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchFilteredProducts();
    // }, []);

    const handleSearch = () => {
        setCurrentPage(0);
        fetchFilteredProducts();
    };

    // const handleExportExcel = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8080/products/export-excel", {
    //             method: "GET",
    //             headers: {
    //                 "Authorization": `Bearer ${localStorage.getItem("token")}`
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error("Lỗi khi xuất file Excel");
    //         }

    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = "danh_sach_san_pham.xlsx";
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         window.URL.revokeObjectURL(url);
    //         toast.success("Xuất file Excel thành công!");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Lỗi khi xuất file Excel!");
    //     }
    // };

    const handleExportExcel = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để xuất Excel!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/products/export-excel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productIds: selectedProducts }) // Gửi danh sách ID sản phẩm đã chọn
            });

            if (!response.ok) {
                throw new Error("Lỗi khi xuất file Excel");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh_sach_san_pham_xuat_excel.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success("Xuất file Excel thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xuất file Excel!");
        }
    };


    const handleImportExcel = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            toast.error("Vui lòng chọn một tệp Excel!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/products/import-excel", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Lỗi khi nhập file Excel");
            }

            toast.success("Nhập file Excel thành công!");
            fetchProducts(); // Load lại danh sách sản phẩm sau khi nhập
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi nhập file Excel!");
        }
    };

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    Danh sách sản phẩm
                </h3>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button type="button" className='btn btn-success' style={{ cursor: "pointer" }}>
                        <i className='mdi mdi-file-import'></i>Nhập Excel
                    </button>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleImportExcel}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer"
                        }}
                    />
                </div>
                <button type="button" className='btn btn-success' onClick={handleExportExcel}>
                    <i className='mdi mdi-file-export'></i>Xuất Excel
                </button>
                <button type="button" className="btn btn-gradient-primary float-right" onClick={handleAddProduct}>
                    <i className='mdi mdi-plus'></i> Thêm mới
                </button>
            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-md-12'>
                                    <SearchProducts filters={filters} setFilters={setFilters} onSearch={handleSearch} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}></div>
                            {successMessage && (
                                <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                                    {successMessage}
                                </Alert>
                            )}
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                    <Spinner animation="border" variant="primary" />
                                    <span className="ml-2">Đang tải dữ liệu...</span>
                                </div>
                            ) : error ? (
                                <div className="text-danger">{error}</div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead
                                            // style={{ backgroundColor: "#CE91FF", color: "#fff" }}
                                            >
                                                <tr>
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedProducts(products.map(p => p.id));
                                                                } else {
                                                                    setSelectedProducts([]);
                                                                }
                                                            }}
                                                            checked={selectedProducts.length === products.length && products.length > 0}
                                                        />
                                                    </th>
                                                    <th>Ảnh chính</th>
                                                    <th>Mã sản phẩm</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Thương hiệu</th>
                                                    <th>Danh mục</th>
                                                    <th>Chất liệu</th>
                                                    <th>Mô tả</th>
                                                    <th style={{ width: '50px' }}>Tổng số lượng</th>
                                                    <th>Trạng thái</th>
                                                    <th style={{ width: '100px' }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.length > 0 ? (
                                                    products
                                                        .map((product, index) => (
                                                            <tr
                                                                key={product.id}
                                                                onClick={() => handleProductDetail(product.id)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <td onClick={(event) => event.stopPropagation()}>
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedProducts([...selectedProducts, product.id]);
                                                                            } else {
                                                                                setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                                                            }
                                                                        }}
                                                                        checked={selectedProducts.includes(product.id)}
                                                                    />
                                                                </td>
                                                                <td onClick={(event) => event.stopPropagation()}>
                                                                    {product.mainImage != "image.png" ? (
                                                                        <img
                                                                            src={product.mainImage}
                                                                            alt="Product"
                                                                            style={{ width: '100px', height: 'auto', cursor: 'pointer', borderRadius: '5%', objectFit: 'contain' }}
                                                                            onClick={() => handleShowImageModal(product.mainImage)}  // Mở modal khi click vào ảnh
                                                                        />
                                                                    ) : (
                                                                        <span>No Image</span>
                                                                    )}
                                                                </td>
                                                                <td>{product.productCode}</td>
                                                                <td>{product.productName}</td>
                                                                <td>{product.brand.brandName}</td>
                                                                <td>{product.category.categoryName}</td>
                                                                <td>{product.material.materialName}</td>
                                                                <td className="long-content">{product.description}</td>
                                                                <td>{product.totalQuantity}</td>
                                                                <td>
                                                                    <span className={`badge ${product.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                        {product.status === 1 ? 'Đang bán' : product.status === 2 ? 'Ngừng bán' : 'Hết hàng'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div
                                                                        onClick={(event) => event.stopPropagation()}
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            gap: '10px',
                                                                            textAlign: 'center',
                                                                            height: '100%',
                                                                            padding: '10px'
                                                                        }} >
                                                                        {/* <button className="btn btn-outline-warning btn-sm btn-rounded btn-icon"
                                                                            onClick={() => handleProductDetail(product.id, product.productName)}
                                                                        >
                                                                            <i className='mdi mdi-eye'></i>
                                                                        </button> */}
                                                                        <Switch
                                                                            checked={product.status !== 2}
                                                                            onChange={() => handleToggleStatus(product.id, product.status, product.totalQuantity)}
                                                                            offColor="#888"
                                                                            onColor="#ca51f0"
                                                                            uncheckedIcon={false}
                                                                            checkedIcon={false}
                                                                            height={20}
                                                                            width={40}
                                                                        />
                                                                        {/* <button className="btn btn-outline-danger btn-sm btn-rounded btn-icon"
                                                                            onClick={() => handleUpdateProduct(product.id)}
                                                                        >
                                                                            <i className='mdi mdi mdi-wrench'></i>
                                                                        </button> */}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="text-center">Không có sản phẩm nào</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column", // Xếp theo cột
                                        alignItems: "center", // Căn giữa theo chiều ngang
                                        marginTop: "20px",
                                        gap: "10px",
                                        width: "100%"
                                    }}>
                                        <Pagination className="justify-content-center">
                                            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
                                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />

                                            {[...Array(totalPages)].map((_, index) => (
                                                <Pagination.Item
                                                    key={index}
                                                    active={index === currentPage}
                                                    onClick={() => handlePageChange(index)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}

                                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                                            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                                        </Pagination>
                                        <div style={{ minWidth: "80px", textAlign: "center" }}>
                                            <select
                                                value={pageSize}
                                                onChange={handlePageSizeChange}
                                                className="form-control"
                                            >
                                                {pageSizeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
                <Modal.Body>
                    <img
                        src={imageUrl}
                        alt="Large Product"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div >
    )
}

export default Products
