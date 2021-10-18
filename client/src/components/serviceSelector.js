import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';

const ServiceSelector = function (props) {
  const services = props.services;
  const insertTicket = props.insertTicket;

  return (
    <Row className="p-5">
      <Row className="text-dark">
        <h3>Select a service</h3>
      </Row>
      {services != null
        ? services.map((service) => (
            <Col xs={{ span: 4 }}>
              <ServiceItem service={service} insertTicket={() => insertTicket(service.id)} />
            </Col>
          ))
        : null}
    </Row>
  );
};

const ServiceItem = function (props) {
  const service = props.service;
  return (
    <Card className="mt-3">
      <Button style={{ fontSize: '2rem' }} onClick={props.insertTicket}>
        {service.name}
      </Button>
    </Card>
  );
};

export default ServiceSelector;
