import axios from "axios";
import jsCookie from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor to handle 401 -> try refresh
let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

API.interceptors.request.use(
  (config) => {
    try {
      const authData = jsCookie.get("authData");
      if (authData) {
        const { accessToken } = JSON.parse(authData);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    } catch (err) {
      // invalid cookie format — ignore
      // console.error("api-client req interceptor cookie parse error", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
