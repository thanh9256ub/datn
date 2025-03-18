import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
const Vouchers = () => {
  //Lấy List
  const apiVoucher = "http://localhost:8080/voucher";
  const getVouchers = () => {
    return axios.get(apiVoucher);
  };
  const createVoucher = (voucher) => {
    return axios.post(apiVoucher, voucher);
  };
  const [voucherList, setVoucher] = useState([]);
  const [deletedVouchers, setDeletedVouchers] = useState([]);
  const history = useHistory();
  //Xóa
  const handleSoftDelete = async (id) => {
    try {
      // Gọi API để cập nhật trạng thái trong database
      await axios.delete(`http://localhost:8080/voucher/${id}`);

      // Cập nhật state trên frontend
      setVoucher((prevList) => prevList.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa mềm voucher:", error);
    }
  };
  // Khôi phục voucher đã xóa
  const restoreVoucher = (id) => {
    setDeletedVouchers((prevDeleted) => {
      const restoredVoucher = prevDeleted.find((v) => v.id === id);
      if (!restoredVoucher) return prevDeleted;

      restoredVoucher.status = "ACTIVE"; // Đổi lại trạng thái ban đầu

      setVoucher((prevList) => [...prevList, restoredVoucher]); // Thêm lại vào danh sách chính
      return prevDeleted.filter((v) => v.id !== id); // Xóa khỏi danh sách đã xóa
    });
  };
  //Sửa
  const handleEditVoucher = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/voucher/edit/${id}`,
        updatedData
      );

      // Cập nhật danh sách trên giao diện
      setVoucher((prevList) =>
        prevList.map((v) => (v.id === id ? response.data.data : v))
      );

      console.log("Voucher updated successfully:", response.data);
    } catch (error) {
      console.error("Lỗi khi sửa voucher:", error);
    }
  };
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleEditClick = (voucher) => {
  setEditingVoucher({
    ...voucher,
    startDate: voucher.startDate || new Date().toISOString().split("T")[0], 
    endDate: voucher.endDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0]
  });
  setShowModal(true);
};

  const handleSaveChanges = async () => {
    console.log("Dữ liệu gửi lên:", editingVoucher);
    const updatedVoucher = {
      ...editingVoucher,
      startDate: editingVoucher.startDate
        ? `${editingVoucher.startDate}T00:00:00`
        : null,
      endDate: editingVoucher.endDate
        ? `${editingVoucher.endDate}T00:00:00`
        : null,
    };
    try {
      const response = await axios.put(
        `http://localhost:8080/voucher/edit/${editingVoucher.id}`,
        updatedVoucher
      );
      console.log("Response từ server:", response.data);
      setShowModal(false);
      setEditingVoucher(null);
    } catch (error) {
      console.error(
        "Lỗi khi sửa voucher:",
        error.response?.data || error.message
      );
    }
  };

  //format date
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("vi-VN");
  };
  //Add
  const handleAddVoucher = () => {
    history.push("/admin/vouchers/add");
  };
  // need
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Tự gen mã
  function generateVoucher(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let voucher = "";
    for (let i = 0; i < length; i++) {
      voucher += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return voucher;
  }
  //Api
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await getVouchers();
        console.log("API response:", response); // Debug API response
        if (response.data && response.data.data) {
          setVoucher(response.data.data);
        } else {
          setVoucher([]);
          setError("Dữ liệu API không hợp lệ.");
        }
      } catch (err) {
        console.error("Lỗi API:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchVoucher();
  }, []);
  //
  useEffect(() => {
    if (voucherList.length > 0) {
      const currentDate = new Date().toISOString().split("T")[0];

      // Lọc danh sách mà KHÔNG cập nhật trực tiếp vào state
      const updatedVouchers = voucherList.map((voucher) => {
        if (voucher.status === "Đã xóa") return voucher; // Bỏ qua nếu đã xóa

        let newStatus = voucher.status;

        if (voucher.startDate && voucher.endDate) {
          if (currentDate < voucher.startDate) {
            newStatus = "Không hoạt dộng";
          } else if (
            currentDate >= voucher.startDate &&
            currentDate <= voucher.endDate
          ) {
            newStatus = "Hoạt động";
          } else {
            newStatus = "Hết hạn";
          }
        }

        return { ...voucher, status: newStatus };
      });

      // So sánh xem có thay đổi không rồi mới cập nhật
      if (JSON.stringify(updatedVouchers) !== JSON.stringify(voucherList)) {
        setVoucher(updatedVouchers);
      }
    }
  }, [voucherList]);

  return (
    <div>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Khuyến Mại</h4>
            {error && <p className="text-danger">{error}</p>}
            <div
              className="card-description"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Form.Control
                type="text"
                id="exampleInputUsername1"
                placeholder="Search by name"
                size="lg"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddVoucher}
              >
                <i className="mdi mdi-plus"></i> Thêm mới
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã khuyến mại</th>
                    <th>Tên khuyến mại</th>
                    <th>Điều kiện</th>
                    <th>Giá trị</th>
                    <th>Số lượng</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Giá trị tối đa</th>
                    <th>Loại giảm giá</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Ngày sửa</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {voucherList.length > 0 ? (
                    voucherList
                      .filter((v) => v.status !== "Đã xóa")
                      .map((v, index) => (
                        <tr key={index}>
                          <td>{v.id}</td>
                          <td>{v.voucherCode}</td>
                          <td>{v.voucherName}</td>
                          <td>{v.condition}</td>
                          <td>{v.discountValue}</td>
                          <td>{v.quantity}</td>
                          <td>{formatDate(v.startDate)}</td>
                          <td>{formatDate(v.endDate)}</td>
                          <td>{v.maxDiscountValue}</td>
                          <td>{v.discountType}</td>
                          <td>{v.status}</td>
                          <td>{formatDate(v.createdAt)}</td>
                          <td>{formatDate(v.updateAt)}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              variant="link"
                              onClick={() => handleSoftDelete(v.id)}
                            >
                              <i className="mdi mdi-close-box-outline"> Xóa</i>
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleEditClick(v)}
                            >
                              <i className="mdi mdi-autorenew"> Sửa</i>
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Chỉnh sửa Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Mã khuyến mại</Form.Label>
                      <Form.Control
                        type="text"
                        value={editingVoucher?.voucherCode || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            voucherCode: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Tên khuyến mại</Form.Label>
                      <Form.Control
                        type="text"
                        value={editingVoucher?.voucherName || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            voucherName: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Điều kiện</Form.Label>
                      <Form.Control
                        type="text"
                        value={editingVoucher?.condition || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            condition: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Giá trị</Form.Label>
                      <Form.Control
                        type="number"
                        value={editingVoucher?.discountValue || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            discountValue: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Số lượng</Form.Label>
                      <Form.Control
                        type="number"
                        value={editingVoucher?.quantity || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Ngày bắt đầu</Form.Label>
                      <Form.Control
                        type="date"
                        value={editingVoucher?.startDate || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Ngày kết thúc</Form.Label>
                      <Form.Control
                        type="date"
                        value={editingVoucher?.endDate || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Giá trị tối đa</Form.Label>
                      <Form.Control
                        type="number"
                        value={editingVoucher?.maxDiscountValue || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            maxDiscountValue: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Loại giảm giá</Form.Label>
                      <Form.Control
                        as="select"
                        value={editingVoucher?.discountType || "Giảm giá cố định"}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            discountType: e.target.value,
                          })
                        }
                      >
                        <option value="Phần trăm">Phần trăm</option>
                        <option value="Giảm giá cố định">
                          Giảm giá cố định
                        </option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Trạng thái</Form.Label>
                      <Form.Control
                        as="select"
                        value={editingVoucher?.status || ""}
                        onChange={(e) =>
                          setEditingVoucher({
                            ...editingVoucher,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Không hoạt động">Không hoạt động</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Đóng
                  </Button>
                  <Button variant="primary" onClick={() => handleSaveChanges()}>
                    Lưu thay đổi
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vouchers;
