import { createContext, useContext } from "react";

export const AuthContext = createContext({
  userId: "",
  email: "",
  token: "",
  login: () => {},
  logout: () => {},
  signup: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};
