import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateVoucher = () => {
  const [formData, setFormData] = useState({
    voucherName: "",
    discountValue: 0,
    quantity: 0,
    condition: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    maxDiscountValue: 0,
    discountType: "Theo %",
    status: "Chưa áp dụng",
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
  });

  //LocalDateTime
  const formatDateToLocalDateTime = (date) => {
    return date.toISOString().slice(0, 19);
  };
  // Cập nhật ngày vào formData
  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: formatDateToLocalDateTime(date) });
  };

  // Hàm cập nhật dữ liệu form
  const handleChange = (e) => {
    console.log(`Field: ${e.target.name}, Value: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm gửi dữ liệu lên Spring Boot API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      startDate: formatDateToLocalDateTime(new Date(formData.startDate)),
      endDate: formatDateToLocalDateTime(new Date(formData.endDate)),
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/voucher/add",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Dữ liệu gửi đi:", JSON.stringify(formData, null, 2));
      console.log("Tạo thành công:", response.data);
      alert("Tạo voucher thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Lỗi khi tạo voucher, vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Tạo khuyến mại mới</h4>
          <form className="form-sample" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Tên Voucher</label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="text"
                      name="voucherName"
                      value={formData.voucherName}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Điều kiện</label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Số lượng</label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">
                    Ngày bắt đầu
                  </label>
                  <div className="col-sm-9">
                    <DatePicker
                      className="form-control w-100"
                      selected={new Date(formData.startDate)}
                      onChange={(date) => handleDateChange(date, "startDate")}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">
                    Loại giảm giá
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                    >
                      <option value="Theo %">Theo %</option>
                      <option value="Theo số tiền">Theo số tiền</option>
                    </select>
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">
                    Giá trị giảm
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">
                    Giá trị tối đa
                  </label>
                  <div className="col-sm-9">
                    <Form.Control
                      type="number"
                      name="maxDiscountValue"
                      value={formData.maxDiscountValue}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">
                    Ngày kết thúc
                  </label>
                  <div className="col-sm-9">
                    <DatePicker
                      className="form-control w-100"
                      selected={new Date(formData.endDate)}
                      onChange={(date) => handleDateChange(date, "endDate")}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>
            <hr />
            <br></br>
            <div></div>
            <button type="submit" className="btn btn-primary">
              <i className="mdi mdi-plus">Thêm mới</i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVoucher;
