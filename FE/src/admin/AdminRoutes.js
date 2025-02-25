import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../admin/shared/Spinner';
import BanHang from './counter/BanHang';
import Products from './products/Products';
import Employees from './employees/Employees';
import Customers from './customers/Customers';
import Orders from './orders/Orders';
import OrderDetail from './orders/OderDetail/OrderDetail';
import Vouchers from './vouchers/Vouchers';
import CreateProduct from './products/components/CreateProduct';

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

          <Route exact path="/admin/employees" component={Employees} />
          <Route exact path="/admin/customers" component={Customers} />
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
