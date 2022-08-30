import { Button } from "@mui/material";
import React from "react";
import { theme } from "../public/theme";
import styles from "../styles/main.module.css";

export const PrimaryButton = ({ label, fn }) => {
  return (
    <Button
      variant="contained"
      onClick={fn}
      className={styles.primaryButton}
      sx={{
        fontWeight: 700,
        fontFamily: theme.typography.fontFamily,
        textTransform: "none",
      }}
    >
      {label}
    </Button>
  );
};
