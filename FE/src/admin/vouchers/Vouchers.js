import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { getVouchers } from "./service/VoucherService";
import useWebSocket from "../../hook/useWebSocket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { messages, isConnected } = useWebSocket("/topic/voucher-updates");
  const history = useHistory();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getVouchers();
      if (response.data?.data) {
        setVouchers(response.data.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách voucher");
      console.error("Lỗi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Hiển thị thông báo từ WebSocket qua toast
      toast.info(lastMessage);

      fetchVouchers()
    }
  }, [messages]);

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="page-title">Danh sách khuyến mại</h3>

        </div>
      </div>
      <div className="d-flex align-items-center">
        {isConnected ? (
          <span className="badge badge-success mr-2">
            <i className="mdi mdi-wifi"></i> Đang kết nối
          </span>
        ) : (
          <span className="badge badge-danger mr-2">
            <i className="mdi mdi-wifi-off"></i> Mất kết nối
          </span>
        )}
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="card-description d-flex justify-content-between align-items-center mb-3">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '300px' }}
                />
                <Button
                  variant="primary"
                  onClick={() => history.push('/admin/vouchers/add')}
                >
                  <i className="mdi mdi-plus"></i> Thêm mới
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>Mã</th>
                        <th>Tên khuyến mại</th>
                        <th>Loại giảm giá</th>
                        <th>Giá trị tối thiểu</th>
                        <th>Giá trị giảm</th>
                        <th>Số lượng</th>
                        <th>Giảm tối đa</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher) => (
                          <tr key={voucher.id}>
                            <td>{voucher.id}</td>
                            <td>
                              <span className="font-weight-bold">
                                {voucher.voucherCode}
                              </span>
                            </td>
                            <td>{voucher.voucherName}</td>
                            <td>
                              {voucher.discountType === 0
                                ? <span className="badge badge-primary">Theo số tiền</span>
                                : <span className="badge badge-success">Theo %</span>}
                            </td>
                            <td>{voucher.minOrderValue?.toLocaleString()}đ</td>
                            <td>
                              {voucher.discountType === 0
                                ? `${voucher.discountValue?.toLocaleString()}đ`
                                : `${voucher.discountValue}%`}
                            </td>
                            <td>{voucher.quantity}</td>
                            <td>
                              {voucher.maxDiscountValue?.toLocaleString()}đ
                            </td>
                            <td>
                              {new Intl.DateTimeFormat('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                              }).format(new Date(voucher.startDate))}
                            </td>
                            <td>
                              {new Intl.DateTimeFormat('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                              }).format(new Date(voucher.endDate))}
                            </td>
                            <td>
                              <span className={`badge ${voucher.status === 1
                                ? 'badge-success'
                                : voucher.status === 0
                                  ? 'badge-danger'
                                  : 'badge-info'}`}>
                                {voucher.status === 1
                                  ? "Đang hoạt động"
                                  : voucher.status === 0
                                    ? "Đã hết hạn"
                                    : "Chưa kích hoạt"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center py-4">
                            {searchTerm
                              ? "Không tìm thấy voucher phù hợp"
                              : "Không có voucher nào"}
                          </td>
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Vouchers;