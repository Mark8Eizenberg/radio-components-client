import React, { Component } from 'react'
import Alert  from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import userRoles, { getUserRoleName } from '../utils/UserRoles'

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
                </Alert>) })
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

        fetch("api/users/" + id , requestOptions)
            .then(response => {
                !response.ok && this.setState({
                    message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                        {response.json().message ?? "Unknown error"}
                    </Alert>)
                });
                this.updateUsersList();
            })
            .catch(error => console.log('error', error));

    }

    addUser(userName, password, fullName, roleId) {
        if (userName == null || userName.length < 4) {
            this.setState({
                message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                    Wrong username or length less than 4 characters
                </Alert>)
            });
            return;
        }

        if (password == null || password.length < 8) {
            this.setState({
                message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                    Wrong password or length less than 8 characters
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
                            User {response.json().name} was added succefully
                        </Alert>)
                    }) :
                    this.setState({
                        message: (<Alert variant="danger" onClose={() => this.setState({ message: null })} dismissible>
                            {response.json().message ?? "Unknown error"}
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Full name</th>
                            <th>Type of user</th>
                            <th>Action</th>
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
                                        window.confirm("Are you sure that you want DELETE user " + user.name) && this.removeUserById(user.id);
                                    }}>
                                        Remove user
                                    </button>
                                </td>
                            </tr> 
                           )}
                    </tbody>
                </Table>
                <Card>
                    <div className="container">
                        <div className="row m-2">
                            <input type="text" placeholder="Username" className="col-md-6 col-sm-12 p-1 mb-1" onChange={(e) => userName = e.target.value} />
                            <input type="password" placeholder="Password" className="col-md-6 col-sm-12 p-1 mb-1" onChange={(e) => userPassword = e.target.value} />
                            <input type="text" placeholder="User full name" className="col-md-6 col-sm-12 p-1 mb-1" onChange={(e) => userFullName = e.target.value} />
                            <select className="col-md-6 col-sm-12 p-1 mb-1" onChange={(e) => roleId = Number(e.target.value)}>
                                {userRoles.map((role, index) => <option key={role.id} value={role.id}>{role.role}</option>)}
                            </select>
                            <button className="btn btn-outline-success col-12" onClick={() => { this.addUser(userName, userPassword, userFullName, roleId); }}>
                                Add user
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
            )
    }

    render() {
        return(
        <div>
            {this.state.message != null && this.state.message}
                {this.state.loading ? <p>Loading...</p> : this.createUsersViews(this.state.users) }
            </div>
        )
    }

}