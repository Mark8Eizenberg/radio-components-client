import React, { useState, useEffect } from 'react';
import DropDownCard from './helpers/DropDownCard';
import { ChipTypeWorker, PackagesWorker, TransistorTypeWorker } from './helpers/api/ComponentsWorker'
import { EditorCapacitor } from './radioComponentsWorkers/CapacitorWorker ';
import { EditorResistor } from './radioComponentsWorkers/ResistorWorker';
import { ChipWorker } from './radioComponentsWorkers/ChipWorker'
import { DiodeWorker } from './radioComponentsWorkers/DiodeWorker';
import { OptocouplesWorker } from './radioComponentsWorkers/OptocouplesWorker';
import { QuartzWorker } from './radioComponentsWorkers/QuartzWorker';
import { StabilizerWorker } from './radioComponentsWorkers/StabilizerWorker';
import { TransistorWorker } from './radioComponentsWorkers/TransistorWorker';
import { ZenerDiodeWorker } from './radioComponentsWorkers/ZenerDiodeWorker';
import { OtherWorker } from './radioComponentsWorkers/OtherWorker';
import { Button, Form, InputGroup, Alert } from 'react-bootstrap';

export default function RadioComponents() {

    useEffect(()=>{
        PackagesWorker.updatePackages(localStorage.token);
        ChipTypeWorker.updateChipTypes(localStorage.token);
        TransistorTypeWorker.updateTransistorTypes(localStorage.token);
    },[]);
    
    return <>
        <DropDownCard name="Редагування радіокомпонентів">
            <DropDownCard name={"Резистори"}>
                <EditorResistor/>
            </DropDownCard>
            <DropDownCard name={"Конденсатори"}>
                <EditorCapacitor/>
            </DropDownCard>
            <DropDownCard name={"Мікросхеми"}>
                <ChipWorker/>
            </DropDownCard>
            <DropDownCard name={"Діоди"}>
                <DiodeWorker/>
            </DropDownCard>
            <DropDownCard name={"Оптопара"}>
                <OptocouplesWorker/>
            </DropDownCard>
            <DropDownCard name={"Кварци"}>
                <QuartzWorker/>
            </DropDownCard>
            <DropDownCard name={"Стабілізатор"}>
                <StabilizerWorker/>
            </DropDownCard>
            <DropDownCard name={"Транзистори"}>
                <TransistorWorker/>
            </DropDownCard>
            <DropDownCard name={"Стабілітрони"}>
                <ZenerDiodeWorker/>
            </DropDownCard>
            <DropDownCard name={"Інше"}>
                <OtherWorker/>
            </DropDownCard>
        </DropDownCard>
        <DropDownCard name={"Типи корпусу"}>
            <PackageEditor/>
        </DropDownCard>
        <DropDownCard name={"Типи транзисторів"}>
            <TransistorTypeEditor/>
        </DropDownCard>
        <DropDownCard name={"Типи мікросхем"}>
            <ChipTypeEditor/>
        </DropDownCard>

    </>
}

const PackageEditor = () => {
    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);
    const errorMessage = (error) => {
        setMessage(
            <Alert dismissible variant='danger' onClose={clearMessage}> 
                {error}
            </Alert>);
    }

    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState([]);    
    const [needUpdate, setNeedUpdate] = useState(false);

    const [id, setId] = useState(1);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    
    useEffect(()=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
        
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        fetch("/api/storage/packaging", requestOptions)
            .then(response => response.ok ? response.json() : errorMessage('Не вдалося завантажити дані'))
            .then(result => {
                if(result != null){
                    setPackages(result);
                    setLoading(false);
                }
            })
            .catch(error => console.log('error', error));
    }, [])

    useEffect(()=>{
        if(needUpdate){
            setLoading(true);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
            
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        
            fetch("/api/storage/packaging", requestOptions)
                .then(response => response.ok ? response.json() : errorMessage('Не вдалося завантажити дані'))
                .then(result => {
                    if(result != null){
                        setPackages(result);
                        setLoading(false);
                        setNeedUpdate(false);
                    }
                })
                .catch(error => console.log('error', error));
        }
    }, [needUpdate] )

    return loading ? <>
        <em>Триває завантаження</em>
    </> : 
    
    <>
        {message}
        <InputGroup className='mb-3'>
            <InputGroup.Text>Оберіть корпус для видалення</InputGroup.Text>
            <Form.Select onChange={e => {
                setId(e.target.value);
            }}>
                {packages.map((item) => 
                    <option key={item.id} value={item.id}>#{item.id} {item.name}</option>    
            )}
            </Form.Select>
            <Button variant='danger' onClick={(e)=>{
                if(window.confirm("Ви впевнені що бажаєте видалити обраний тип корпусу ?")){
                    PackagesWorker.removePackage(localStorage.token, id, errorMessage);
                    setMessage(
                        <Alert dismissible variant='success' onClose={clearMessage}> 
                            Тип корпусу видалено
                        </Alert>);
                    setNeedUpdate(true);
                }
            }}>Видалити</Button>
        </InputGroup>

        <InputGroup className='mb-3'>
            <InputGroup.Text>Назва нового корпусу</InputGroup.Text>
            <Form.Control placeholder='Назва' onChange={e => setName(e.target.value)}></Form.Control>
            <InputGroup.Text>Короткий опис нового корпусу</InputGroup.Text>
            <Form.Control placeholder='опис' onChange={e=>setDescription(e.target.value)}></Form.Control>
            <Button variant='success'
                onClick={(e)=>{
                    if(name == null){
                        errorMessage("Необхідно ввести назву нового типу корпусу");
                        return;
                    }
                    PackagesWorker.addNewPackages(localStorage.token, name, description, errorMessage);
                    setMessage(
                        <Alert dismissible variant='success' onClose={clearMessage}> 
                            Тип корпусу додано
                        </Alert>);
                    setNeedUpdate(true);
                }}>
                    Додати
                </Button>
        </InputGroup>
    </>
}

const TransistorTypeEditor = () => {
    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);
    const errorMessage = (error) => {
        setMessage(
            <Alert dismissible variant='danger' onClose={clearMessage}> 
                {error}
            </Alert>);
    }

    const [loading, setLoading] = useState(true);
    const [transistorTypes, setTransistorTypes] = useState([]);    
    const [needUpdate, setNeedUpdate] = useState(false);

    const [id, setId] = useState(1);
    const [name, setName] = useState(null);
    
    useEffect(()=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
        
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        fetch("/api/storage/TransistorType", requestOptions)
            .then(response => response.ok ? response.json() : errorMessage('Не вдалося завантажити дані'))
            .then(result => {
                if(result != null){
                    setTransistorTypes(result);
                    setLoading(false);
                }
            })
            .catch(error => console.log('error', error));
    })

    useEffect(()=>{
        if(needUpdate){
            setLoading(true);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
            
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        
            fetch("/api/storage/TransistorType", requestOptions)
                .then(response => response.ok ? response.json() : errorMessage('Не вдалося завантажити дані'))
                .then(result => {
                    if(result != null){
                        setTransistorTypes(result);
                        setLoading(false);
                        setNeedUpdate(false);
                    }
                })
                .catch(error => console.log('error', error));
        }
    }, [needUpdate] )

    return loading ? <>
        <em>Триває завантаження</em>
    </> : 
    
    <>
        {message}
        <InputGroup className='mb-3'>
            <InputGroup.Text>Оберіть тип транзистору для видалення</InputGroup.Text>
            <Form.Select onChange={e => {
                setId(e.target.value);
            }}>
                {transistorTypes.map((item) => 
                    <option key={item.id} value={item.id}>#{item.id} {item.name}</option>    
            )}
            </Form.Select>
            <Button variant='danger' onClick={(e)=>{
                if(window.confirm("Ви впевнені що бажаєте видалити обраний тип транзистору?")){
                    TransistorTypeWorker.removeTransistorType(localStorage.token, id, errorMessage);
                    setMessage(
                        <Alert dismissible variant='success' onClose={clearMessage}> 
                            Тип транзистору видалено
                        </Alert>);
                    setNeedUpdate(true);
                }
            }}>Видалити</Button>
        </InputGroup>

        <InputGroup className='mb-3'>
            <InputGroup.Text>Назва нового типу транзисторв</InputGroup.Text>
            <Form.Control placeholder='Назва' onChange={e => setName(e.target.value)}></Form.Control>
            <Button variant='success'
                onClick={(e)=>{
                    if(name == null){
                        errorMessage("Необхідно ввести назву нового типу транзистору");
                        return;
                    }
                    TransistorTypeWorker.addNewTransistorType(localStorage.token, name, errorMessage);
                    setMessage(
                        <Alert dismissible variant='success' onClose={clearMessage}> 
                            Тип транзистору додано
                        </Alert>);
                    setNeedUpdate(true);
                }}>
                    Додати
                </Button>
        </InputGroup>
    </>
}

const ChipTypeEditor = () => {
    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);
    const errorMessage = (error) => {
        setMessage(
            <Alert dismissible variant='danger' onClose={clearMessage}> 
                {error}
            </Alert>);
    }

    const [loading, setLoading] = useState(true);
    const [chipTypes, setChipTypes] = useState([]);    
    const [needUpdate, setNeedUpdate] = useState(false);

    const [id, setId] = useState(1);
    const [name, setName] = useState(null);
    
    useEffect(()=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
        
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        fetch("/api/storage/chiptype", requestOptions)
            .then(response => response.ok ? response.json() : errorMessage('Не вдалося завантажити дані'))
            .then(result => {
                if(result != null){
                    setChipTypes(result);
                    setLoading(false);
                }
            })
            .catch(error => console.log('error', error));
    })

    useEffect(()=>{
        if(needUpdate){
            setLoading(true);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
            
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        
            fetch("/api/storage/chiptype", requestOptions)
                .then(response => response.ok ? response.json() : errorMessage('Не вдалося завантажити дані'))
                .then(result => {
                    if(result != null){
                        setChipTypes(result);
                        setLoading(false);
                        setNeedUpdate(false);
                    }
                })
                .catch(error => console.log('error', error));
        }
    }, [needUpdate] )

    return loading ? <>
        <em>Триває завантаження</em>
    </> : 
    
    <>
        {message}
        <InputGroup className='mb-3'>
            <InputGroup.Text>Оберіть тип мікросхеми для видалення</InputGroup.Text>
            <Form.Select onChange={e => {
                setId(e.target.value);
            }}>
                {chipTypes.map((item) => 
                    <option key={item.id} value={item.id}>#{item.id} {item.name}</option>    
            )}
            </Form.Select>
            <Button variant='danger' onClick={(e)=>{
                if(window.confirm("Ви впевнені що бажаєте видалити обраний тип корпусу ?")){
                    ChipTypeWorker.removeChipType(localStorage.token, id, errorMessage);
                    setMessage(
                        <Alert dismissible variant='success' onClose={clearMessage}> 
                            Тип мікросхеми видалено
                        </Alert>);
                    setNeedUpdate(true);
                }
            }}>Видалити</Button>
        </InputGroup>

        <InputGroup className='mb-3'>
            <InputGroup.Text>Назва нового типу мікросхеми</InputGroup.Text>
            <Form.Control placeholder='Назва' onChange={e => setName(e.target.value)}></Form.Control>
            <Button variant='success'
                onClick={(e)=>{
                    if(name == null){
                        errorMessage("Необхідно ввести назву нового типу мікросхеми");
                        return;
                    }
                    ChipTypeWorker.addNewChipType(localStorage.token, name, errorMessage);
                    setMessage(
                        <Alert dismissible variant='success' onClose={clearMessage}> 
                            Тип мікросхеми додано
                        </Alert>);
                    setNeedUpdate(true);
                }}>
                    Додати
                </Button>
        </InputGroup>
    </>
}