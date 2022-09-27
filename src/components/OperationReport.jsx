import React, { Component } from 'react';
import DateTimePicker from './helpers/DateTimePicker';
import UserPicker from './helpers/UserPicker';
import {
    Card,
    Collapse,
    Table,
    Alert,
    Button, ButtonGroup,
    Container, Row, Col
} from 'react-bootstrap';
import DropDownCard from './helpers/DropDownCard';

export default class OperationReport extends Component {
    static displayName = OperationReport.name;

    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            loading: true,
            page: 0,
            totalPages: 0,
            totalCount: 0,
            countOnPage: 50,
            filters : { needDateFrom: false, needDateTo: false, needUserId: false },
            dataHandlers : { dateFrom: null, dateTo: null, userId: null },
            message: null
        };
        this.populateReports = this.populateReports.bind(this);
        this.getPageSwitcher = this.getPageSwitcher.bind(this);
    }

    #getEditedDictionary(dictName, name, val) {
        var prev = this.state[dictName];
        prev[name] = val;
        return prev;
    }

    componentDidMount() {
        this.populateReports()
    }

    populateReports(page) {
        this.setState({ loading: true , page: page ?? 0});
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "page": page,
            "countOnPage": this.state.countOnPage
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        var url = "api/storage/OperationsReadeble/?"
            + (this.state.filters.needUserId ? "userId=" + this.state.dataHandlers.userId + '&' : "")
            + (this.state.filters.needDateFrom ? "dateFrom=" + this.state.dataHandlers.dateFrom + '&' : '')
            + (this.state.filters.needDateTo ? "dateTo=" + this.state.dataHandlers.dateTo + '&' : '');

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok)
                    return response.json();
                this.setState({
                    message: <Alert dismissible variant="danger"
                        onClose={() => { this.setState({ message: null }) }}>{response.json().message ?? "Unknown error"}</Alert>
                });
            })
            .then(result => {
                this.setState({
                    loading: false,
                    reports: result.items,
                    totalCount: result.totalCount,
                    totalPages: result.totalPages,

                }) })
            .catch(error => console.log('error', error));
    }

    static showReportsTable(reports) {
        return reports && (<Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>User</th>
                    <th>Operation type</th>
                    <th>Component</th>
                    <th>Count</th>
                    <th>DateTime</th>
                </tr>
            </thead>
            <tbody>
            {reports.map((operation) =>
                <tr key={operation.id}>
                    <td>{operation.id}</td>
                    <td>{operation.user?.fullName ?? "Unknown"}</td>
                    <td>{operation.operationType}</td>
                    <td>{operation.radioComponent?.name ?? "Unknown"}</td>
                    <td>{operation.count}</td>
                    <td>{new Date(operation.dateTime).toLocaleDateString() + " " + new Date(operation.dateTime).toLocaleTimeString()}</td>
                </tr>
                )}
            </tbody>
        </Table>)
    }

    getPageSwitcher() {
        let pages = new Array();
        if (this.state.totalPages < 5) {
            for (let i = 0; i < this.state.totalPages; i++) {
                pages.push({
                    id: i, content: i + 1, disable: false, callback: () =>
                    {
                        this.populateReports(i);
                    }, variant: "info"
                });
            }
        } else {
            pages.push({
                id: 0, content: 1, disable: false, callback: () => {
                    this.populateReports(0);
                }, variant: "info"
            });
            pages.push({
                id: 1, content: 2, disable: false, callback: () => {
                    this.populateReports(1);
                }, variant: "info"
            });
            pages.push({ id: 2, content: "Current page: " + (this.state.page + 1), disable: true, callback: null, variant: "info" });
            pages.push({
                id: this.state.totalPages - 2, content: this.state.totalPages - 1, disable: false, callback: () => {
                    this.populateReports(this.state.totalPages - 2);
                }, variant: "info"
            });
            pages.push({
                id: this.state.totalPages - 1, content: this.state.totalPages, disable: false, callback: () => {
                    this.populateReports(this.state.totalPages - 1);
                }, variant: "info"
            });
        }
        return this.state.totalPages > 1 ? (<ButtonGroup className="me-2">
            <Button disabled={this.state.page == 0} onClick={() => {
                this.populateReports(this.state.page - 1);
            }} variant="info">Previous</Button>
            {pages.map(p => <Button disabled={p.disable || this.state.page == p.id } key={p.id} onClick={p.callback} variant={p.variant}>{p.content}</Button>) }
            <Button disabled={this.state.page + 1 >= this.state.totalPages} onClick={() => {
                this.populateReports(this.state.page + 1);
            }} variant="info">Next</Button>
        </ButtonGroup>) : null
    }

    searchFilterUpdateData() {
        return <>
            <DropDownCard name={"Search filters"} show={false}>
                <Container>
                    <Row className="p-2">
                        <Col>
                            <label>Date from</label>
                            <input type="checkbox" value={this.state.filters.needDateFrom} onChange={(e) => {
                                if (this.state.filters.needDateFrom != e.target.checked)
                                    this.setState({ filters: this.#getEditedDictionary('filters', 'needDateFrom', e.target.checked) });
                            }}></input>
                        </Col>
                        <Col>
                            <DateTimePicker callbackToGetDate={(dateTime) => {
                                if (this.state.dataHandlers.dateFrom != dateTime) {
                                    this.setState({ dataHandlers: this.#getEditedDictionary('dataHandlers', 'dateFrom', dateTime)});
                                }
                            }} />
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col>
                            <label>Date to</label>
                            <input  type="checkbox" value={this.state.filters.needDateTo} onChange={(e) => {
                                if (this.state.filters.needDateTo != e.target.checked)
                                    this.setState({ filters: this.#getEditedDictionary('filters', 'needDateTo', e.target.checked) });
                            }}></input>
                        </Col>
                        <Col>
                            <DateTimePicker callbackToGetDate={(dateTime) => {
                                if (this.state.dataHandlers.dateTo != dateTime) {
                                    this.setState({ dataHandlers: this.#getEditedDictionary('dataHandlers', 'dateTo', dateTime) });
                                }
                            }} />
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col>
                            <label>User</label>
                            <input type="checkbox" value={this.state.filters.needUserId} onChange={(e) => {
                                if (this.state.filters.needUserId != e.target.checked)
                                    this.setState({ filters: this.#getEditedDictionary('filters', 'needUserId', e.target.checked) });
                            }}></input>
                        </Col>
                        <Col>
                            <UserPicker calbackToSetUser={(user) => {
                                if (this.state.dataHandlers.userId != user) {
                                    this.setState({ dataHandlers: this.#getEditedDictionary('dataHandlers', 'userId', user) });
                                }
                            }} />
                        </Col>
                    </Row>
                    <Row><Button onClick={() => {
                        this.populateReports(0);
                    }}>Search</Button></Row>
                </Container>
            </DropDownCard>
           
        </>

    }

    render() {
        
        return (
            <>
                <h2 className="text-center">Operation reports</h2>
                {this.state.message}
                {this.searchFilterUpdateData()}
                <Card className="mt-2">
                    <Card.Header>
                        <Container>
                            <Row>
                                <Col>
                                    <p>Rows on page:</p>
                                </Col>
                                <Col>
                                    <input type="number" defaultValue={this.state.countOnPage} onChange={(e) => { this.setState({ countOnPage: e.target.value }) } }/>
                                </Col>
                                <Col>
                                    <Button onClick={() => { this.populateReports(0); } }>Set count</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Header>
                    <div className="m-2">{this.state.loading ? <p>Loading...</p> : OperationReport.showReportsTable(this.state.reports)}</div>
                    <div className="d-flex justify-content-center m-2">{this.getPageSwitcher()}</div>
                </Card>
            </>
        );
    }

    
}
