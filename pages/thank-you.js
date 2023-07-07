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

export const Converter = () => {
  const router = useRouter();
  const { tracks = 0, playlists = 0 } = router.query;

  useEffect(() => {
    const [trackCount, playlistCount] = [Number(tracks), Number(playlists)]
    if (trackCount > 0 || playlistCount > 0) {
      Mixpanel.track("User completed process.", { trackCount, playlistCount });

      // User-level update stats
      const userIdentifier = localStorage.getItem("access_token")
        ? localStorage.getItem("access_token").slice(0, 20)
        : ""
      Mixpanel.identify(userIdentifier);

      if (trackCount > 0) {
        Mixpanel.people.increment("tracksUpdated", trackCount);
      }
      if (playlistCount > 0) {
        Mixpanel.people.increment("playlistsUpdated", playlistCount);
      }
    }
  }, [router.isReady]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className={styles.container}>
        <GlobalHead />

        <main>
          <GlobalNav />

          <div className={styles.pageContent}>
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
                  Congrats! You just replaced {tracks > 0 ? tracks : "all"} songs across{" "}
                  {playlists > 0 ? playlists : "all"} of your playlists with Taylor’s Version.
                  Thank you for supporting Taylor's rightful ownership of her music.
                  Long story short, we survived! Feel free to share this with
                  other Swifties!
                </Typography>
              </Grid>
            </Grid>
          </div>
        </main>

        <GlobalFooter />
      </div>
    </ThemeProvider>
  );
};

export default Converter;
