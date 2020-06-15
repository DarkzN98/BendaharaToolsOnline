import React, { useState, useEffect } from 'react';

import NavBar from './../NavBar';
import FormInsertNota from './FormInsertNota';

import {useHistory} from 'react-router-dom'
import { Table } from 'react-bootstrap'

const axios = require('axios');
const constants = require('./../constants');

const KasBulanan = () => {

    const uangBulanan = 1000000;
    const history = useHistory();
    const [notas, setNotas] = useState([]);
    const [itemDetail, setItemDetail] = useState([]);

    const checkLogin = () =>{
        return window.localStorage.getItem('bendaharausertoken') != ''
    }

    const getThisMonthItems = async () =>{
        setNotas([]);
        setItemDetail([]);
        axios.get(`${constants.backend_url}/api/notas/?this_month=true`, {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) =>{
            setNotas(response.data);
        })
        .catch( (error) =>{
            if(!error.response)
            {
                window.localStorage.removeItem('bendaharausertoken');
                window.localStorage.removeItem('bendaharausername');
                history.push("/");
                return
            }
            if (error.response.status == 401)
            {
                window.localStorage.removeItem('bendaharausertoken');
                window.localStorage.removeItem('bendaharausername');
                history.push("/");
            }
        });
    }

    const handleRowClicked = (rowindex) =>{
        setItemDetail(notas[rowindex].items);
    }

    const getUangBulanIni = () =>{
        return uangBulanan - notas.map( n => n.items.map(i => i.qty_item * i.harga_item).reduce((a,b) => a+b, 0)).reduce((a,b) =>  a+b, 0)
    }

    useEffect(()=>{
        if(checkLogin()){
            getThisMonthItems();
        }else{
            history.push('/');
        }
    }, []);

    return ( 
        <React.Fragment>
            <NavBar/>
            <div className="container">
                <br/>
                <FormInsertNota callback={getThisMonthItems}/>
                <hr/>
                <h3>Pembelian Bulan Ini</h3>
                <div className="row">
                    <div className="col col-sm-7">
                        <Table striped bordered hover borderless responsive>
                            <thead>
                                <th>#</th>
                                <th>Toko</th>
                                <th>Tanggal (y-m-d)</th>
                                <th>Total Biaya</th>
                            </thead>
                            <tbody>
                                {
                                    notas.map( (n, indx) =>{
                                        return (
                                            <tr key={`${indx}`} onClick={(e)=> handleRowClicked(indx)}>
                                                <td>{indx+1}</td>
                                                <td>{n.toko.nama_toko}</td>
                                                <td>{n.tanggal_beli}</td>
                                                <td>Rp. {n.items.map(i => i.qty_item * i.harga_item).reduce((a,b) => a+b, 0)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <h2 style={getUangBulanIni() >= 0 ? {textAlign: "center", color:"#5cb85c"} : {textAlign:"center", color:"#d9534f"}}>Sisa Uang Bulan Ini: Rp. {getUangBulanIni()}</h2>
                    </div>
                    <div className="col col-sm-5">
                    <h5>Detail Pembelian</h5>
                    <Table striped bordered hover variant="dark" borderless size="sm">
                            <thead>
                                <th>#</th>
                                <th>Nama Item</th>
                                <th>Harga Item</th>
                                <th>Qty Item</th>
                                <th>Subtotal</th>
                            </thead>
                            <tbody>
                                {
                                    itemDetail.map( (i, indx) =>{
                                        return (
                                            <tr>
                                                <td>{indx+1}</td>
                                                <td>{i.nama_item}</td>
                                                <td>Rp. {i.harga_item}</td>
                                                <td>{i.qty_item}</td>
                                                <td>Rp. {i.harga_item * i.qty_item}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
                <hr/>
            </div>
        </React.Fragment>
    );
}
 
export default KasBulanan;