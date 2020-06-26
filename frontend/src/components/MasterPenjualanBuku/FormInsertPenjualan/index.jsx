import React, {Fragment, useState, useEffect} from 'react';

import { Form, Row, Col, FormGroup, FormLabel, FormControl, Table, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import constants from '../../constants';

const axios = require('axios');

const FormInsertPenjualan = (props) => {

    const [messages, setMessages] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [listBukuPraks, setListBukuPraks] = useState([]); 
    const [selectedBukuPrak, setSelectedBukuPrak] = useState({});
    const [formData, setFormData] = useState({
        buku_praktikum: -1,
        lab_penjualan: "L-204",
        jumlah_buku_terjual: "",
        jumlah_uang_diterima: ""
    });

    const resetForm = () =>{
        setFormData({
            buku_praktikum: -1,
            lab_penjualan: "L-204",
            jumlah_buku_terjual: "",
            jumlah_uang_diterima: ""
        });
    }

    const handleFormChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if(e.target.name == 'buku_praktikum'){
            // change selected
            setSelectedBukuPrak(listBukuPraks.find(b => b.id == formData.buku_praktikum));
        }
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        axios.post(`${constants.backend_url}/api/penjualans/`, {
                "id_buku": formData.buku_praktikum,
                "tanggal_penjualan_buku": `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`,
                "lab_penjualan_buku": formData.lab_penjualan,
                "jumlah_penjualan_buku": formData.jumlah_buku_terjual,
                "terima_uang_penjualan_buku": formData.jumlah_uang_diterima,
                "confirmed_uang_penjualan_buku": false
            }
        ,{
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
            console.log(error.data)
            setMessages([...messages, {
                msg: "Gagal Insert Buku !",
                variant: "danger"
            }]);
        });
    }

    const getBukuPraks = async () =>{
        axios.get(`${constants.backend_url}/api/bukus/?this_semester=true`,{
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then(async (response) =>{
            setListBukuPraks(response.data);
            setFormData({...formData, buku_praktikum: response.data[0].id});
            setSelectedBukuPrak(response.data[0]);
        })
        .catch((error) =>{

        });
    }

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useState( () => {
        getBukuPraks()
    }, []);

    return (
        <Fragment>
            {
                messages.map( m => {
                    return <Alert variant={m.variant} onClose={()=> setMessages(messages.filter(me => me != m))} dismissible>{m.msg}</Alert>
                })
            }
            <h1>Insert Penjualan</h1>
            <hr/>
            <div>
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={handleSubmitForm}>
                            <FormGroup as={Form.Row}>
                                <FormLabel column sm={4}>Buku Praktikum</FormLabel>
                                <Col>
                                    <FormControl as="select" name={"buku_praktikum"} value={formData.buku_praktikum} onClick={handleFormChange} onChange={handleFormChange}>
                                        {
                                            listBukuPraks.map( b => {
                                                return(
                                                    <option value={b.id}>{b.nama_buku} {b.jurusan_buku} [{new Date().getFullYear()}]</option>
                                                )
                                            })
                                        }
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Tanggal Jual</Form.Label>
                                <Col>
                                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} todayButton="Today" className='form-control' required/>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <FormLabel column sm={4}>Lab Penjualan</FormLabel>
                                <Col>
                                    <FormControl as="select" name={"lab_penjualan"} value={formData.lab_penjualan} onChange={handleFormChange}>
                                        <option value="L-204">L-204</option>
                                        <option value="L-304">L-304</option>
                                        <option value="L-404">L-404</option>
                                        <option value="E-401">E-401</option>
                                        <option value="Other">Other</option>
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4} >Jumlah Buku Terjual</Form.Label>
                                <Col>
                                    <Form.Control type="number" required placeholder="Jumlah Buku Terjual" min={1} name={"jumlah_buku_terjual"} value={formData.jumlah_buku_terjual} onChange={handleFormChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Form.Row}>
                                <Form.Label column sm={4}>Jumlah Uang Diterima</Form.Label>
                                <Col>
                                    <Form.Control type="number" required placeholder="Jumlah Uang Yang Diterima" min={1} name={"jumlah_uang_diterima"} value={formData.jumlah_uang_diterima} onChange={handleFormChange}/>
                                </Col>
                            </FormGroup>
                            <Button variant={'primary'} onClick={resetForm} block>Clear</Button>
                            <Button variant={'success'} type={'submit'} block>Insert</Button>
                        </Form>
                    </Col>
                    <Col sm={6}>
                        <h4>Hitungan Sementara Buku {selectedBukuPrak.nama_buku ? selectedBukuPrak.nama_buku : ""}</h4>
                        <Table responsive variant={'dark'} striped>
                            <tr>
                                <th>Harga Buku</th>
                                <td>:</td>
                                <th>{selectedBukuPrak.harga_jual_buku ? `Rp. ${numberWithCommas(selectedBukuPrak.harga_jual_buku)}` : ""}</th>
                            </tr>
                            <tr>
                                <th>Jumlah Terjual</th>
                                <td>:</td>
                                <th>{formData.jumlah_buku_terjual*1}</th>
                            </tr>
                        </Table>
                        <Table responsive variant={'dark'} striped>
                            <tr>
                                <th>Harga Buku &times; Jumlah Terjual</th>
                                <td>:</td>
                                <th>{selectedBukuPrak.harga_jual_buku ? `Rp. ${numberWithCommas(selectedBukuPrak.harga_jual_buku * formData.jumlah_buku_terjual)}` : ""}</th>
                            </tr>
                            <tr>
                                <th>Jumlah Uang Diterima</th>
                                <td>:</td>
                                <th>{`Rp. ${numberWithCommas(formData.jumlah_uang_diterima*1)}`}</th>
                            </tr>
                            <tr style={{borderTop: "2px solid white"}}>
                                <th className="text-right">Total</th>
                                <td>:</td>
                                <th style={formData.jumlah_uang_diterima - (selectedBukuPrak.harga_jual_buku * formData.jumlah_buku_terjual) >= 0 ? {color: "lightgreen"}:{color:"red"}}>{`Rp. ${numberWithCommas(formData.jumlah_uang_diterima - (selectedBukuPrak.harga_jual_buku * formData.jumlah_buku_terjual))}`}</th>
                            </tr>
                        </Table>
                        <p><i>*Note: Sebelum melakukan insert mohon check kembali apakah data yang dimasukkan sudah benar</i></p>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}
 
export default FormInsertPenjualan;