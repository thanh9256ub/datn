import Dashboard from "./views/Dashboard";
import Users from "./views/Users";
import Settings from "./views/Settings";
import Products from "./views/Products";
import * as RiIcons from 'react-icons/ri';

const routes = [
    {
        path: "/dashboard",
        component: Dashboard,
        name: "Dashboard"
    },
    {
        path: "/users",
        component: Users,
        name: "Khách hàng",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subRoutes: [
            {
                path: "/customers",
                name: "Quản lý Khách hàng"
            },
            {
                path: "/add-product",
                name: "Quản lý Địa chỉ"
            }
        ]
    },
    {
        path: "/settings",
        component: Settings,
        name: "Cài đặt"
    },
    {
        path: "/products",
        component: Products,
        name: "Sản phẩm",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subRoutes: [
            {
                path: "/products",
                component: Products,
                name: "Quản lý sản phẩm"
            },
            {
                path: "/add-product",
                name: "Thêm sản phẩm"
            }
        ]
    }
];

export default routes;
