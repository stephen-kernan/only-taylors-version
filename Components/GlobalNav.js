import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import {theme} from "../public/theme";
import styles from "/styles/main.module.css";

export const GlobalNav = () => {
  return (
    <AppBar position="static" sx={{ boxShadow: "none" }}>
      <Toolbar
        sx={{
          background: theme.palette.background.header,
          paddingBlock: "2.75rem",
          borderBottom: "1px solid white"
        }}
      >
        <Link href="/" sx={{ width: "100%" }}>
          <Typography
            variant="h1"
            component="h1"
            className={styles.title}
            sx={{
              textAlign: "center",
              width: "100%",
              fontWeight: 700,
            }}
          >
            Only (Taylor's Version)
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
