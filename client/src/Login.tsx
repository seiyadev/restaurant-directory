import { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar } from "@mui/material";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Props } from "./interfaces/Auth.interface";

interface AxiosError {
  response: {
    data: {
      detail: string;
    };
  };
}

const validationSchema = Yup.object().shape({
  email_username: Yup.string().required("Email or Username is required"),
  password: Yup.string()
    .min(8, "Password must be min 8 characters")
    .required("Password is required"),
});

export default function Login({ isAuth }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cookies, setCookie] = useCookies(["session"]); // Destrucutre setCookie from useCookies hook
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
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
        Login
      </Typography>
      <Formik
        initialValues={{
          email_username: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const response = await axios.post(
              "http://localhost:8000/api/v1/login",
              values
            );
            const token = response.data.token;
            setCookie("session", token, { path: "/" });
            navigate("/", { replace: true });
          } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response.data.detail) {
              setError(axiosError.response.data.detail);
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
                name="email_username"
                label="Email or Username"
                type="email"
                as={TextField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email_username}
                fullWidth
              />
              {touched.email_username && errors.email_username && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.email_username}
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
              Login
            </Button>
          </Box>
        )}
      </Formik>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={error.length > 0 ? error : "Something went wrong."}
        onClick={() => {
          console.log("clicked, here are the cookies :) ", cookies);
          setOpen(false);
        }}
      />
    </Box>
  );
}
