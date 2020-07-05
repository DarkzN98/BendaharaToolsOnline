import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Form, Row, Col, FormGroup, FormLabel, FormControl, Table, Button, Alert, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import constants from '../../constants';

const axios = require('axios');

const FormInsertPeminjaman = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [formData, setFormData] = useState({
        nama_peminjam: "",
        tanggal_pinjam: new Date(),
        barangs: []
    });

    const [bulkEditData, setBulkEditData] = useState({
        nama_item: "",
        selected_item: "A",
        selected_number: "0",
        ranges: ""
    });

    const resetForm = () =>{
        setFormData({
            nama_peminjam: "",
            tanggal_pinjam: new Date(),
            barangs: []
        });
    }

    const [itemFormData, setItemFormData] = useState({
        nama_barang: "",
        id_stiker: ""
    });
    
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleItemFormChange = (e) =>{
        setItemFormData({
            ...itemFormData,
            [e.target.name]: e.target.name === 'id_stiker' ? e.target.value.toUpperCase().substr(0,4) : e.target.value
        });
    }

    const handleAddItem = () =>{
        // pindahkan dari itemForm ke FormData
        setFormData({
            ...formData,
            barangs: [...formData.barangs, itemFormData]
        });
        setItemFormData({
            nama_barang: "",
            id_stiker: ""
        });
    }

    const handleDeleteItem = (index) =>{
        setFormData({
            ...formData,
            barangs: formData.barangs.filter((a,b) => b != index)
        });
    }

    const handleBulkAdd = () =>{
        // handle bulk add...
        if (bulkEditData.ranges == '' || bulkEditData.nama_item == '') return;
        let ranges = bulkEditData.ranges.trim().split(' ').join('').split(',');
        let peritems = ranges.filter(r => !r.includes('-'));
        let perrange = ranges.filter(r => r.includes('-'));
        let bulkBarangs = peritems.map( r => {
            return {
                nama_barang: bulkEditData.nama_item,
                id_stiker: `${bulkEditData.selected_item}${bulkEditData.selected_number}${r.padStart(2,'0')}`
            } 
        });
        let bulkBarangsRange = perrange.map( r => {
            let startend = r.split('-');
            startend.sort((a,b)=> a-b);
            let genrange = Array(startend[1] - startend[0] + 1).fill().map((_, idx) => (parseInt(startend[0]) + parseInt(idx)).toString())
            return genrange.map( g => {
                return {
                    nama_barang: bulkEditData.nama_item,
                    id_stiker: `${bulkEditData.selected_item}${bulkEditData.selected_number}${g.padStart(2,'0')}`
                }
            })         
        });
        bulkBarangsRange.forEach(e => {
            bulkBarangs = [...bulkBarangs, ...e]
        });
        setFormData({
            ...formData,
            barangs: [...formData.barangs, ...bulkBarangs].sort((a,b) => a.id_stiker < b.id_stiker ? -1 : 1 )
        });
        setBulkEditData({
            nama_item: "",
            selected_item: "A",
            selected_number: "0",
            ranges: ""
        });
    }

    const handleBulkAddChange = (e) =>{
        setBulkEditData({
            ...bulkEditData,
            [e.target.name]: e.target.value
        });
    }

    const handleInsertPeminjaman = (e) =>{
        e.preventDefault();
        if(formData.barangs.length <= 0) return;
        setFormData({...formData, tanggal_pinjam: `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`});
        axios.post(`${constants.backend_url}/api/peminjamans/`, formData, {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) => {
            if(response.status == 201) {resetForm(); return props.callback};
        })
        .catch( (error) =>{
            console.log(error.response);
        });
    }

    return ( 
        <Fragment>
            <h3>Form Insert Peminjaman</h3>
            <hr/>
            <Row>
                <Col sm={6}>
                    <Form onSubmit={handleInsertPeminjaman}>
                        <FormGroup as={Form.Row}>
                            <FormLabel column sm={4}>Nama Peminjam</FormLabel>
                            <Col>
                                <FormControl type="text" placeholder="Nama Peminjam" value={formData.nama_peminjam} onChange={handleFormChange} name={"nama_peminjam"} required></FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup as={Form.Row}>
                            <Form.Label column sm={4}>Tanggal Pinjam</Form.Label>
                            <Col>
                                <DatePicker selected={startDate} onChange={date => setStartDate(date)} todayButton="Today" className='form-control' required/>
                            </Col>
                        </FormGroup>
                        <Button block variant={"primary"} onClick={resetForm}>Clear</Button>
                        <Button block variant={"success"} type="submit"> Insert</Button>
                    </Form>
                </Col>
                <Col sm={6}>
                    <h4>List Barang Yang Dipinjam</h4>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama Barang</th>
                                <th>Stiker Barang</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                formData.barangs.map( (b, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{b.nama_barang}</td>
                                            <td>{b.id_stiker}</td>
                                            <td><Button variant="danger" onClick={(e) => handleDeleteItem(index)}>Delete</Button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <h6>Add Item: </h6>
                    <FormGroup as={Form.Row}>
                        <Col sm={3}>
                            <Form.Control type="text" placeholder="Nama Barang" name='nama_barang' onChange={handleItemFormChange} value={itemFormData.nama_barang}></Form.Control>
                        </Col>
                        <Col sm={3}>
                            <Form.Control type="text" placeholder="Stiker" name='id_stiker' onChange={handleItemFormChange} value={itemFormData.id_stiker}></Form.Control>
                        </Col>
                        <Col sm={3}>
                            <Button variant="primary" block onClick={handleAddItem}>Add Item</Button>
                        </Col>
                        <Col sm={3}>
                            <Button variant="primary" block onClick={e => setShowModal(true)}>Bulk Add</Button>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            
            <Modal centered show={showModal} onHide={e =>setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Bulk Add Item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <FormLabel>Nama Item:</FormLabel>
                        <FormControl type={'text'} value={bulkEditData.nama_item} onChange={handleBulkAddChange} name={"nama_item"}></FormControl>
                    </FormGroup>
                    <FormGroup as={Form.Row}>
                        <FormLabel column sm={12}>Stiker Item:</FormLabel>
                        <Col sm={2}>
                            <FormControl as={'select'} value={bulkEditData.selected_item} name={"selected_item"} onChange={handleBulkAddChange}>
                                {
                                    'abcdefghijklkmnopqrstuvwxyz'.split('').map(a => <option value={a.toUpperCase()}>{a.toUpperCase()}</option>)
                                }
                            </FormControl>
                        </Col>
                        <Col sm={2}>
                            <FormControl as={'select'} value={bulkEditData.selected_number} name={"selected_number"} onChange={handleBulkAddChange}>
                                {
                                    '0123456789'.split('').map(a => <option value={a.toUpperCase()}>{a.toUpperCase()}</option>)
                                }
                            </FormControl>
                        </Col>
                        <Col>
                            <FormControl type={'text'} value={bulkEditData.ranges} onChange={handleBulkAddChange} name={"ranges"}></FormControl>
                            <Form.Text id="id_stiker_help" muted>
                                Ketik angka dan/atau range angka stiker yang dipisahkan dengan koma. Eg. 1,3,5-12 
                            </Form.Text>
                        </Col>
                        
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={(e) => {setShowModal(false); handleBulkAdd()}}>Bulk Add</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}
 
export default FormInsertPeminjaman;