import React, { useEffect, useState } from 'react';
import { Row, Col, Button, ListGroup, Table, ListGroupItem, Alert, Spinner } from 'react-bootstrap';
import { ChipTypeWorker, MaterialWorker, PackagesWorker, TransistorTypeWorker } from './helpers/api/ComponentsWorker'
import {
  showAllActiveComponent, takeComponentFromStorage, microFaradToReadeble, OmToReadeble,
  HzToReadeble, addComponentToStorage, Components
} from './helpers/api/ComponentsEditorWorker'
import PdfViewer from './helpers/PdfViewer';
import ComponentViewer from './radioComponentsWorkers/ComponentViewer';
import AddingsComponentModalWindow from './radioComponentsWorkers/AddingsComponent';
import FilterForComponent from './helpers/FilterForComponents';
import { ExportComponents, ImportComponent } from './helpers/DataTransferWorker';

const ComoponentEnumeration = {
  resistor: { path: 'resistor', name: 'Резистори' },
  capacitor: { path: "capacitor", name: "Конденсатори" },
  chip: { path: "chip", name: "Мікросхеми" },
  diode: { path: "diode", name: "Діоди" },
  optocouple: { path: "optocouple", name: "Оптопари" },
  quartz: { path: "quartz", name: "Кварци" },
  stabilizer: { path: "stabilizer", name: "Стабілізатори" },
  transistor: { path: "transistor", name: "Транзистори" },
  zenerDiode: { path: "zenerDiode", name: "Стабілітрони" },
  other: { path: "other", name: "Інше" }
}

export default function Home() {
  const [message, setMessage] = useState(null);

  const [choosenComponent, setChoosenComponent] = useState(ComoponentEnumeration.resistor);
  const [filters, setFilters] = useState({});
  const [components, setComponents] = useState([]);
  const [sortedComponents, setSortedComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  const clearMessage = () => setMessage(null);

  //Update data for components
  function collectData() {
    setLoading(true);
    showAllActiveComponent(choosenComponent.path, localStorage.token,
      (error) => setMessage(<Alert dismissible onClose={clearMessage}>{error}</Alert>),
      (result) => setComponents(result))
      .then((isLoaded) => {
        if (isLoaded) {
          setLoading(false);
        } else {
          setMessage(<Alert dismissible onClose={clearMessage}>Помилка при завантаженні компонентів, спробуйте перезавантажити сторінку</Alert>)
        }
      })
      .catch(error => console.error(error));
  }

  const addComponent = (id) => {
    let count = window.prompt("Скільки компонентів додати?", 0)
    if (count === null) return;
    if (isNaN(count)) {
      setMessage(<Alert variant='danger' dismissible onClose={() => setMessage(null)}>Необхідно ввести число</Alert>)
    } else {
      addComponentToStorage(localStorage.token, id, count).then(result => {
        if (result) {
          setMessage(<Alert variant='success' dismissible onClose={() => setMessage(null)}>Додано {count} елементів до компоненту з ID {id}</Alert>);
          collectData();
        } else {
          setMessage(<Alert variant='danger' dismissible onClose={() => setMessage(null)}>Помилка додавання</Alert>);
        }
      });
    }
  }

  const takeComponent = (id) => {
    let count = window.prompt("Скільки компонентів взяти?", 0)
    if (count === null) return;
    if (isNaN(count)) {
      setMessage(<Alert variant='danger' dismissible onClose={() => setMessage(null)}>Необхідно ввести число</Alert>)
    } else {
      takeComponentFromStorage(localStorage.token, id, count).then(result => {
        if (result) {
          setMessage(<Alert variant='success' dismissible onClose={() => setMessage(null)}>Ви взяли {count} елементів з ID {id}</Alert>);
          collectData();
        } else {
          setMessage(<Alert variant='danger' dismissible onClose={() => setMessage(null)}>Помилка при обробці. Перевірте число компонентів </Alert>);
        }
      });
    }
  }

  const componentsToTable = (components) => {
    return <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Id</th>
          {choosenComponent.path !== Components.resistor && choosenComponent.path !== Components.quartz && <th>Назва</th>}
          <th>Даташит</th>
          {components[0]?.frequency != null && <th>Частота</th>}
          {components[0]?.current != null && <th>Струм A</th>}
          {components[0]?.resistance != null && <th>Опір</th>}
          {components[0]?.capacity != null && <th>Ємність</th>}
          {components[0]?.chipType != null && <th>Тип мікросхеми</th>}
          {components[0]?.powerRating != null && <th>Потужність W</th>}
          {(components[0]?.voltage != null || components[0].capacity != null) && <th>Напруга V</th>}
          {components[0]?.transistorType != null && <th>Тип транзистора</th>}
          {components[0]?.accuracy != null && <th>Точність %</th>}
          {components[0]?.materialId != null && <th>Матеріал/Тип</th>}
          <th>Корпус</th>
          <th>Опис</th>
          <th>Кількість</th>
          <th>Додати</th>
          <th>Взяти</th>
        </tr>
      </thead>
      <tbody>
        {components.map((item, index) => {
          return <tr key={item.id}>
            <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{index}</td>
            <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.id}</td>
            {choosenComponent.path !== Components.resistor && choosenComponent.path !== Components.quartz && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.name}</td>}
            <td><Button className='w-100' variant='primary'
              disabled={item.datasheetId === null}
              onClick={() => {
                setMessage(<PdfViewer
                  fileId={Number(item.datasheetId)}
                  onClose={() => setMessage(null)}
                />)
              }}>📄</Button></td>
            {components[0]?.frequency != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{HzToReadeble(item.frequency)}</td>}
            {components[0]?.current != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.current}</td>}
            {components[0]?.resistance != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{OmToReadeble(item.resistance)}</td>}
            {components[0]?.capacity != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{microFaradToReadeble(item.capacity)}</td>}
            {components[0]?.chipType != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.chipType.name}</td>}
            {components[0]?.powerRating != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.powerRating}</td>}
            {(components[0]?.voltage || components[0]?.capacity) && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.voltage ?? "Unknown"}</td>}
            {components[0]?.transistorType != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.transistorType.name}</td>}
            {components[0]?.accuracy != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.accuracy}</td>}
            {components[0]?.materialId != null && <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{MaterialWorker.getMaterialById(item?.materialId ?? 1)}</td>}
            <td onClick={() => {
              setMessage(<ComponentViewer id={item.id} onClose={() => setMessage(null)} title={item.name} onUpdateCallback={collectData} />)
            }
            }>{item.packaging.name}</td>
            <td>{item.description}</td>
            <td>{item.count}</td>
            <td><Button className='w-100' variant='outline-success' onClick={() => { addComponent(item.id) }}>+</Button></td>
            <td><Button className='w-100' variant='outline-danger' onClick={() => { takeComponent(item.id) }}>-</Button></td>
          </tr>
        })}
      </tbody>
    </Table>
  }

  const showComponents = (components) => {
    return <>
      <ListGroup>
        {componentsToTable(components)}
      </ListGroup>
    </>
  }

  //Comoponent did mount on DOM
  useEffect(() => {
    async function fetchData() {
      let result = await PackagesWorker.updatePackages(localStorage.token);
      result = await TransistorTypeWorker.updateTransistorTypes(localStorage.token);
      result = await ChipTypeWorker.updateChipTypes(localStorage.token);
      result = await MaterialWorker.updateMaterials(localStorage.token);
      result = await showAllActiveComponent(choosenComponent.path, localStorage.token,
        (error) => setMessage(<Alert dismissible onClose={clearMessage}>{error}</Alert>),
        (result) => setComponents(result));
      if (result.isOk) {
        setLoading(false);
      }
    }

    fetchData();

  }, [choosenComponent])

  useEffect(() => setSortedComponents(components), [components])

  useEffect(() => {
    setLoading(true);
    showAllActiveComponent(choosenComponent.path, localStorage.token,
      (error) => setMessage(<Alert dismissible onClose={clearMessage}>{error}</Alert>),
      (result) => {
        const filtersParameters = Object.entries(filters ?? {});
        var filteredComponent = result;

        for (var i = 0; i < filtersParameters.length; i++) {
          if (!filtersParameters[i][1] || filtersParameters[i][1].length < 1) continue;

          const filterParameter = filtersParameters[i][0];
          const filterVariables = filtersParameters[i][1];

          switch (filterParameter) {
            case 'packaging':
              filteredComponent = filteredComponent.filter(item => filterVariables.includes(item[filterParameter].id));
              break;
            case 'chipType':
              filteredComponent = filteredComponent.filter(item => filterVariables.includes(item[filterParameter].id));
              break;
            case 'transistorType':
              filteredComponent = filteredComponent.filter(item => filterVariables.includes(item[filterParameter].id));
              break;
            case 'nameSearch':
              filteredComponent = filteredComponent.filter(item => item?.name.toLowerCase().indexOf(filterVariables) !== -1);
              break;
            default:
              filteredComponent = filteredComponent.filter(item => filterVariables.includes(item[filterParameter]));
              break;
          }
        }

        setSortedComponents(filteredComponent);
      })
      .then((isLoaded) => {
        if (isLoaded) {
          setLoading(false);
        } else {
          setMessage(<Alert dismissible onClose={clearMessage}>Помилка при завантаженні компонентів, спробуйте перезавантажити сторінку</Alert>)
        }
      })
      .catch(error => console.error(error));

  }, [filters, components, choosenComponent])

  return <>
    {message}
    <Row style={{ margin: 0 }}>
      {Object.values(ComoponentEnumeration).map((item, index) =>
        <Col key={index}>
          <Button className='w-100 m-1'
            variant={item === choosenComponent ? 'primary' : 'outline-primary'}
            onClick={() => { setChoosenComponent(item) }}
          >{item.name}</Button>
        </Col>)}
    </Row>
    <Row className='justify-content-center m-1'>
      <Col md={4} lg={3} className="mb-1" style={{ padding: 0 }}>
        <FilterForComponent
          component={choosenComponent.path}
          components={components}
          onChange={filter => setFilters(filter)} />
      </Col>
      <Col md={8} lg={9} style={{ padding: '0', margin: '0' }}>
        {
          loading ?
            <Row className='justify-content-center'>
              <Spinner style={{ marginTop: '10%' }} animation='grow' />
            </Row> :
            <>
              {Object.entries(sortedComponents).length > 0 ?
                showComponents(sortedComponents) :
                <ListGroup>
                  <ListGroupItem><em>Не знайдено компонентів за даним фільтром</em></ListGroupItem>
                </ListGroup>}
              <Row>
                <div className='col-8'>
                  <Button variant='success' className='w-100' onClick={() => {
                    setMessage(<AddingsComponentModalWindow component={choosenComponent.path} onAdd={() => {
                      collectData();
                      setMessage(<Alert dismissible variant='success' onClose={clearMessage}>Додано новий компонент</Alert>)
                    }} onClose={clearMessage} />)
                  }}>Додати новий компонент</Button>
                </div>
                <div className='col-2'>
                  <Button className='w-100' variant='outline-primary' onClick={
                    () => setMessage(<ImportComponent component={choosenComponent.path} onClose={() => {
                      clearMessage();
                      collectData();
                    }} />)}
                  >Імпорт</Button>
                </div>
                <div className='col-2'>
                  <Button className='w-100' variant='outline-primary' onClick={() => { ExportComponents(sortedComponents, ',') }}
                  >Експорт</Button>
                </div>
              </Row>
            </>
        }
      </Col>
    </Row>
  </>
}
