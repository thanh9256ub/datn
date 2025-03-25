import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../admin/shared/Spinner';
// import BanHang from './counter/BanHang';
// import Products from './products/Products';
// import InactiveProducts from './products/InactiveProducts';
// import Employees from './employees/Employees';
// import Customers from './customers/Customers';
// import Orders from './orders/Orders';
// import OrderDetail from './orders/OderDetail/OrderDetail';
// import Vouchers from './vouchers/Vouchers';
// import CreateProduct from './products/action/CreateProduct';
// import UpdateProduct from './products/action/UpdateProduct';
// import Brands from './products/Brands';
// import Materials from './products/Material';
// import Categories from './products/Categories';

// import Dashboard from './dashboard/Dashboard'
// import Buttons from './basic-ui/Buttons';
// import Dropdowns from './basic-ui/Dropdowns'
// import Typography from './basic-ui/Typography';
// import BasicElements from './form-elements/BasicElements';
// import BasicTable from './tables/BasicTable';
// import Mdi from './icons/Mdi';
// import ChartJs from './charts/ChartJs';
// import Error404 from './error-pages/Error404';
// import Error500 from './error-pages/Error500';
// import Login from './user-pages/Login';
// import Register1 from './user-pages/Register';
// import Lockscreen from './user-pages/Lockscreen';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const Buttons = lazy(() => import('./basic-ui/Buttons'));

const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));
const Lockscreen = lazy(() => import('./user-pages/Lockscreen'));

const BanHang = lazy(() => import('./counter/BanHang'));
const Products = lazy(() => import('./products/Products'));
const InactiveProducts = lazy(() => import('./products/InactiveProducts'));
const Employees = lazy(() => import('./employees/Employees'));
const Customers = lazy(() => import('./customers/Customers'));
const Orders = lazy(() => import('./orders/Orders'));
const OrderDetail = lazy(() => import('./orders/OderDetail/OrderDetail'));
const Vouchers = lazy(() => import('./vouchers/Vouchers'));
const CreateProduct = lazy(() => import('./products/action/CreateProduct'));
const UpdateProduct = lazy(() => import('./products/action/UpdateProduct'));
const Brands = lazy(() => import('./products/Brands'));
const Materials = lazy(() => import('./products/Material'));
const Categories = lazy(() => import('./products/Categories'));

class AdminRoutes extends Component {
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>

          <Route exact path="/admin/dashboard" component={Dashboard} />

          <Route exact path="/admin/basic-ui/buttons" component={Buttons} />
          <Route exact path="/admin/basic-ui/dropdowns" component={Dropdowns} />
          <Route exact path="/admin/basic-ui/typography" component={Typography} />

          <Route exact path="/admin/form-Elements/basic-elements" component={BasicElements} />

          <Route exact path="/admin/tables/basic-table" component={BasicTable} />

          <Route exact path="/admin/icons/mdi" component={Mdi} />

          <Route exact path="/admin/charts/chart-js" component={ChartJs} />

          <Route exact path="/admin/user-pages/login-1" component={Login} />
          <Route exact path="/admin/user-pages/register-1" component={Register1} />
          <Route exact path="/admin/user-pages/lockscreen" component={Lockscreen} />

          <Route exact path="/admin/error-pages/error-404" component={Error404} />
          <Route exact path="/admin/error-pages/error-500" component={Error500} />

          <Route exact path="/admin/counter" component={BanHang} />

          <Route exact path="/admin/products" component={Products} />
          <Route exact path="/admin/products/add" component={CreateProduct} />
          <Route exact path="/admin/products/edit/:id" component={UpdateProduct} />
          <Route exact path="/admin/products/inactive" component={InactiveProducts} />
          <Route exact path="/admin/brands" component={Brands} />
          <Route exact path="/admin/categories" component={Categories} />
          <Route exact path="/admin/materials" component={Materials} />

          <Route exact path="/admin/employees" component={Employees} />
          <Route exact path="/admin/customers" component={Customers} />
          <Route exact path="/admin/orders" component={Orders} />
          <Route exact path="/admin/order-detail/orders/:orderId" component={OrderDetail} />
          <Route exact path="/admin/vouchers" component={Vouchers} />

          <Redirect to="/admin/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AdminRoutes;
