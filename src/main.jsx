import "./index.css";
import axios from "axios";
import './translation/i18n';
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


axios.defaults.baseURL = "https://www.isouzbekistan.uz/api"
let token = localStorage.getItem("accessToken");

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
