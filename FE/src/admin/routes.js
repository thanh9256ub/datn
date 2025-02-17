import Dashboard from "./views/Dashboard";
import Users from "./views/Users";
import Settings from "./views/Settings";

const routes = [
    { path: "/dashboard", component: Dashboard },
    { path: "/users", component: Users },
    { path: "/settings", component: Settings },
];

export default routes;
