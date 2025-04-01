import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Badge, notification, Modal } from "antd";
import { PlusOutlined, WifiOutlined, DisconnectOutlined } from "@ant-design/icons";
import { getVouchers } from "./service/VoucherService";
import useWebSocket from "../../hook/useWebSocket";
import { Button } from "react-bootstrap";

const { Search } = Input;

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { messages, isConnected } = useWebSocket("/topic/voucher-updates");
  const history = useHistory();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchVouchers();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getVouchers();
      if (response.data?.data) {
        setVouchers(response.data.data);
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi tải danh sách voucher" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      notification.info({ message: lastMessage });

      if (isMounted) {
        fetchVouchers();
      }
    }

    return () => {
      isMounted = false; // Cleanup để tránh cập nhật state khi component đã unmount
    };
  }, [messages]);


  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);  // Set selected voucher details
    setModalVisible(true);  // Open modal
  };

  const handleCloseModal = () => {
    setModalVisible(false);  // Close modal
    setSelectedVoucher(null);  // Reset selected voucher details
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách khuyến mại</h2>
        {localStorage.getItem("role") === "ADMIN" && (
          <button type="button" className="btn btn-gradient-primary btn-sm" onClick={() => history.push("/admin/vouchers/add")}>
            <i className='mdi mdi-plus'></i> Thêm mới
          </button>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên hoặc mã"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        {isConnected ? (
          <Badge status="success" text={<><WifiOutlined /> Đang kết nối</>} />
        ) : (
          <Badge status="error" text={<><DisconnectOutlined /> Mất kết nối</>} />
        )}
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <p>Đang tải dữ liệu...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Mã</th>
                        <th>Tên khuyến mại</th>
                        <th>Loại giảm giá</th>
                        {/* <th>Giá trị tối thiểu(VND)</th>
                        <th>Giá trị giảm</th> */}
                        <th>Số lượng</th>
                        {/* <th>Giảm giá tối đa (VND)</th> */}
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher) => (
                          <tr key={voucher.id}>
                            <td>{voucher.id}</td>
                            <td><strong>{voucher.voucherCode}</strong></td>
                            <td>{voucher.voucherName}</td>
                            <td>
                              {voucher.discountType === 0
                                ? <span className="badge badge-primary">Theo số tiền</span>
                                : <span className="badge badge-success">Theo %</span>}
                            </td>
                            {/* <td>{voucher.minOrderValue?.toLocaleString()}</td> */}
                            {/* <td>
                              {voucher.discountType === 0
                                ? `${voucher.discountValue?.toLocaleString()}`
                                : `${voucher.discountValue}%`}
                            </td> */}
                            <td>{voucher.quantity}</td>
                            {/* <td>
                              {voucher.maxDiscountValue?.toLocaleString()}
                            </td> */}
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
                              <span className={`badge ${voucher.status === 1 ? 'badge-success' : voucher.status === 0 ? 'badge-danger' : 'badge-info'}`}>
                                {voucher.status === 1 ? "Đang hoạt động" : voucher.status === 0 ? "Đã hết hạn" : "Chưa kích hoạt"}
                              </span>
                            </td>
                            <td>
                              <Button variant="link"
                                style={{ padding: '0px', marginRight: '10px' }}

                                onClick={() => handleViewDetails(voucher)}
                              >
                                <i className='mdi mdi-eye'></i>
                              </Button>
                              <Button variant="link"
                                style={{ padding: '0px' }}

                                onClick={() => history.push(`/admin/vouchers/edit/${voucher.id}`)}
                              >
                                <i className='mdi mdi-pencil'></i>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center py-4">
                            {searchTerm ? "Không tìm thấy voucher phù hợp" : "Không có voucher nào"}
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

      <Modal
        title="Chi tiết Voucher"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedVoucher && (
          <div>
            <hr />
            {/* <p><strong>ID:</strong> {selectedVoucher.id}</p> */}
            <p><strong>Mã khuyến mại:</strong> <b>{selectedVoucher.voucherCode}</b></p>
            <p><strong>Tên khuyến mại:</strong> {selectedVoucher.voucherName}</p>
            {selectedVoucher.minOrderValue != 0 &&
              <p><strong>Giá trị hoá đơn tối thiểu:</strong> {selectedVoucher.minOrderValue.toLocaleString()}</p>
            }
            <p><strong>Loại giảm giá:</strong> {selectedVoucher.discountType === 0 ? 'Theo số tiền' : 'Theo %'}</p>
            <p><strong>Số lượng:</strong> {selectedVoucher.quantity}</p>
            <p><strong>Giá trị giảm:</strong> {selectedVoucher.discountType === 0 ? `${selectedVoucher.discountValue.toLocaleString()}` : `${selectedVoucher.discountValue}%`}</p>
            <p><strong>Giá trị giảm tối đa:</strong> {selectedVoucher.maxDiscountValue.toLocaleString()}</p>
            <p>
              <strong>Ngày bắt đầu: </strong>
              {new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
              }).format(new Date(selectedVoucher.startDate))}
            </p>
            <p>
              <strong>Ngày kết thúc: </strong>
              {new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
              }).format(new Date(selectedVoucher.endDate))}
            </p>
            <p>
              <strong>Trạng thái: </strong>
              <span className={`badge ${selectedVoucher.status === 1 ? 'badge-success' : selectedVoucher.status === 0 ? 'badge-danger' : 'badge-info'}`}>
                {selectedVoucher.status === 1 ? "Đang hoạt động" : selectedVoucher.status === 0 ? "Đã hết hạn" : "Chưa kích hoạt"}
              </span>
            </p>
            <hr />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vouchers;
