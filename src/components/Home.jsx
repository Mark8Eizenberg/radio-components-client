import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Button, InputGroup, 
  Form, ListGroup, Table, ListGroupItem, Alert, Container, Card 
} from 'react-bootstrap';
import { PackagesWorker } from './helpers/api/ComponentsWorker'
import { 
  showAllActiveComponent, Components, 
  takeComponentFromStorage,  microFaradToReadeble, OmToReadeble, 
  HzToReadeble, addComponentToStorage 
} from './helpers/api/ComponentsEditorWorker'

import ComponentViewer from './radioComponentsWorkers/ComponentViewer';
import AddingsComponentModalWindow from './radioComponentsWorkers/AddingsComponent';
import SliderRange from './helpers/SliderRange';

export default function Home(){
  const [message, setMessage] = useState(null);  

  const [components, setComponents] = useState({});
  const [loading, setLoading] = useState(true);

  const populateFilterData = async ()=>{
    var result = {};
    let workingComponent = document.getElementById('choosen-component')?.value ?? Components.resistor;
  
    await showAllActiveComponent(Components[workingComponent], localStorage.token, 
      (error)=>{console.log(error)}, 
      (data)=>{
        if(document.getElementById('need-packaging-filter')?.checked){
          let packageFilterId = Number(document.getElementById('filter-package')?.value ?? 1); 
          data = data.filter((item)=>item.packaging.id === packageFilterId)
        }

        //Resistance filter
        if(document.getElementById('resistance')?.checked ?? false){
          let resistanceRange = {
            from: ((document.getElementById('resistance-from')?.value ?? 0) * (document.getElementById('resistance-from-mult')?.value ?? 1)),
            to: ((document.getElementById('resistance-to')?.value ?? 1) * (document.getElementById('resistance-to-mult')?.value ?? 1000000)),
          }

          data = data.filter(item => item.resistance > resistanceRange.from && item.resistance < resistanceRange.to);
        }

        //Capacity filter 
        if(document.getElementById('capacity')?.checked ?? false){
          let capacityRange = {
            from: ((document.getElementById('capacity-from')?.value ?? 0) * (document.getElementById('capacity-from-mult')?.value ?? 0.000001)),
            to: ((document.getElementById('capacity-to')?.value ?? 1) * (document.getElementById('capacity-to-mult')?.value ?? 1000000)),
          }

          data = data.filter(item => item.capacity > capacityRange.from && item.capacity < capacityRange.to);
        }

        //Accurancy filter
        if(document.getElementById('accurancy')?.checked ?? false){
          let accurancyRange = {
            from: document.getElementById('accurancy-from')?.value ?? 0,
            to: document.getElementById('accurancy-to')?.value ?? 100,
          }

          data = data.filter(item => item.accuracy >= accurancyRange.from && item.accuracy <= accurancyRange.to);
        }

        result = data;
    });
    return result;
  }

  const useFilter = () =>{
    populateFilterData().then(result => setComponents(result));
  }

  const addComponent = (id) => {
    let count = window.prompt("Скільки компонентів додати?", 0)
    if(count === null) return;
    if(isNaN(count)){
      setMessage(<Alert variant='danger' dismissible onClose={()=>setMessage(null)}>Необхідно ввести число</Alert>)
    } else {
      addComponentToStorage(localStorage.token, id, count).then(result=>{
        if(result){
          setMessage(<Alert variant='success' dismissible onClose={()=>setMessage(null)}>Додано {count} елементів до компоненту з ID {id}</Alert>);
          populateFilterData().then(result => setComponents(result));
        } else {
          setMessage(<Alert variant='danger' dismissible onClose={()=>setMessage(null)}>Помилка додавання</Alert>);
        }
      });
    }
  }

  const takeComponent = (id) => {
    let count = window.prompt("Скільки компонентів взяти?", 0)
    if(count === null) return;
    if(isNaN(count)){
      setMessage(<Alert variant='danger' dismissible onClose={()=>setMessage(null)}>Необхідно ввести число</Alert>)
    } else {
      takeComponentFromStorage(localStorage.token, id, count).then(result=>{
        if(result){
          setMessage(<Alert variant='success' dismissible onClose={()=>setMessage(null)}>Ви взяли {count} елементів з ID {id}</Alert>);
          populateFilterData().then(result => setComponents(result));
        } else {
          setMessage(<Alert variant='danger' dismissible onClose={()=>setMessage(null)}>Помилка при обробці. Перевірте число компонентів </Alert>);
        }
      });
    }
  }

  const componentsToTable = (components)=>{
    return <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>назва</th>
                  {components[0]?.frequency != null && <th>Частота</th>}
                  {components[0]?.resistance != null && <th>Опір</th>}
                  {components[0]?.capacity != null && <th>Ємність</th>}
                  {components[0]?.chipType != null && <th>Тип мікросхеми</th>}
                  {components[0]?.powerRating != null && <th>Потужність</th>}
                  {components[0]?.voltage != null && <th>Напруга</th>}
                  {components[0]?.transistorType != null && <th>Тип транзистора</th>}
                  {components[0]?.accuracy != null && <th>Точність</th>}
                  <th>Корпус</th>
                  <th>Кількість</th>
                  <th>Додати</th>
                  <th>Взяти</th>
                </tr>
              </thead>
              <tbody>
                {components.map((item, index)=>{
                  return <tr key={item.id}>
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{index}</td>
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.id}</td>
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.name}</td>
                  {components[0]?.frequency != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{HzToReadeble(item.frequency)}</td>}
                  {components[0]?.resistance != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{OmToReadeble(item.resistance)}</td>}
                  {components[0]?.capacity != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{microFaradToReadeble(item.capacity)}</td>}
                  {components[0]?.chipType != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.chipType.name}</td>}
                  {components[0]?.powerRating != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.powerRating}</td>}
                  {components[0]?.voltage != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.voltage}</td>}
                  {components[0]?.transistorType != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.transistorType.name}</td>}
                  {components[0]?.accuracy != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.accuracy}</td>}
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name} onUpdateCallback={useFilter}/>)}
                  }>{item.packaging.name}</td>
                  <td>{item.count}</td>
                  <td><Button className='w-100' variant='outline-success' onClick={()=>{addComponent(item.id)}}>+</Button></td>
                  <td><Button className='w-100' variant='outline-danger' onClick={()=>{takeComponent(item.id)}}>-</Button></td>
                </tr>})}
              </tbody>
            </Table>
  }

  const showComponents = (components)=>{
    return <>
      <ListGroup>
          
          {componentsToTable(components)}
          <Button variant='success' className='w-100' onClick={()=>{
            let workingComponent = document.getElementById('choosen-component')?.value ?? Components.resistor;
            setMessage(<AddingsComponentModalWindow component={workingComponent} onAdd={()=>{
              setMessage(<Alert dismissible variant='success' onClose={()=>{
                setMessage(null)
              }}>Додано новий компонент</Alert>)
              populateFilterData().then(result => setComponents(result));
            }} onClose={()=>{
              setMessage(null);
            }} />)
          }}>Додати новий компонент</Button>
      </ListGroup>
    </>
  }

  const renderFilters = () => {
    let workingComponent = document.getElementById('choosen-component')?.value ?? Components.resistor;
    switch(workingComponent){
      case Components.resistor:
        return <>
        <ListGroupItem variant='info'>
          <input type='checkbox' id='resistance' onChange={useFilter}/>
          <em className='p-3'>Опір</em>
        </ListGroupItem>
        {document.getElementById('resistance')?.checked && <ListGroupItem>
          <InputGroup className='mb-1'>
            <InputGroup.Text>З</InputGroup.Text>
            <Form.Control id='resistance-from' onChange={useFilter} defaultValue={0}/>
            <Form.Select defaultValue={1} id='resistance-from-mult' onChange={useFilter}>
              <option value={1}>Om</option>
              <option value={1000}>kOm</option>
              <option value={1000000}>MOm</option>
            </Form.Select>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>По</InputGroup.Text>
            <Form.Control id='resistance-to' onChange={useFilter} defaultValue={1000}/>
            <Form.Select defaultValue={1000000} id='resistance-to-mult' onChange={useFilter}>
              <option value={1}>Om</option>
              <option value={1000}>kOm</option>
              <option value={1000000}>MOm</option>
            </Form.Select>
          </InputGroup>
        </ListGroupItem>}
        <ListGroupItem variant='info'>
          <input type='checkbox' id='accurancy' onChange={useFilter}/>
          <em className='p-3'>Точність</em>
        </ListGroupItem>
        {document.getElementById('accurancy')?.checked && <ListGroupItem>
          <input type={'number'} style={{visibility: 'hidden', position: 'absolute'}} id='accurancy-from'/>
          <input type={'number'} style={{visibility: 'hidden', position: 'absolute'}} id='accurancy-to'/>
          <SliderRange min={0} max={100} onChange={(range)=>{
            const accuracyFrom = document.getElementById('accurancy-from');
            const accuracyTo = document.getElementById('accurancy-to');

            if(accuracyFrom){
              accuracyFrom.value = range.min;
            }

            if(accuracyTo){
              accuracyTo.value = range.max;
            }

            populateFilterData().then(result => setComponents(result));
          }}/>
        </ListGroupItem>}
        </>
      case Components.capacitor:
        return <>
        <ListGroupItem variant='info'>
          <input type='checkbox' id='capacity' onChange={useFilter}/>
          <em className='p-3'>Ємність</em>
        </ListGroupItem>
        {document.getElementById('capacity')?.checked && <ListGroupItem>
          <InputGroup className='mb-1'>
            <InputGroup.Text>З</InputGroup.Text>
            <Form.Control id='capacity-from' onChange={useFilter} defaultValue={0}/>
            <Form.Select defaultValue={0.000001} id='capacity-from-mult' onChange={useFilter}>
              <option value={1000000}>F</option>
              <option value={1000}>mF</option>
              <option value={1}>µF</option>
              <option value={0.001}>nF</option>
              <option value={0.000001}>pF</option>
            </Form.Select>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>По</InputGroup.Text>
            <Form.Control id='capacity-to' onChange={useFilter} defaultValue={1000}/>
            <Form.Select defaultValue={1000000} id='capacity-to-mult' onChange={useFilter}>
            <option value={1000000}>F</option>
              <option value={1000}>mF</option>
              <option value={1}>µF</option>
              <option value={0.001}>nF</option>
              <option value={0.000001}>pF</option>
            </Form.Select>
          </InputGroup>
        </ListGroupItem>}
        <ListGroupItem variant='info'>
          <input type='checkbox' id='accurancy' onChange={useFilter}/>
          <em className='p-3'>Точність</em>
        </ListGroupItem>
        {document.getElementById('accurancy')?.checked && <ListGroupItem>
          <input type={'number'} style={{visibility: 'hidden', position: 'absolute'}} id='accurancy-from'/>
          <input type={'number'} style={{visibility: 'hidden', position: 'absolute'}} id='accurancy-to'/>
          <SliderRange min={0} max={100} onChange={(range)=>{
            const accuracyFrom = document.getElementById('accurancy-from');
            const accuracyTo = document.getElementById('accurancy-to');

            if(accuracyFrom){
              accuracyFrom.value = range.min;
            }

            if(accuracyTo){
              accuracyTo.value = range.max;
            }

            populateFilterData().then(result => setComponents(result));
          }}/>
        </ListGroupItem>}
        </>
      default:
        return <></>
    }
  }

  useEffect(()=>{
    PackagesWorker.updatePackages(localStorage.token);
    populateFilterData().then(result => {
      setComponents(result);
      setLoading(false);
    });
  }, [])

  return loading ? 
  <>
    {message}
    <em>Завантаження...</em>
  </> : 
  <>
    {message}
    <InputGroup className='mb-3'>
      <Form.Select defaultValue={Components.resistor} id='choosen-component' size='lg'>
        <option value={Components.resistor}>Резистори</option>
        <option value={Components.capacitor}>Конденсатори</option>
        <option value={Components.chip}>Мікросхеми</option>
        <option value={Components.diode}>Діоди</option>
        <option value={Components.optocouple}>Оптопари</option>
        <option value={Components.other}>Інше</option>
        <option value={Components.quartz}>Кварци</option>
        <option value={Components.stabilizer}>Стабілізатори</option>
        <option value={Components.transistor}>Транзистори</option>
        <option value={Components.zenerDiode}>Стабілітрони</option>
      </Form.Select>
      <Button onClick={useFilter}>Обрати</Button>
    </InputGroup>
    <Row className='justify-content-center'>
      <Col md={4} lg={3} className="mb-1">
      <ListGroup>
            <ListGroupItem variant='info'>
              <input type='checkbox' id='need-packaging-filter' onChange={useFilter}/>
              <em className='p-3'>Тип корпусу</em>
            </ListGroupItem>
            {document.getElementById('need-packaging-filter')?.checked && <ListGroupItem>
              <InputGroup>
                <Form.Select 
                  defaultValue={PackagesWorker.getPackages()[0]?.id} 
                  id='filter-package' 
                  onChange={useFilter}
                >
                  {PackagesWorker.getPackages().map((item)=>
                    <option key={item.id} value={item.id}>{item.name}</option>
                  )}
                </Form.Select>
              </InputGroup>
            </ListGroupItem>}
            {renderFilters()}
            
          </ListGroup>
      </Col>
      <Col md={8} lg={9}>
        {Object.entries(components).length > 0 ? showComponents(components) : 
          <ListGroup>
            <ListGroupItem><em>Не знайдено компонентів за даним фільтром</em></ListGroupItem>
          </ListGroup>}
      </Col>
    </Row>
  </> 
}
