import React, {Fragment, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import NavBar from './../NavBar';
import FormInsertBuku from './FormInsertBuku';
import FormInsertNota from '../KasBulanan/FormInsertNota';
import { Table } from 'react-bootstrap';
import constants from '../constants';

const axios = require('axios');

const MasterBuku = () => {

    const [listBukus, setListBukus] = useState([]);
    const refreshListBuku = async () =>{
        axios.get(`${constants.backend_url}/api/bukus/?this_semester=true`,{
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then((response) =>{
            setListBukus(response.data)
        })
        .catch((error) =>{

        });
    }

    useEffect(()=>{
        refreshListBuku()
    }, []);

    return ( 
    <Fragment>
        <NavBar/>
        <br/>
        <div className="container">
            <FormInsertBuku callback={refreshListBuku}/>
            <hr/>
            <h3>List Buku Praktikum Semester Ini</h3>
            <Table variant={'dark'} striped hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama Buku</th>
                        <th>Harga Beli</th>
                        <th>Harga Jual</th>
                        <th>Stok</th>
                        <th>Terjual</th>
                        <th>Sisa</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listBukus.map((lb, indx) =>{
                            return (
                                <tr>
                                    <td>{indx+1}</td>
                                    <td>{lb.nama_buku} {lb.jurusan_buku} [{new Date().getFullYear()}]</td>
                                    <td>{lb.harga_beli_buku}</td>
                                    <td>{lb.harga_jual_buku}</td>
                                    <td>{lb.stok_buku}</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
        <br/>
    </Fragment>
    );
}
 
export default MasterBuku;