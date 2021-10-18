import {Card, Col, ListGroup, Row} from "react-bootstrap";

const ServiceSelector = function (props) {

    const services = props.services;
    const apiInsertTicket = props.apiInsertTicket;
    return (<>
        <Row>
            <Col xs={{span: 4, offset: 4}}>
                <ListGroup variant="flush">
                    {services != null ? services.map(service => (<ListGroup.Item onClick={() => {
                            apiInsertTicket(service.id)
                        }}>
                            <ServiceItem service={service}/>
                        </ListGroup.Item>)) :
                        <div/>
                    }

                </ListGroup>
            </Col>
        </Row>
    </>);
}

const ServiceItem = function (props) {
    const service = props.service;
    return (<>

        <Card>
            <Card.Header style={{fontSize: '2rem', backgroundColor: 'rgb(205,225,20)'}}>{service.name}</Card.Header>
        </Card>

    </>);
}

export default ServiceSelector;