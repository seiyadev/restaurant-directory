import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Divider } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../context/ThemeContext";
import { useCookies } from "react-cookie";
import axios from "axios";
import { PropsUser } from "../interfaces/Auth.interface";

const pages = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Create a restaurant",
    path: "/new",
  },
];
const settings = ["Logout"];

function NavBar({ user }: PropsUser) {
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);
  const [isAuth, setIsAuth] = React.useState<boolean>(false);
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useLayoutEffect(() => {
    const verifyAuth = async () => {
      if (cookies.session) {
        try {
          await axios.get("http://localhost:8000/api/v1/users", {
            headers: {
              Authorization: `Bearer ${cookies.session}`,
            },
          });
          await setIsAuth(true);
        } catch (error) {
          setCookie("session", "", { path: "/" });
          removeCookie("session", { path: "/" });
        }
      }
    };
    verifyAuth();
  }, [cookies.session, removeCookie, setCookie]);

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link to="/">
              <Typography
                noWrap
                fontWeight={700}
                fontSize={20}
                letterSpacing={".1rem"}
                display={{
                  xs: "none",
                  md: "block",
                }}
                title="Go to home page"
                color={"primary"}
              >
                Restaurant Directory
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => {
                  if (page.path === "/new" && !isAuth) return null;
                  return (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Link key={page.name} to={`${page.path}`}>
                        <Typography
                          sx={{
                            cursor: "pointer",
                            color:
                              location.pathname === page.path
                                ? "primary.main"
                                : "inherit",
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                          textAlign="center"
                        >
                          {page.name}
                        </Typography>
                      </Link>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
            <Typography
              noWrap
              flexGrow={1}
              fontWeight={700}
              letterSpacing={".1rem"}
              display={{ xs: "flex", md: "none" }}
              title="Go to home page"
              color={"primary"}
              fontSize={16}
              textAlign="center"
              position="absolute"
              sx={{
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              Restaurant
              <br />
              Directory
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                ml: 4,
                gap: 2,
              }}
            >
              {pages.map((page) => {
                if (page.path === "/new" && !isAuth) return null;
                return (
                  <Link key={page.name} to={`${page.path}`}>
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color:
                          location.pathname === page.path
                            ? "primary.main"
                            : "inherit",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {page.name}
                    </Typography>
                  </Link>
                );
              })}
            </Box>

            <Box
              sx={{
                flexGrow: 0,
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                color="inherit"
                sx={{ mr: 1, zIndex: 10 }}
                onClick={toggleTheme}
                disableRipple
              >
                {theme === "light" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              {isAuth ? (
                <>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    title="Open settings"
                  >
                    <Avatar alt="Username" src="/goku.jpg" />
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {user && (
                      <MenuItem
                        disableTouchRipple
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "end",
                          gap: "0.5rem",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          cursor: "default",
                          mb: 1,
                        }}
                      >
                        <Typography fontSize={16} fontWeight={800}>
                          {user.username}
                        </Typography>
                        <Typography fontSize={12} fontStyle={"italic"}>
                          {user.email}
                        </Typography>
                      </MenuItem>
                    )}
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => {
                          removeCookie("session", { path: "/" });
                          setIsAuth(false);
                          handleCloseUserMenu();
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color:
                          location.pathname === "/login"
                            ? "primary.main"
                            : "inherit",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      Login
                    </Typography>
                  </Link>
                  <Link to="/signup">
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color:
                          location.pathname === "/signup"
                            ? "primary.main"
                            : "inherit",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      Sign Up
                    </Typography>
                  </Link>
                </div>
              )}
            </Box>
          </Toolbar>
        </Container>
        <Divider />
      </AppBar>
      <Outlet />
    </>
  );
}
export default NavBar;
