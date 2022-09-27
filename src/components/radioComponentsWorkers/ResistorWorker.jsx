import { isNumeric } from 'jquery';
import React, { useState, useEffect } from 'react'
import {
    Table, Spinner, Alert, Button,
    Modal, InputGroup, Form
} from 'react-bootstrap';
import { 
    Components as ComponentSelector, 
    showAllActiveComponent, removeComponent,
    addComponent, OmToReadeble, getComponentInfo
} from '../helpers/api/ComponentsEditorWorker';
import ComponentViewer from './ComponentViewer';

export function EditorResistor() {
    const [loading, setLoading] = useState(true);
    const [resistors, setResistors] = useState(null);
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
        
        showAllActiveComponent(ComponentSelector.resistor, localStorage.token, 
            errorMessage,
            (result) => {
                setResistors(result);
                setLoading(false);
            }
        );
    }

    const deleteResistor = (id) => {
        var isRemoved = removeComponent(ComponentSelector.resistor, id,
            localStorage.token, errorMessage, (result) => {
                setMessage(
                    <Alert dismissible onClose={clearMessage}>
                        {`Resistor with id ${id} was deleted`}
                    </Alert>);
                    populateData();
            }    
        )
        if(!isRemoved){
            errorMessage({message: "Error when deleting resistor"});
        }
    }

    const showTable = (resistors) => {
        if (resistors == null) return;
        return <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Packaging</th>
                        <th>R</th>
                        <th>Acc</th>
                        <th>Whatts</th>
                        <th>Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {resistors.map(resistor =>
                        <tr key={resistor.id} 
                            onClick={()=>{setMessage(
                                <ComponentViewer id={resistor.id} onClose={clearMessage}
                                title={resistor.name}
                        />)}}>
                            <td>{resistor.id}</td>
                            <td>{resistor.name}</td>
                            <td>{resistor.packagingId}</td>
                            <td>{OmToReadeble(resistor.resistance)}</td>
                            <td>{resistor.accuracy}</td>
                            <td>{resistor.powerRating}</td>
                            <td>{resistor.count}</td>
                            <td>
                                <Button style={{ zIndex: '1000' }} variant='outline-danger' onClick={ () => deleteResistor(resistor.id) }>Delete element</Button>
                            </td>
                        </tr>)}
                </tbody>
            </Table>
            <Button 
                variant="outline-success" 
                className='w-100' 
                onClick={() => setMessage(
                    <ResistorAddingModal 
                        onClose={clearMessage} 
                        onAdding={(isOk)=>{setMessage(
                            <Alert dismissible variant='success'
                                onClose={clearMessage}>Component addings
                            </Alert>);
                            populateData();
                        }}/>
                    )}
            >
                Add resistor
            </Button>
        </>
    }

    useEffect(() => {
        populateData(); 
    }, []);


    return <>
        { message }
        {loading ? <><p>Loading</p><Spinner animation="border" size="sm" /></> : showTable(resistors) }
    </>
}

function ResistorAddingModal({ onClose, onAdding }) {
    const [show, setShow] = useState(true);
    const [message, setMessage] = useState(null);

    const [resistance, setResistance] = useState(null);
    const [accuracy, setAccuracy] = useState(0);
    const [powerRating, setPowerRating] = useState(0);
    const [name, setName] = useState(null);
    const [packagingId, setPackaging] = useState(1);
    const [description, setDescriprion] = useState(null);
    const [notice, setNotice] = useState(null);
    const [multiplicator, setMultiplicator] = useState(1);

    const close = () => setShow(false);
    const errorMessage = (error) => {
        setMessage(
            <Alert variant='danger' dismissible onClose={()=>{setMessage(null)}}>
                {error?.message ?? "Unknown error" }
            </Alert>
        )
    }

    const addResistor = () =>{
        var resistor = {
            resistance: resistance * multiplicator,
            accuracy: accuracy,
            powerRating: powerRating,
            name: name,
            packagingId: packagingId,
            description: description,
            notice: notice,
        }

        if(resistance == null){
            errorMessage({message: 'Resistance is required' });
            return;
        }
        if(name == null){
            errorMessage({message: 'Name is required' });
            return;
        }

        addComponent(ComponentSelector.resistor, resistor, localStorage.token, errorMessage, (result)=>{
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
            <Modal.Title>Add resistor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
            <InputGroup className="mb-3">
                <InputGroup.Text id="resistance-number">Resistance</InputGroup.Text>
                <Form.Control
                    aria-label="resistance"
                    aria-describedby="resistance-number"
                    placeholder='0'
                    onChange={(e) => {
                        if (isNumeric(e.target.value)) {
                            setResistance(Number(e.target.value));
                        } else if (e.target.value.length == 0) {
                            return;
                        } else {
                            errorMessage({message: 'Resistance is a number'})
                            e.target.value = 0;
                        }
                    }}
                />
                <Form.Select aria-label="" onChange={(e) => {
                    setMultiplicator(Number(e.target.value));
                }}>
                    <option value='1'>Om</option>
                    <option value='1000'>kOm</option>
                    <option value='1000000'>MOm</option>
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Accurancy</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Accuracy of resistor"
                    onChange={(e) => {
                        if (isNumeric(e.target.value)) {
                            setAccuracy(Number(e.target.value));
                        } else if (e.target.value.length == 0) {
                            return;
                        } else {
                            errorMessage({message: 'Accuracy is a number'});
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Power rating</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Power rating of resistor"
                    onChange={(e) => {
                        if (isNumeric(e.target.value)) {
                           setPowerRating(Number(e.target.value));
                        } else if (e.target.value.length == 0) {
                            return;
                        } else {
                            errorMessage({message: 'Power ratingis a number' });
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>Watt</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Resistor name</InputGroup.Text>
                <Form.Control
                    placeholder="Resistor name"
                    aria-label="Name of resistor"
                    onChange={(e) => {
                        setName(e.target.value); 
                    }}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Packaging</InputGroup.Text>
                <Form.Select>
                    <option value='1'>This feature will be create</option>
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text>Description</InputGroup.Text>
                <Form.Control as='textarea' onChange={(e) => {
                    setDescriprion(e.target.value);
                }}/>
            </InputGroup>

            <InputGroup className='mb-3'>
                <InputGroup.Text>Notice</InputGroup.Text>
                <Form.Control as='textarea' onChange={(e) => {
                    setNotice(e.target.value);
                }}/>
            </InputGroup>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={addResistor}>
                Add resistor
            </Button>
            <Button variant="danger" onClick={close}>Cancel</Button>
        </Modal.Footer>
    </Modal>
}
