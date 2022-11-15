import React, { useEffect, useState } from 'react';
import { Row, Col, Button, InputGroup, Form, ListGroup, Table, ListGroupItem, Alert } from 'react-bootstrap';
import DropDownCard from './helpers/DropDownCard';
import { PackagesWorker } from './helpers/api/ComponentsWorker'
import { 
  showAllActiveComponent, Components, 
  takeComponentFromStorage,  microFaradToReadeble, OmToReadeble, 
  HzToReadeble, addComponentToStorage 
} from './helpers/api/ComponentsEditorWorker'

import ComponentViewer from './radioComponentsWorkers/ComponentViewer';

export default function Home(){
  const [message, setMessage] = useState(null);  

  const [components, setComponents] = useState({});
  const [loading, setLoading] = useState(true);

  const [usePackageFilter, setUsePackageFilter] = useState(false);
  const [packageFilterId, setPackageFilterId] = useState(1);

  const populateFilterData = async ()=>{
    var result = {};
    var sortedPackage = usePackageFilter ? Number(packageFilterId) : null;
    if(window.document.getElementById('need-resistor')?.checked){
      await showAllActiveComponent(Components.resistor, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
            if(data.length < 1) return;
          }
          result.resistor = data;
      });
    }
    if(window.document.getElementById('need-capacitor')?.checked){
      await showAllActiveComponent(Components.capacitor, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.capacitor = data;
      });
    }
    if(window.document.getElementById('need-chip')?.checked){
      await showAllActiveComponent(Components.chip, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.chip = data;
      });
    }
    if(window.document.getElementById('need-diode')?.checked){
      await showAllActiveComponent(Components.diode, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.diode = data;
      });
    }
    if(window.document.getElementById('need-optocouple')?.checked){
      await showAllActiveComponent(Components.optocouple, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.optocouple = data;
      });
    }
    if(window.document.getElementById('need-quartz')?.checked){
      await showAllActiveComponent(Components.quartz, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.quartz = data;
      });
    }
    if(window.document.getElementById('need-stabilizer')?.checked){
      await showAllActiveComponent(Components.stabilizer, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.stabilizer = data;
      });
    }
    if(window.document.getElementById('need-transistor')?.checked){
      await showAllActiveComponent(Components.transistor, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.transistor = data;
      });
    }
    if(window.document.getElementById('need-zenerDiode')?.checked){
      await showAllActiveComponent(Components.zenerDiode, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.zenerDiode = data;
      });
    }
    if(window.document.getElementById('need-other')?.checked){
      await showAllActiveComponent(Components.other, localStorage.token, 
        (error)=>{console.log(error)}, 
        (data)=>{
          if(sortedPackage){
            data = data.filter(e=>e.packaging.id === sortedPackage);
          }
          if(data.length < 1) return;
          result.other = data;
      });
    }
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
                  {components[0].frequency != null && <th>Частота</th>}
                  {components[0].resistance != null && <th>Опір</th>}
                  {components[0].capacity != null && <th>Ємність</th>}
                  {components[0].chipType != null && <th>Тип мікросхеми</th>}
                  {components[0].voltage != null && <th>Напруга</th>}
                  {components[0].transistorType != null && <th>Тип транзистора</th>}
                  {components[0].accuracy != null && <th>Точність</th>}
                  <th>Пакування</th>
                  <th>Кількість</th>
                  <th>Покласти</th>
                  <th>Взяти</th>
                </tr>
              </thead>
              <tbody>
                {components.map((item, index)=>{
                  return <tr key={item.id}>
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{index}</td>
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{item.id}</td>
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{item.name}</td>
                  {components[0].frequency != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{HzToReadeble(item.frequency)}</td>}
                  {components[0].resistance != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{OmToReadeble(item.resistance)}</td>}
                  {components[0].capacity != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{microFaradToReadeble(item.capacity)}</td>}
                  {components[0].chipType != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{item.chipType.name}</td>}
                  {components[0].voltage != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{item.voltage}</td>}
                  {components[0].transistorType != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{item.transistorType.name}</td>}
                  {components[0].accuracy != null && <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
                  }>{item.accuracy}</td>}
                  <td onClick={()=>{
                    setMessage(<ComponentViewer id={item.id} onClose={()=>setMessage(null)} title={item.name}/>)}
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
        {components.resistor && <>
          <ListGroupItem variant='primary'>Резистори</ListGroupItem>
          {componentsToTable(components.resistor)}
        </>}
        {components.capacitor && <>
          <ListGroupItem variant='primary'>Конденсатори</ListGroupItem>
          {componentsToTable(components.capacitor)}
        </>}
        {components.chip && <>
          <ListGroupItem variant='primary'>Мікросхеми</ListGroupItem>
          {componentsToTable(components.chip)}
        </>}
        {components.diode && <>
          <ListGroupItem variant='primary'>Діоди</ListGroupItem>
          {componentsToTable(components.diode)}
        </>}
        {components.optocouple && <>
          <ListGroupItem variant='primary'>Оптопари</ListGroupItem>
          {componentsToTable(components.optocouple)}
        </>}
        {components.quartz && <>
          <ListGroupItem variant='primary'>Кварци</ListGroupItem>
          {componentsToTable(components.quartz)}
        </>}
        {components.stabilizer && <>
          <ListGroupItem variant='primary'>Стабілізатори</ListGroupItem>
          {componentsToTable(components.stabilizer)}
        </>}
        {components.transistor && <>
          <ListGroupItem variant='primary'>Транзистори</ListGroupItem>
          {componentsToTable(components.transistor)}
        </>}
        {components.zenerDiode && <>
          <ListGroupItem variant='primary'>Стабілітрони</ListGroupItem>
          {componentsToTable(components.zenerDiode)}
        </>}
        {components.other && <>
          <ListGroupItem variant='primary'>Інше</ListGroupItem>
          {componentsToTable(components.other)}
        </>}
      </ListGroup>
    </>
  }

  useEffect(()=>{
    PackagesWorker.updatePackages(localStorage.token).then(result => {setLoading(false)});
  }, [])

  useEffect(()=>{
    populateFilterData().then(result => setComponents(result));
  },[usePackageFilter, packageFilterId]);

  return loading ? 
  <>
    {message}
    <em>Завантаження...</em>
  </> : 
  <>
    {message}
    <Row>
      <InputGroup>
        <InputGroup.Text>Компонент</InputGroup.Text>
        <Form.Select>
          <option>Резистори</option>
          <option>Транзистори</option>
          <option>Мікросхеми</option>
        </Form.Select>
      </InputGroup>
    </Row>
    <Row className='justify-content-center'>
      <Col md={4} lg={3} className="mb-1">
        <DropDownCard name={"Фільтри пошуку"} show >
        <Form.Label>Тип компонентів</Form.Label>
          <ListGroup className='mb-3'>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-resistor' onChange={useFilter} />
                </Col>
                <Col>
                  <em>Резистори</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-capacitor' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Конденсатори</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-chip' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Мікросхеми</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-diode' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Діоди</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-optocouple' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Оптопари</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-quartz' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Кварци</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-stabilizer' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Стабілізатори</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-transistor' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Транзистори</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-zenerDiode' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Стабілітрони</em>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <input type="checkbox" id='need-other' onChange={useFilter}/>
                </Col>
                <Col>
                  <em>Інше</em>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
          <Form.Label>Тип корпусу</Form.Label>
          <InputGroup className='mb-3'>
            <InputGroup.Checkbox onChange={(e)=>{
              setUsePackageFilter(e.target.checked);
            }}/>
            <Form.Select onChange={e=>{
                setPackageFilterId(e.target.value);
              }}>
              {PackagesWorker.getPackages().map((item) => 
                <option key={item.id} value={item.id}>{`#${item.id}|${item.name}`}</option>
              )}
            </Form.Select>
          </InputGroup>
          <Button className='w-100' variant='outline-success' onClick={useFilter}>Use filters</Button>
        </DropDownCard>
      </Col>
      <Col md={8} lg={9}>
        {Object.entries(components).length > 0 ? showComponents(components) : <em>Не знайдено компонентів за даним фільтром</em>}
      </Col>
    </Row>
  </>
}
