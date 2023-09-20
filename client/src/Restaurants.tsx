import {
  Container,
  CircularProgress,
  Typography,
  Snackbar,
} from "@mui/material";
import RestaurantCard from "./components/RestaurantCard";
import { useEffect, useState } from "react";
import { Restaurant } from "./interfaces/Restaurant.interface";
import axios from "axios";
import { Props } from "./interfaces/Auth.interface";
import { useCookies } from "react-cookie";

function Restaurants({ isAuth }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [cookies] = useCookies(["session"]);

  const fetchRestaurants = async () => {
    const response = await (
      await axios.get<Restaurant[]>("http://localhost:8000/api/v1/restaurants")
    ).data;
    setLoading(false);
    setRestaurants(response);
  };

  const handleDeleteRestaurant = async (id: string) => {
    await axios.delete(`http://localhost:8000/api/v1/restaurants?id=${id}`, {
      headers: {
        Authorization: `Bearer ${cookies.session}`,
      },
    });
    const newRestaurants = await restaurants.filter(
      (restaurant) => restaurant.id !== id
    );
    setRestaurants(newRestaurants);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTimeout(fetchRestaurants, 500);
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Restaurants
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {loading ? (
          <CircularProgress
            color="primary"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              handleDeleteRestaurant={handleDeleteRestaurant}
              isAuth={isAuth}
            />
          ))
        )}
      </div>
      {!loading && restaurants.length == 0 && (
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "text.secondary",
            fontWeight: 400,
          }}
        >
          There is not restaurants yet.
        </Typography>
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Restaurant deleted successfully."
      />
    </Container>
  );
}

export default Restaurants;
