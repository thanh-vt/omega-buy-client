import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from "i18next";
import {initReactI18next} from 'react-i18next';
import common_en from "./translations/en/common.json";
import common_vi from "./translations/vi/common.json";
import manufacturer_en from "./translations/en/manufacturer.json";
import manufacturer_vi from "./translations/vi/manufacturer.json";
import product_en from "./translations/en/product.json";
import product_vi from "./translations/vi/product.json";
import {Provider} from 'react-redux';
import store from "./store/Store";

i18next
.use(initReactI18next)
.init({
  resources: {
    en: {
      common: common_en,
      manufacturer: manufacturer_en,
      product: product_en
    },
    vi: {
      common: common_vi,
      manufacturer: manufacturer_vi,
      product: product_vi
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {escapeValue: false},  // React already does escaping
});

ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,

    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export default i18next;
