import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { Components, HzToReadeble, microFaradToReadeble, OmToReadeble } from "./api/ComponentsEditorWorker";
import { ChipTypeWorker, MaterialWorker, PackagesWorker, TransistorTypeWorker } from "./api/ComponentsWorker";

function ResistorFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            resistance: [],
            accuracy: [],
            powerRating: [],
        }
        
        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.resistance.push(item.resistance);
            variants.accuracy.push(item.accuracy);
            variants.powerRating.push(item.powerRating);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.resistance = [ ...new Set(variants.resistance)];
        variants.accuracy = [ ...new Set(variants.accuracy)];
        variants.powerRating = [ ...new Set(variants.powerRating)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, resistance: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Опір
            </ListGroupItem>
            {filters.resistance && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.resistance.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, resistance: [...prevFilters.resistance, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newResistance = prevFilters.resistance;
                                        const indexOfElement = newResistance.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newResistance.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, resistance: newResistance};
                                    })
                                }
                            })}/>
                        {OmToReadeble(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, accuracy: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Точність
            </ListGroupItem>
            {filters.accuracy && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.accuracy.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, accuracy: [...prevFilters.accuracy, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newAccuracy = prevFilters.accuracy;
                                        const indexOfElement = newAccuracy.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newAccuracy.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, accuracy: newAccuracy};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, powerRating: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Потужність
            </ListGroupItem>
            {filters.powerRating && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.powerRating.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, powerRating: [...prevFilters.powerRating, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.powerRating;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, powerRating: newData};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function CapacitorFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            capacity: [],
            materialId: [],
            accuracy: [],
            powerRating: [],
        }

        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.capacity.push(item.capacity);
            variants.materialId.push(item.materialId);
            variants.accuracy.push(item.accuracy);
            variants.powerRating.push(item.powerRating);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.capacity = [ ...new Set(variants.capacity)];
        variants.materialId = [ ...new Set(variants.materialId)];
        variants.accuracy = [ ...new Set(variants.accuracy)];
        variants.powerRating = [ ...new Set(variants.powerRating)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, capacity: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Ємність
            </ListGroupItem>
            {filters.capacity && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.capacity.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, capacity: [...prevFilters.capacity, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.capacity;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, capacity: newData};
                                    })
                                }
                            })}/>
                        {microFaradToReadeble(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, accuracy: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Точність
            </ListGroupItem>
            {filters.accuracy && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.accuracy.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, accuracy: [...prevFilters.accuracy, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newAccuracy = prevFilters.accuracy;
                                        const indexOfElement = newAccuracy.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newAccuracy.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, accuracy: newAccuracy};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, materialId: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Матеріал
            </ListGroupItem>
            {filters.materialId && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.materialId.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, materialId: [...prevFilters.materialId, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.materialId;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, materialId: newData};
                                    })
                                }
                            })}/>
                        {MaterialWorker.getMaterialById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function ChipFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            chipType: []
        }

        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.chipType.push(item.chipType?.id);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.chipType = [ ...new Set(variants.chipType)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, chipType: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Тип мікросхеми
            </ListGroupItem>
            {filters.chipType && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.chipType.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, chipType: [...prevFilters.chipType, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.chipType;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, chipType: newData};
                                    })
                                }
                            })}/>
                        {ChipTypeWorker.getChipTypeById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function DiodeFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            voltage: [],
            current: [],
        }

        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.voltage.push(item.voltage);
            variants.current.push(item.current);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.voltage = [ ...new Set(variants.voltage)];
        variants.current = [ ...new Set(variants.current)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, voltage: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Напруга (V)
            </ListGroupItem>
            {filters.voltage && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.voltage.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, voltage: [...prevFilters.voltage, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.voltage;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, voltage: newData};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, current: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Струм (A)
            </ListGroupItem>
            {filters.current && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.current.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, current: [...prevFilters.current, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.current;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, current: newData};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function QuartzFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            frequency: [],
        }
        
        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.frequency.push(item.frequency);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.frequency = [ ...new Set(variants.frequency)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, frequency: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Частота
            </ListGroupItem>
            {filters.frequency && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.frequency.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, frequency: [...prevFilters.frequency, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.frequency;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, frequency: newData};
                                    })
                                }
                            })}/>
                        {HzToReadeble(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}

            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function StabilizerFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            voltage: [],
        }

        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.voltage.push(item.voltage);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.voltage = [ ...new Set(variants.voltage)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, voltage: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Напруга (V)
            </ListGroupItem>
            {filters.voltage && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.voltage.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, voltage: [...prevFilters.voltage, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.voltage;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, voltage: newData};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
            
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function TransistorFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            transistorType: [],
        }
        
        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.transistorType.push(item.transistorType?.id);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.transistorType = [ ...new Set(variants.transistorType)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, transistorType: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Тип транзистору
            </ListGroupItem>
            {filters.transistorType && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.transistorType.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, transistorType: [...prevFilters.transistorType, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.transistorType;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, transistorType: newData};
                                    })
                                }
                            })}/>
                        {TransistorTypeWorker.getTransistorTypeById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
            
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function ZenerDiodeFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: [],
            voltage: [],
        }

        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            variants.voltage.push(item.voltage);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];
        variants.voltage = [ ...new Set(variants.voltage)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, voltage: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Напруга (V)
            </ListGroupItem>
            {filters.voltage && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.voltage.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, voltage: [...prevFilters.voltage, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newData = prevFilters.voltage;
                                        const indexOfElement = newData.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newData.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, voltage: newData};
                                    })
                                }
                            })}/>
                        {item}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
            
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

function DefaultFilter({onChange, components}){
    const [filters, setFilters] = useState({});
    const [variation, setVariations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        
        let variants = {
            packaging: []
        }

        components.map(item=>{
            variants.packaging.push(item.packaging.id);
            return null;
        })

        variants.packaging = [ ...new Set(variants.packaging)];

        setVariations(variants);
        setLoading(false);
    },[components])

    useEffect(()=>{
        onChange(filters);
    },[filters, onChange])
    
    return (loading ? <div style={{width: '100%', justifyContent: 'center', verticalAlign: 'center', display: 'flex'}}><Spinner animation='grow'/></div> : 
        <ListGroup>
            <ListGroupItem variant="info">
                <input type={'checkbox'}
                    onChange={event=>{
                        setFilters(prevFilters => ({...prevFilters, packaging: (event.target.checked ? [] : null)}))
                    }}
                    style={{marginRight: '4px'}}/>
                Корпус
            </ListGroupItem>
            {filters.packaging && <ListGroupItem className="col" style={{maxHeight: '200px', overflowY: "scroll"}}>
                <ListGroup>
                    {variation.packaging.map((item, index)=><ListGroupItem key={index}>
                        <input type={'checkbox'} 
                            style={{marginRight: '4px'}}
                            onChange={(event=>{
                                if(event.target.checked){
                                    setFilters(prevFilters => ({...prevFilters, packaging: [...prevFilters.packaging, item]}))
                                } else{
                                    setFilters(prevFilters => {
                                        var newPackaging = prevFilters.packaging;
                                        const indexOfElement = newPackaging.indexOf(item);
                                        if(indexOfElement !== -1){
                                            newPackaging.splice(indexOfElement, 1);
                                        }
                                        return {...prevFilters, packaging: newPackaging};
                                    })
                                }
                            })}/>
                        {PackagesWorker.getPackagesById(item)}
                    </ListGroupItem>)}
                </ListGroup>
            </ListGroupItem>}
        </ListGroup>)
}

export default function FilterForComponent({component, components, onChange}){
    switch (component) {
        case Components.resistor:
            return <ResistorFilter components={components} onChange={onChange}/>
        case Components.capacitor:
            return <CapacitorFilter components={components} onChange={onChange}/>
        case Components.chip:
            return <ChipFilter components={components} onChange={onChange} />
        case Components.diode:
            return <DiodeFilter components={components} onChange={onChange} />
        case Components.quartz:
            return <QuartzFilter components={components} onChange={onChange} />
        case Components.stabilizer:
            return <StabilizerFilter components={components} onChange={onChange} />
        case Components.zenerDiode:
            return <ZenerDiodeFilter components={components} onChange={onChange} />
        case Components.transistor:
            return <TransistorFilter components={components} onChange={onChange} />
        default:
            return <DefaultFilter components={components} onChange={onChange} />
    }
}