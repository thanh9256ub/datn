// AuthContext.js
import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    const customerId = localStorage.getItem("customerId");

    return {
      token: token || "",
      role: role || "",
      id: id || "",
      email: email || "",
      customerId: customerId || "",
      fullName: fullName || "",
      isAuthenticated: !!token
    };
  });

  const history = useHistory();

  // Cấu hình axios và xử lý token
  // useEffect(() => {
  //   if (authState.token) {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
  //   } else {
  //     delete axios.defaults.headers.common['Authorization'];
  //   }
  // }, [authState.token]);

  // AuthContext.js
  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
          history.push('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authState.token, history]);

  const login = (token, userData) => {
    const { id, email, fullName, role, customerId, image } = userData; // Thêm customerId vào destructuring
    const newAuthState = {
      token,
      role,
      id: id || "",
      email: email || "",
      fullName: fullName || "",
      customerId: customerId || "", // Thêm customerId vào authState
      isAuthenticated: true,
      image: image || ""
    };

    setAuthState(newAuthState);

    // Lưu vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (id) localStorage.setItem("id", id);
    if (email) localStorage.setItem("email", email);
    if (fullName) localStorage.setItem("fullName", fullName);
    if (customerId) localStorage.setItem("customerId", customerId); // Lưu customerId
    if (image) localStorage.setItem("image", image); // Lưu image
  };

  const logout = () => {
    setAuthState({
      token: "",
      role: "",
      id: "",
      email: "",
      fullName: "",
      customerId: "", // Thêm customerId vào state khi logout
      isAuthenticated: false
    });

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("customerId");

    // history.push("/login")
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};