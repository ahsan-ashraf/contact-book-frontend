import React, { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import jsCookie from "js-cookie";
import {
  loginApi,
  logoutApi,
  signupApi,
  refreshTokenApi,
} from "../api/auth-api";

function AuthContextProvider({ children }) {
  // const [authData, setAuthData] = useState(() => {
  //   const storedCookie = jsCookie.get("authData");
  //   return storedCookie ? JSON.parse(storedCookie) : null;
  // });
  const [authData, setAuthData] = useState();

  useEffect(() => {
    const stored = jsCookie.get("authData");
    if (stored) {
      const data = JSON.parse(stored);
      setAuthData(data);
    }
  }, []);

  useEffect(() => {
    if (authData) {
      jsCookie.set(
        "authData",
        JSON.stringify({
          userId: authData.userId,
          email: authData.email,
          accessToken: authData.accessToken,
        }),
        {
          expires: 1 / 24, // 1 hour
        }
      );
    }
  }, [authData]);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      // console.log("-=> LOGIN: " + JSON.stringify(response.data));
      setAuthData({
        userId: response.data.userId,
        email: response.data.email,
        accessToken: response.data.accessToken,
      });
    } catch (err) {
      console.log("-=> " + err.message);
    }
  };
  const logout = async () => {
    try {
      const response = await logoutApi();
      // console.log("-=> LOGOUT: " + JSON.stringify(response.data));
      setAuthData(null);
      jsCookie.remove("authData");
    } catch (err) {
      console.log("-=> " + err.message);
    }
  };
  const signup = async (username, email, password) => {
    try {
      const response = await signupApi(username, email, password);
      // console.log("-=> SIGNUP: " + JSON.stringify(response.data));
      setAuthData({
        userId: response.data.userId,
        email: response.data.email,
        accessToken: response.data.accessToken,
      });
    } catch (err) {
      console.log("-=> " + err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: authData?.accessToken,
        userId: authData?.userId,
        email: authData?.email,
        login: login,
        logout: logout,
        signup: signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
