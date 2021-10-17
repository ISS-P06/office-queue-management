import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';


const CounterConfiguration = (props) => {

    const { serviceList, counterList, offeredServiceList, officerList, onBack } = props;

    return (
        <Container>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <Row className="align-items-center mt-3 mb-3">
                        <Col><h2 className="float-start">Configure Counters</h2></Col>
                        <Col><h6 className="float-end">(step 2 of 2)</h6></Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <CounterForm serviceList={serviceList}></CounterForm>
                    <CounterTable counterList={counterList} offeredServiceList={offeredServiceList} officerList={officerList}></CounterTable>
                    <Row >
                        <Col xs={{ span: 2, offset: 0 }}>
                            <Link to={'/setup/services'}>
                                <Button className="mb-4" variant='primary'>Back</Button>
                            </Link>
                        </Col>
                        <Col xs={{ span: 2, offset: 8 }}>
                            {/*<Link to={'/setup/services'}>
                                <Button className="mt-2 mb-4 float-end" variant='primary' onClick={onNext}>Done</Button>
                            </Link>*/}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

const CounterForm = (props) => {
    const { serviceList } = props;

    return (
        <Row>
            <Col xs={{ span: 6, offset: 3 }}>
                <h5 className="text-center mb-4">Add new counter</h5>
                <Form>
                    <Form.Group className="mb-3" controlId='selectedScore'>
                        <Form.Label>Services offered</Form.Label>
                        <Form.Control as="select" multiple htmlSize={serviceList.length}>
                            {
                                serviceList.map(s => {
                                    return (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    );
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId='selectedCourse'>
                        <Form.Label>Officier name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId='selectedCourse'>
                        <Form.Label>Officier password</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Col md={{ span: 1, offset: 5 }}>
                        <Button className="mb-5" variant='success'>Add</Button>
                    </Col>
                </Form></Col>
        </Row>
    );
}

const CounterTable = (props) => {

    const { counterList, offeredServiceList, officerList } = props;

    return (<>
        <h5 className="text-center">Existing counters</h5>
        <Table responsive striped bordered>
            <thead>
                <tr>
                    <th>Counter name</th>
                    <th>Officer name</th>
                    <th>Services offered</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    counterList.map(c => {
                        return (
                            <tr key={c.id}>
                                <td className="align-middle">Counter {c.id}</td>
                                <td className="align-middle">
                                    {officerList.filter(o => o.id == c.officer).map(o => o.username)}
                                </td>
                                <td className="align-middle">
                                    { offeredServiceList.filter(i => i.counter_id == c.id).map(os => os.service_name).join(", ") }
                                </td>
                                <td></td>
                                {/*<td className="align-middle"><Button disabled={s.status} variant="danger" className="shadow-none d-inline-flex align-items-center" onClick={() => onDelete(s)}><Trash className="mb-1 mt-1"/></Button></td>*/}
                            </tr>
                        );
                    })
                }
            </tbody>
        </Table>
    </>
    );

}

export default CounterConfiguration;