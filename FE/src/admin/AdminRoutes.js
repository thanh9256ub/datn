import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../admin/shared/Spinner';

import { useAuth } from '../context/AuthContext';

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
const ProductDetail = lazy(() => import('./products/ProductDetail'));
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

const CreateCustomer = lazy(() => import('./customers/action/CreateCustomer'));
const UpdateCustomer = lazy(() => import('./customers/action/UpdateCustomer'));
const CreateEmployee = lazy(() => import('./employees/action/CreateEmployee'));
const UpdateEmployee = lazy(() => import('./employees/action/UpdateEmployee'));

// Component bảo vệ route (AuthGuard)
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        console.log("token: " + !!token) ||
          !!token ? <Component {...props} /> : <Redirect to="/LoginNhanVien" />
      }
    />
  );
};

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

          <ProtectedRoute exact path="/admin/counter" component={BanHang} />

          <ProtectedRoute exact path="/admin/products" component={Products} />
          <ProtectedRoute exact path="/admin/products/:id/detail" component={ProductDetail} />
          <ProtectedRoute exact path="/admin/products/add" component={CreateProduct} />
          <ProtectedRoute exact path="/admin/products/edit/:id" component={UpdateProduct} />
          <ProtectedRoute exact path="/admin/products/inactive" component={InactiveProducts} />
          <ProtectedRoute exact path="/admin/brands" component={Brands} />
          <ProtectedRoute exact path="/admin/categories" component={Categories} />
          <ProtectedRoute exact path="/admin/materials" component={Materials} />

           <ProtectedRoute exact path="/admin/employees" component={Employees} />
          <ProtectedRoute exact path="/admin/employees/add" component={CreateEmployee} />
          <ProtectedRoute exact path="/admin/employees/update/:id" component={UpdateEmployee} />
          <ProtectedRoute exact path="/admin/customers" component={Customers} />
          <ProtectedRoute exact path="/admin/customers/update/:id" component={UpdateCustomer} />

          <ProtectedRoute exact path="/admin/customers/add" component={CreateCustomer} />

          <Route exact path="/admin/orders" component={Orders} />
          <Route exact path="/admin/orders/:id" component={OrderDetail} />
          <Route exact path="/admin/vouchers" component={Vouchers} />

          <Redirect to="/admin/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AdminRoutes;