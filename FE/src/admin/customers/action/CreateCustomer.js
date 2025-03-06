import React from 'react'

const CreateCustomer = () => {
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Thêm khách hàng</h2>
            <hr></hr>
            <form >
                <div style={{ display: 'flex' }}>
                    <div style={{ width: "50%" }}>
                        <div>
                            <div>
                                <label htmlFor="customerCodeInput" className="form-label">
                                    Mã khách hàng
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px', width: "90%"
                                    }}
                                    type="text"
                                    className="form-control"
                                    id="customerCodeInput"
                                // value={newCustomer.customerCode}
                                // onChange={(e) => {
                                //     setNewCustomer({ ...newCustomer, customerCode: e.target.value });
                                // }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <div>
                                <label htmlFor="fullNameInput" className="form-label">
                                    Tên khách hàng
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px', width: "90%"
                                    }}
                                    type="text"
                                    className="form-control"
                                    id="fullNameInput" // Thay đổi id 
                                // value={newCustomer.fullName}
                                // onChange={(e) => {
                                //     setNewCustomer({ ...newCustomer, fullName: e.target.value });
                                // }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <div>
                                <label htmlFor="genderLabel" className="form-label">
                                    Giới tính
                                </label>
                            </div>
                            <div className='container' style={{ display: "flex", marginBottom: "10px", fontSize: '20px' }}>
                                <div>
                                    <input

                                        type="radio" className="form-check-input" name="gender" id="male"
                                        value="Nam"
                                    // checked={newCustomer.gender === "Nam"}
                                    // onChange={(e) => {
                                    //     setNewCustomer({ ...newCustomer, gender: e.target.value });
                                    // }}
                                    />
                                    <label htmlFor="male" className="form-check-label">Nam</label>
                                </div>

                                <div style={{ marginLeft: "60px" }} >
                                    <input

                                        type="radio" className="form-check-input" name="gender" id="female"
                                        value="Nữ"
                                    // checked={newCustomer.gender === "Nữ"}
                                    // onChange={(e) => {
                                    //     setNewCustomer({ ...newCustomer, gender: e.target.value });
                                    // }}

                                    />
                                    <label htmlFor="female" className="form-check-label">Nữ</label>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "10px" }} >
                            <div>
                                <label htmlFor="birthDateInput" className="form-label">
                                    Ngày sinh
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px', fontSize: '16px', width: "90%"
                                    }}
                                    type="date"
                                    className="form-control"
                                    id="birthDateInput"
                                // value={newEmployee.birthDate}
                                // onChange={(e) => {
                                //     const selectedDate = new Date(e.target.value);
                                //     const currentYear = 2025;
                                //     const minBirthYear = currentYear - 18;
                                //     const selectedYear = selectedDate.getFullYear();
                                //     if (selectedYear <= minBirthYear) {
                                //         setNewEmployee({ ...newEmployee, birthDate: e.target.value });
                                //         setBirthDateError("");
                                //     } else {
                                //         setBirthDateError("Tuổi phải từ 18 trở lên.");
                                //         setNewEmployee({ ...newEmployee, birthDate: "" });
                                //     }
                                // }}
                                />
                                {/* {birthDateError && (<div style={{ color: "red", marginTop: "5px" }}>{birthDateError}</div>)} */}
                            </div>
                        </div>

                    </div>
                    <div style={{ width: "50%" }}>
                        <div>
                            <div>
                                <label htmlFor="phoneInput" className="form-label">
                                    Số điện thoại
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px', width: "90%"
                                    }}
                                    type="tel"
                                    className="form-control"
                                    id="phoneInput"
                                // value={newCustomer.phone}
                                // onChange={(e) => {
                                //     setNewCustomer({ ...newCustomer, phone: e.target.value });
                                // }}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="emailInput" className="form-label">
                                    Email
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px', width: "90%"
                                    }}
                                    type="email"
                                    className="form-control"
                                    id="emailInput"
                                // value={newCustomer.email}
                                // onChange={(e) => {
                                //     setNewCustomer({ ...newCustomer, email: e.target.value });
                                // }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <div>
                                <label htmlFor="passwordInput" className="form-label">
                                    Password
                                </label>
                            </div>
                            <div style={{ position: 'relative' }}>

                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px', width: "90%"
                                    }}
                                    type={"" ? 'text' : 'password'} // Use "text" for password
                                    className="form-control"
                                    id="passwordInput" // Change id to passwordInput
                                // value={newCustomer.password} // Change value to detail.username

                                // onChange={(e) => {
                                //     setNewCustomer({ ...newCustomer, password: e.target.value }); // Change to update username
                                // }}
                                />
                                {/* <i
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="mdi mdi-eye"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPassword ? '' : ''}
                                </i> */}

                            </div>
                        </div>
                        <div style={{ marginTop: '20px', marginLeft: "50%" }}>
                            <button type="button" className="btn btn-primary">
                                Thêm khách hàng
                            </button>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <div style={{ width: "30%" }}>
                            <div>
                                <label htmlFor="addressInputCity" className="form-label">
                                    Tỉnh/Thành phố
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        width: "80%",
                                    }}
                                    className="form-control"
                                    id="addressInputCity"
                                />
                            </div>
                        </div>

                        <div style={{ width: "30%" }}>
                            <div>
                                <label htmlFor="addressInputDistrict" className="form-label">
                                    Quận/Huyện
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        width: "80%",
                                    }}
                                    className="form-control"
                                    id="addressInputDistrict"
                                />
                            </div>
                        </div>

                        <div style={{ width: "30%" }}>
                            <div>
                                <label htmlFor="addressInputWard" className="form-label">
                                    Phường/Xã
                                </label>
                            </div>
                            <div>
                                <input
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        width: "80%",
                                    }}
                                    className="form-control"
                                    id="addressInputWard"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{ marginTop: "10px", width: "94%" }}>
                            <div>
                                <label htmlFor="addressInput" className="form-label">
                                    Địa chỉ chi tiết
                                </label>
                            </div>
                            <div>
                                <input style={{
                                    border: '1px solid black',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontSize: '16px', width: "100%"
                                }}
                                    className="form-control"
                                    id="addressInput"
                                // value={addressCusstomer.detailedAddress}
                                // onChange={(e) => {
                                //     setAddressCusstomer({ ...addressCusstomer, detailedAddress: e.target.value });
                                // }}
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="mt-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="addressInput"
                                    className="h-16 w-16 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-6 text-4xl text-gray-900 font-extrabold">Chọn làm địa chỉ mặc định</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', marginLeft: "78%" }}>
                            <button type="button" className="btn btn-primary">
                                Thêm địa chỉ
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateCustomer