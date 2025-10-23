import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import { getAuthSchema } from "./auth-schema";

function AuthForm() {
  const initialValues = { username: "", email: "", password: "" };
  const [isLogin, setIsLogin] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: getAuthSchema(isLogin),
    onSubmit: async (values) => {
      console.log("Form Submitted:", values);
    },
  });

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      }}
    >
      <Grid>
        <Paper
          elevation={6}
          sx={{
            width: 380,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transition: "height 0.3s ease",
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography variant="h5" fontWeight={600} mb={1}>
            {isLogin ? "Welcome Back" : "Create an Account"}
          </Typography>
          <form onSubmit={formik.handleSubmit} style={{ marginTop: 16 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
              }}
            >
              {!isLogin && (
                <TextField
                  label="Username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  fullWidth
                />
              )}

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            </Box>
          </form>
          <Typography variant="body2" mt={3}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {isLogin ? "Register" : "Login"}
            </Button>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AuthForm;
