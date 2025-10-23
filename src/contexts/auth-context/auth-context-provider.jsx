import React, { useState } from "react";
import { AuthContext } from "./auth-context";
import jsCookie from "js-cookie";

function AuthContextProvider({ children }) {
  const [authData, setAuthData] = useState(() => {
    const storedCookie = jsCookie.get("authData");
    return storedCookie ? JSON.parse(storedCookie) : null;
  });

  const login = () => {};
  const logout = () => {};
  const signup = () => {};

  return (
    <AuthContext.Provider
      value={{
        token: authData?.token,
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
