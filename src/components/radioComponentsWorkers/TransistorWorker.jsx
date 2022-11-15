import React, { useState, useEffect } from 'react'
import {
    Table, Spinner, Alert, Button,
    Modal, InputGroup, Form
} from 'react-bootstrap';
import { 
    Components as ComponentSelector, 
    showAllActiveComponent, removeComponent,
    addComponent, getComponentInfo,
} from '../helpers/api/ComponentsEditorWorker';
import { TransistorTypeWorker, PackagesWorker } from '../helpers/api/ComponentsWorker';
import ComponentViewer from './ComponentViewer';

export function TransistorWorker() {
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
        
        showAllActiveComponent(ComponentSelector.transistor, localStorage.token, 
            errorMessage,
            (result) => {
                setComponents(result);
                setLoading(false);
            }
        );
    }

    const deleteTransistor = (id) => {
        var isRemoved = removeComponent(ComponentSelector.transistor, id,
            localStorage.token, errorMessage, (result) => {
                setMessage(
                    <Alert dismissible onClose={clearMessage}>
                        {`Стабілізатор ${id} було видалено`}
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
                        <th>Тип транзистору</th>
                        <th>Тип корпусу</th>
                        <th>Кількість</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {components.map(component =>
                        <tr key={component.id} 
                            onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage}
                                title={component.name}
                        />)}}>
                            <td>{component.id}</td>
                            <td>{component.name}</td>
                            <td>{component.transistorType.name} </td>
                            <td>{component.packaging.name}</td>
                            <td>{component.count}</td>
                            <td>
                            <Button style={{ zIndex: '1000' }} variant='outline-danger' 
                                    onClick={ () => {if(window.confirm(`Видалити транзистор: "${component.name}"?`))deleteTransistor(component.id)} }
                                >Видалити компонент</Button>
                            </td>
                        </tr>)}
                </tbody>
            </Table>
            <Button 
                variant="outline-success" 
                className='w-100' 
                onClick={() => setMessage(
                    <StabilizerAddingModal 
                        onClose={clearMessage} 
                        onAdding={(isOk)=>{setMessage(
                            <Alert dismissible variant='success'
                                onClose={clearMessage}>Транзистор успішно додано
                            </Alert>);
                            populateData();
                        }}/>
                    )}
            >
                Додати транзистор
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

function StabilizerAddingModal({ onClose, onAdding }) {
    const [show, setShow] = useState(true);
    const [message, setMessage] = useState(null);

    const [name, setName] = useState(null);
    const [transistorTypeId, setTransistorTypeId] = useState(1);
    const [packagingId, setPackaging] = useState(1);
    const [description, setDescriprion] = useState(null);
    const [notice, setNotice] = useState(null);

    const close = () => setShow(false);
    const errorMessage = (error) => {
        setMessage(
            <Alert variant='danger' dismissible onClose={()=>{setMessage(null)}}>
                {error?.message ?? "Невідома помилка" }
            </Alert>
        )
    }

    const addTransistor = () =>{
        
        if(name === null){
            errorMessage({message: 'Назва транзистора обов\'язкова' });
            return;
        }

        if(transistorTypeId == null || isNaN(transistorTypeId)){
            errorMessage({ message: "Необхідно вказати тип транзистору"});
            return;
        }
        
        var transistor = {
            name: name,
            transistorTypeId: transistorTypeId,
            packagingId: packagingId,
            description: description,
            notice: notice,
        }
        
        addComponent(ComponentSelector.transistor, transistor, localStorage.token, errorMessage, (result)=>{
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
            <Modal.Title>Додати транзистор</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
            <InputGroup className="mb-3">
                <InputGroup.Text >Назва транзистора</InputGroup.Text>
                <Form.Control
                    placeholder="Назва транзистора"
                    onChange={(e) => {
                        setName(e.target.value); 
                    }}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Тип транзистора</InputGroup.Text>
                <Form.Select
                    placeholder="Тип транзистора"
                    onChange={(e) => {
                        setTransistorTypeId(e.target.value); 
                    }}
                >
                    {TransistorTypeWorker.getTransistorTypes().map((type) => 
                        <option key={type.id} value={type.id}>{type.name}</option>
                    )}
                </Form.Select>
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
            <Button variant="success" onClick={addTransistor}>
                Додати транзистор
            </Button>
            <Button variant="danger" onClick={close}>Відміна</Button>
        </Modal.Footer>
    </Modal>
}
