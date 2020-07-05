import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from './NavBar';
import QrReader from 'react-qr-reader';

const ScannerKembalikan = () => {
    const history = useHistory();
    const handleError = (error) =>{
        console.error(error);
    }

    const handleScan = (data) =>{
        if(data)
        {
            console.log(data);
            history.push(data);
        }
    }

    return (
    <Fragment>
        <NavBar/>
        <br/>
        <div className="container" style={{width: '500px', height:'500px'}}>
            <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }}/>
        </div>
        <br/>
    </Fragment>
    );
}
 
export default ScannerKembalikan;