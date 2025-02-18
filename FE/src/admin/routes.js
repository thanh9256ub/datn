// routes.js
import Dashboard from "./views/Dashboard";
import Users from "./views/Users";
import Settings from "./views/Settings";
import Products from "./views/Products";

const routes = [
    {
        path: "/dashboard",
        component: Dashboard,
        name: "Dashboard"
    },
    {
        path: "/users",
        component: Users,
        name: "Quản lý khách hàng"
    },
    {
        path: "/settings",
        component: Settings,
        name: "Cài đặt"
    },
    {
        path: "/products",
        component: Products,
        name: "Quản lý sản phẩm"
    }
];

export default routes;
