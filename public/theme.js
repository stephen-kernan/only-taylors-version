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
      header: "url(https://cdn.shopify.com/s/files/1/0011/4651/9637/t/243/assets/snpib.png)",
      default: "url(/background-image__ts-speak-now.webp)",
    },
  },
  typography: {
    h1: {
      fontFamily: "'mina', 'Sacramento', 'Mr De Haviland', sans-serif;",
      textTransform: "none",
      color: "#FFF"
    },
    h2: {
      fontWeight: 700,
    },
    body1: {
      fontWeight: 700,
    },
    body2: {
      textAlign: "center",
      fontWeight: 500,
    },
    fontFamily: "'filosofia-all-small-caps', 'Playfair Display', serif;",
    fontSize: 36
  },
});
