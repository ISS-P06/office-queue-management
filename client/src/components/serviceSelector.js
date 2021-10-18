import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';

const ServiceSelector = function (props) {
  const services = props.services;
  const apiInsertTicket = props.apiInsertTicket;
  return (
    <>
      <Row>
        <Col xs={{ span: 4, offset: 4 }}>
          <ListGroup variant="flush">
            {services != null ? (
              services.map((service) => (
                <ListGroup.Item>
                  <ServiceItem service={service} insertTicket={() => apiInsertTicket(service.id)} />
                </ListGroup.Item>
              ))
            ) : (
              <div />
            )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

const ServiceItem = function (props) {
  const service = props.service;
  return (
    <>
      <Card>
        <Button as="Card.Header" style={{ fontSize: '2rem' }} onClick={props.insertTicket}>
          {service.name}
        </Button>
      </Card>
    </>
  );
};

export default ServiceSelector;
