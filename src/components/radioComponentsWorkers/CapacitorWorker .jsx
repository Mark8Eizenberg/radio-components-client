﻿import { isNumeric } from 'jquery';
import React, { useState, useEffect } from 'react'
import {
    Table, Spinner, Alert, Button,
    Modal, InputGroup, Form
} from 'react-bootstrap';
import { 
    Components as ComponentSelector, 
    showAllActiveComponent, removeComponent,
    addComponent, microFaradToReadeble, getComponentInfo,
} from '../helpers/api/ComponentsEditorWorker';
import { PackagesWorker } from '../helpers/api/ComponentsWorker';
import ComponentViewer from './ComponentViewer';

export function EditorCapacitor() {
    const [loading, setLoading] = useState(true);
    const [components, setComponents] = useState(null);
    const [message, setMessage] = useState(null);

    const clearMessage = () => setMessage(null);
    const errorMessage = (error) => {
        setMessage(
            <Alert dismissible onClose={clearMessage}> 
                {error.message}
            </Alert>);
    }
    const populateData = () => {
        setLoading(true);
        
        showAllActiveComponent(ComponentSelector.capacitor, localStorage.token, 
            errorMessage,
            (result) => {
                setComponents(result);
                setLoading(false);
            }
        );
    }

    const deleteCapacitor = (id) => {
        var isRemoved = removeComponent(ComponentSelector.capacitor, id,
            localStorage.token, errorMessage, (result) => {
                setMessage(
                    <Alert dismissible onClose={clearMessage}>
                        {`Конденсатор ${id} було видалено`}
                    </Alert>);
                    populateData();
            }    
        )
        if(!isRemoved){
            errorMessage({message: "Помилка видалення компоненту"});
        }
    }

    const showTable = () => {
        if (components == null) return;
        return <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Назва</th>
                        <th>Тип корпусу</th>
                        <th>Ємність</th>
                        <th>Точність</th>
                        <th>Кількість</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {components.map(capacitor =>
                        <tr key={capacitor.id} 
                            onClick={()=>{setMessage(
                                <ComponentViewer id={capacitor.id} onClose={clearMessage}
                                title={capacitor.name}
                        />)}}>
                            <td>{capacitor.id}</td>
                            <td>{capacitor.name}</td>
                            <td>{capacitor.packaging.name}</td>
                            <td>{microFaradToReadeble(capacitor.capacity)}</td>
                            <td>{capacitor.accuracy}</td>
                            <td>{capacitor.count}</td>
                            <td>
                                <Button style={{ zIndex: '1000' }} variant='outline-danger' 
                                    onClick={ () => {if(window.confirm(`Видалити конденсатор: "${capacitor.name}"?`))deleteCapacitor(capacitor.id)} 
                                }>Видалити компонент</Button>
                            </td>
                        </tr>)}
                </tbody>
            </Table>
            <Button 
                variant="outline-success" 
                className='w-100' 
                onClick={() => setMessage(
                    <CapacitorAddingModal 
                        onClose={clearMessage} 
                        onAdding={(isOk)=>{setMessage(
                            <Alert dismissible variant='success'
                                onClose={clearMessage}>Додати компонент
                            </Alert>);
                            populateData();
                        }}/>
                    )}
            >
                Додати конденсатор
            </Button>
        </>
    }

    useEffect(() => {
        populateData(); 
    }, []);


    return <>
        { message }
        {loading ? <><p>Триває завантаження...</p><Spinner animation="border" size="sm" /></> : showTable() }
    </>
}

function CapacitorAddingModal({ onClose, onAdding }) {
    const [show, setShow] = useState(true);
    const [message, setMessage] = useState(null);

    const [capacity, setCapacity] = useState(null);
    const [accuracy, setAccuracy] = useState(0);
    const [name, setName] = useState(null);
    const [packagingId, setPackaging] = useState(1);
    const [description, setDescriprion] = useState(null);
    const [notice, setNotice] = useState(null);
    const [multiplicator, setMultiplicator] = useState(1);

    const close = () => setShow(false);
    const errorMessage = (error) => {
        setMessage(
            <Alert variant='danger' dismissible onClose={()=>{setMessage(null)}}>
                {error?.message ?? "Невідома помилка" }
            </Alert>
        )
    }

    const addCapacitor = () =>{
        var capacitor = {
            capacity: capacity * multiplicator,
            accuracy: accuracy,
            name: name,
            packagingId: packagingId,
            description: description,
            notice: notice,
        }

        if(capacity == null){
            errorMessage({message: 'Необхідно ввести ємність при додаванні нового конденсатору' });
            return;
        }
        if(name == null){
            errorMessage({message: 'Назва конденсатору обов\'язкова' });
            return;
        }

        addComponent(ComponentSelector.capacitor, capacitor, localStorage.token, errorMessage, (result)=>{
            setShow(false);
            onAdding(true);
        });
        
    }

    useEffect(() =>{
        !show && onClose();
    }, [show])


    return <Modal
        show={show}
        backdrop="static"
        keyboard={false}>
        <Modal.Header >
            <Modal.Title>Додати конденсатор</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
            <InputGroup className="mb-3">
                <InputGroup.Text >Ємність</InputGroup.Text>
                <Form.Control
                    aria-label="capacity"
                    placeholder='0'
                    onChange={(e) => {
                        if (isNumeric(e.target.value)) {
                            setCapacity(Number(e.target.value));
                        } else if (e.target.value.length == 0) {
                            return;
                        } else {
                            errorMessage({message: 'Ємність може бути лише в чисельній формі'})
                            e.target.value = 0;
                        }
                    }}
                />
                <Form.Select aria-label="" onChange={(e) => {
                    setMultiplicator(Number(e.target.value));
                }} defaultValue='1'>
                    <option value='1000000'>F</option>
                    <option value='1000'>mF</option>
                    <option value='1'>µF</option>
                    <option value='0.001'>nF</option>
                    <option value='0.000001'>pF</option>
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Точність конденсатору</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Точність конденсатору"
                    onChange={(e) => {
                        if (isNumeric(e.target.value)) {
                            setAccuracy(Number(e.target.value));
                        } else if (e.target.value.length == 0) {
                            return;
                        } else {
                            errorMessage({message: 'Точність може бути лише в чисельній формі'});
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Назва конденсатору</InputGroup.Text>
                <Form.Control
                    placeholder="Назва конденсатору"
                    onChange={(e) => {
                        setName(e.target.value); 
                    }}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Тип корпусу</InputGroup.Text>
                <Form.Select onChange={(e) => {
                    setPackaging(Number(e.target.value))
                }}>
                    {PackagesWorker.getPackages().map((item, index)=>{
                        return <option key={index} value={item.id}>{item.name}</option>
                    })}
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text>Опис</InputGroup.Text>
                <Form.Control as='textarea' onChange={(e) => {
                    setDescriprion(e.target.value);
                }}/>
            </InputGroup>

            <InputGroup className='mb-3'>
                <InputGroup.Text>Примітки</InputGroup.Text>
                <Form.Control as='textarea' onChange={(e) => {
                    setNotice(e.target.value);
                }}/>
            </InputGroup>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={addCapacitor}>
                Додати конденсатор
            </Button>
            <Button variant="danger" onClick={close}>Відміна</Button>
        </Modal.Footer>
    </Modal>
}
