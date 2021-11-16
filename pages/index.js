import { ThemeProvider } from "@emotion/react";
import { Button, CssBaseline, Grid, Typography } from "@mui/material";
import styles from "../styles/main.module.css";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect } from "react";
import { GlobalHead } from "../Components/GlobalHead";
import { GlobalNav } from "../Components/GlobalNav";
import { theme } from "../public/theme";
import { PrimaryButton } from "../Components/PrimaryButton";

const spotifyScopes = process.env.NEXT_SPOTIFY_SCOPES;
const redirectUri = "https://spotifytaylorsversion.com/callback";
const myClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("spotifyAccessToken")) {
      router.push("/converter");
    }
  });

  const loginWithSpotify = () => {
    window.location =
      "https://accounts.spotify.com/authorize" +
      "?response_type=token" +
      "&client_id=" +
      myClientId +
      (spotifyScopes ? "&scope=" + encodeURIComponent(spotifyScopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirectUri);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="container">
        <GlobalHead />

        <main>
          <GlobalNav />

          <Grid container spacing={4} className={styles.pageContainer}>
            <Grid item xs={12}>
              <Typography
                variant="h2"
                component="h2"
                textAlign="center"
                className={styles.headers}
              >
                NO MORE STOLEN LULLABIES
              </Typography>
            </Grid>
            <Grid item xs={12} className={styles.paragraphContainer}>
              <Typography
                variant="body1"
                component="p"
                className={styles.paragraphText}
              >
                This is a Sc***er B***n hate page. We have created a way to
                replace all of the Taylor Swift original recordings in your
                playlists with Taylor’s Version by simply clicking a button.
                …Are you ready for it?
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <PrimaryButton label="LOGIN TO SPOTIFY" fn={loginWithSpotify} />
            </Grid>
          </Grid>
        </main>

        <footer></footer>
      </div>
    </ThemeProvider>
  );
};

export default Home;
