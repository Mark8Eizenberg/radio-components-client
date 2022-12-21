import { useState, useEffect, useRef } from "react";
import { Alert, Button, Col, Form, InputGroup, ProgressBar, Row, Table } from "react-bootstrap";
import { addComponent, Components } from "./api/ComponentsEditorWorker";
import { ChipTypeWorker, MaterialWorker, PackagesWorker, TransistorTypeWorker } from "./api/ComponentsWorker";
import { HzToReadeble, OmToReadeble, microFaradToReadeble } from "./api/ComponentsEditorWorker";
import "./DataTransferWorker.css"

function ReadCSV({ onRead, onClose }) {
    const [firstAsNames, setFirstAsNames] = useState(false);
    const [separator, setSeparator] = useState(',');
    const [fileContext, setFileContext] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [result, setResult] = useState(null);
    const inputFileRef = useRef(null);

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    async function ReadFile() {
        if (inputFileRef.current.files.lenght < 1) {
            setMessage(<Alert dismissible variant="danger" onClose={clearMessage}>Необхідно обрати файл!</Alert>);
            return;
        }

        const file = inputFileRef.current.files[0];

        if (!file) {
            setMessage(<Alert dismissible variant="danger" onClose={clearMessage}>Необхідно обрати файл!</Alert>);
            return;
        }

        if (file.type !== 'text/csv') {
            setMessage(<Alert dismissible variant="danger" onClose={clearMessage}>Можливо вивантажити дані лише з файлу формату CSV</Alert>);
            return;
        }

        var reader = new FileReader();
        reader.onloadend = function (e) {
            setFileContext(this.result);
        };
        reader.readAsText(file);
    }

    function ShowResultAsTable(data) {
        return <Table striped responsive>
            <thead>
                <tr>
                    {headers && headers.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {result && result.map((row, index) => <tr key={index}>
                    {row && row.map((data, index) => <td key={index}>{data}</td>)}
                </tr>)}
            </tbody>
        </Table>
    }

    function readCallback() {
        onRead && onRead(headers, result);
        onClose();
    }

    useEffect(() => {
        if (fileContext) {
            var data = fileContext.split('\n');
            data = data.map(item => item.substr(item.length - 1) === '\r' ? item.substr(0, item.length - 1) : item);
            data = data.map(item => item.split(separator));
            if (data[data.length - 1][0] === '') {
                data.pop();
            }

            if (firstAsNames) {
                setHeaders(data[0]);
                data.splice(0, 1);
            } else {
                setHeaders(data[0].map((item, index) => 'Column' + index));
            }

            setResult(data)
        }
    }, [fileContext, separator, firstAsNames])

    return <div className="--read-csv-background">
        <div className="--read-csv-container">
            {message}
            <Col>
                <Row className="m-0 mb-1">
                    <InputGroup>
                        <InputGroup.Checkbox onChange={(e) => setFirstAsNames(e.target.checked ?? false)} defaultChecked={false} />
                        <Form.Control value={"Перший рядок назви стовбців"} disabled />
                    </InputGroup>
                </Row>
                <Row className="m-0 mb-1">
                    <InputGroup>
                        <Form.Control value={"Сепаратор"} disabled />
                        <Form.Control defaultValue={','} onChange={(e) => setSeparator(e.target.value)} />
                    </InputGroup>
                </Row>
                <Row className="m-0 mb-1">
                    <InputGroup>
                        <Form.Control ref={inputFileRef} type="file" />
                        <Button onClick={ReadFile}>Прочитати</Button>
                    </InputGroup>
                </Row>
                <Row style={{ overflowY: 'scroll', maxHeight: '20vh', position: 'relative', margin: '0' }}>
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

function ParsePercent(percent) {
    if (!isNaN(percent)) return Number(percent);
    if (percent[percent.length - 1] === '%') {
        return Number(percent.substr(0, percent.length - 1).replace(',', '.'))
    }
    return null;
}

function ComponentsToTable({ components, onClose }) {
    var result = null;
    try {
        result = <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>#</th>
                    <th>назва</th>
                    {components[0]?.frequency != null && <th>Частота</th>}
                    {components[0]?.current != null && <th>Струм</th>}
                    {components[0]?.resistance != null && <th>Опір</th>}
                    {components[0]?.capacity != null && <th>Ємність</th>}
                    {components[0]?.chipType != null && <th>Тип мікросхеми</th>}
                    {components[0]?.powerRating != null && <th>Потужність</th>}
                    {(components[0]?.voltage != null || components[0]?.capacity) && <th>Напруга</th>}
                    {components[0]?.transistorType != null && <th>Тип транзистора</th>}
                    {components[0]?.accuracy != null && <th>Точність</th>}
                    {components[0]?.material != null && <th>Матеріал/Тип</th>}
                    <th>Корпус</th>
                    <th>Кількість</th>
                </tr>
            </thead>
            <tbody>
                {components.map((item, index) => {
                    return <tr key={index}>
                        <td>{index}</td>
                        <td>{item.name}</td>
                        {components[0]?.frequency != null && <td  >{HzToReadeble(item.frequency)}</td>}
                        {components[0]?.current != null && <td  >{item.current}</td>}
                        {components[0]?.resistance != null && <td  >{OmToReadeble(item.resistance)}</td>}
                        {components[0]?.capacity != null && <td  >{microFaradToReadeble(item.capacity)}</td>}
                        {components[0]?.chipType != null && <td  >{item.chipType}</td>}
                        {components[0]?.powerRating != null && <td  >{item.powerRating}</td>}
                        {(components[0]?.voltage != null || components[0]?.capacity) && <td  >{item.voltage ?? "Unknown"}</td>}
                        {components[0]?.transistorType != null && <td  >{item.transistorType}</td>}
                        {components[0]?.accuracy != null && <td  >{item.accuracy}</td>}
                        {components[0]?.material != null && <td>{item.material}</td>}
                        <td  >{item.packaging}</td>
                        <td>{item.count}</td>
                    </tr>
                })}
            </tbody>
        </Table>
    } catch (error) {
        result = <Alert dismissible variant="danger" onClose={onClose}>Помилка при спробі вивести компоненти</Alert>
    }
    return result;
}

function ResistorImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    function ParseOm(OmString) {
        if (!OmString) return null;
        if (!isNaN(OmString)) return Number(OmString);
        const OmArr = OmString.split(' ');
        if (isNaN(OmArr[OmArr.length - 1])) {
            switch (OmArr.length) {
                case 1:
                    return null;
                case 2:
                    switch (OmArr[1].toLowerCase()) {
                        case 'r': return Number(OmArr[0].replace(',', '.'));
                        case 'om': return Number(OmArr[0].replace(',', '.'));
                        case 'ом': return Number(OmArr[0].replace(',', '.'));
                        case 'k': return Number(OmArr[0].replace(',', '.')) * 1000;
                        case 'kom': return Number(OmArr[0].replace(',', '.')) * 1000;
                        case 'к': return Number(OmArr[0].replace(',', '.')) * 1000;
                        case 'ком': return Number(OmArr[0].replace(',', '.')) * 1000;
                        case 'мом': return Number(OmArr[0].replace(',', '.')) * 1000000;
                        case 'м': return Number(OmArr[0].replace(',', '.')) * 1000000;
                        case 'm': return Number(OmArr[0].replace(',', '.')) * 1000000;
                        case 'mom': return Number(OmArr[0].replace(',', '.')) * 1000000;
                        default: return null;
                    }
                default:
                    return null;
            }
        } else {
            return Number(OmString)
        }
    }

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];

            await PackagesWorker.updatePackages(localStorage.token);

            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );

            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )


            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.resistor, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                console.log(dataFromFile);
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'Resistor_' + o[1] + '_' + o[2] + '_' : o[0],
                        resistance: ParseOm(o[1]),
                        powerRating: o[2] ? Number(o[2].replace(',', '.')) : 0,
                        accuracy: ParsePercent(o[3]),
                        packaging: o[4],
                        count: o[5] ? Number(o[5].replace(',', '.')) : 0,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function CapacitorImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    function ParseMicroFarad(microFaradString) {
        if (!microFaradString) return null;
        if (!isNaN(microFaradString)) return Number(microFaradString);
        const faradArray = microFaradString.split(' ');
        if (isNaN(faradArray[faradArray.length - 1])) {
            switch (faradArray.length) {
                case 1:
                    return null;
                case 2:
                    switch (faradArray[1].toLowerCase()) {
                        case 'p': return Number(faradArray[0].replace(',', '.') * 0.000001);
                        case 'pf': return Number(faradArray[0].replace(',', '.') * 0.000001);
                        case 'n': return Number(faradArray[0].replace(',', '.')) * 0.001;
                        case 'nf': return Number(faradArray[0].replace(',', '.')) * 0.001;
                        case 'u': return Number(faradArray[0].replace(',', '.'));
                        case 'uf': return Number(faradArray[0].replace(',', '.'));
                        case 'µ': return Number(faradArray[0].replace(',', '.'));
                        case 'µf': return Number(faradArray[0].replace(',', '.'));
                        case 'm': return Number(faradArray[0].replace(',', '.')) * 1000;
                        case 'mf': return Number(faradArray[0].replace(',', '.')) * 1000;
                        case 'f': return Number(faradArray[0].replace(',', '.')) * 1000000;
                        default: return null;
                    }
                default:
                    return null;
            }
        } else {
            return Number(microFaradString)
        }
    }

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with packages
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];

            await PackagesWorker.updatePackages(localStorage.token);

            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );

            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            //Work with material
            const uniqueMaterial = [...new Set(componentsArray.map(o => o.material))];

            await MaterialWorker.updateMaterials(localStorage.token);

            uniqueMaterial.filter(p => !MaterialWorker.getMaterials().map(pack => pack.name).includes(p)).map(async p =>
                await MaterialWorker.addNewMaterial(localStorage.token, p, p, (error) => { console.error(error) })
            );

            componentsArray.map(c =>
                c.materialId = MaterialWorker.getMaterials().filter(p => p.name === c.material)[0]?.id ?? 1
            )

            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.capacitor, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        //Назва	Ємність	Напруга	Точність	Матеріал	Корпус	Кількість
                        name: o[0]?.length < 1 ? '' + o[1] + '_' + o[2] : o[0],
                        capacity: ParseMicroFarad(o[1]),
                        voltage: o[2] !== 'null' && 0[2].length > 0 ? Number(o[2].replace(',', '.')) : null,
                        accuracy: ParsePercent(o[3]),
                        material: o[4],
                        packaging: o[5],
                        count: o[6] ? Number(o[6].replace(',', '.')) : 0,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function ChipImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with package
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            //Work with chipType
            const uniqueChipType = [...new Set(componentsArray.map(o => o.chipType))];
            await ChipTypeWorker.updateChipTypes(localStorage.token);
            uniqueChipType.filter(p => !ChipTypeWorker.getChipTypes().map(chip => chip.name).includes(p)).map(async p =>
                await ChipTypeWorker.addNewChipType(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.chipTypeId = ChipTypeWorker.getChipTypes().filter(p => p.name === c.chipType)[0]?.id ?? 1
            )


            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];

                try {
                    await addComponent(Components.chip, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0],
                        chipType: o[1],
                        packaging: o[2],
                        count: o[3] ? Number(o[3].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function DiodeImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with packages
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.diode, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'Diode_' + o[1] + 'A_' + o[2] + 'V' : o[0],
                        current: o[1] ? Number(o[1].replace(',', '.')) : null,
                        voltage: o[2] ? Number(o[2].replace(',', '.')) : null,
                        packaging: o[3],
                        count: o[4] ? Number(o[4].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function OptoCoupleImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with packages
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.optocouple, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'Optocouple_package_' + o[1] : o[0],
                        packaging: o[1],
                        count: o[2] ? Number(o[2].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function QuartzImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    function ParseHz(HzString) {
        if (!HzString) return null;
        if (!isNaN(HzString)) return Number(HzString);
        const parseArray = HzString.split(' ');
        if (isNaN(parseArray[parseArray.length - 1])) {
            switch (parseArray.length) {
                case 1:
                    return null;
                case 2:
                    switch (parseArray[1].toLowerCase()) {
                        case 'hz': return Number(parseArray[0].replace(',', '.'));
                        case 'гц': return Number(parseArray[0].replace(',', '.'));
                        case 'k': return Number(parseArray[0].replace(',', '.')) * 1000;
                        case 'khz': return Number(parseArray[0].replace(',', '.')) * 1000;
                        case 'кгц': return Number(parseArray[0].replace(',', '.')) * 1000;
                        case 'мгц': return Number(parseArray[0].replace(',', '.')) * 1000000;
                        case 'м': return Number(parseArray[0].replace(',', '.')) * 1000000;
                        case 'm': return Number(parseArray[0].replace(',', '.')) * 1000000;
                        case 'mhz': return Number(parseArray[0].replace(',', '.')) * 1000000;
                        default: return null;
                    }
                default:
                    return null;
            }
        } else {
            return Number(HzString)
        }
    }

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];

            await PackagesWorker.updatePackages(localStorage.token);

            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );

            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )


            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.quartz, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        //Назва,Частота,Корпус,Кількість
                        name: o[0]?.length < 1 ?? true ? 'quartz_' + o[1] : o[0],
                        frequency: ParseHz(o[1]),
                        packaging: o[2],
                        count: o[3] ? Number(o[3].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function StabilizerImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with packages
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.stabilizer, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'Diode_' + o[1] + 'V' : o[0],
                        voltage: o[1] ? Number(o[1].replace(',', '.')) : null,
                        packaging: o[2],
                        count: o[3] ? Number(o[3].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function TransistorImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with package
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            //Work with transistorType
            const uniqueTransistorType = [...new Set(componentsArray.map(o => o.transistorType))];
            await TransistorTypeWorker.updateTransistorTypes(localStorage.token);
            uniqueTransistorType.filter(p => !TransistorTypeWorker.getTransistorTypes().map(chip => chip.name).includes(p)).map(async p =>
                await TransistorTypeWorker.addNewTransistorType(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.transistorTypeId = TransistorTypeWorker.getTransistorTypes().filter(p => p.name === c.transistorType)[0]?.id ?? 1
            )


            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];


                try {
                    await addComponent(Components.transistor, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'transistor_' + o[1] : o[0],
                        transistorType: o[1],
                        packaging: o[2],
                        count: o[3] ? Number(o[3].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function DiodeZenerImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with packages
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.zenerDiode, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'DiodeZener_' + o[1] + 'V' : o[0],
                        voltage: o[1] ? Number(o[1].replace(',', '.')) : null,
                        packaging: o[2],
                        count: o[3] ? Number(o[3].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

function OtherImport({ onClose }) {
    const [dataFromFile, setDataFromFiles] = useState(null);
    const [componentsArray, setComponentsArray] = useState(null)

    const [message, setMessage] = useState(null);
    const clearMessage = () => setMessage(null);

    const loadingRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBarMessageRef = useRef(null);

    async function importData() {
        function setProggress(progress) {
            if (progressBarRef.current && progressBarMessageRef.current) {
                progressBarRef.current.firstChild.ariaValueNow = progress;
                progressBarRef.current.firstChild.style.width = `${progress}%`;
                progressBarMessageRef.current.textContent = `Імпортовано ${progress}%`
            }
        }
        if (loadingRef.current && progressBarRef.current) {
            loadingRef.current.style.display = 'flex'

            setProggress(0);

            //Work with packages
            const uniquePackaging = [...new Set(componentsArray.map(o => o.packaging))];
            await PackagesWorker.updatePackages(localStorage.token);
            uniquePackaging.filter(p => !PackagesWorker.getPackages().map(pack => pack.name).includes(p)).map(async p =>
                await PackagesWorker.addNewPackages(localStorage.token, p, p, (error) => { console.error(error) })
            );
            componentsArray.map(c =>
                c.packagingId = PackagesWorker.getPackages().filter(p => p.name === c.packaging)[0]?.id ?? 1
            )

            let errors = '';
            function addError(error) {
                errors += error;
            }

            for (var i = 0; i < componentsArray.length; i++) {
                const numOfComponent = i;
                const currentComponent = componentsArray[i];
                try {
                    await addComponent(Components.other, currentComponent, localStorage.token, (error) => {
                        addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                    }, () => { });
                } catch (error) {
                    addError(`Помилка імпорту компоненту №${numOfComponent} !\n`);
                }
                setProggress(i / componentsArray.length * 100);
            }

            let message = errors === '' ?
                "Дані успішно імпортовано. Ви можете продовжити імпорт, або ж завершити роботу з ним" :
                "Виникли поммилки при імпорті:\n" + errors;

            setMessage(<Alert dismissible variant={errors === '' ? "success" : "warning"} onClose={clearMessage}>{message}</Alert>);
            setComponentsArray(null);
            loadingRef.current.style.display = 'none'
        }
    }

    useEffect(() => {
        if (dataFromFile) {
            try {
                const components = dataFromFile.map(o => {
                    return {
                        name: o[0].length < 1 ? 'RadioComponent_' + o[1] : o[0],
                        packaging: o[1],
                        count: o[2] ? Number(o[2].replace(',', '.')) : null,
                    }
                })
                setComponentsArray(components);
            } catch (error) {
                setMessage(<Alert dismissible onClose={clearMessage} variant="danger">Помилка читання даних!</Alert>)
            }
        }
    }, [dataFromFile])

    return <div className="--container-background">
        <button onClick={onClose} className="--close-button">X</button>
        <div className="--container">
            {message}
            <Row className="m-0">
                <div className="--progress-of-loading" ref={loadingRef} style={{ display: 'none' }}>
                    <div className="--progress-background">
                        <ProgressBar ref={progressBarRef} now={0} striped animated />
                        <em ref={progressBarMessageRef} >Завантажено</em>
                    </div>
                </div>
                <Col className="m-0">
                    <Row className="m-0 mb-1">
                        <Button onClick={() => setMessage(<ReadCSV onClose={clearMessage} onRead={(headers, data) => { setDataFromFiles(data) }} />)}>Обрати файл з данними</Button>
                    </Row>
                    <Row style={{ overflowY: 'scroll', maxHeight: '30vh', position: 'relative', margin: '0' }}>
                        {componentsArray && <ComponentsToTable components={componentsArray} onClose={clearMessage} />}
                    </Row>
                    {componentsArray && <Row className="m-0">
                        <Col className="w-100">
                            <Button variant="success" className="w-100" onClick={importData}>Імпортувати</Button>
                        </Col>
                        <Col className="w-100">
                            <Button variant="danger" className="w-100" onClick={onClose}>Скасувати</Button>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </div>
    </div>
}

export function ExportComponents(components, separator) {
    try {

        let result = "Назва" + separator +
            (components[0]?.frequency != null ? "Частота" + separator : '') +
            (components[0]?.current != null ? "Струм" + separator : '') +
            (components[0]?.resistance != null ? "Опір" + separator : '') +
            (components[0]?.capacity != null ? "Ємність" + separator : '') +
            (components[0]?.chipType != null ? "Тип мікросхеми" + separator : '') +
            (components[0]?.powerRating != null ? "Потужність" + separator : '') +
            (components[0]?.voltage != null || components[0].capacity ? "Напруга" + separator : '') +
            (components[0]?.transistorType != null ? "Тип транзистора" + separator : '') +
            (components[0]?.accuracy != null ? "Точність" + separator : '') +
            (components[0]?.materialId != null ? "Матеріал/Тип" + separator : '') +
            "Корпус" + separator + "Кількість\n";

        result += components.map((item) =>
            "" + item.name + separator +
            (components[0]?.frequency != null ? HzToReadeble(item.frequency) + separator : '') +
            (components[0]?.current != null ? item.current + separator : '') +
            (components[0]?.resistance != null ? OmToReadeble(item.resistance) + separator : '') +
            (components[0]?.capacity != null ? microFaradToReadeble(item.capacity) + separator : '') +
            (components[0]?.chipType != null ? (item.chipType.name) + separator : '') +
            (components[0]?.powerRating != null ? (item.powerRating) + separator : '') +
            (components[0]?.voltage != null || components[0].capacity ? (item.voltage) + separator : '') +
            (components[0]?.transistorType != null ? (item.transistorType.name) + separator : '') +
            (components[0]?.accuracy != null ? (item.accuracy) + "%" + separator : '') +
            (components[0]?.materialId != null ? MaterialWorker.getMaterialById(item.materialId) + separator : '') +
            item.packaging.name + separator + item.count
        ).join('\n');

        const file = new Blob([result], { type: 'text/csv;charset=utf-8' });

        const pseudoLink = document.createElement("a");
        pseudoLink.href = URL.createObjectURL(file);
        pseudoLink.download = "export_file.csv";
        pseudoLink.click();
        URL.revokeObjectURL(pseudoLink.href);
    } catch (error) {
        console.error(error);
    }
}

export function ImportComponent({ component, onClose }) {
    switch (component) {
        case Components.resistor: return <ResistorImport onClose={onClose} />
        case Components.capacitor: return <CapacitorImport onClose={onClose} />
        case Components.chip: return <ChipImport onClose={onClose} />
        case Components.diode: return <DiodeImport onClose={onClose} />
        case Components.optocouple: return <OptoCoupleImport onClose={onClose} />
        case Components.quartz: return <QuartzImport onClose={onClose} />
        case Components.stabilizer: return <StabilizerImport onClose={onClose} />
        case Components.transistor: return <TransistorImport onClose={onClose} />
        case Components.zenerDiode: return <DiodeZenerImport onClose={onClose} />
        case Components.other: return <OtherImport onClose={onClose} />
        default: return null;
    }
}