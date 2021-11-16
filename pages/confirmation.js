import {
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";

import React, { useEffect, useState } from "react";
import { GlobalFooter } from "../Components/GlobalFooter";
import { GlobalHead } from "../Components/GlobalHead";
import { GlobalNav } from "../Components/GlobalNav";
import { PrimaryButton } from "../Components/PrimaryButton";
import { replaceWithTaylorsVersion } from "../helpers/trackConverter";
import { theme } from "../public/theme";

import styles from "../styles/main.module.css";

export const LoadingResults = () => {
  return (
    <Grid container spacing={4} className={styles.pageContainer}>
      <Grid item xs={12} className={styles.paragraphContainer}>
        <CircularProgress />
      </Grid>
      <Grid item xs={12} className={styles.paragraphContainer}>
        <Typography variant="h1" component="p" className={styles.paragraphText}>
          UPDATING PLAYLISTS
        </Typography>
      </Grid>
    </Grid>
  );
};

export const ConfirmationContent = ({ confirmChoice }) => {
  return (
    <Grid container spacing={4} className={styles.pageContainer}>
      <Grid item xs={12}>
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          className={styles.headers}
        >
          LET’S DIVE IN HEAD FIRST, FEARLESS
        </Typography>
      </Grid>
      <Grid item xs={12} className={styles.paragraphContainer}>
        <Typography
          variant="body1"
          component="p"
          className={styles.paragraphText}
        >
          Just making sure you are okay with replacing all of your Taylor Swift
          songs on your playlists with Taylor’s Version. There is no way to
          reverse it. No need to cry like a baby coming home from the bar, just
          click the button below!
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <PrimaryButton label="REPLACE TRACKS" fn={confirmChoice} />
      </Grid>
    </Grid>
  );
};

export const Confirmation = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/");
    }

    setToken(storedToken);
  });

  const confirmChoice = async () => {
    setLoading(true);
    if (token) {
      const url = await replaceWithTaylorsVersion(token);
      if (url) {
        router.push(url)
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className="container">
        <GlobalHead />

        <main>
          <GlobalNav />

          {loading ? (
            <LoadingResults />
          ) : (
            <ConfirmationContent confirmChoice={confirmChoice} />
          )}
        </main>

        <GlobalFooter />
      </div>
    </ThemeProvider>
  );
};

export default Confirmation;
