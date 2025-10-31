import React, { useEffect, useState, useRef } from "react";
import { AuthContext } from "./auth-context";
import jsCookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    const stored = jsCookie.get("authData");
    if (stored) {
      const data = JSON.parse(stored);
      setAuthData(data);
    }
  }, []);

  const logoutTimer = useRef(null);
  const autoLogoutOnAccessTokenExpiration = () => {
    const decoded = jwtDecode(authData.accessToken);
    const expirationTime = decoded.exp * 1000; // exp is in seconds → ms
    const currentTime = Date.now();
    const remaining = expirationTime - currentTime;

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    if (remaining > 0) {
      logoutTimer.current = setTimeout(() => {
        console.log("Access token expired — auto logging out.");
        logout();
      }, remaining);
    }
  };

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

      autoLogoutOnAccessTokenExpiration();
    } else {
      jsCookie.remove("authData");
    }
  }, [authData]);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    // console.log("-=> LOGIN: " + JSON.stringify(response.data));
    setAuthData({
      userId: response.data.userId,
      email: response.data.email,
      accessToken: response.data.accessToken,
    });
  };
  const logout = async () => {
    const response = await logoutApi();
    // console.log("-=> LOGOUT: " + JSON.stringify(response.data));
    setAuthData(null);
    jsCookie.remove("authData");
  };
  const signup = async (username, email, password) => {
    const response = await signupApi(username, email, password);
    // console.log("-=> SIGNUP: " + JSON.stringify(response.data));
    setAuthData({
      userId: response.data.userId,
      email: response.data.email,
      accessToken: response.data.accessToken,
    });
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
