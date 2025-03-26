import axios from "axios";

const listEmployee = async (searchInput, pageInput, statusInput) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await axios.get("http://localhost:8080/employee", {
        params: {
            search: searchInput,
            page: pageInput,
            status: statusInput
        }
    })
}
export { listEmployee };

const listRole = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get("http://localhost:8080/role")
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
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = axios.get("http://localhost:8080/employee" + '/' + id)
    return response
}

export const updateEmployee = async (id, employee) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.put("http://localhost:8080/employee/update" + '/' + id, employee)
    return response.data
}
export const addEmployee = async (employee) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post("http://localhost:8080/employee/add", employee)
    return response.data
}

export const deleteEmployee = (id) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.delete("http://localhost:8080/employee" + '/' + id)
}

export const updateEmployeeStatus = async (id) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.put("http://localhost:8080/employee/updateEmployeeStatus" + '/' + id)
    return response.data
}