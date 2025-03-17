import axios from "axios"
// const token = localStorage.getItem('token');  // Đảm bảo rằng 'token' là khóa bạn đã lưu token

// if (token) {
//   // Thiết lập Bearer Token vào header Authorization của axios
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }


const listCustomer = async (searchInput, pageInput) => {
    let token = localStorage.getItem('token'); 
    return await axios.get("http://localhost:8080/customer", {
        params: {
            search: searchInput,
            page: pageInput
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export { listCustomer };


const listAddress = () => {
    let token = localStorage.getItem('token'); 
    return axios.get("http://localhost:8080/address"),{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    
}
export { listAddress };

export const addCustomer = async (customer) => {
    let token = localStorage.getItem('token'); 
    const response = await axios.post("http://localhost:8080/customer/add", customer)
    return response.data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const addAddressCustomer = async (addressCustomer) => {
    const response = await axios.post("http://localhost:8080/address/add", addressCustomer)
    return response.data
}

const listRole = () => {
    return axios.get("http://localhost:8080/role")
}
export { listRole };

export const updateCustomer = async (id, customer) => {
    const response = await axios.put("http://localhost:8080/customer/update" + '/' + id, customer)
    return response.data
}

export const getCusomer = (id) => {
    const response = axios.get("http://localhost:8080/customer" + '/' + id)
    return response
}
