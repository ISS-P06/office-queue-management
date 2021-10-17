import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';

const CounterConfiguration = (props) => {

    const { serviceList, onBack } = props;

    return (<>
        <Row>
            <Col md={{ span: 8, offset: 2 }}>
                <Row className="align-items-center">
                    <Col><h2>Configure Counters</h2></Col>
                    <Col><h6 className="float-end">(step 2 of 2)</h6></Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col md={{ span: 8, offset: 2 }}>

                <CounterForm serviceList={serviceList}></CounterForm>

                <CounterTable></CounterTable>
                <Row >
                    <Col xs={{ span: 2, offset: 0 }}>
                        <Button className="mb-4" variant='primary' onClick={onBack}>Back</Button>
                    </Col>
                    <Col xs={{ span: 2, offset: 8 }} >
                        <Button className="mb-4 float-end" variant='primary'>Done</Button>
                    </Col>
                </Row>
            </Col></Row>
    </>
    );
}

const CounterForm = (props) => {
    const { serviceList } = props;

    return (
        <Row>
            <Col xs={{ span: 6, offset: 3 }}>
                <h5 className="text-center mb-0">Add new counter</h5>
                <Form>
                    <Form.Group className="mb-2" controlId='selectedCourse'>
                        <Form.Label>Counter name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId='selectedScore'>
                        <Form.Label>Services offered</Form.Label>
                        <Form.Control as="select" multiple htmlSize={serviceList.length}>
                            {
                                serviceList.map(s => {
                                    return (
                                        <option value={s.id}>{s.name}</option>
                                    );
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId='selectedCourse'>
                        <Form.Label>Officier name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId='selectedCourse'>
                        <Form.Label>Officier password</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Col md={{ span: 1, offset: 5 }}>
                        <Button className="mb-4" variant='success'>Add</Button>
                    </Col>
                </Form></Col>
        </Row>
    );
}

const CounterTable = (props) => {
    return (<>
        <h5 className="text-center">Existing counters</h5>
        <Table responsive striped bordered>
            <thead>
                <tr>
                    <th>Counter name</th>
                    <th>Services offered</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Counter 1</td>
                    <td>Service 1, Service 2</td>
                </tr>
                <tr>
                    <td>Counter 2</td>
                    <td>Service 3</td>
                </tr>
            </tbody>
        </Table>
    </>
    );

}

export default CounterConfiguration;