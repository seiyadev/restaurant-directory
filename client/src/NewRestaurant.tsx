import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Props } from "./interfaces/Auth.interface";
import { useCookies } from "react-cookie";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone number is required"),
});

function NewRestaurant({ isAuth }: Props) {
  const [typeOfFood, setTypeOfFood] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [cookies] = useCookies(["session"]);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setTypeOfFood(event.target.value as string);
  };

  if (!isAuth) return <Navigate to="/" replace />;

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
        New Restaurant
      </Typography>
      <Formik
        initialValues={{
          name: "",
          address: "",
          phone: "",
        }}
        onSubmit={async (values) => {
          const restaurant = {
            ...values,
            type: typeOfFood,
          };
          try {
            await axios.post(
              "http://localhost:8000/api/v1/restaurants",
              restaurant,
              {
                headers: {
                  Authorization: `Bearer ${cookies.session}`,
                },
              }
            );
            await navigate("/");
          } catch (error) {
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
          isValid,
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
                name="name"
                label="Restaurant Name"
                type="text"
                as={TextField}
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.name}
                fullWidth
              />
              {touched.name && errors.name && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.name}
                </Typography>
              )}
            </div>
            <FormControl fullWidth>
              <InputLabel id="label-for-type-of-food">Type</InputLabel>
              <Select
                labelId="label-for-type-of-food"
                id="demo-simple-select"
                value={typeOfFood}
                label="Type"
                onChange={handleChangeSelect}
                defaultValue={"🍕 Pizza"}
              >
                <MenuItem value={"🍕 Pizza"}>🍕 Pizza</MenuItem>
                <MenuItem value={"🌮 Tacos"}>🌮 Tacos</MenuItem>
                <MenuItem value={"🇮🇹 Italian"}>🇮🇹 &nbsp;&nbsp;Italian</MenuItem>
                <MenuItem value={"🥤 Fast food"}>🥤 Fast food</MenuItem>
              </Select>
            </FormControl>
            <div>
              <Field
                name="address"
                label="Address"
                type="text"
                as={TextField}
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.address}
                fullWidth
              />
              {touched.address && errors.address && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.address}
                </Typography>
              )}
            </div>
            <div>
              <Field
                name="phone"
                label="Phone number"
                type="text"
                as={TextField}
                fullWidth
              />
              {touched.phone && errors.phone && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "error.main",
                  }}
                >
                  {errors.phone}
                </Typography>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              size="large"
              disabled={isSubmitting || typeOfFood === "" || !isValid}
            >
              Save
            </Button>
          </Box>
        )}
      </Formik>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={"Something went wrong."}
      />
    </Box>
  );
}

export default NewRestaurant;
