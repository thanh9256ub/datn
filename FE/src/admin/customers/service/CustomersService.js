import axios from "axios"
// const token = localStorage.getItem('token');  // Đảm bảo rằng 'token' là khóa bạn đã lưu token

// if (token) {
//   // Thiết lập Bearer Token vào header Authorization của axios
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }


const listCustomer = async (searchInput, pageInput) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await axios.get("http://localhost:8080/customer", {
        params: {
            search: searchInput,
            page: pageInput
        }
    })
}
export { listCustomer };


const listAddress = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get("http://localhost:8080/address")

}
export { listAddress };

export const addCustomer = async (customer) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post("http://localhost:8080/customer/add", customer)
    return response.data
}

export const addAddressCustomer = async (addressCustomer) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post("http://localhost:8080/address/add", addressCustomer)
    return response.data
}

const listRole = () => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get("http://localhost:8080/role")
}
export { listRole };

export const updateCustomer = async (id, customer) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.put("http://localhost:8080/customer/update" + '/' + id, customer)
    return response.data
}

export const getCusomer = (id) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = axios.get("http://localhost:8080/customer" + '/' + id)
    return response
}

export const deleteAddressCustomer = async (id) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.delete(`http://localhost:8080/address/${id}`)
    return response.data
}

export const updateAddressCustomer = async (id, address) => {
    let token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.put(`http://localhost:8080/address/update/${id}`, address)
    return response.data
}
