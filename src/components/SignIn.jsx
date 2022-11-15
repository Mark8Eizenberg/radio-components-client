import React, { useState, useEffect} from 'react'
import { Alert, Button, Form, Card, Container, Row, Col } from 'react-bootstrap'
import {signIn} from './helpers/api/UsersWorker'

export const SignIn = () =>{
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [message, setMessage] = useState(null);

    const submit = (e) =>{
        signIn(userName, password).then(result => {
            if(!result.isOk){
                setMessage(<Alert 
                        className='w-100'
                        variant='danger' 
                        dismissible 
                        onClose={() => setMessage(null)}
                    >Помилка авторизації: {result?.error?.message ?? "Unknown error"}</Alert>)
                } else {
                    window.location.href = '/';
                }
            });
        e.preventDefault();
    }

    return <>
    {message}
    <Container>
        <Row className='d-flex justify-content-center'>
            <Card className='col-md-6 mt-5 p-0'>
                <Card.Header>Вхід</Card.Header>
                <Card.Body>
                    <Form action='/' onSubmit={submit}>
                        <Form.Group controlId='username'>
                            <Form.Label>Нікнейм</Form.Label>
                            <Form.Control type='text' placeholder='username' onChange={e => setUserName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type='password' placeholder='password' onChange={e => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button variant='success' type='submit' className='w-100 mt-2'>
                            Увійти
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Row>    
    </Container>
    </>
}