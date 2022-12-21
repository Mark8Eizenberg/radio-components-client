import React, { Component } from 'react'
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import userRoles, { getUserRoleName } from '../utils/UserRoles'
import { Button, Form, InputGroup } from 'react-bootstrap'

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], loading: true, message: null };
    }

    componentDidMount() {
        this.updateUsersList();
    }

    async updateUsersList() {
        this.setState({ loading: true, users: [] });
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch("/api/users", requestOptions)
        const data = await response.json();
        if (response.ok) {
            this.setState({ users: data, loading: false });
        } else {
            this.setState({
                message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                    {data.message}
                </Alert>)
            })
        }

    }

    removeUserById(id) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("api/users/" + id, requestOptions)
            .then(response => {
                !response.ok && this.setState({
                    message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                        {response.json().message ?? "Невідома помилка"}
                    </Alert>)
                });
                this.updateUsersList();
            })
            .catch(error => console.log('error', error));

    }

    addUser(userName, password, fullName, roleId) {
        if (userName == null || userName.length < 3) {
            this.setState({
                message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                    Нікнейм користувача закороткий або невірний
                </Alert>)
            });
            return;
        }

        if (password == null || password.length < 8) {
            this.setState({
                message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                    Довжина пароль повинна бути більше 7 символів
                </Alert>)
            });
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userName": userName,
            "password": password,
            "fullName": fullName ?? userName,
            "roleId": roleId
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("api/users/", requestOptions)
            .then(response => {
                response.ok ?
                    this.setState({
                        message: (<Alert variant="success" onClose={() => this.setState({ message: null })} dismissible>
                            Користувача {response.json().name} успішно додано
                        </Alert>)
                    }) :
                    this.setState({
                        message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                            {response.json().message ?? "Невідома помилка"}
                        </Alert>)
                    });
                this.updateUsersList();
            })
            .catch(error => console.log('error', error));
    }

    createUsersViews = (users) => {

        var userName = null;
        var userPassword = null;
        var userFullName = null;
        var roleId = 1;

        return (
            <div>
                <div className='d-flex justify-content-center'>
                </div>
                <Card className='m-2'>
                    <Card.Header>
                        <h2>Список користувачів</h2>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Нікнейм</th>
                                    <th>Повне ім'я</th>
                                    <th>Тип користувача</th>
                                    <th>Дії</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.fullName}</td>
                                        <td>{getUserRoleName(user.userRoleId)}</td>
                                        <td>
                                            <button className="btn btn-outline-danger w-100" onClick={() => {
                                                window.confirm("Чи впевнені ви, що хочете ВИДАЛИТИ користувача " + user.name) && this.removeUserById(user.id);
                                            }}>
                                                Видалити користувача
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                <Card className='m-2'>
                    <Card.Header>
                        <h2>Додати нового користувача</h2>
                    </Card.Header>
                    <Card.Body>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text >Нікнейм</InputGroup.Text>
                            <Form.Control
                                aria-label="Nickname"
                                placeholder='Нікнейм'
                                onChange={(e) => {
                                    userName = e.target.value
                                }}
                            />
                        </InputGroup>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text >Пароль</InputGroup.Text>
                            <Form.Control
                                type="password"
                                aria-label="capacity"
                                placeholder='Password'
                                onChange={(e) => {
                                    userPassword = e.target.value
                                }}
                            />
                        </InputGroup>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text >Повне ім'я</InputGroup.Text>
                            <Form.Control
                                aria-label="capacity"
                                placeholder='Full Name'
                                onChange={(e) => {
                                    userFullName = e.target.value
                                }}
                            />
                        </InputGroup>
                        <InputGroup className='mb-1'>
                            <InputGroup.Text >Тип користувача</InputGroup.Text>
                            <Form.Select
                                onChange={(e) => {
                                    roleId = Number(e.target.value);
                                }}
                            >
                                {userRoles.map((role, index) => <option key={role.id} value={role.id}>{role.role}</option>)}
                            </Form.Select>
                        </InputGroup>
                        <Button variant="outline-success" className='w-100' onClick={() => { this.addUser(userName, userPassword, userFullName, roleId); }}>Додати користувача</Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.message != null && this.state.message}
                {this.state.loading ? <p>Триває завантаження ...</p> : this.createUsersViews(this.state.users)}
            </div>
        )
    }

}