import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Grid, Typography } from "@mui/material";
import styles from "../styles/main.module.css";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { GlobalHead } from "../Components/GlobalHead";
import { GlobalNav } from "../Components/GlobalNav";
import { theme } from "../public/theme";
import { PrimaryButton } from "../Components/PrimaryButton";
import { GlobalFooter } from "../Components/GlobalFooter";
import { Mixpanel } from "../helpers/mixPanel";

const spotifyScopes = process.env.NEXT_PUBLIC_SPOTIFY_SCOPES;
const redirectUri = process.env.NEXT_PUBLIC_CALLBACK_URI;
const myClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const referrer = document.referrer;
    console.log("referrer => ", referrer.split("?")[0]);
    Mixpanel.track("Landing page");
  }, []);

  useEffect(() => {
    if (localStorage.getItem("spotifyAccessToken")) {
      router.push("/converter");
    }
  });

  const loginWithSpotify = () => {
    Mixpanel.track("Redirect to login");
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
      <div className={styles.container}>
        <GlobalHead />

        <main>
          <GlobalNav />

          <div className={styles.pageContent}>
            <Grid container spacing={4} className={styles.pageContainer}>
              <Grid item xs={12}>
                <Typography
                  variant="h2"
                  component="h2"
                  textAlign="center"
                >
                  No More Stolen Lullabies
                </Typography>
              </Grid>
              <Grid item xs={12} className={styles.paragraphContainer}>
                <Typography
                  variant="body1"
                  component="p"
                  className={styles.paragraphText}
                >
                  We have created a way to replace all of the Taylor Swift
                  original recordings in your Spotify playlists with Taylor’s
                  Version by simply clicking a button… Are you ready for it?
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <PrimaryButton label="Login to Spotify" fn={loginWithSpotify} />
              </Grid>
            </Grid>
          </div>
        </main>

        <GlobalFooter />
      </div>
    </ThemeProvider>
  );
};

export default Home;
