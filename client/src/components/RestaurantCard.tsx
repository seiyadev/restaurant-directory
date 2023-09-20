import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "../interfaces/Restaurant.interface";

interface Props {
  restaurant: Restaurant;
  handleDeleteRestaurant: (id: string) => Promise<void>;
  isAuth: boolean;
}

export default function RestaurantCard({
  restaurant,
  handleDeleteRestaurant,
  isAuth,
}: Props) {
  const [open, setOpen] = React.useState<true | false>(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ minWidth: 275, height: isAuth ? 200 : 160 }}>
        <CardContent>
          <Typography variant="h6">{restaurant.name}</Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {restaurant.type}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            📍 {restaurant.address}
          </Typography>
          <Typography variant="body2">📞 {restaurant.phone}</Typography>
          <CardActions
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {isAuth && (
              <IconButton onClick={() => navigate(`/edit/${restaurant.id}`)}>
                <EditIcon fontSize="small" color="info" />
              </IconButton>
            )}
            {isAuth && (
              <IconButton onClick={handleClickOpen}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            )}
          </CardActions>
        </CardContent>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              textTransform: "none",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteRestaurant(restaurant.id);
              handleClose();
            }}
            sx={{
              textTransform: "none",
              color: "error.main",
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
