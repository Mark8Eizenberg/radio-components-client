import React, {useEffect, useState} from 'react'
import { Table, Modal, Button } from 'react-bootstrap';
import { getComponentInfo, microFaradToReadeble, OmToReadeble } from '../helpers/api/ComponentsEditorWorker';

export default function ComponentViewer({id, onClose, title}){
    const [loading, setLoading] = useState(true);
    const [component, setComponent] = useState(null);
    const [show, setShow] = useState(true);
    const [error, setError] = useState(null);

    const close = () => {
        setShow(false);
        onClose();
    }

    useEffect(()=>{
        getComponentInfo(id, localStorage.token)
            .then(result => {
                if(result.isOk){
                    setComponent(result.data);
                } else {
                    setError(result.error ?? "Unknown error");
                }
                setLoading(false); 
            });
    },[])

    const createComponentInfo = () => {

        
        return<>
            <Table striped bordered hover responsive>
                <tbody>
                    {Object.entries(component.component).map((item, index) => {
                        switch (item[0]) {
                            case 'resistance':
                                return <tr key={index}>
                                    <td>{item[0]}</td>
                                    <td><p>{OmToReadeble(item[1])}</p></td>
                                </tr>
                            case 'capacity':
                                return <tr key={index}>
                                <td>{item[0]}</td>
                                <td><p>{microFaradToReadeble(item[1])}</p></td>
                            </tr>
                            default:
                                break;
                        }
                        return <tr key={index}>
                            <td>{item[0]}</td>
                            <td><p>{item[1]}</p></td>
                        </tr>
                    })}
                    <tr>
                        <td>Packaging</td>
                        <td>{component.package.name}</td>
                    </tr>
                    <tr>
                        <td>Created by</td>
                        <td>{component.creator.fullName}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    }

    return<>
        <Modal show={show} size="lg" 
            aria-labelledby="contained-modal-title-vcenter" centered
            onHide={close} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? <p>Loading...</p> : <>
                { error ?? createComponentInfo()}
            </> }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
}