import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CounterConfiguration = (props) => {
  const { serviceList, counterList, offeredServiceList, officerList, onAdd, onDelete, onBack } =
    props;

  return (
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row className="align-items-center mt-3 mb-3">
            <Col>
              <h2 className="float-start">Configure Counters</h2>
            </Col>
            <Col>
              <h6 className="float-end">(step 2 of 2)</h6>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <CounterForm
            serviceList={serviceList}
            counterList={counterList}
            officerList={officerList}
            onAdd={onAdd}></CounterForm>
          <CounterTable
            counterList={counterList}
            offeredServiceList={offeredServiceList}
            officerList={officerList}
            onDelete={onDelete}></CounterTable>
          <Row>
            <Col xs={{ span: 2, offset: 0 }}>
              <Link to={'/setup/services'}>
                <Button className="mt-2 mb-4 float-start" variant="primary">
                  Back
                </Button>
              </Link>
            </Col>
            <Col xs={{ span: 2, offset: 8 }}>
              <Button
                className="mt-2 mb-4 float-end"
                variant="primary"
                onClick={() => props.logout()}>
                Done
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const CounterForm = (props) => {
  const { serviceList, counterList, officerList, onAdd } = props;

  const [services, setServices] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (services.length == 0) {
      setValidated(true);
    }

    // check if form is valid using HTML constraints
    if (!form.checkValidity()) {
      setValidated(true); // enables bootstrap validation error report
    } else {
      // we must re-compose the service object from its separated fields
      const newOfficer = Object.assign({}, { username, password });
      onAdd(newOfficer, services);
    }
  };

  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        <h5 className="text-center mb-4">Add new counter</h5>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="selectedScore">
            <Form.Label>Services offered{/*services.toString()*/}</Form.Label>
            <Form.Control
              required
              as="select"
              multiple
              htmlSize={serviceList.length}
              onChange={(e) =>
                setServices([].slice.call(e.target.selectedOptions).map((item) => item.value))
              }>
              {serviceList.map((s) => {
                return (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                );
              })}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide at least one choice.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="form-name">
            <Form.Label>Officer name</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter officer name"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              required
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Please provide a officer name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4" controlId="selectedCourse">
            <Form.Label>Officer password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Col md={{ span: 1, offset: 5 }}>
            <Button className="mb-5" variant="success" type="submit">
              Add
            </Button>
          </Col>
        </Form>
      </Col>
    </Row>
  );
};

const CounterTable = (props) => {
  const { counterList, offeredServiceList, officerList, onDelete } = props;

  return (
    <>
      <h5 className="text-center mb-3">Existing counters</h5>
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
          {counterList.map((c) => {
            return (
              <tr key={c.id}>
                <td className="align-middle">Counter {c.id}</td>
                <td className="align-middle">
                  {officerList.filter((o) => o.id == c.officer).map((o) => o.username)}
                </td>
                <td className="align-middle">
                  {offeredServiceList
                    .filter((i) => i.counter_id == c.id)
                    .map((os) => os.service_name)
                    .join(', ')}
                </td>
                <td className="align-middle">
                  <Button
                    disabled={c.status}
                    variant="danger"
                    className="shadow-none d-inline-flex align-items-center"
                    onClick={() => onDelete(c)}>
                    <Trash className="mb-1 mt-1" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default CounterConfiguration;
