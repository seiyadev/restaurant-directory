import { createContext, useState, useLayoutEffect } from "react";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookies } from "react-cookie";

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps
);

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookies, setCookie] = useCookies(["theme"]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useLayoutEffect(() => {
    if (
      cookies.theme &&
      (cookies.theme === "light" || cookies.theme === "dark")
    ) {
      setTheme(cookies.theme);
    } else {
      setCookie("theme", "light", { path: "/" });
    }
  }, [cookies.theme, setTheme, setCookie]);

  const light: ThemeOptions = {
    palette: {
      background: {
        default: "#F3E7FF",
        paper: "#FFFFFF",
      },
      primary: {
        main: "#8A63A9",
      },
      secondary: {
        main: "#CDA4E5",
      },
    },
  };

  const dark: ThemeOptions = {
    palette: {
      background: {
        default: "#1D1D1D",
        paper: "#2D2D2D",
      },
      primary: {
        main: "#A55B9A",
      },
      secondary: {
        main: "#7E3B73",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#DADADA",
      },
      divider: "#4B4B4B",
    },
  };

  const themeMUI: ThemeOptions = createTheme(
    theme === "light" ? light : theme === "dark" ? dark : light
  );

  const toggleTheme = () => {
    setCookie("theme", theme === "light" ? "dark" : "light", { path: "/" });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={themeMUI}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
