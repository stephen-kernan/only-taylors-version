import { Link, Typography } from "@mui/material";
import styles from "../styles/main.module.css";

export const GlobalFooter = () => {
  return (
    <footer>
      <div className={styles.footerContainer}>
        <Typography
          variant="body2"
          component="p"
          className={styles.footerContent}
        >
          <Link href="https://www.npr.org/2019/08/22/753393630/look-what-they-made-her-do-taylor-swift-to-re-record-her-catalog">
            Why is Taylor Re-recording?
          </Link>
        </Typography>
        <Typography
          variant="body2"
          component="p"
          className={styles.footerContent}
        >
          <Link href="https://www.npr.org/2019/08/22/753393630/look-what-they-made-her-do-taylor-swift-to-re-record-her-catalog">
            View Code
          </Link>
        </Typography>
      </div>
    </footer>
  );
};
