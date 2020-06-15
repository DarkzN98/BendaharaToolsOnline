import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const Logout = () => {

    const history = useHistory();
    // langsung logout :)
    useEffect(()=>{
        window.localStorage.removeItem('bendaharausername');
        window.localStorage.removeItem('bendaharausertoken');
        history.push('/');
    }, []);

    return ( <h1>Logging out</h1> );
}
 
export default Logout;