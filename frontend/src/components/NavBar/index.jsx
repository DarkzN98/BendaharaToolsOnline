import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import {NavDropdown} from 'react-bootstrap';

//TODO Web Template Studio: Add a new link in the NavBar for your page here.
// A skip link is included as an accessibility best practice. For more information visit https://www.w3.org/WAI/WCAG21/Techniques/general/G1.
const NavBar = () => {

  useEffect(()=>{

  }, []);

  return (
    <React.Fragment>
      <div className={styles.skipLink}>
        <a href="#mainContent">Skip to Main Content</a>
      </div>
      <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between">
        <Link className="navbar-brand" to="/">
          BendaharaTools
        </Link>
        <div className="navbar-nav">
          {
            window.localStorage.getItem('bendaharausertoken') == undefined ?
            ""
            :
            <NavDropdown title={`Tools`}>
              <NavDropdown.Item href="/kasbulanan">Kas Bulanan</NavDropdown.Item>
              <NavDropdown.Item href="/kaslab">Kas Lab</NavDropdown.Item>
              <NavDropdown.Item href="/penjualanbuku">Penjualan Buku</NavDropdown.Item>
            </NavDropdown>
          }
          {
            window.localStorage.getItem('bendaharausertoken') == undefined ?
            <Link className="nav-item nav-link active" to="/login">
              Login
            </Link>
            :
            <NavDropdown title={`Hello, ${window.localStorage.getItem('bendaharausername')}`}>
              <NavDropdown.Item href="/logout" style={{color: 'red'}}>Logout</NavDropdown.Item>
            </NavDropdown>
          }
        </div>
      </nav>
    </React.Fragment>
  );
}
export default NavBar;
