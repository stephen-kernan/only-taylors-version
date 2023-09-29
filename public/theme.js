import { createTheme } from "@mui/material";
const headerFont = '"ff-providence-sans-web-pro", sans-serif;'
const textFont = '"trade-gothic-next", sans-serif;'

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#555353",
      contrastText: "#555353",
    },
    secondary: {
      main: "#555353",
    },
    text: {
      header: "#555353",
      primary: "#555353",
    },
    background: {
      paper: "url(/1989-body-bg.webp)",
      header: "url(/1989-header-bg.webp)",
      default: "url(/1989-body-bg.webp)",
    },
  },
  typography: {
    fontFamily: "var(--text-font)",
    fontSize: 24,
    h1: {
      fontFamily: "var(--header-font)",
      color: "#555353"
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
  },
});
