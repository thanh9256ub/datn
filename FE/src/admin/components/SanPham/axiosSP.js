import axios from "axios";

const axiSp = () => {
    return axios.get("http://localhost:8080/order")
}
export { axiSp };