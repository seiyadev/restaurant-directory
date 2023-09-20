import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate: NavigateFunction = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} alignItems={"center"}>
          <Grid xs={6}>
            <Typography variant="h2" fontWeight={800}>
              Oops!
            </Typography>
            <div className="flex flex-col gap-4 w-fit">
              <Typography variant="h6">
                The page you’re looking for doesn’t exist.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  textTransform: "none",
                }}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </Grid>
          <Grid xs={6}>
            <img src="/404.png" alt="" width={500} height={250} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
