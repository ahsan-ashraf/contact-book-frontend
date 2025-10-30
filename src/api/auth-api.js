import API from "./api-client";

export const loginApi = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response;
};
export const signupApi = async (username, email, password) => {
  const response = await API.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response;
};
export const logoutApi = async () => {
  const response = await API.post("/auth/logout");
  return response;
};
export const refreshTokenApi = async () => {
  const response = await API.post("/auth/refresh-token");
  return response;
};
