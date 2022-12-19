import React, {useEffect, useState} from 'react'
import { Table, Modal, Button, InputGroup, Form, Alert, Row } from 'react-bootstrap';
import { 
    getComponentInfo, microFaradToReadeble, 
    OmToReadeble, HzToReadeble, editComponentInfo 
} from '../helpers/api/ComponentsEditorWorker';
import {ChipTypeWorker, TransistorTypeWorker, PackagesWorker, MaterialWorker} from '../helpers/api/ComponentsWorker'
import { AddDatasheetForEmpty, ChangeDatasheet, DeleteDatasheetFromComponent } from '../helpers/DatasheetWorker';
import PdfViewer from '../helpers/PdfViewer';

const localString = new Map([
    ["resistance" , "Опір"],
    ["accuracy" ,  "Точність"],
    ["powerRating" , "Потужність"],
    ["name" , "Назва"],
    ["packagingId" , "Id типу корпуса"],
    ["description" , "Опис"],
    ["notice" , "Примітки"],
    ["count" , "Кількість"],
    ["voltage", "Напруга (V)"],
    ["current", "Струм (A)"],
    ["chipTypeId", "Id типу мікросхеми"]
]);


export default function ComponentViewer({id, onClose, title, enableEditor=true, onUpdateCallback}){
    const [loading, setLoading] = useState(true);
    const [component, setComponent] = useState(null);
    const [show, setShow] = useState(true);
    const [message, setMessage] = useState(null);
    const [editorMode, setEditorMode] = useState(false);

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
                    setMessage(<Alert dismissible variant='danger' onClose={()=>setMessage(null)}>{result.error ?? "Невідома помилка"}</Alert>);
                }
                setLoading(false); 
            });
        
        if(PackagesWorker.getPackages().length < 1){
            PackagesWorker.updatePackages(localStorage.token);
        }

        if(TransistorTypeWorker.getTransistorTypes().length < 1){
            TransistorTypeWorker.updateTransistorTypes(localStorage.token);
        }

        if(ChipTypeWorker.getChipTypes().length < 1){
            ChipTypeWorker.updateChipTypes(localStorage.token);
        }
    },[id])

    const getMicroFaradWithMult = (mF) => {
        if(mF > 1){
            if(mF / 1000 < 1){
                return {mf: mF, mult: 1} 
            } else if(mF / 1000000 < 1){
                return {mf: mF / 1000, mult: 1000} 
            } else {
                return {mf: mF / 1000000, mult: 1000000} 
            }
        } else {
            if(mF * 1000 < 1){
                return {mf: mF * 1000000, mult: 0.000001} 
            } 
            return {mf: mF * 1000, mult: 0.001} 
        }
    }

    const saveEditComponent = () => {
        let keys = Object.entries(component.component).map(i => i[0]);
        let newOBject = component.component;
        keys.map(key=>{
            if(key === "id") return true;
            var newInfo = document.getElementById(key)?.value;
            if(newInfo === null){
                setMessage(<Alert dismissible onClose={()=>setMessage(null)}>
                    Помилка при обробці введених данних, перевірте їх правильність.
                </Alert>)
                return false;
            }
            if(key === 'frequency' || key === 'resistance' || key === 'capacity'){
                const valueEnterElement = document.getElementById('converter-number');
                newInfo *= valueEnterElement?.value;
            }
            newOBject[key] = newInfo;
            return true;
        })

        editComponentInfo(localStorage.token, newOBject)
            .then(result => {
                if(result.isOk){
                    setMessage(<Alert dismissible variant='success' onClose={()=>setMessage(null)}>
                    Дані успішно оновлено
                </Alert>)
                if(onUpdateCallback) onUpdateCallback(true);
                } else {
                    setMessage(<Alert dismissible variant='danger' onClose={()=>setMessage(null)}>
                    Помилка при спробі збереження введених данних, перевірте їх правильність.
                </Alert>)
                }
            })
            .catch(error => {});
    }

    const createComponentInfo = () => {
        return<>
            <Table striped bordered hover responsive>
                <tbody>
                    {Object.entries(component.component).map((item, index) => {
                        switch (item[0]) {
                            case 'frequency':
                                return <tr key={index}>
                                    <td>Частота</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                        {editorMode ? <>
                                            <InputGroup>
                                                <Form.Control id='frequency'
                                                    defaultValue={item[1] > 1000 ? item[1] > 1000000 ? item[1] / 1000000 : item[1] / 1000 : item[1]}
                                                />
                                                <Form.Select id='converter-number' defaultValue={item[1] > 1000 ? item[1] > 1000000 ? 1000000 : 1000 :1}>
                                                    <option value={1}>Hz</option>
                                                    <option value={1000}>kHz</option>
                                                    <option value={1000000}>MHz</option>
                                                </Form.Select>
                                            </InputGroup>
                                        </> : 
                                        <p>{HzToReadeble(item[1])}</p>}
                                    </td>
                                </tr>
                            case 'resistance':
                                return <tr key={index}>
                                    <td>Опір</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                    {editorMode ? <>
                                            <InputGroup>
                                                <Form.Control id = 'resistance'
                                                    defaultValue={item[1] > 1000 ? item[1] > 1000000 ? item[1] / 1000000 : item[1] / 1000 : item[1]}
                                                />
                                                <Form.Select id='converter-number' defaultValue={item[1] > 1000 ? item[1] > 1000000 ? 1000000 : 1000 :1}>
                                                    <option value={1}>Om</option>
                                                    <option value={1000}>kOm</option>
                                                    <option value={1000000}>MOm</option>
                                                </Form.Select>
                                            </InputGroup>
                                        </> : 
                                        <p>{OmToReadeble(item[1])}</p>}
                                    </td>
                                </tr>
                            case 'capacity':
                                return <tr key={index}>
                                    <td>Ємність</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                            {editorMode ? <>
                                                <InputGroup>
                                                    <Form.Control id='capacity'
                                                        defaultValue={getMicroFaradWithMult(item[1]).mf}
                                                    />
                                                    <Form.Select id='converter-number' defaultValue={getMicroFaradWithMult(item[1]).mult}>
                                                        <option value={1000000}>F</option>
                                                        <option value={1000}>mF</option>
                                                        <option value={1}>µF</option>
                                                        <option value={0.001}>nF</option>
                                                        <option value={0.000001}>pF</option>
                                                    </Form.Select>
                                                </InputGroup>
                                            </> : 
                                            <p>{microFaradToReadeble(item[1])}</p>}
                                        </td>
                                </tr>
                            case 'materialId':
                                return <tr><td>Матеріал</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                        {editorMode ? <>
                                            <Form.Select defaultValue={item[1]} id='materialId'>
                                                {MaterialWorker.getMaterials().map(material => 
                                                    <option key={material.id} value={material.id}>{material.name}</option>    
                                                )}
                                            </Form.Select>
                                        </> : <>
                                        {MaterialWorker.getMaterialById(item[1])}
                                        </>}
                                    </td>
                                </tr>
                            case 'id':
                                return <tr key={index}>
                                    <td>ID</td>
                                    <td>{item[1]}</td>
                                </tr>
                            case 'packagingId':
                                return <></>;
                            case 'chipTypeId':
                                return <tr><td>Тип мікросхеми</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                        {editorMode ? <>
                                            <Form.Select defaultValue={item[1]} id='chipTypeId'>
                                                {ChipTypeWorker.getChipTypes().map(chipType => 
                                                    <option key={chipType.id} value={chipType.id}>{chipType.name}</option>    
                                                )}
                                            </Form.Select>
                                        </> : <>
                                        {ChipTypeWorker.getChipTypeById(item[1])}
                                        </>}
                                    </td>
                                </tr>
                            case 'transistorTypeId':
                                return <tr><td>Тип транзистора</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                        {editorMode ? <>
                                            <Form.Select defaultValue={item[1]} id='transistorTypeId'>
                                                {TransistorTypeWorker.getTransistorTypes().map(transistorType => 
                                                    <option key={transistorType.id} value={transistorType.id}>{transistorType.name}</option>    
                                                )}
                                            </Form.Select>
                                        </> : <>
                                        {TransistorTypeWorker.getTransistorTypeById(item[1])}
                                        </>}
                                    </td>
                                </tr>
                            case 'datasheetId':
                                return <tr><td>Даташит</td>
                                    {item[1] ? 
                                        <td>
                                            <Row className='w-100 m-0'>
                                                <Button
                                                    className='col'
                                                    variant='outline-success' 
                                                    onClick={()=>{
                                                        setMessage(<PdfViewer 
                                                            fileId={Number(item[1])}
                                                            onClose={()=>setMessage(null)}
                                                            />)}}
                                                            >Переглянути</Button>
                                                <Button
                                                    className='col'
                                                    variant='outline-info'
                                                    onClick={()=>{setMessage(<ChangeDatasheet 
                                                        componentId={component.component?.id}
                                                        oldFileId={Number(item[1])} 
                                                        onClose={
                                                            ()=>{
                                                                setShow(false);
                                                                if(onUpdateCallback)onUpdateCallback(true);
                                                                onClose();
                                                            }
                                                        }/>)}}
                                                    >Змінити</Button>
                                                <Button
                                                    className='col'
                                                    variant='outline-danger'
                                                    onClick={()=>{setMessage(
                                                        <DeleteDatasheetFromComponent
                                                            componentId={component.component?.id}
                                                            fileId={Number(item[1])}
                                                            onClose={()=>{
                                                                setShow(false);
                                                                if(onUpdateCallback)onUpdateCallback(true);
                                                                onClose();
                                                            }}
                                                        />
                                                    )}}
                                                >Видалити</Button>
                                            </Row>
                                        </td>
                                    :
                                        <td>
                                            <p>Відсутній даташит</p>
                                            <Button variant="outline-success"
                                                onClick={()=>setMessage(<AddDatasheetForEmpty
                                                    componentId={component.component?.id}
                                                    onClose={()=>{
                                                        setShow(false);
                                                        if(onUpdateCallback)onUpdateCallback(true);
                                                        onClose();
                                                    }}
                                                />)}
                                            >Додати</Button>
                                        </td>
                                    }
                                    
                                </tr>
                            default:
                                return <tr key={index}>
                                    <td>{localString.get(item[0]) ?? item[0]}</td>
                                    <td onClick={()=>enableEditor && setEditorMode(true)}>
                                        {editorMode ? <>
                                            <InputGroup>
                                                <Form.Control id={item[0]} defaultValue={item[1]}/>
                                            </InputGroup>
                                        </> : <p>{item[1]}</p>}
                                    </td>
                                </tr>
                        }
                    })}
                    <tr>
                        <td>Тип корпусу</td>
                        {editorMode ? <td >
                            <InputGroup>
                                <Form.Select defaultValue={component.package.id} id="packagingId">
                                    {PackagesWorker.getPackages().map(packaging => <option key={packaging.id} value={packaging.id}>{packaging.name}</option>)}
                                </Form.Select>
                            </InputGroup>
                        </td> :<td onClick={()=>enableEditor && setEditorMode(true)}>{component.package.name}</td> 
                        }
                    </tr>
                    <tr>
                        <td>Ким додано</td>
                        <td>{component?.creator?.fullName ?? "Невідомо"}</td>
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
                {loading ? <p>Триває завантаження...</p> : <>
                { message}
                {createComponentInfo()}
            </> }
            </Modal.Body>
            <Modal.Footer>
                {enableEditor && editorMode && <Button variant='success' onClick={saveEditComponent}>Зберегти зміни</Button>}
                <Button onClick={close} variant="danger">Закрити</Button>
            </Modal.Footer>
        </Modal>
    </>
}