import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#70000E",
      contrastText: "#CCBBB0",
    },
    secondary: {
      main: "#D3D2D7",
    },
    text: {
      primary: "#70000E",
    },
    background: {
      paper: "#CCBBB0",
      default: "#CCBBB0",
    },
  },
  typography: {
    h1: {
      fontSize: "1.25em",
      fontWeightRegular: 700,
      fontWeightMedium: 700,
      fontWeightBold: 700,
      fontStyle: "italic",
    },
    h2: {
      fontSize: "1.5em",
      fontWeightRegular: 700,
      fontWeightMedium: 700,
      fontWeightBold: 700,
      fontStyle: "italic",
    },
    fontFamily: "Open Sans Condensed",

    fontSize: 24,
  },
});
