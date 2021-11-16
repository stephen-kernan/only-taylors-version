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
          <Link
            target="_blank"
            href="https://www.npr.org/2019/08/22/753393630/look-what-they-made-her-do-taylor-swift-to-re-record-her-catalog"
          >
            Why is Taylor Re-recording?
          </Link>
        </Typography>
        <Typography
          variant="body2"
          component="p"
          className={styles.footerContent}
        >
          <Link
            target="_blank"
            href="https://www.npr.org/2019/08/22/753393630/look-what-they-made-her-do-taylor-swift-to-re-record-her-catalog"
          >
            View Code
          </Link>
        </Typography>
      </div>
      <div className={styles.disclaimer}>
        <Typography
          variant="body2"
          component="p"
          className={styles.footerContent}
        >
          *This application is fan-made and is in no way endorsed by Taylor
          Swift or Spotify
        </Typography>
      </div>
    </footer>
  );
};
