import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1F1025",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#502B5D",
    },
    text: {
      header: "#2a153d",
      primary: "#2a153d",
    },
    background: {
      paper: "url(/background-image__ts-speak-now.webp)",
      default: "url(/background-image__ts-speak-now.webp)",
    },
  },
  typography: {
    h1: {
      fontSize: "1.5em",
      fontFamily: "'Sacramento', 'Mr De Haviland', sans-serif;",
      textTransform: "none",
      fontColor: "#BFBAC0"
    },
    h2: {
      fontSize: "1.5em",
      fontWeight: 700,
    },
    body1: {
      fontWeight: 700,
      textTransform: "uppercase"
    },
    body2: {
      textAlign: "center",
      fontSize: "0.75em",
      fontWeight: 600,
      textTransform: "uppercase"
    },
    fontFamily: "Playfair Display",
    fontSize: 24,
  },
});
