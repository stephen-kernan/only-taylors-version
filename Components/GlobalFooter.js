import { Link, Typography } from "@mui/material";
import styles from "../styles/main.module.css";
import {Mixpanel} from "../helpers/mixPanel";

// SmartLink has a Mixpanel callbacks o that I can track the anonymous usage in Mixpanel
const SmartLink = ({ href, target, children }) => {
  const onLinkClick = (e) => {
    if (href.includes("buymeacoffee")) {
      Mixpanel.track("User visited support site.")
    } else {
      Mixpanel.track("User clicked footer link.")
    }
  }

  return (
    <Link target={target} href={href} onClick={onLinkClick}>{children}</Link>
  )
}

export const GlobalFooter = () => {
  return (
    <footer>
      <div className={styles.footerContainer}>
        <Typography
          variant="none"
          component="p"
          className={styles.footerContent}
        >
          <SmartLink
            target="_blank"
            href="https://www.npr.org/2019/08/22/753393630/look-what-they-made-her-do-taylor-swift-to-re-record-her-catalog"
          >
            Why is Taylor re-recording?
          </SmartLink>
        </Typography>
        <Typography
          variant="none"
          component="p"
          className={styles.footerContent}
        >
          <SmartLink
            target="_blank"
            href="https://github.com/stephen-kernan/only-taylors-version"
          >
            View Code
          </SmartLink>
        </Typography>
        <Typography
          variant="none"
          component="p"
          className={styles.footerContent}
        >
          <SmartLink
            target="_blank"
            href="https://www.buymeacoffee.com/stephenkernan"
          >
            Support This Site
          </SmartLink>
        </Typography>
      </div>
      <div className={styles.disclaimer}>
        <Typography
          variant="body1"
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
