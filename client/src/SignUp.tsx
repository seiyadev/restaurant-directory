import { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar } from "@mui/material";
import { Formik, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { Props } from "./interfaces/Auth.interface";

interface AxiosError {
  response: {
    data: {
      username: string;
    };
  };
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Insert a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be min 8 characters")
    .required("Password is required"),
});

export default function SignUp({ isAuth }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cookies, setCookie] = useCookies(["session"]);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    console.log("Here the cookies: ", cookies)
  };

  if (isAuth) return <Navigate to="/" replace />;

  return (
    <Box
      sx={{
        paddingTop: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Sign Up
      </Typography>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const response = await axios.post(
              "http://localhost:8000/api/v1/signup",
              values
            );
            const token = response.data.token;
            setCookie("session", token, { path: "/" });
            navigate("/");
          } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response.data.username) {
              setError("Username already exists.");
            }
            setOpen(true);
          }
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "30%",
              paddingTop: "1rem",
            }}
          >
            <div>
              <Field
                name="username"
                label="Username"
                type="text"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                fullWidth
              />
              {touched.username && errors.username && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.username}
                </Typography>
              )}
            </div>
            <div>
              <Field
                name="email"
                label="Email"
                type="email"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                fullWidth
              />
              {touched.email && errors.email && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.email}
                </Typography>
              )}
            </div>
            <div>
              <Field
                name="password"
                label="Password"
                type="password"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                fullWidth
              />
              {touched.password && errors.password && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.password}
                </Typography>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              size="large"
              sx={{
                textTransform: "none",
              }}
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Formik>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={error.length > 0 ? error : "Something went wrong."}
      />
    </Box>
  );
}
