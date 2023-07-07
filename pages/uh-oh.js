import {
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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { GlobalFooter } from "../Components/GlobalFooter";
import { Mixpanel } from "../helpers/mixPanel";
import {PrimaryButton} from "../Components/PrimaryButton";


export const UhOh = () => {
  const router = useRouter();

  useEffect(() => {
    const userIdentifier = localStorage.getItem("access_token")
      ? localStorage.getItem("access_token").slice(0, 20)
      : ""

    Mixpanel.identify(userIdentifier);
    Mixpanel.track("User failed to update tracks");
  }, []);

  const redirectToConfirmationPage = () => {
    router.push("/confirmation")
  }

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
                <ErrorOutlineIcon fontSize="large" />
              </Grid>
              <Grid item xs={12} className={styles.paragraphContainer}>
                <Typography
                  variant="body1"
                  component="p"
                  className={styles.paragraphText}
                >
                  Sorry! Our page got stuck in a lavender haze!
                  <br/>
                  Please click the button below to try again.
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  className={styles.paragraphText}
                >
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <PrimaryButton label="Begin Again" fn={redirectToConfirmationPage} />
              </Grid>

            </Grid>
          </div>
        </main>

        <GlobalFooter />
      </div>
    </ThemeProvider>
  );
};

export default UhOh;
