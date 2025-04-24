import axios from "axios";

const API_URL = "https://www.isouzbekistan.uz/api";
axios.defaults.withCredentials = true;

const $axios = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}`,
});

export { $axios, API_URL };