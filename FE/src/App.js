import React from 'react';
import logo from './logo.svg';
import './admin/App.scss';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Admin from './admin/Admin.js';
import Client from './ClientComponents/Client.js';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>

          <Route path="/admin" component={Admin} />

          <Route path="/" component={Client} />

          <Redirect to="/" />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
