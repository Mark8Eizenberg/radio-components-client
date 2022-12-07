import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Button, InputGroup, 
  Form, ListGroup, Table, ListGroupItem, Alert, Spinner 
} from 'react-bootstrap';
import { ChipTypeWorker, PackagesWorker, TransistorTypeWorker } from './helpers/api/ComponentsWorker'
import { 
  showAllActiveComponent, Components, 
  takeComponentFromStorage,  microFaradToReadeble, OmToReadeble, 
  HzToReadeble, addComponentToStorage 
} from './helpers/api/ComponentsEditorWorker'

import ComponentViewer from './radioComponentsWorkers/ComponentViewer';
import AddingsComponentModalWindow from './radioComponentsWorkers/AddingsComponent';

import "./Home.css";

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
        if(document.getElementById('filter-resistance')?.checked ?? false){
          let resistanceRange = {
            from: ((document.getElementById('resistance-from')?.value ?? 0) * (document.getElementById('resistance-from-mult')?.value ?? 1)),
            to: ((document.getElementById('resistance-to')?.value ?? 1) * (document.getElementById('resistance-to-mult')?.value ?? 1000000)),
          }

          data = data.filter(item => item.resistance >= resistanceRange.from && item.resistance <= resistanceRange.to);
        }

        //Capacity filter 
        if(document.getElementById('filter-capacity')?.checked ?? false){
          let capacityRange = {
            from: ((document.getElementById('capacity-from')?.value ?? 0) * (document.getElementById('capacity-from-mult')?.value ?? 0.000001)),
            to: ((document.getElementById('capacity-to')?.value ?? 1) * (document.getElementById('capacity-to-mult')?.value ?? 1000000)),
          }

          data = data.filter(item => item.capacity >= capacityRange.from && item.capacity <= capacityRange.to);
        }

        //Accurancy filter
        if(document.getElementById('accurancy')?.checked ?? false){
          let accurancyRange = {
            from: document.getElementById('accurancy-from')?.value ?? 0,
            to: document.getElementById('accurancy-to')?.value ?? 100,
          }

          data = data.filter(item => item.accuracy >= accurancyRange.from && item.accuracy <= accurancyRange.to);
        }

        //Chip type filter
        if(document.getElementById('chip-type')?.checked ?? false){
         let chipTypeFilter = document.getElementById('chip-type-id')?.value;
         
         data = data.filter(item => item.chipType.id === Number(chipTypeFilter));
        }

        //Frequency filter
        if(document.getElementById('filter-frequency')?.checked ?? false){
          let frequencyRange = {
            from: ((document.getElementById('frequency-from')?.value ?? 0) * (document.getElementById('frequency-from-mult')?.value ?? 1)),
            to: ((document.getElementById('frequency-to')?.value ?? 1) * (document.getElementById('frequency-to-mult')?.value ?? 1000000)),
          }

          data = data.filter(item => item.frequency >= frequencyRange.from && item.frequency <= frequencyRange.to);
        }

        //Voltage filter
        if(document.getElementById('voltage')?.checked ?? false){
          let voltageRange = {
            from: document.getElementById('voltage-from')?.value,
            to: document.getElementById('voltage-to')?.value,
          }

          if(isNaN(voltageRange.from) || isNaN(voltageRange.to)){
            setMessage(<Alert variant='danger' dismissible onClose={()=>{setMessage(null)}}>Необхідно ввести число в поле вибору напруги!</Alert>);
          }

          data = data.filter(item => item.voltage >= voltageRange.from && item.voltage <= voltageRange.to);
        }

        //Transistor type filter
        if(document.getElementById('transistor-type')?.checked ?? false){
          let transistorTypeFilter = document.getElementById('transistor-type-id')?.value;
          
          data = data.filter(item => item.transistorType.id === Number(transistorTypeFilter));
         }

        result = data;
    });
    return result;
  }
  //Update data for components
  const useFilter = () =>{
    setLoading(true);
    populateFilterData().then(result => {
      setComponents(result);
      setLoading(false);
    });
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

  //Render filters for each components
  const renderFilters = () => {
    let workingComponent = document.getElementById('choosen-component')?.value ?? Components.resistor;
    switch(workingComponent){
      case Components.resistor:
        return <>
        <ListGroupItem variant='info'>
          <input type='checkbox' id='filter-resistance' onChange={useFilter}/>
          <em className='p-3'>Опір</em>
        </ListGroupItem>
        {document.getElementById('filter-resistance')?.checked && <ListGroupItem>
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
          <div className="--slider-container">
              <div className='--min-range-container'>
                  <p className='--slider-label'>З:</p>
                  <p className='--slider-label' id='accurancy-from-label'>{0}</p>
                  <input type={'range'} 
                    id='accurancy-from' 
                    defaultValue={0}
                    min={0} 
                    max={100} 
                    className='--slider-input' 
                    onClick={useFilter} 
                    onChange={(event)=>{
                      const maxRange = document.getElementById('accurancy-to');
                      const newValue = Number(event.target.value);

                      if(maxRange){
                        if(newValue >= Number(maxRange.value)){
                          event.target.value = maxRange.value - 1;
                        }
                      }

                      const minLabel = document.getElementById('accurancy-from-label');
                      if(minLabel){
                        minLabel.textContent = event.target.value;
                      }
                  }}/>
                  <p className='--slider-label'>%</p>
              </div>
              <div className='--max-range-container'>
                  <p className='--slider-label'>По:</p>
                  <p className='--slider-label' id='accurancy-to-label'>{100}</p>
                  <input type={'range'} 
                    id='accurancy-to'
                    defaultValue={100} 
                    min={0} 
                    max={100} 
                    className='--slider-input' 
                    onClick={useFilter}
                    onChange={(event)=>{
                      const minRange = document.getElementById('accurancy-from');
                      const newValue = Number(event.target.value);

                      if(minRange){
                        if(newValue <= Number(minRange.value)){
                          event.target.value = Number(minRange.value) + 1;
                        }
                      }

                      const minLabel = document.getElementById('accurancy-to-label');
                      if(minLabel){
                        minLabel.textContent = event.target.value;
                      }
                    }}/>
                  <p className='--slider-label'>%</p>
              </div>
          </div>
        </ListGroupItem>}
        </>
      case Components.capacitor:
        return <>
        <ListGroupItem variant='info'>
          <input type='checkbox' id='filter-capacity' onChange={useFilter}/>
          <em className='p-3'>Ємність</em>
        </ListGroupItem>
        {document.getElementById('filter-capacity')?.checked && <ListGroupItem>
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
        <div className="--slider-container">
              <div className='--min-range-container'>
                  <p className='--slider-label'>З:</p>
                  <p className='--slider-label' id='accurancy-from-label'>{0}</p>
                  <input type={'range'} 
                    id='accurancy-from' 
                    defaultValue={0}
                    min={0} 
                    max={100} 
                    className='--slider-input' 
                    onClick={useFilter} 
                    onChange={(event)=>{
                      const maxRange = document.getElementById('accurancy-to');
                      const newValue = Number(event.target.value);

                      if(maxRange){
                        if(newValue >= Number(maxRange.value)){
                          event.target.value = maxRange.value - 1;
                        }
                      }

                      const minLabel = document.getElementById('accurancy-from-label');
                      if(minLabel){
                        minLabel.textContent = event.target.value;
                      }
                  }}/>
                  <p className='--slider-label'>%</p>
              </div>
              <div className='--max-range-container'>
                  <p className='--slider-label'>По:</p>
                  <p className='--slider-label' id='accurancy-to-label'>{100}</p>
                  <input type={'range'} 
                    id='accurancy-to'
                    defaultValue={100} 
                    min={0} 
                    max={100} 
                    className='--slider-input' 
                    onClick={useFilter}
                    onChange={(event)=>{
                      const minRange = document.getElementById('accurancy-from');
                      const newValue = Number(event.target.value);

                      if(minRange){
                        if(newValue <= Number(minRange.value)){
                          event.target.value = Number(minRange.value) + 1;
                        }
                      }

                      const minLabel = document.getElementById('accurancy-to-label');
                      if(minLabel){
                        minLabel.textContent = event.target.value;
                      }
                    }}/>
                  <p className='--slider-label'>%</p>
              </div>
          </div>
        </ListGroupItem>}
        </>
      case Components.chip:
        return<>
          <ListGroupItem variant='info'>
            <input type='checkbox' id='chip-type' onChange={useFilter}/>
            <em className='p-3'>Тип мікросхеми</em>
          </ListGroupItem>
          {document.getElementById('chip-type')?.checked && <ListGroupItem>
            <Form.Select
              id='chip-type-id'
              defaultValue={ChipTypeWorker.getChipTypes[0]?.id ?? 0}
              onChange={useFilter}
            >
              {ChipTypeWorker.getChipTypes().map(
                (item, index)=><option key={index} value={item.id}>{item.name}</option>
              )}
            </Form.Select>
          </ListGroupItem>}
        </>
      case Components.quartz:
        return <>
          <ListGroupItem variant='info'>
          <input type='checkbox' id='filter-frequency' onChange={useFilter}/>
          <em className='p-3'>Частота</em>
          </ListGroupItem>
          {document.getElementById('filter-frequency')?.checked && <ListGroupItem>
            <InputGroup className='mb-1'>
              <InputGroup.Text>З</InputGroup.Text>
              <Form.Control id='frequency-from' onChange={useFilter} defaultValue={0}/>
              <Form.Select defaultValue={1} id='frequency-from-mult' onChange={useFilter}>
                <option value={1}>Hz</option>
                <option value={1000}>kHz</option>
                <option value={1000000}>MHz</option>
              </Form.Select>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>По</InputGroup.Text>
              <Form.Control id='frequency-to' onChange={useFilter} defaultValue={1000}/>
              <Form.Select defaultValue={1000000} id='frequency-to-mult' onChange={useFilter}>
                <option value={1}>Hz</option>
                <option value={1000}>kHz</option>
                <option value={1000000}>MHz</option>
              </Form.Select>
            </InputGroup>
          </ListGroupItem>}
        </>
      case Components.stabilizer:
        return<>
         <ListGroupItem variant='info'>
            <input type='checkbox' id='voltage' onChange={useFilter}/>
            <em className='p-3'>Напруга</em>
          </ListGroupItem>
          {document.getElementById('voltage')?.checked && <ListGroupItem>
            <InputGroup className='mb-1'>
              <InputGroup.Text>З</InputGroup.Text>
              <Form.Control id='voltage-from' onChange={useFilter} defaultValue={0}/>
              <InputGroup.Text>V</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>По</InputGroup.Text>
              <Form.Control id='voltage-to' onChange={useFilter} defaultValue={1000}/>
              <InputGroup.Text>V</InputGroup.Text>
            </InputGroup>
          </ListGroupItem>}
        </>
      case Components.transistor:
        return<>
          <ListGroupItem variant='info'>
            <input type='checkbox' id='transistor-type' onChange={useFilter}/>
            <em className='p-3'>Тип транзистора</em>
          </ListGroupItem>
          {document.getElementById('transistor-type')?.checked && <ListGroupItem>
            <Form.Select
              id='transistor-type-id'
              defaultValue={TransistorTypeWorker.getTransistorTypes()[0]?.id ?? 0}
              onChange={useFilter}
            >
              {TransistorTypeWorker.getTransistorTypes().map(
                (item, index)=><option key={index} value={item.id}>{item.name}</option>
              )}
            </Form.Select>
          </ListGroupItem>}
        </>
      case Components.zenerDiode:
        return<>
         <ListGroupItem variant='info'>
            <input type='checkbox' id='voltage' onChange={useFilter}/>
            <em className='p-3'>Напруга</em>
          </ListGroupItem>
          {document.getElementById('voltage')?.checked && <ListGroupItem>
            <InputGroup className='mb-1'>
              <InputGroup.Text>З</InputGroup.Text>
              <Form.Control id='voltage-from' onChange={useFilter} defaultValue={0}/>
              <InputGroup.Text>V</InputGroup.Text>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>По</InputGroup.Text>
              <Form.Control id='voltage-to' onChange={useFilter} defaultValue={1000}/>
              <InputGroup.Text>V</InputGroup.Text>
            </InputGroup>
          </ListGroupItem>}
        </>
      default:
        return <></>
    }
  }

  //Comoponent did mount on DOM
  useEffect(()=>{
    PackagesWorker.updatePackages(localStorage.token);
    TransistorTypeWorker.updateTransistorTypes(localStorage.token);
    ChipTypeWorker.updateChipTypes(localStorage.token);
    populateFilterData().then(result => {
      setComponents(result);
      setLoading(false);
    });
  }, [])

  return <>
    {message}
    {/* <InputGroup className='mb-3'>
      <Form.Select defaultValue={Components.resistor} onChange={useFilter} id='choosen-component' size='lg'>
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
    </InputGroup> */}
    <Row style={{margin: 0}}>
      <Col><Button className='w-100 m-1' variant='primary' id='choosen-component' value={Components.resistor} 
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Резистори</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary' value={Components.capacitor} 
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Конденсатори</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.chip}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Мікросхеми</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.diode}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Діоди</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.optocouple}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Оптопари</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.other}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Інше</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.quartz}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Кварци</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.stabilizer}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Стабілізатори</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.transistor}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Транзистори</Button></Col>
      <Col><Button className='w-100 m-1' variant='outline-primary'
        value={Components.zenerDiode}
        onClick={useFilter}
        onMouseDown={(event)=>{
          const prevChoosenElement = document.getElementById('choosen-component');
          if(prevChoosenElement){
            prevChoosenElement.id = '';
            prevChoosenElement.classList = "w-100 m-1 btn btn-outline-primary";
          }

          event.target.id='choosen-component';
          event.target.classList = "w-100 m-1 btn btn-primary";
        }}
      >Стабілітрони</Button></Col>
    </Row>
    <Row className='justify-content-center m-1'>
      <Col md={4} lg={3} className="mb-1" style={{padding: 0}}>
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
      <Col md={8} lg={9} style={{padding: '0', margin: '0'}}>
      {
        loading ? 
        <Row className='justify-content-center'>
          <Spinner style={{marginTop: '10%'}} animation='grow'/>
        </Row> : 
        Object.entries(components).length > 0 ? showComponents(components) : 
          <ListGroup>
            <ListGroupItem><em>Не знайдено компонентів за даним фільтром</em></ListGroupItem>
          </ListGroup>
      }
      </Col>
    </Row>
  </> 
}
