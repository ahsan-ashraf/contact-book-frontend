import { createContext, useContext } from "react";

export const AuthContext = createContext({
  userId: "",
  email: "",
  accessToken: "",
  login: () => {},
  logout: () => {},
  signup: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};
