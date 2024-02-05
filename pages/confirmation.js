import {
  Checkbox,
  CircularProgress,
  CssBaseline,
  FormControlLabel,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";

import React, { useEffect, useState } from "react";
import { GlobalFooter } from "../Components/GlobalFooter";
import { GlobalHead } from "../Components/GlobalHead";
import { GlobalNav } from "../Components/GlobalNav";
import { PrimaryButton } from "../Components/PrimaryButton";
import { Mixpanel } from "../helpers/mixPanel";
import { replaceWithTaylorsVersion } from "../helpers/trackConverter";
import { theme } from "../public/theme";

import styles from "../styles/main.module.css";
import { TrackConverterV2 } from "../helpers/TrackConverterV2";

export const LoadingResults = () => {
  return (
    <div>
      <Grid container spacing={4} className={styles.pageContent}>
        <Grid
          item
          xs={12}
          sx={{ marginTop: "5rem" }}
          className={styles.paragraphContainer}
        >
          <CircularProgress />
        </Grid>
        <Grid item xs={12} className={styles.paragraphContainer}>
          <Typography
            variant="p"
            component="p"
            className={styles.paragraphText}
          >
            Are we in the clear yet? <br /> Please wait, this can take a minute.
            Your updated playlists are enchanted to meet you!
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export const ConfirmationContent = ({ confirmChoice }) => {
  const [useTenMinuteVersion, setUseTenMinuteVersion] = useState(false);

  const toggleTenMinute = () => {
    setUseTenMinuteVersion(!useTenMinuteVersion);
    console.log(useTenMinuteVersion);
  };

  return (
    <div className={styles.pageContent}>
      <Grid container spacing={4} className={styles.pageContainer}>
        <Grid item xs={12}>
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            className={styles.headers}
          >
            Let's Dive In Head First, Fearless
          </Typography>
        </Grid>
        <Grid item xs={12} className={styles.paragraphContainer}>
          <Typography
            variant="body1"
            component="p"
            className={styles.paragraphText}
          >
            Just making sure you are okay with replacing all of your Taylor
            Swift songs on your playlists with Taylor’s Version. There is no way
            to reverse it. No need to cry like a baby coming home from the bar,
            just click the button below!
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={styles.paragraphText}
          ></Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <PrimaryButton
            label="Replace Tracks"
            fn={() => confirmChoice(useTenMinuteVersion)}
          />
          <br />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <FormControlLabel
            label="Use All Too Well (10 Minute Version)?"
            onClick={toggleTenMinute}
            checked={useTenMinuteVersion}
            className={styles.formLabel}
            control={<Checkbox />}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export const Confirmation = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Mixpanel.track("User logged in successfully");
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/");
    }

    setToken(storedToken);
  });

  const confirmChoice = async (tenMinuteVersion = false) => {
    Mixpanel.track("User clicked confirm", { tenMinuteVersion });
    setLoading(true);
    if (token) {
      const converter = new TrackConverterV2(token, tenMinuteVersion);
      const url = await converter.replaceWithTaylorsVersion();
      if (url) {
        window.location = url;
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className={styles.container}>
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
