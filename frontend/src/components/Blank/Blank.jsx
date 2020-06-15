import React, {useState , useEffect} from "react";
import {Alert} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import NavBar from './../NavBar';

const Blank = () => {

  const [loginState, setLoginState] = useState(false);

  const history = useHistory();

  const checkLogin = () =>{
    // check token di localstorage
    if(window.localStorage.getItem('bendaharausertoken')){
      setLoginState(true);
      history.push("kasbulanan");
    }
  }

  useEffect(()=>{
    checkLogin();
  }, []);

  return( 
  <React.Fragment>
    <NavBar/>
    <main id="mainContent">
      <div className="container">
          <br/>
          {loginState ? "" : <Alert variant='info'><Alert.Heading>Belum Login</Alert.Heading>Harap melakukan login terlebih dahulu <hr/>klik link berikut <Alert.Link href='login'>Go to Login Page</Alert.Link> atau tombol login pada navbar untuk pindah ke halaman login</Alert>}
      </div>
    </main>
  </React.Fragment>
  );
}
export default Blank;
