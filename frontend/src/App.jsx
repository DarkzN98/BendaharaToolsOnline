import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";

import Blank from "./components/Blank/Blank";
import LoginPage from "./components/LoginPage";
import Logout from "./components/Logout";
import KasBulanan from './components/KasBulanan';
import MasterBuku from './components/MasterBuku';

//TODO Web Template Studio: Add routes for your new pages here.
const App = () => {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path = "/" component = { Blank } />
          <Route exact path = "/login" component = { LoginPage } />
          <Route exact path = "/logout" component = { Logout } />
          <Route exact path = "/kasbulanan" component = { KasBulanan } />
          <Route exact path = "/masterbuku" component = { MasterBuku } />
        </Switch>
        <Footer />
      </React.Fragment>
    );
}

export default App;
