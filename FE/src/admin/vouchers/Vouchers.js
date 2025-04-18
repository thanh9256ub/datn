import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Badge, notification, Modal, Select, DatePicker } from "antd";
import { PlusOutlined, WifiOutlined, DisconnectOutlined, DeleteOutlined } from "@ant-design/icons";
import { getVouchers, deleteOrRestoreVoucher, getBin } from "./service/VoucherService";
import useWebSocket from "../../hook/useWebSocket";
import { Button } from "react-bootstrap";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Swal from "sweetalert2";

dayjs.extend(isBetween);

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const { messages, isConnected } = useWebSocket("/topic/voucher-updates");
  const history = useHistory();
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [selectedDeletedVouchers, setSelectedDeletedVouchers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [binModalVisible, setBinModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [deletedVouchers, setDeletedVouchers] = useState([]);
  const [binLoading, setBinLoading] = useState(false);

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

  const fetchDeletedVouchers = async () => {
    try {
      setBinLoading(true);
      const response = await getBin();
      if (response.data?.data) {
        setDeletedVouchers(response.data.data);
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi tải danh sách voucher đã xóa" });
    } finally {
      setBinLoading(false);
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
      isMounted = false;
    };
  }, [messages]);

  // Hàm xử lý khi chọn hoặc bỏ chọn một voucher
  const handleSelectVoucher = (voucherId, isChecked) => {
    if (isChecked) {
      setSelectedVouchers([...selectedVouchers, voucherId]);
    } else {
      setSelectedVouchers(selectedVouchers.filter(id => id !== voucherId));
    }
  };

  const handleSelectDeletedVoucher = (voucherId, isChecked) => {
    if (isChecked) {
      setSelectedDeletedVouchers([...selectedDeletedVouchers, voucherId]);
    } else {
      setSelectedDeletedVouchers(selectedDeletedVouchers.filter(id => id !== voucherId));
    }
  };

  // Hàm xử lý xóa nhiều voucher
  const handleDeleteSelected = async () => {
    if (selectedVouchers.length === 0) return;

    try {
      const confirmResult = await Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn xoá voucher này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!confirmResult.isConfirmed) return;

      await deleteOrRestoreVoucher(selectedVouchers);
      notification.success({ message: "Xóa voucher thành công" });
      setSelectedVouchers([]); // Reset danh sách đã chọn
      fetchVouchers(); // Tải lại danh sách
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa voucher" });
    }
  };

  const handleRestoreSelected = async () => {
    if (selectedDeletedVouchers.length === 0) return;

    try {
      const confirmResult = await Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn khôi phục voucher này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!confirmResult.isConfirmed) return;

      await deleteOrRestoreVoucher(selectedDeletedVouchers);
      notification.success({ message: "Khôi phục voucher thành công" });
      setSelectedDeletedVouchers([]);
      fetchDeletedVouchers();
      fetchVouchers();
    } catch (error) {
      notification.error({ message: "Lỗi khi khôi phục voucher" });
    }
  };

  // Hàm chọn tất cả/bỏ chọn tất cả
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVouchers(filteredVouchers.map(v => v.id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    // Lọc theo từ khóa
    const matchesSearch =
      voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo loại giảm giá
    const matchesDiscountType =
      discountTypeFilter === null ||
      voucher.discountType === discountTypeFilter;

    // Lọc theo khoảng ngày - CÁCH MỚI CHÍNH XÁC HƠN
    let matchesDateRange = true;
    if (dateRange && dateRange.length === 2) {
      const start = dayjs(dateRange[0]).startOf('day');
      const end = dayjs(dateRange[1]).endOf('day');
      const voucherStart = dayjs(voucher.startDate);
      const voucherEnd = dayjs(voucher.endDate);

      // Kiểm tra xem khoảng thời gian voucher có giao với khoảng đã chọn không
      matchesDateRange = (
        (voucherStart.isBetween(start, end, null, '[]')) || // Ngày bắt đầu nằm trong khoảng
        (voucherEnd.isBetween(start, end, null, '[]')) ||  // Ngày kết thúc nằm trong khoảng
        (voucherStart.isBefore(start) && voucherEnd.isAfter(end)) // Voucher bao trùm khoảng
      );
    }

    return matchesSearch && matchesDiscountType && matchesDateRange;
  });

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedVoucher(null);
  };

  const showBinModal = () => {
    fetchDeletedVouchers();
    setBinModalVisible(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách khuyến mại</h2>
        <div>
          {selectedVouchers.length > 0 && (
            <button
              type="button"
              className="btn btn-gradient-danger btn-sm mr-2"
              onClick={handleDeleteSelected}
            >
              <i className='mdi mdi-delete'></i> Xóa ({selectedVouchers.length})
            </button>
          )}
          {localStorage.getItem("role") === "ADMIN" && (
            <>

              <button
                type="button"
                className="btn btn-gradient-primary btn-sm"
                onClick={() => history.push("/admin/vouchers/add")}
              >
                <i className='mdi mdi-plus'></i> Thêm mới
              </button>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên hoặc mã"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Loại giảm giá"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setDiscountTypeFilter(value)}
        >
          <Option value={null}>Tất cả</Option>
          <Option value={0}>Theo số tiền</Option>
          <Option value={1}>Theo %</Option>
        </Select>

        <RangePicker
          style={{ width: 250 }}
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          onChange={(dates) => setDateRange(dates)}
          format="DD/MM/YYYY"
        />
        <button
          type="button"
          className="btn btn-gradient-warning btn-sm mr-2"
          onClick={showBinModal}
        >
          <DeleteOutlined /> Thùng rác
        </button>
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
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedVouchers.length === filteredVouchers.length && filteredVouchers.length > 0}
                          />
                        </th>
                        <th>STT</th>
                        <th>Mã</th>
                        <th>Tên khuyến mại</th>
                        <th>Loại giảm giá</th>
                        <th>Số lượng</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher, index) => (
                          <tr key={voucher.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedVouchers.includes(voucher.id)}
                                onChange={(e) => handleSelectVoucher(voucher.id, e.target.checked)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td><strong>{voucher.voucherCode}</strong></td>
                            <td>{voucher.voucherName}</td>
                            <td>
                              {voucher.discountType === 0
                                ? <span className="badge badge-primary">Theo số tiền</span>
                                : <span className="badge badge-success">Theo %</span>}
                            </td>
                            <td>{voucher.quantity}</td>
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
                                {voucher.status === 1 ? "Đang hoạt động" : voucher.status === 0 ? "Đã hết hạn" : voucher.status === 2 ? "Chưa kích hoạt" : "Hết số lượng"}
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
            <p><strong>Mã khuyến mại:</strong> <b>{selectedVoucher.voucherCode}</b></p>
            <p><strong>Tên khuyến mại:</strong> {selectedVoucher.voucherName}</p>
            <p><strong>Giá trị hoá đơn tối thiểu:</strong> {selectedVoucher.minOrderValue.toLocaleString()}</p>
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
              <span className={`badge ${selectedVoucher.status === 1 ? 'badge-success' : selectedVoucher.status === 0 ? 'badge-danger' : selectedVoucher.status === 2 ? 'badge-info' : 'badge-dark'}`}>
                {selectedVoucher.status === 1 ? "Đang hoạt động" : selectedVoucher.status === 0 ? "Đã hết hạn" : selectedVoucher.status === 2 ? "Chưa kích hoạt" : "Đã xoá"}
              </span>
            </p>
            <hr />
          </div>
        )}
      </Modal>
      <Modal
        title="Danh sách voucher đã xóa"
        visible={binModalVisible}
        onCancel={() => setBinModalVisible(false)}
        footer={[
          <Button
            key="restore"
            variant="success"
            disabled={selectedDeletedVouchers.length === 0}
            onClick={handleRestoreSelected}
          >
            Khôi phục ({selectedDeletedVouchers.length})
          </Button>
        ]}
        width={1000}
      >
        {binLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeletedVouchers(deletedVouchers.map(v => v.id));
                        } else {
                          setSelectedDeletedVouchers([]);
                        }
                      }}
                      checked={
                        selectedDeletedVouchers.length === deletedVouchers.length &&
                        deletedVouchers.length > 0
                      }
                    />
                  </th>
                  <th>STT</th>
                  <th>Mã</th>
                  <th>Tên khuyến mại</th>
                  <th>Loại giảm giá</th>
                  <th>Số lượng</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deletedVouchers.length > 0 ? (
                  deletedVouchers.map((voucher, index) => (
                    <tr key={voucher.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedDeletedVouchers.includes(voucher.id)}
                          onChange={(e) => handleSelectDeletedVoucher(voucher.id, e.target.checked)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td><strong>{voucher.voucherCode}</strong></td>
                      <td>{voucher.voucherName}</td>
                      <td>
                        {voucher.discountType === 0
                          ? <span className="badge badge-primary">Theo số tiền</span>
                          : <span className="badge badge-success">Theo %</span>}
                      </td>
                      <td>{voucher.quantity}</td>
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
                        <span className="badge badge-dark">
                          {voucher.status === 4 ? "Đã xoá" : ""}
                        </span>
                      </td>
                      <td>
                        <Button variant="link"
                          style={{ padding: '0px', marginRight: '10px' }}
                          onClick={() => handleViewDetails(voucher)}
                        >
                          <i className='mdi mdi-eye'></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Không có voucher đã xoá nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Vouchers;