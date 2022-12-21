import { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { downloadDatasheetById } from "./api/DatasheetWorker";
import './PdfViewer.css';

const PdfViewer = ({ fileId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        downloadDatasheetById(localStorage.token, fileId)
            .then((result) => {
                setLoading(false);
                if (result.isOk) {
                    setFile(result.data);
                } else {
                    setError(result.error);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }, [fileId]);

    const fileToPdfWiev = (file) => {
        const url = window.URL.createObjectURL(file);

        return <div className="--pdf-viewer-container" onClick={onClose}>
            <iframe title="Datasheet" className="--pdf-viewer" src={url} />
        </div>
    }

    return <>
        {loading ?
            <Spinner variant="grow" /> :
            <>
                {error && <Alert variant="danger" dismissible onClose={onClose}>Помилка завантаження файлу</Alert>}
                {file && fileToPdfWiev(file)}
            </>}
    </>
}

export default PdfViewer;