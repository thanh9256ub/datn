import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './ClientComponents/Context/ShopContext';
import "./i18n";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <ShopContextProvider>
    <App />
  </ShopContextProvider>,
  document.getElementById('root')
);


reportWebVitals();
serviceWorker.unregister();
