import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Button, Badge, notification } from "antd";
import { PlusOutlined, WifiOutlined, DisconnectOutlined } from "@ant-design/icons";
import { getVouchers } from "./service/VoucherService";
import useWebSocket from "../../hook/useWebSocket";

const { Search } = Input;

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
      notification.error({ message: "Lỗi khi tải danh sách voucher" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      notification.info({ message: lastMessage });
      fetchVouchers();
    }
  }, [messages]);

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách khuyến mại</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push("/admin/vouchers/add")}>Thêm mới</Button>
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
                        <th>Giá trị tối thiểu(VND)</th>
                        <th>Giá trị giảm</th>
                        <th>Số lượng</th>
                        <th>Giảm giá tối đa (VND)</th>
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
                            <td>{voucher.voucherCode}</td>
                            <td>{voucher.voucherName}</td>
                            <td>
                              {voucher.discountType === 0
                                ? <span className="badge badge-primary">Theo số tiền</span>
                                : <span className="badge badge-success">Theo %</span>}
                            </td>
                            <td>{voucher.minOrderValue?.toLocaleString()}</td>
                            <td>
                              {voucher.discountType === 0
                                ? `${voucher.discountValue?.toLocaleString()}`
                                : `${voucher.discountValue}%`}
                            </td>
                            <td>{voucher.quantity}</td>
                            <td>
                              {voucher.maxDiscountValue?.toLocaleString()}
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
                              <span className={`badge ${voucher.status === 1 ? 'badge-success' : voucher.status === 0 ? 'badge-danger' : 'badge-info'}`}>
                                {voucher.status === 1 ? "Đang hoạt động" : voucher.status === 0 ? "Đã hết hạn" : "Chưa kích hoạt"}
                              </span>
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
    </div>
  );
};

export default Vouchers;
