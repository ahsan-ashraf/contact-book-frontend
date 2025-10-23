import * as Yup from "yup";

export const getAuthSchema = (isLogin) => {
  const baseSchema = {
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  };

  if (!isLogin) {
    baseSchema.username = Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required");
  }

  return Yup.object().shape(baseSchema);
};
