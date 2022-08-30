import {
  CircularProgress,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import { theme } from "../public/theme";
import { GlobalHead } from "../Components/GlobalHead";
import styles from "../styles/main.module.css";
import { GlobalNav } from "../Components/GlobalNav";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { GlobalFooter } from "../Components/GlobalFooter";
import { Mixpanel } from "../helpers/mixPanel";

export const LoadingStatus = ({ trackName, playlistName }) => {
  return (
    <div className="container">
      <CircularProgress />
      <Typography variant="p" component="p">
        Working on Playlist: {playlistName}
      </Typography>
      <Typography variant="p" component="p">
        Replacing {trackName}
      </Typography>
    </div>
  );
};

export const Converter = () => {
  const router = useRouter();
  const { tracks = 0, playlists = 0 } = router.query;

  useEffect(() => {
    Mixpanel.identify(localStorage.getItem("access_token"));
    Mixpanel.track("User successfully updated tracks", { tracks, playlists });
    if (tracks > 0) {
      Mixpanel.people.increment("tracksUpdated", tracks);
    }
    if (playlists > 0) {
      Mixpanel.people.increment("playlistsUpdated", playlists);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className={styles.container}>
        <GlobalHead />

        <main>
          <GlobalNav />

          <Grid container spacing={4} className={styles.pageContainer}>
            <Grid item xs={12} className={styles.paragraphContainer}>
              <CheckCircleOutlineIcon fontSize="large" />
            </Grid>
            <Grid item xs={12} className={styles.paragraphContainer}>
              <Typography
                variant="body1"
                component="p"
                className={styles.paragraphText}
              >
                Congrats! You just replaced {tracks || "all"} songs in{" "}
                {playlists || "all"} of your playlists with Taylor’s Version.
                Thank you for supporting Taylor rightfully owning her music.
                Long story short, we survived! Feel free to share this with
                other Swifties!
              </Typography>
            </Grid>
          </Grid>
        </main>

        <GlobalFooter />
      </div>
    </ThemeProvider>
  );
};

export default Converter;
