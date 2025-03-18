import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './ClientComponents/Context/ShopContext';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from './context/AuthContext.js';

ReactDOM.render(
  <AuthProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </AuthProvider>,
  document.getElementById('root')
);


reportWebVitals();
serviceWorker.unregister();
