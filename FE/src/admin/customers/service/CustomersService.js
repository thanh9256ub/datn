import axios from "axios"


const listCustomer = async (searchInput, pageInput) => {
    return await axios.get("http://localhost:8080/customer", {
        params: {
            search: searchInput,
            page: pageInput
        }
    })
}
export { listCustomer };


const listAddress = () => {
    return axios.get("http://localhost:8080/address")
}
export { listAddress };

export const addCustomer = async (customer) => {
    const response = await axios.post("http://localhost:8080/customer/add", customer)
    return response.data
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
