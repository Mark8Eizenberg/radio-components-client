import { useState, useEffect, useRef } from "react";
import { Alert, Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Components } from "./api/ComponentsEditorWorker";
import "./DataTransferWorker.css"

function ReadCSV({onRead, onClose}){
    const [firstAsNames, setFirstAsNames] = useState(false);
    const [separator, setSeparator] = useState(',');
    const [fileContext, setFileContext] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [result, setResult] = useState(null);
    const inputFileRef = useRef(null);
    
    const [message, setMessage] = useState(null);
    const clearMessage = ()=>setMessage(null);

    async function ReadFile(){
        if(inputFileRef.current.files.lenght < 1){
            setMessage(<Alert dismissible variant="danger" onClose={clearMessage}>Необхідно обрати файл!</Alert>);
            return;
        }

        const file = inputFileRef.current.files[0];

        if(!file){
            setMessage(<Alert dismissible variant="danger" onClose={clearMessage}>Необхідно обрати файл!</Alert>);
            return;
        }
        
        if(file.type !== 'text/csv'){
            setMessage(<Alert dismissible variant="danger" onClose={clearMessage}>Можливо вивантажити дані лише з файлу формату CSV</Alert>);
            return;
        }
        
        var reader = new FileReader();
        reader.onloadend = function(e){
            setFileContext(this.result);
        };
        reader.readAsText(file);
    }

    function ShowResultAsTable(data){
        return <Table striped responsive>
            <thead>
                <tr>
                    {headers && headers.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {result && result.map((row, index)=><tr key={index}>
                    {row && row.map((data, index)=><td key={index}>{data}</td>)}
                </tr>)}
            </tbody>
        </Table>
    }

    function readCallback(){
        onRead && onRead(headers, result);
        onClose();
    }

    useEffect(()=>{
        if(fileContext){
            var data = fileContext.split('\n');
            data = data.map(item => item.substr(item.length - 1) === '\r' ? item.substr(0, item.length - 1) : item);
            data = data.map(item => item.split(separator));
            if(data[data.length - 1] === ''){
                data.pop();
            }

            if(firstAsNames){
                setHeaders(data[0]);
                data.splice(0,1);
            } else {
                setHeaders(data[0].map((item, index) => 'Column' + index));
            }
            
            setResult(data)
        }
    },[fileContext, separator, firstAsNames])

    return <div className="--read-csv-background">
        <div className="--read-csv-container">
            {message}
            <Col>
                <Row className="m-0 mb-1">
                    <InputGroup>
                        <InputGroup.Checkbox onChange={(e)=>setFirstAsNames(e.target.checked ?? false)} defaultChecked={false}/>
                        <Form.Control  value={"Перший рядок назви стовбців"} disabled />
                    </InputGroup> 
                </Row>
                <Row className="m-0 mb-1">
                    <InputGroup>
                        <Form.Control  value={"Сепаратор"} disabled />
                        <Form.Control  defaultValue={','} onChange={(e)=> setSeparator(e.target.value)} />
                    </InputGroup> 
                </Row>
                <Row className="m-0 mb-1">
                    <InputGroup>
                        <Form.Control ref={inputFileRef} type="file"/>
                        <Button onClick={ReadFile}>Прочитати</Button>
                    </InputGroup>
                </Row>
                <Row style={{overflowY: 'scroll', maxHeight: '20vh', position: 'relative', margin: '0'}}>
                    {ShowResultAsTable(result)}
                </Row>
                <Row className="m-0 mt-1">
                    <Col>
                        <Button
                            disabled={!result || !headers}  
                            variant="success" 
                            className="w-100" 
                            onClick={readCallback}
                        >Ок</Button>
                    </Col>
                    <Col>
                        <Button variant="danger" className="w-100" onClick={onClose}>Відміна</Button>
                    </Col>
                </Row>
            </Col>
        </div>
    </div>
}

function ParsePercent(percent){
    if(!isNaN(percent)) return Number(percent);
    if(percent[percent.length - 1] === '%'){
        return Number(percent.substr(0, percent.length - 1))
    }
    return null;
}

function ResistorImport({onClose}){
    const [dataFromFile, setDateFromFiles] = useState(null);
    const [resistorArray, setResistorArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = ()=>setMessage(null);

    function ParseOm(OmString){
        if(!OmString) return null;
        if(!isNaN(OmString)) return Number(OmString);
        const OmArr = OmString.split(' ');
        if(isNaN(OmArr[OmArr.length - 1])){
            switch (OmArr.length) {
                case 1:
                    return null;
                case 2:
                    switch (OmArr[1].toLowerCase()){
                        case 'r': return Number(OmArr[0]);
                        case 'om': return Number(OmArr[0]);
                        case 'ом': return Number(OmArr[0]);
                        case 'k': return Number(OmArr[0]) * 1000;
                        case 'kom': return Number(OmArr[0]) * 1000;
                        case 'к': return Number(OmArr[0]) * 1000;
                        case 'ком': return Number(OmArr[0]) * 1000;
                        case 'мом': return Number(OmArr[0]) * 1000000;
                        case 'м': return Number(OmArr[0]) * 1000000;
                        case 'm': return Number(OmArr[0]) * 1000000;
                        case 'mom': return Number(OmArr[0]) * 1000000;
                        default: return null;
                    }            
                default:
                    return null;
                }
        } else {
            return Number(OmString)
        }
    }

    useEffect(()=>{
        if(dataFromFile){
            var data =  dataFromFile.map(o => {
                return {
                    resistance: ParseOm(o[0]),
                    accurancy: ParsePercent(o[2]),
                    packaging: o[1],
                    powerRating: o[2] ? Number(o[3].replace(',', '.')) : null,
                    count: o[4] ? Number(o[4].replace(',', '.')) : null,
                    name: o[0] + '_' + o[1] + '_' + o[2]
                }
            });
            const uniquePackaging = [...new Set(data.map(o=>o.packaging))];
            //TODO: Check packaging by name
            debugger;
        }
    },[dataFromFile])

    return <div className="--container-background">
        {message}
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            <button onClick={()=>setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data)=>{setDateFromFiles(data)}}/>)}>Read file</button>
        </div>
    </div>
}

export default function ImportComponent({component, onClose}){
    switch (component) {
        case Components.resistor:
           return <ResistorImport onClose={onClose} />     
        default:
            break;
    }
}