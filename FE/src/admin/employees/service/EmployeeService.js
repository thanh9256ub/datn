import axios from "axios";

const token = localStorage.getItem('token');  // Đảm bảo rằng 'token' là khóa bạn đã lưu token

if (token) {
  // Thiết lập Bearer Token vào header Authorization của axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const listEmployee = async (searchInput, pageInput, statusInput) => {
    return await axios.get("http://localhost:8080/employee", {
        params: {
            search: searchInput,
            page: pageInput,
            status: statusInput
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export { listEmployee };

const listRole = () => {
    return axios.get("http://localhost:8080/role", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export { listRole };

// const REST_API_BASE_URL = "localhost:8080/employee";

// export const listEmployee = () => {
//     return axios.get(REST_API_BASE_URL)
// }


// export const createEmployee = (employee) => {
//     return axios.post(REST_API_BASE_URL, employee);
// }

export const getEmployee = (id) => {
    const response = axios.get("http://localhost:8080/employee" + '/' + id)
    return response
}

export const updateEmployee = async (id, employee) => {
    const response = await axios.put("http://localhost:8080/employee/update" + '/' + id, employee)
    return response.data
}
export const addEmployee = async (employee) => {
    const response = await axios.post("http://localhost:8080/employee/add", employee)
    return response.data
}

export const deleteEmployee = (id) => {
    return axios.delete("http://localhost:8080/employee" + '/' + id)
}

export const updateEmployeeStatus = async (id) => {
    const response = await axios.put("http://localhost:8080/employee/updateEmployeeStatus" + '/' + id)
    return response.data
}
