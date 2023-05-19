import { AppBar, Link, Toolbar, Typography } from "@mui/material";

export const GlobalNav = () => {
  return (
    <AppBar position="static" sx={{ boxShadow: "none" }}>
      <Toolbar
        sx={{
          bgcolor: "primary.main",
          paddingTop: "0.5em",
          paddingBottom: "0.5em",
        }}
      >
        <Link href="/" sx={{ width: "100%" }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              textAlign: "center",
              width: "100%",
              fontWeight: 700,
              letterSpacing: "0.1rem",
              color: "#BFBAC0",
            }}
          >
            Only (Taylor's Version)
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
