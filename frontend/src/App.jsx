import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";

import Blank from "./components/Blank/Blank";
import LoginPage from "./components/LoginPage";
import Logout from "./components/Logout";
import KasBulanan from './components/KasBulanan';
import MasterBuku from './components/MasterBuku';
import MasterPenjualanBuku from './components/MasterPenjualanBuku';
import MasterPinjamBarang from './components/MasterPinjamBarang';
import ScannerKembalikan from './components/ScannerKembalikan';
import MasterKembalikan from './components/MasterKembalikan';

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
          <Route exact path = "/masterpenjualanbuku" component = { MasterPenjualanBuku } />
          <Route exact path = "/masterpinjambarang" component = { MasterPinjamBarang } />
          <Route exact path = "/scankembalikan" component= { ScannerKembalikan } />
          <Route path = "/kembalikan/:id_peminjaman" component= { MasterKembalikan } />
        </Switch>
        <Footer />
      </React.Fragment>
    );
}

export default App;
