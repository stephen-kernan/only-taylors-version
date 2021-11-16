import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import styles from '../styles/main.module.css'

export const GlobalNav = () => {
  return (
    <AppBar position="static" sx={{ boxShadow: "none" }}>
      <Toolbar
        sx={{
          bgcolor: "primary.main",
          paddingTop: "2em",
          paddingBottom: "1em",
        }}
      >
        <Link href="/" sx={{ width: "100%" }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "primary.contrastText",
              textAlign: "center",
              width: "100%",
            }}
            className={styles.headers}
          >
            ONLY (TAYLOR'S VERSION)
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
