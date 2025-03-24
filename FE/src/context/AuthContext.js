import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Lưu token vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Thiết lập Bearer Token vào header Authorization của axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      axios.defaults.headers.common['Authorization'] = ``;
    }
  }, [token]);

  // Hàm đăng nhập (lưu token)
  const login = (newToken) => {
    setToken(newToken);
  };

  // Hàm đăng xuất (xóa token)
  const logout = () => {
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
