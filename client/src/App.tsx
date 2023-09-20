import { useLayoutEffect, useState } from "react";
import ErrorPage from "./components/ErrorPage.tsx";
import NavBar from "./components/NavBar.tsx";
import NewRestaurant from "./NewRestaurant.tsx";
import Login from "./Login.tsx";
import EditRestaurant from "./EditRestaurant.tsx";
import SignUp from "./SignUp.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Restaurants from "./Restaurants";
import { useCookies } from "react-cookie";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useLayoutEffect(() => {
    const verifyAuth = async () => {
      if (cookies.session) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/users",
            {
              headers: {
                Authorization: `Bearer ${cookies.session}`,
              },
            }
          );
          setIsAuth(true);
          setUser(response.data);
        } catch (error) {
          removeCookie("session", { path: "/" });
        }
      } else {
        setIsAuth(false);
      }
    };
    verifyAuth();
  }, [cookies.session, removeCookie, setCookie]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar user={user} />}>
          <Route index path="/" element={<Restaurants isAuth={isAuth}/>} />
          <Route path="/new" element={<NewRestaurant isAuth={isAuth} />} />
          <Route
            path="/edit/:id"
            element={<EditRestaurant isAuth={isAuth} />}
          />
          <Route path="/login" element={<Login isAuth={isAuth} />} />
          <Route path="/signup" element={<SignUp isAuth={isAuth}/>} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
