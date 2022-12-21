import { useRef, useState } from 'react'
import { Alert, Button, Row, Col, Form, InputGroup, ProgressBar } from 'react-bootstrap';
import {
    addDatasheet, deleteDatasheetById,
    unSetDatasheetFromComponent,
    setDatasheetToComponent
} from './api/DatasheetWorker.js'
import "./DatasheetWorker.css";

export function ChangeDatasheet({ componentId, oldFileId, onClose }) {
    const [message, setMessage] = useState(null);
    const inputGroupRef = useRef(null);
    const fileInputRef = useRef(null);
    const progressRef = useRef(null);

    const setProgress = (progress) => {
        if (progressRef.current) {
            progressRef.current.firstChild.ariaValueNow = progress;
            progressRef.current.firstChild.style.width = `${progress}%`;
        }
    }

    const setErrorAndQuit = (errorMessage) => {
        if (inputGroupRef.current) {
            inputGroupRef.current.style.display = "none";
        }

        setMessage(<Alert variant='danger' dismissible onClose={onClose}>{errorMessage}</Alert>)
    }

    const setError = (errorMessage) => {
        setMessage(<Alert variant='danger' dismissible onClose={() => setMessage(null)}>{errorMessage}</Alert>)
    }

    const ChangingFile = async () => {
        if (inputGroupRef.current && fileInputRef.current) {

            var newDatasheet = fileInputRef.current.files[0];

            if (!newDatasheet) {
                setError("Спочатку необхідно обрати файл");
                return;
            }

            inputGroupRef.current.style.display = "none";
            progressRef.current.style.display = "flex";

            setProgress(10);
            var responceResult = await addDatasheet(localStorage.token, newDatasheet);

            if (!responceResult.isOk) {
                setErrorAndQuit("Не вдалося завантажити файл");
                return;
            }

            setProgress(20);
            const newFileId = responceResult.fileId;

            responceResult = await unSetDatasheetFromComponent(localStorage.token, oldFileId, componentId);
            if (!responceResult.isOk) {
                setErrorAndQuit("Не вдалося відв'язати файл");
                return;
            }
            setProgress(40);

            responceResult = await setDatasheetToComponent(localStorage.token, newFileId, componentId);
            if (!responceResult.isOk) {
                setErrorAndQuit("Не вдалося прив'язати файл до компоненту");
                return;
            }
            setProgress(60);

            deleteDatasheetById(localStorage.token, oldFileId);
            setProgress(100);

            setMessage(<Alert variant='success' dismissible onClose={onClose}>
                Даташит успішно заміненно
            </Alert>)

        }
        return;
    }

    return <div className='--edit-datasheet-background'>
        <div className='--edit-datasheet-container'>
            {message}
            <ProgressBar ref={progressRef} animated striped now={0} style={{ display: 'none' }} />
            <InputGroup ref={inputGroupRef}>
                <Form.Control ref={fileInputRef} type='file' />
                <Button variant='outline-success' onClick={ChangingFile}>Замінити</Button>
                <Button variant='outline-danger' onClick={onClose}>Скасувати</Button>
            </InputGroup>
        </div>
    </div>
}

export function AddDatasheetForEmpty({ componentId, onClose }) {
    const [message, setMessage] = useState(null);
    const inputGroupRef = useRef(null);
    const fileInputRef = useRef(null);
    const progressRef = useRef(null);

    const setProgress = (progress) => {
        if (progressRef.current) {
            progressRef.current.firstChild.ariaValueNow = progress;
            progressRef.current.firstChild.style.width = `${progress}%`;
        }
    }

    const setErrorAndQuit = (errorMessage) => {
        if (progressRef.current) {
            progressRef.current.style.display = "none";
        }

        if (inputGroupRef.current) {
            inputGroupRef.current.style.display = "none";
        }

        setMessage(<Alert variant='danger' dismissible onClose={onClose}>{errorMessage}</Alert>)
    }

    const setError = (errorMessage) => {
        setMessage(<Alert variant='danger' dismissible onClose={() => setMessage(null)}>{errorMessage}</Alert>)
    }

    const AddFile = async () => {
        if (inputGroupRef.current && fileInputRef.current && progressRef.current) {

            var newDatasheet = fileInputRef.current.files[0];

            if (!newDatasheet) {
                setError("Спочатку необхідно обрати файл");
                return;
            }

            inputGroupRef.current.style.display = "none";
            progressRef.current.style.display = "flex";

            setProgress(10);

            var responceResult = await addDatasheet(localStorage.token, newDatasheet);

            if (!responceResult.isOk) {
                setErrorAndQuit("Не вдалося завантажити файл");
                return;
            }
            setProgress(50);

            const newFileId = responceResult.fileId;


            responceResult = await setDatasheetToComponent(localStorage.token, newFileId, componentId);
            if (!responceResult.isOk) {
                setErrorAndQuit("Не вдалося прив'язати файл до компоненту");
                return;
            }
            setProgress(100);

            setMessage(<Alert variant='success' dismissible onClose={onClose}>
                Даташит успішно додано
            </Alert>)

        }
        return;
    }

    return <div className='--edit-datasheet-background'>
        <div className='--edit-datasheet-container'>
            {message}
            <ProgressBar ref={progressRef} animated striped now={0} style={{ display: 'none' }} />
            <InputGroup ref={inputGroupRef}>
                <Form.Control ref={fileInputRef} type='file' />
                <Button variant='outline-success' onClick={AddFile}>Додати</Button>
                <Button variant='outline-danger' onClick={onClose}>Скасувати</Button>
            </InputGroup>
        </div>
    </div>
}

export function DeleteDatasheetFromComponent({ componentId, fileId, onClose }) {
    const [message, setMessage] = useState(null);
    const progressRef = useRef(null);
    const askingRef = useRef(null);

    const setProgress = (progress) => {
        if (progressRef.current) {
            progressRef.current.firstChild.ariaValueNow = progress;
            progressRef.current.firstChild.style.width = `${progress}%`;
        }
    }

    const setErrorAndQuit = (errorMessage) => {
        setMessage(<Alert variant='danger' dismissible onClose={onClose}>{errorMessage}</Alert>)
    }

    const RemoveFile = async () => {

        if (askingRef.current) {
            askingRef.current.style.display = 'none';
        }

        progressRef.current.style.display = "flex";
        setProgress(10);

        var responceResult = await unSetDatasheetFromComponent(localStorage.token, fileId, componentId);
        if (!responceResult.isOk) {
            setErrorAndQuit("Не вдалося відв'язати файл");
            return;
        }
        setProgress(50);

        responceResult = await deleteDatasheetById(localStorage.token, fileId);
        setProgress(100);

        setMessage(<Alert variant='success' dismissible onClose={onClose}>
            Даташит успішно видалено
        </Alert>)
        return;
    }

    return <div className='--edit-datasheet-background'>
        <div className='--edit-datasheet-container'>
            {message}
            <ProgressBar ref={progressRef} animated striped now={0} style={{ display: 'none' }} />
            <Col ref={askingRef}>
                <Row>
                    <Col style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '0.2em'
                    }}><h4>Ви впевнені що хочете видалити даташит?</h4></Col>
                </Row>
                <Row>
                    <Col><Button className='w-100' variant='success' onClick={RemoveFile}>Yes</Button></Col>
                    <Col><Button className='w-100' variant='danger' onClick={onClose}>No</Button></Col>
                </Row>
            </Col>
        </div>
    </div>
}