import React from "react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <div className="col-8 col-md-5">
            <h5 className={styles.title}>Bendahara Tools</h5>
            <p className={styles.description}>
              Tools bendahara created by DarkzN98
            </p>
            <p className={styles.description}>Powered By: <strong>ReactJS</strong> and <strong>Django</strong></p>
          </div>
          <div className="col-2">
            <ul className="list-unstyled">
              <li>
                <a className={styles.footerlink} href="https://istts.ac.id/">
                  Website Kampus ISTTS
                </a>
              </li>
              <li>
                <a className={styles.footerlink} href="https://informatika.istts.ac.id/">
                  Website Informatika ISTTS
                </a>
              </li>
              <li>
                <a className={styles.footerlink} href="https://lkomp.istts.ac.id/">
                  Website Lab Komputer ISTTS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;