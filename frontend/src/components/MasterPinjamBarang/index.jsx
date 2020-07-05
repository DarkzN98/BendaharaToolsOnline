import React, { Fragment , useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from './../NavBar';
import { Table, Modal, Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

import FormInsertPeminjaman from './FormInsertPeminjaman';

const constants = require('../constants');
const axios = require('axios');
const QRCode = require('qrcode.react');

const MasterPinjamBarang = () => {

    const history = useHistory();
    const [listPeminjaman, setListPeminjaman] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [detailItem, setDetailItem] = useState({"url": "",
        "id": "",
        "nama_peminjam": "",
        "tanggal_peminjaman": "",
        "user_meminjamkan": {
            "username": "",
            "email": ""
        },
        "barangs": []
    });

    useEffect(()=>{
        loadAllPeminjaman()
    },[]);

    const handleViewDetail = (id) =>{
        setDetailItem(listPeminjaman.find(l => l.id === id));
        setShowModal(true);
    }

    const loadAllPeminjaman = () =>{
        axios.get(`${constants.backend_url}/api/peminjamans/`, {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) =>{
            setListPeminjaman(response.data);
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

    return ( 
    <Fragment>
        <NavBar />
        <br/>
        <div className="container">
            <FormInsertPeminjaman/>
            <br/>
            <h1>List Peminjaman</h1>
            <hr/>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tanggal</th>
                        <th>Nama Peminjam</th>
                        <th>Jumlah Item</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listPeminjaman.map((p, idx) =>{
                            return (
                                <tr>
                                    <td>{idx+1}</td>
                                    <td>{p.tanggal_peminjaman}</td>
                                    <td>{p.nama_peminjam}</td>
                                    <td>{p.barangs.length} Item</td>
                                    <td>
                                        <Button onClick={(e) => handleViewDetail(p.id)}>Details</Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
        <br/>

        <Modal centered show={showModal} onHide={e =>setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <FormLabel>Tanggal Peminjaman:</FormLabel>
                        <FormControl type="text" readOnly value={detailItem.tanggal_peminjaman}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Nama Peminjam:</FormLabel>
                        <FormControl type="text" readOnly value={detailItem.nama_peminjam}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Yang meminjamkan:</FormLabel>
                        <FormControl type="text" readOnly value={detailItem.user_meminjamkan.username}></FormControl>
                    </FormGroup>
                    <h3>List Item</h3>
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
                                detailItem.barangs.map( (b, indx) =>{
                                    return (
                                        <tr>
                                            <td>{indx + 1}</td>
                                            <td>{b.nama_barang}</td>
                                            <td>{b.id_stiker}</td>
                                            <td>{b.tanggal_kembali ? `${b.tanggal_kembali} (${b.user_konfirmasi_kembali.username})` : "Belum kembali"}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <h3>QR-Code</h3>
                    <hr/>
                    <QRCode value={`kembalikan/${detailItem.id}`} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={(e) => {setShowModal(false);}}>Close</Button>
                </Modal.Footer>
            </Modal>
    </Fragment> 
    );
}
 
export default MasterPinjamBarang;