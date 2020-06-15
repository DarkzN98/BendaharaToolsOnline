import React, { Fragment, useState } from 'react';
import { Alert, Toast } from 'react-bootstrap';
import LoginForm from './LoginForm';
import { useHistory } from 'react-router-dom';
import NavBar from './../NavBar';


// Import AXIOS untuk Request ke Django Server
const axios = require('axios');
const constants = require('./../constants');

const LoginPage = () => {

    const history = useHistory();

    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChangeForm = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }

    const handleSubmitForm = async (e) =>{
        e.preventDefault();
        await axios.post(`${constants.backend_url}/api-token-auth/`, {
            username: formData.username,
            password: formData.password
        }).then((response) =>{
            window.localStorage.setItem('bendaharausertoken', response.data.token);
            window.localStorage.setItem('bendaharausername', formData.username);
            history.push("/");
        }).catch((error) =>{
            if(!error.response)
            {
                setErrorMessage("Network Error! Backend Server Mungkin Down!")
            }
            else if(error.response.status == 400)
            {
                setErrorMessage("Username / Password Salah !");
            }
        });
    }

    const styles = {
        toaststyle: {
            position: 'absolute',
            bottom: 0,
            right: 10,
        }
    }

    return ( 
        <Fragment>
            <NavBar></NavBar>
            <div aria-live="polite" aria-atomic="true" style={{position: 'relative', minHeight: '100px',}}>
                <Toast
                    style={styles.toaststyle} show={errorMessage != ""} onClose={()=>{setErrorMessage("")}} delay={5000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">Login Error</strong>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
            </div>
            <LoginForm formData={formData} handleChange={handleChangeForm} handleSubmit={handleSubmitForm}/>
            <div className="container" style={{width: "40%"}}>
                <Alert variant="info">
                    <Alert.Heading>Info</Alert.Heading>
                    <hr/>
                    <ul>
                        <li>Username yang digunakan adalah username yang terdaftar pada backend bendahara (beda dengan LKOMP)</li>
                        <li>Untuk pembuatan user baru, hubungi Admin</li>
                    </ul>
                </Alert>
            </div>
            <br/>
        </Fragment> 
    );
}
 
export default LoginPage;