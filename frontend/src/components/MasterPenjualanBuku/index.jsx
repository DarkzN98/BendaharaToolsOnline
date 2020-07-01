import React, {Fragment, useState, useEffect} from 'react';
import NavBar from './../NavBar';
import FormInsertPenjualan from './FormInsertPenjualan';
import { Table, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const constants = require('./../constants');
const axios = require('axios');

const MasterPenjualanBuku = () => {
    
    const [listPenjualans, setListPenjualans] = useState([]);
    const history = useHistory();

    const handleDeleteBuku = async (id_buku) =>{
        axios.delete(`${constants.backend_url}/api/penjualans/${id_buku}/`, {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then((response) =>{
            loadPenjualanThisSemester();
        })
        .catch((error) =>{
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

    const handleConfirmBuku = async (id_buku) =>{
        axios.patch(`${constants.backend_url}/api/penjualans/${id_buku}/`, {
            "confirmed_uang_penjualan_buku": true
        },{
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then((response) =>{
            loadPenjualanThisSemester();
        })
        .catch((error) =>{
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

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const loadPenjualanThisSemester = async () => {
        axios.get(`${constants.backend_url}/api/penjualans/?this_semester=true`,{
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) => {
            setListPenjualans(response.data);
        })
        .catch((error) => {
            // error get kembalian ke login ?
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

    useEffect(() =>{
        loadPenjualanThisSemester()
    }, []);

    return (
        <Fragment>
            <NavBar/>
            <br/>
            <div className="container">
                <FormInsertPenjualan callback={loadPenjualanThisSemester}/>
                <h3>List Penjualan Buku Semester Ini</h3>
                <hr/>
                <Table hover striped responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama Buku</th>
                            <th>Jumlah Terjual</th>
                            <th>Lab Penjualan</th>
                            <th>Uang yang diterima</th>
                            <th>Uang yang seharusnya</th>
                            <th>Konfirmasi</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listPenjualans.map( (lp, indx) => {
                                return (
                                    <tr>
                                        <td>{indx + 1}</td>
                                        <td>{`${lp.buku.nama_buku} ${lp.buku.jurusan_buku} [${new Date().getFullYear()}]`}</td>
                                        <td>{lp.jumlah_penjualan_buku}</td>
                                        <td>{lp.lab_penjualan_buku}</td>
                                        <td>{`Rp. ${numberWithCommas(lp.terima_uang_penjualan_buku)}`}</td>
                                        <td>{`Rp. ${numberWithCommas(lp.buku.harga_jual_buku * lp.jumlah_penjualan_buku)}`}</td>
                                        <td>{lp.confirmed_uang_penjualan_buku ? <strong>OK</strong> : <Button variant="primary" onClick={()=>handleConfirmBuku(lp.id)}>Confirm</Button>}</td>
                                        <td><Button variant="outline-danger" onClick={()=>{handleDeleteBuku(lp.id)}}>Delete</Button></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <br/>
            </div>
        </Fragment>
    );
}
 
export default MasterPenjualanBuku;