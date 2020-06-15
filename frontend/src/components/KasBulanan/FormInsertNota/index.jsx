import React, {Fragment, useState, useEffect} from 'react';
import { Form, FormGroup, Col, Button, Table, Alert, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const axios = require('axios');
const constants = require('./../../constants');

const FormInsertNota = (props) => {

    const [statusToko1, setStatusToko1] = useState(true);
    const [alertShow, setAlertShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [alertVariant, setAlertVariant] = useState("danger");
    const [errorMsg, setErrorMsg] = useState([]);
    const [item, setItem] = useState({nama_item: "", harga_item: "", qty_item: ""});
    const [inputToko, setInputToko] = useState("");
    const [indexToko, setIndexToko] = useState(-1);

    const [startDate, setStartDate] = useState(new Date());
    const [tokos, setTokos] = useState([{
        nama_toko: ""
    }]);
    const [listItem, setListItem] = useState([]);

    const history = useHistory();

    const getAllTokos = async ()=>{
        setIndexToko(-1);
        setTokos([]);
        await axios.get(`${constants.backend_url}/api/tokos/`,{
            headers:{
                'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
            }
        })
        .then( (response) =>{
            setTokos(response.data);
            setIndexToko(response.data.length <= 0 ? -1 : response.data[0].id);
        })
        .catch( (error) =>{
            if(!error.response){
                setErrorMsg({
                    header: "Network Error!",
                    message: "Network error! Check internet / Backend Online!"
                });
            }else if (error.response.status == 401){
                setErrorMsg({
                    header: "Not Authorized Error!",
                    message: "Please logout then re-login"
                });
            }
            setAlertVariant("danger");
            setAlertShow(true);
        });
    }

    useEffect(()=>{
        getAllTokos();
    },[]);

    const handleRadioTokoChanged = (e) =>{
        if(e.target.id === 'rtoko1'){
            return setStatusToko1(true);
        }
        setStatusToko1(false);
    }

    const resetForm = () =>{
        setStatusToko1(true);
        setStartDate(new Date());
        setListItem([]);
        setItem({nama_item: "", harga_item: "", qty_item: ""});
        setInputToko("");
        getAllTokos();
    }

    const handleSubmit = async () =>{
        try {
            let hasil = await axios.post(`${constants.backend_url}/api/notas/`, {
                toko: statusToko1 ? tokos.find(t=> t.id == indexToko).nama_toko : inputToko,
                tanggal_beli: `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`,
                items: listItem
            },{
                headers:{
                    'Authorization': `Token ${window.localStorage.getItem('bendaharausertoken')}`
                }
            })
            resetForm();
            setAlertVariant("success");
            setErrorMsg({
                header: "Sukses Insert!",
                message: "Data nota berhasil disimpan dalam database!"
            });
            props.callback();
        } catch (error) {
            if(!error.response){
                setErrorMsg({
                    header: "Network Error!",
                    message: "Network error! Check internet / Backend Online!"
                });
            }else if (error.response.status == 401){
                setErrorMsg({
                    header: "Not Authorized Error!",
                    message: "Please logout then re-login"
                });
            } if(!error.response){
                setErrorMsg({
                    header: "Network Error!",
                    message: "Network error! Check internet / Backend Online!"
                });
            }else if (error.response.status == 400){
                setErrorMsg({
                    header: "Bad Request Error!",
                    message: "Please check input"
                });
            }
            setAlertVariant("danger");
            setAlertShow(true);
        }
    }

    const handleButtonInsertNota = (e) =>{
        let errors = {
            input_error: []
        };
        if(!statusToko1 && inputToko == ''){
            errors.input_error.push("Nama Toko Kosong!")   
        }
        if(listItem.length<=0){
            errors.input_error.push("List Item Kosong!")
        }

        if(errors.input_error.length > 0)
        {
            setErrorMsg({
                header: "Input Error!",
                message: errors.input_error.map(err => `${err} `)
            });
            setAlertVariant("danger");
            setAlertShow(true);
        } 
        else
        {
            setModalShow(true);
        }
    }

    const handleChangeIndexToko = (e) =>{
        setIndexToko(e.target.value);
    }

    const handleChangeInputToko = (e) =>{
        setInputToko(e.target.value);
    }

    const handleAddItem = () =>{
        if(item.harga_item && item.nama_item && item.qty_item)
        {
            setListItem([...listItem, item]);
            setItem({nama_item: "", harga_item: "", qty_item: ""});
        }
        else
        {
            let errors = {input_error: []};
            if(item.nama_item == ""){
                errors.input_error.push("Nama Item Kosong!");
            }
            if(item.harga_item == ""){
                errors.input_error.push("Harga Item Kosong!");
            }
            if(item.qty_item == ""){
                errors.input_error.push("Quantity Item Kosong!");
            }
            setErrorMsg({
                header: "Input Error!",
                message: errors.input_error.map(err => `${err} `)
            });
            setAlertVariant("danger");
            setAlertShow(true);
        }
    }

    const handleDeleteItem = (indexremove) =>{
        setListItem(listItem.filter((i,index) => index!=indexremove));
    }

    const handleFormChange = (e) =>{
        setItem({
            ...item,
            [e.target.name]: e.target.value
        });
    }

    return (
        <Fragment>
            <h2>Insert Nota</h2>
            <hr/>
            <Alert variant={alertVariant} dismissible show={alertShow} onClose={()=>{setAlertShow(false)}}>
                <Alert.Heading>{errorMsg.header}</Alert.Heading>
                <p>{errorMsg.message}</p>
            </Alert>
            <Form>
                <FormGroup as={Form.Row}>
                    <Form.Label column sm={2}>Toko</Form.Label>
                    <Col sm={3}>
                        <Form.Row>
                            <Col>
                                <Form.Check custom inline label="" type={'radio'} id={'rtoko1'} name={'rtoko'} onChange={handleRadioTokoChanged} checked={statusToko1}/>
                            </Col>
                            <Col sm={10}>
                                <Form.Control as="select" disabled={!statusToko1} value={indexToko} onChange={handleChangeIndexToko}>
                                    {
                                        tokos.map( t => <option value={t.id}>{t.nama_toko}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Check custom inline label="" type={'radio'} id={'rtoko2'} name={'rtoko'} onChange={handleRadioTokoChanged} checked={!statusToko1}/>
                            </Col>
                            <Col sm={10}>
                                <Form.Control type="text" placeholder="Nama Toko Baru..." disabled={statusToko1} value={inputToko} onChange={handleChangeInputToko}/>
                            </Col>
                        </Form.Row>
                    </Col>
                </FormGroup>
                <FormGroup as={Form.Row}>
                    <Form.Label column sm={2}>Tanggal Beli</Form.Label>
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} todayButton="Today" className='form-control'/>
                </FormGroup>
                <FormGroup as={Form.Row}>
                    <Form.Label column sm={2}>List Item</Form.Label>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>Nama</td>
                                <td>Harga</td>
                                <td>Qty</td>
                                <td>Subtotal</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listItem.map( (i, index) => {
                                    return(
                                        <tr key={`row-${index}`}>
                                            <td>{index+1}</td>
                                            <td>{i.nama_item}</td>
                                            <td>{i.harga_item}</td>
                                            <td>{i.qty_item}</td>
                                            <td>{i.harga_item * i.qty_item}</td>
                                            <td><Button variant='danger' onClick={(e) => handleDeleteItem(index)}>Delete</Button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </FormGroup>
                <FormGroup as={Form.Row}>
                    <Form.Label column sm={2}>Add Item</Form.Label>
                    <Col sm={2}>
                        <Form.Control type="text" placeholder="Nama Barang" name='nama_item' onChange={handleFormChange} value={item.nama_item}></Form.Control>
                    </Col>
                    <Col sm={2}>
                        <Form.Control type="number" placeholder="Harga Barang" name='harga_item' onChange={handleFormChange} value={item.harga_item} min={1}></Form.Control>
                    </Col>
                    <Col sm={2}>
                        <Form.Control type="number" placeholder="Qty Barang" name='qty_item' onChange={handleFormChange} value={item.qty_item} min={1}></Form.Control>
                    </Col>
                    <Button variant="primary" onClick={handleAddItem}>Add Item</Button>
                </FormGroup>
                <Button block variant={'primary'} onClick={resetForm}>Clear Form</Button>
                <Button block variant={'success'} onClick={handleButtonInsertNota}>Insert Nota</Button>
            </Form>

            <Modal centered show={modalShow} onHide={e =>setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Konfirmasi Insert Nota
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Informasi Toko dan Tanggal</h4>
                    <p>Toko: <strong>{statusToko1 ? indexToko == -1 ? "" : tokos.find(t=> t.id == indexToko).nama_toko : `${inputToko} (Baru)`}</strong></p>
                    <p>Tanggal: <strong>{startDate.toLocaleDateString()} ({startDate.toDateString()})</strong></p>
                    <h4>List Item</h4>
                    <Table striped hover variant="dark">
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>Nama</td>
                                <td>Harga</td>
                                <td>Qty</td>
                                <td>Subtotal</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listItem.map( (i, index) => {
                                    return(
                                        <tr key={`row-${index}`}>
                                            <td>{index+1}</td>
                                            <td>{i.nama_item}</td>
                                            <td>{i.harga_item}</td>
                                            <td>{i.qty_item}</td>
                                            <td>{i.harga_item * i.qty_item}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <strong>Total Belanja: {listItem.map(i => i.harga_item * i.qty_item).reduce((a,b) => {return a+b}, 0)}</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={(e) => {setModalShow(false); handleSubmit()}}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}
 
export default FormInsertNota;