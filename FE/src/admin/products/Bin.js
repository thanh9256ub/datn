import React, { useEffect, useState } from 'react';
import { deleteAndRestoreProducts, getBin, updateStatus } from './service/ProductService';
import { Dropdown, Pagination, Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';

const Bin = () => {

    const history = useHistory();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const fetchProducts = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        try {
            const response = await getBin(page, size);
            const data = response.data?.data;
            setProducts(data?.content || []);
            setTotalPages(data?.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải sản phẩm.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, pageSize);

        history.push(`/admin/products/bin?page=${currentPage}&size=${pageSize}`);
    }, [currentPage, pageSize]);

    const pageSizeOptions = [
        { value: 5, label: "5 sản phẩm" },
        { value: 10, label: "10 sản phẩm" },
        { value: 20, label: "20 sản phẩm" },
        { value: 50, label: "50 sản phẩm" }
    ];

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            fetchProducts(page);
            history.push(`/admin/products/bin?page=${page}&size=${pageSize}`);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setCurrentPage(0);
    };

    // Xử lý chọn checkbox
    const handleSelectProduct = (productId) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId) // Bỏ chọn nếu đã có
                : [...prevSelected, productId] // Thêm nếu chưa chọn
        );
    };

    const handleSelectAll = () => {
        setSelectedProducts(selectedProducts.length === products.length ? [] : products.map(p => p.id));
    };

    const handleToggleStatus = async (productId, currentStatus, totalQuantity) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn khôi phục sản phẩm này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
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

    const handleBulkDeleteProducts = async () => {
        if (selectedProducts.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một sản phẩm để xoá!");
            return;
        }

        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn khôi phục các sản phẩm đã chọn?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
            });

            if (!result.isConfirmed) return;

            await deleteAndRestoreProducts(selectedProducts);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    selectedProducts.includes(product.id) ? { ...product, status: 2 } : product
                )
            );

            setSelectedProducts([]);

            fetchProducts();

            toast.success("Đã xoá các sản phẩm thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2>Thùng rác</h2>
                <button
                    type="button"
                    className="btn btn-link"
                    style={{ padding: "0px", marginBottom: "10px" }}
                    onClick={() => history.push('/admin/products')}
                >
                    <i className="mdi mdi-keyboard-backspace"></i>
                    Quay lại
                </button>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-start", marginBottom: 16 }}>
                <Dropdown>
                    <Dropdown.Toggle as="div" id="dropdownMenuSizeButton3" style={{ cursor: "pointer", display: "inline-block" }}>
                        <span style={{ textDecoration: "none" }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                            Thao tác
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleBulkDeleteProducts}>
                            <i className='mdi mdi-backup-restore'></i>
                            Khôi phục các sản phẩm đã chọn</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            {/* <h3 className="card-title"><i className='mdi mdi-archive'></i> KHO LƯU TRỮ</h3>

                        <button
                            className="btn btn-primary mb-3"
                            onClick={handleRestoreSelected}
                            disabled={selectedProducts.length === 0}
                        >
                            <i className="mdi mdi-restore"></i> Khôi phục đã chọn
                        </button> */}

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
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedProducts.length === products.length}
                                                    />
                                                </th>
                                                <th>Ảnh chính</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Thương hiệu</th>
                                                <th>Danh mục</th>
                                                <th>Chất liệu</th>
                                                <th style={{ width: '50px' }}>Tổng số lượng</th>
                                                <th style={{ width: '150px' }}>Trạng thái</th>
                                                <th style={{ width: '100px' }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length > 0 ? (
                                                products.map((product, index) => (
                                                    <tr key={product.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedProducts.includes(product.id)}
                                                                onChange={() => handleSelectProduct(product.id)}
                                                            />
                                                        </td>
                                                        <td><span>img.png</span></td>
                                                        <td>{product.productName}</td>
                                                        <td>{product.brand.brandName}</td>
                                                        <td>{product.category.categoryName}</td>
                                                        <td>{product.material.materialName}</td>
                                                        <td>{product.totalQuantity}</td>
                                                        <td>
                                                            <span className={`badge ${product.status === 1 ? 'badge-success' : 'badge-dark'}`} style={{ padding: '7px' }}>
                                                                Đã xoá
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Switch
                                                                checked={product.status === 1}
                                                                onChange={() => handleToggleStatus(product.id, product.status, product.totalQuantity)}
                                                                offColor="#888"
                                                                onColor="#0d6efd"
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
                                                    <td colSpan="10" className="text-center">Không có sản phẩm nào</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Bin;
