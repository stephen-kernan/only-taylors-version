import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(172, 158, 184)",
      contrastText: "#0f1d28",
    },
    secondary: {
      main: "#0f1d28",
    },
    text: {
      header: "rgb(172, 158, 184)",
      primary: "#e8e9e3",
    },
    background: {
      paper: "url(/background-gradient.jpeg)",
      default: "url(/background-gradient.jpeg)",
    },
  },
  typography: {
    h1: {
      fontSize: "1.5em",
      fontWeightRegular: 500,
      fontWeightMedium: 500,
      fontWeightBold: 500,
    },
    h2: {
      fontSize: "1.5em",
      fontWeightRegular: 500,
      fontWeightMedium: 500,
      fontWeightBold: 500,
    },
    body2: {
      textAlign: "center",
      fontSize: "0.75em",
    },
    fontFamily: "Roboto",

    fontSize: 24,
  },
});
