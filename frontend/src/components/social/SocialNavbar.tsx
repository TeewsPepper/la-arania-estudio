
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "./SocialNavbar.module.css";

export default function SocialNavbar() {
  return (
    <nav className={styles.socialNavbar}>
      <ul className={styles.links}>
        <li>
          <a
            href="https://www.facebook.com/tuestudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/tuestudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/tuestudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
        </li>
      </ul>
    </nav>
  );
}
