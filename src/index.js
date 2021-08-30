import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css"
import App from "./containers/App";
import { Provider } from "react-redux";
import store from "./store/notificationslice.js";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
