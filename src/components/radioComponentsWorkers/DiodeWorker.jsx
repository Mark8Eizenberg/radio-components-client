import React, { useState, useEffect } from 'react'
import {
    Table, Spinner, Alert, Button,
    Modal, InputGroup, Form
} from 'react-bootstrap';
import {
    Components as ComponentSelector,
    showAllActiveComponent, removeComponent,
    addComponent
} from '../helpers/api/ComponentsEditorWorker';
import { PackagesWorker } from '../helpers/api/ComponentsWorker';
import ComponentViewer from './ComponentViewer';

export function DiodeWorker() {
    const [loading, setLoading] = useState(true);
    const [components, setComponents] = useState(null);
    const [message, setMessage] = useState(null);

    const clearMessage = () => setMessage(null);
    const errorMessage = (error) => setMessage(<Alert dismissible onClose={clearMessage}>{error.message}</Alert>);

    const populateData = () => {
        setLoading(true);

        showAllActiveComponent(ComponentSelector.diode, localStorage.token,
            (error) => setMessage(<Alert dismissible onClose={clearMessage}>{error.message}</Alert>),
            (result) => {
                setComponents(result);
                setLoading(false);
            }
        );
    }

    const deleteDiode = (id) => {
        var isRemoved = removeComponent(ComponentSelector.diode, id,
            localStorage.token, errorMessage, (result) => {
                setMessage(
                    <Alert dismissible onClose={clearMessage}>
                        {`Діод № ${id} було видалено`}
                    </Alert>);
                populateData();
            }
        )
        if (!isRemoved) {
            errorMessage({ message: "Помилка видалення компоненту" });
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
                        <th>Кількість</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {components.map(component =>
                        <tr key={component.id}>
                            <td onClick={() => {
                                setMessage(
                                    <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                        title={component.name}
                                    />)
                            }}>{component.id}</td>
                            <td onClick={() => {
                                setMessage(
                                    <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                        title={component.name}
                                    />)
                            }}>{component.name}</td>
                            <td onClick={() => {
                                setMessage(
                                    <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                        title={component.name}
                                    />)
                            }}>{component.packaging.name}</td>
                            <td onClick={() => {
                                setMessage(
                                    <ComponentViewer id={component.id} onClose={clearMessage} onUpdateCallback={populateData}
                                        title={component.name}
                                    />)
                            }}>{component.count}</td>
                            <td>
                                <Button style={{ zIndex: '1000' }} variant='outline-danger'
                                    onClick={() => { if (window.confirm(`Видалити діод: "${component.name}"?`)) deleteDiode(component.id) }}
                                >Видалити компонент</Button>
                            </td>
                        </tr>)}
                </tbody>
            </Table>
            <Button
                variant="outline-success"
                className='w-100'
                onClick={() => setMessage(
                    <DiodeAddingModal
                        onClose={clearMessage}
                        onAdding={(isOk) => {
                            setMessage(
                                <Alert dismissible variant='success'
                                    onClose={clearMessage}>Додати компонент
                                </Alert>);
                            populateData();
                        }} />
                )}
            >
                Додати діод
            </Button>
        </>
    }

    useEffect(() => {
        setLoading(true);

        showAllActiveComponent(ComponentSelector.diode, localStorage.token,
            (error) => setMessage(<Alert dismissible onClose={clearMessage}>{error.message}</Alert>),
            (result) => {
                setComponents(result);
                setLoading(false);
            }
        );
    }, []);


    return <>
        {message}
        {loading ? <><p>Триває завантаження...</p><Spinner animation="border" size="sm" /></> : showTable()}
    </>
}

export function DiodeAddingModal({ onClose, onAdding }) {
    const [show, setShow] = useState(true);
    const [message, setMessage] = useState(null);

    const [name, setName] = useState(null);
    const [packagingId, setPackaging] = useState(1);
    const [description, setDescriprion] = useState(null);
    const [notice, setNotice] = useState(null);
    const [datasheet, setDatasheet] = useState(null);
    const [voltage, setVoltage] = useState(0);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const close = () => setShow(false);
    const errorMessage = (error) => {
        setMessage(
            <Alert variant='danger' dismissible onClose={() => { setMessage(null) }}>
                {error?.message ?? "Невідома помилка"}
            </Alert>
        )
    }

    const addDiode = () => {
        var diode = {
            name: name,
            packagingId: packagingId,
            description: description,
            notice: notice,
            count: count,
            datasheet: datasheet,
            current: current,
            voltage: voltage,
        }

        if (name == null) {
            errorMessage({ message: 'Назва діоду обов\'язкова' });
            return;
        }

        addComponent(ComponentSelector.diode, diode, localStorage.token, errorMessage, (result) => {
            setShow(false);
            onAdding(true);
        });

    }

    useEffect(() => {
        !show && onClose();
    }, [show, onClose])


    return <Modal
        show={show}
        backdrop="static"
        keyboard={false}>
        <Modal.Header >
            <Modal.Title>Додати діод</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
            <InputGroup className="mb-3">
                <InputGroup.Text >Назва діоду</InputGroup.Text>
                <Form.Control
                    placeholder="Назва діоду"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Напруга</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Напруга"
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                            setVoltage(Number(e.target.value));
                        } else if (e.target.value.length === 0) {
                            return;
                        } else {
                            errorMessage({ message: 'Напруга може бути лише в чисельній формі' });
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>V</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Струм</InputGroup.Text>
                <Form.Control
                    placeholder="0"
                    aria-label="Струм"
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                            setCurrent(Number(e.target.value));
                        } else if (e.target.value.length === 0) {
                            return;
                        } else {
                            errorMessage({ message: 'Струм може бути лише в чисельній формі' });
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>A</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Тип корпусу</InputGroup.Text>
                <Form.Select onChange={(e) => {
                    setPackaging(Number(e.target.value))
                }}>
                    {PackagesWorker.getPackages().map((item, index) => {
                        return <option key={index} value={item.id}>{item.name}</option>
                    })}
                </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text>Опис</InputGroup.Text>
                <Form.Control as='textarea' onChange={(e) => {
                    setDescriprion(e.target.value);
                }} />
            </InputGroup>

            <InputGroup className='mb-3'>
                <InputGroup.Text>Примітки</InputGroup.Text>
                <Form.Control as='textarea' onChange={(e) => {
                    setNotice(e.target.value);
                }} />
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
                            errorMessage({ message: 'Кількість може бути лише в чисельній формі' });
                            e.target.value = 0;
                        }
                    }}
                />
                <InputGroup.Text>Штук</InputGroup.Text>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text >Даташит</InputGroup.Text>
                <Form.Control type="file" onChange={(event) => {
                    if (event.target.files) {
                        setDatasheet(event.target.files[0]);
                    }

                }} />
            </InputGroup>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={addDiode}>
                Додати діод
            </Button>
            <Button variant="danger" onClick={close}>Відміна</Button>
        </Modal.Footer>
    </Modal>
}
