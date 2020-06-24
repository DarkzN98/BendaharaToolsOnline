import React, {Fragment, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import { Form, FormGroup, Col, Row, Table, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import constants from '../../constants';

const axios = require('axios');

const FormInsertBuku = (props) => {

    const [messages, setMessages] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [formData, setFormData] = useState({
        nama_buku: "",
        jurusan: "INF",
        harga_beli: "",
        harga_jual: "",
        stok_buku: "",
    });

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const handleFormChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleFormSubmit = async (e) =>{
        e.preventDefault();
        // fields = ['id', 'nama_buku', 'jurusan_buku','tanggal_cetak_buku', 'harga_beli_buku', 'harga_jual_buku', 'stok_buku']
        axios.post(`${constants.backend_url}/api/bukus/`, {
            "nama_buku": formData.nama_buku,
            "jurusan_buku": formData.jurusan,
            "tanggal_cetak_buku": `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`,
            "harga_beli_buku": formData.harga_beli,
            "harga_jual_buku": formData.harga_jual,
            "stok_buku": formData.stok_buku
        },{
            headers:{
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (result) => {
            resetForm();
            setMessages([...messages, {
                msg: "Sukses Insert Buku !",
                variant: "success"
            }]);
            if(props.callback) props.callback()
        })
        .catch( (error) => {
            setMessages([...messages, {
                msg: "Gagal Insert Buku !",
                variant: "danger"
            }]);
        });
    }

    const resetForm = () =>{
        setFormData({
            nama_buku: "",
            jurusan: "INF",
            harga_beli: "",
            harga_jual: "",
            stok_buku: ""
        });
    }

    return (
        <Fragment>
            {
                messages.map( m => {
                    return <Alert variant={m.variant} onClose={()=> setMessages(messages.filter(me => me != m))} dismissible>{m.msg}</Alert>
                })
            }
            <h2>Insert Buku Praktikum</h2>
            <hr/>
            <div>
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={handleFormSubmit}>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Nama Buku Praktikum</Form.Label>
                                <Col>
                                    <Form.Control type="text" placeholder="Nama Buku Praktikum" required value={formData.nama_buku} onChange={handleFormChange} name={"nama_buku"}/>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Jurusan</Form.Label>
                                <Col>
                                    <Form.Control as="select" name={"jurusan"} value={formData.jurusan} onChange={handleFormChange}>
                                        <option value="INF">Informatika</option>
                                        <option value="IFM">Informatika Malam</option>
                                        <option value="SIB">Sistem Informasi Bisnis</option>
                                        <option value="ELK">Elektro</option>
                                    </Form.Control>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Tanggal Cetak</Form.Label>
                                <Col>
                                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} todayButton="Today" className='form-control' required/>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Harga Beli Buku (Cetak)</Form.Label>
                                <Col>
                                    <Form.Control type="number" required placeholder="Harga Beli Buku" min={1} name={"harga_beli"} value={formData.harga_beli} onChange={handleFormChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4} >Harga Jual Buku</Form.Label>
                                <Col>
                                    <Form.Control type="number" required placeholder="Harga Jual Buku" min={1} name={"harga_jual"} value={formData.harga_jual} onChange={handleFormChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Stok Buku</Form.Label>
                                <Col>
                                    <Form.Control type="number" required placeholder="Stok Buku" min={1} name={"stok_buku"} value={formData.stok_buku} onChange={handleFormChange}/>
                                </Col>
                            </FormGroup>
                            <Button block variant={"primary"} onClick={resetForm}>Clear</Button>
                            <Button block variant={"success"} type="submit">Insert</Button>
                        </Form>
                    </Col>
                    {/* Untuk Perhitungan Sementara */}
                    <Col sm={6}>
                        <h4>Penghitungan Potensi Keuntungan</h4>
                        <Table variant={"dark"}>
                            <tr>
                                <th>Harga Jual &times; Stok Buku</th>
                                <td>=</td>
                                <td>Rp. {numberWithCommas(formData.harga_jual * formData.stok_buku)}</td>
                            </tr>
                            <tr>
                                <th>Harga Cetak &times; Stok Buku</th>
                                <td>=</td>
                                <td>Rp. {numberWithCommas(formData.harga_beli * formData.stok_buku)}</td>
                            </tr>
                            <tr style={{borderTop: "2px solid white", }}>
                                <th>Potensi Keuntungan</th>
                                <td>=</td>
                                <th style={(formData.harga_jual * formData.stok_buku) - (formData.harga_beli * formData.stok_buku) >= 0 ? {color:"lightgreen"}:{color:"red"}}>Rp. {numberWithCommas((formData.harga_jual * formData.stok_buku) - (formData.harga_beli * formData.stok_buku))}</th>
                            </tr>
                        </Table>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}
 
export default FormInsertBuku;