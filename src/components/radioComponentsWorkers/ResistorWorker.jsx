import React, { useState, useEffect } from 'react'
import {
    Table, Spinner, Alert, Button,
    Modal, InputGroup, Form
} from 'react-bootstrap';
import { 
    Components as ComponentSelector, 
    showAllActiveComponent, removeComponent,
    addComponent, OmToReadeble
} from '../helpers/api/ComponentsEditorWorker';
import { PackagesWorker } from '../helpers/api/ComponentsWorker';
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
            (error)=>setMessage(<Alert dismissible onClose={clearMessage}>{error.message}</Alert>),
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
                        <th>Назва</th>
                        <th>Тип корпусу</th>
                        <th>Резистивність</th>
                        <th>Точність</th>
                        <th>Потужність</th>
                        <th>Кількість</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {resistors.map(component =>
                        <tr key={component.id}>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{component.id}</td>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{component.name}</td>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{component.packaging.name}</td>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{OmToReadeble(component.resistance)}</td>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{component.accuracy}</td>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{component.powerRating}</td>
                            <td onClick={()=>{setMessage(
                                <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                title={component.name}
                            />)}}>{component.count}</td>
                            <td>
                                <Button style={{ zIndex: '1000' }} variant='outline-danger' 
                                    onClick={ () => {if(window.confirm(`Видалити резистор: "${component.name}"?`))deleteResistor(component.id)} }
                                >Видалити елемент
                                </Button>
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
                                onClose={clearMessage}>Додано нові компоненти
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
        setLoading(true);
        
        showAllActiveComponent(ComponentSelector.resistor, localStorage.token, 
            (error)=>setMessage(<Alert dismissible onClose={clearMessage}>{error.message}</Alert>),
            (result) => {
                setResistors(result);
                setLoading(false);
            }
        ); 
    }, []);

    return <>
        { message }
        {loading ? <><p>Завантаження даних...</p><Spinner animation="border" size="sm" /></> : showTable(resistors) }
    </>
}

export function ResistorAddingModal({ onClose, onAdding }) {
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
    const [datasheet, setDatasheet] = useState(null);
    const [count, setCount] = useState(0);

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
            count: count,
            datasheet: datasheet
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
    }, [show, onClose])

    return <Modal
        show={show}
        backdrop="static"
        keyboard={false}>
        <Modal.Header >
            <Modal.Title>Додати резистор</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
            <InputGroup className="mb-3">
                <InputGroup.Text id="resistance-number">Опір</InputGroup.Text>
                <Form.Control
                    aria-label="resistance"
                    aria-describedby="resistance-number"
                    placeholder='0'
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                            setResistance(Number(e.target.value));
                        } else if (e.target.value.length === 0) {
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
                <InputGroup.Text >Точність</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Accuracy of resistor"
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                            setAccuracy(Number(e.target.value));
                        } else if (e.target.value.length === 0) {
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
                <InputGroup.Text >Розсіювальна потужність</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Power rating of resistor"
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                           setPowerRating(Number(e.target.value));
                        } else if (e.target.value.length === 0) {
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
                <InputGroup.Text >Назва</InputGroup.Text>
                <Form.Control
                    placeholder="Resistor name"
                    aria-label="Name of resistor"
                    onChange={(e) => {
                        setName(e.target.value); 
                    }}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Тип корпусу</InputGroup.Text>
                <Form.Select onChange={(e) => {setPackaging(e.target.value)}}>
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

            <InputGroup className="mb-3">
                <InputGroup.Text >Кількість</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Кількість"
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                            setCount(Number(e.target.value));
                        } else if (e.target.value.length === 0) {
                            return;
                        } else {
                            errorMessage({message: 'Кількість може бути лише в чисельній формі'});
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>Штук</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Даташит</InputGroup.Text>
                <Form.Control type="file" onChange={(event)=>{
                    if(event.target.files){
                        setDatasheet(event.target.files[0]);
                    }
                    
                }}/>
            </InputGroup>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={addResistor}>
                Додати резистор
            </Button>
            <Button variant="danger" onClick={close}>Відміна</Button>
        </Modal.Footer>
    </Modal>
}
