import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, useParams} from 'react-router-dom';
import { FormGroup, FormLabel, FormControl, Table, Button, Modal } from 'react-bootstrap';
import NavBar from './../NavBar';
import constants from '../constants';

const axios = require('axios');

const MasterKembalikan = () => {

    const { id_peminjaman } = useParams();
    const history = useHistory();
    const [peminjaman, setPeminjaman] = useState(
    {"url": "",
        "id": "",
        "nama_peminjam": "",
        "tanggal_peminjaman": "",
        "user_meminjamkan": {
            "username": "",
            "email": ""
        },
        "barangs": []
    });

    const getPeminjaman = () =>{
        axios.get(`${constants.backend_url}/api/peminjamans/${id_peminjaman}/`, {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) =>{
            console.log(response.data);
            setPeminjaman(response.data);
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

    const handleKembalikan = (id_barang) =>{
        axios.patch(`${constants.backend_url}/api/barangs/${id_barang}/`, {
            tanggal_kembali: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
        }, {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) =>{
            console.log(response.data)
            getPeminjaman();
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

    useEffect(()=>{
        getPeminjaman()
    }, []);

    return ( 
    <Fragment>
        <NavBar/>
        <br/>
        <div className="container">
            <h1>Detail Peminjaman</h1>
            <hr/>
            <FormGroup>
                <FormLabel>Tanggal Peminjaman:</FormLabel>
                <FormControl type="text" readOnly value={peminjaman.tanggal_peminjaman}></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Nama Peminjam:</FormLabel>
                <FormControl type="text" readOnly value={peminjaman.nama_peminjam}></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Yang meminjamkan:</FormLabel>
                <FormControl type="text" readOnly value={peminjaman.user_meminjamkan.username}></FormControl>
            </FormGroup>
            <h3>List Item</h3>
            <hr/>
            <Table striped hover variant={"dark"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama Barang</th>
                        <th>Stiker</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        peminjaman.barangs.map( (b, indx) =>{
                            return (
                                <tr>
                                    <td>{indx + 1}</td>
                                    <td>{b.nama_barang}</td>
                                    <td>{b.id_stiker}</td>
                                    <td>{b.tanggal_kembali ? `Sudah dikembalikan ${b.tanggal_kembali} (${b.user_konfirmasi_kembali.username})` : <Button variant={"success"} onClick={(e) => handleKembalikan(b.id)}>Confirm Kembali</Button>}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
        <br/>
    </Fragment>
    );
}
 
export default MasterKembalikan;