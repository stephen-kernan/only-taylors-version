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


export const UnknownPage = () => {
  const router = useRouter();

  useEffect(() => {
    Mixpanel.track("Landed on an unknown page");
  }, []);

  const redirectToHomePage = () => {
    router.push("/")
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
                  It looks like we got lost in translation!
                  <br/>
                  We couldn't find the page you're looking for. Click the button below to go back to our landing page.
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  className={styles.paragraphText}
                >
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <PrimaryButton label="Take Me Home" fn={redirectToHomePage} />
              </Grid>

            </Grid>
          </div>
        </main>

        <GlobalFooter />
      </div>
    </ThemeProvider>
  );
};

export default UnknownPage;
