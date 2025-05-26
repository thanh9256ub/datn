import axios from "axios";

// Tạo instance axios để tái sử dụng
const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Hàm đăng nhập nhân viên
export const getToken = async (username, password) => {
    try {
        const response = await api.post("/auth/token", {
            username,
            password
        });
        return response
    } catch (error) {
        throw error;
    }
};

// Hàm đăng nhập khách hàng
export const getTokenCustomer = async (email, password) => {
    try {
        const response = await api.post("/authCustomer/token", {
            email,
            password
        });

        console.log('Login response:', response.data);

        if (response.data?.message === "NOT_CUSTOMER" || response.data?.message === "TAI_KHOAN_BI_KHOA") {
            return { message: response.data.message }; // Không phải khách hàng hoặc tài khoản bị khóa
        }

        return response;
    } catch (error) {
        console.error("Customer login error:", error);
        throw error;
    }
};

// Hàm đăng ký khách hàng
export const registerCustomer = async (customerData) => {
    try {
        const response = await api.post("/authCustomer/register", customerData);
        return response;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

// Hàm lấy thông tin profile (thêm vào)
export const fetchCustomerProfile = async (token) => {
    try {
        const response = await api.get("/authCustomer/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch profile error:", error);
        throw error;
    }
};

export const existsEmail = async (email) => {

    try {
        // Gửi yêu cầu POST để kiểm tra sự tồn tại của email
        const response = await axios.post("http://localhost:8080/customer/exists-email", {email});

        // Trả về dữ liệu từ phản hồi
        return response.data.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi khi kiểm tra email:", error);
        return false; // Hoặc trả về một giá trị khác để đại diện cho trường hợp email không tồn tại
    }
}

export const existsPhone = async (phone) => {
    try {
        // Gửi yêu cầu POST để kiểm tra sự tồn tại của email
        const response = await axios.post("http://localhost:8080/customer/exists-phone", { phone });

        // Trả về dữ liệu từ phản hồi
        return response.data.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Đã xảy ra lỗi khi kiểm tra email:", error);
        return false; // Hoặc trả về một giá trị khác để đại diện cho trường hợp email không tồn tại
    }
}
