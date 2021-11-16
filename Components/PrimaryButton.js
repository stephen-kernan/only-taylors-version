import { Button } from "@mui/material";
import React from "react";
import styles from "../styles/main.module.css";

export const PrimaryButton = ({ label, fn }) => {
  return (
    <Button
      variant="contained"
      onClick={fn}
      className={styles.primaryButton}
    >
      {label}
    </Button>
  );
};
