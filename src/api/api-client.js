import axios from "axios";
import jsCookie from "js-cookie";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // for local development
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function getAuthDataFromCookie() {
  try {
    const raw = jsCookie.get("authData");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function setAuthDataToCookie(newAccessToken) {
  const current = getAuthDataFromCookie() || {};
  const updated = {
    ...current,
    accessToken: newAccessToken,
  };

  jsCookie.set("authData", JSON.stringify(updated), {
    expires: 1 / 24,
  });
}

API.interceptors.request.use(
  (config) => {
    const authData = getAuthDataFromCookie();
    if (authData?.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let subscribers = [];

function notifySubscribers(newToken) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

async function performTokenRefresh() {
  const refreshClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const res = await refreshClient.post("/auth/refresh-token");
  const newAccessToken = res.data.accessToken;

  setAuthDataToCookie(newAccessToken);

  return newAccessToken;
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(API(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await performTokenRefresh();

        isRefreshing = false;
        notifySubscribers(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        notifySubscribers(null);

        jsCookie.remove("authData");

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
