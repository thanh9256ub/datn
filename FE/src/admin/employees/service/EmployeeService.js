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



export const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "long_preset");
    formData.append("cloud_name", "dgj9htnpn");

    try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dgj9htnpn/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response.status === 200) {
            return response.data.secure_url;
        }
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        alert("Có lỗi xảy ra khi tải ảnh lên Cloudinary.");
        return null;
    }
};
