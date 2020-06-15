import React from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

const LoginForm = (props) => {
    const styles = {
        login: {
            padding: "60px 0"
        },
        loginform: {
            margin: "0 auto",
            maxWidth: "320px",
            borderRadius: "1em",
            backgroundColor: "#efefef",
            padding: "1em",
            boxShadow: "0 0 5px #0080FF",
        }
    }

    return ( 
    <div className="login" style={styles.login}>
        <form action="#" style={styles.loginform} onSubmit={props.handleSubmit}>
            <FormGroup controlId="username">
                <FormLabel>Username</FormLabel>
                <FormControl autoFocus type="text" name="username" value={props.formData.username} onChange={props.handleChange} required/>
            </FormGroup>
            <FormGroup controlId="password">
                <FormLabel>Password</FormLabel>
                <FormControl type="password" name="password" value={props.formData.password} onChange={props.handleChange} required/>
            </FormGroup>
            <Button block variant="primary" type="submit">LOGIN</Button>
        </form>
    </div>
    );
}
 
export default LoginForm;