import { Card, Row, Col, Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const MyTicketList = ({ tickets, deleteAllTickets, deleteSingleTicket }) => {
  console.log(tickets);
  return (
    <Row className="p-5">
      <Row className="text-dark">
        <h3>My tickets</h3>
      </Row>
      {tickets.map((t) => (
        <Col xs={{ span: 4 }}>
          <Ticket {...t} deleteTicket={deleteSingleTicket} />
        </Col>
      ))}

      {tickets.length !== 0 ? (
        <Row className="mt-3">
          <Col>
            <Button variant="danger" onClick={() => deleteAllTickets()}>
              Delete all
            </Button>
          </Col>
        </Row>
      ) : null}
    </Row>
  );
};

const Ticket = (props) => {
  return (
    <Card className="mt-3 bg-info" style={{ fontSize: '1.2rem' }}>
      <Card.Body>
        <div>Number: {props.number}</div>
        <div>Service: {props.service.name}</div>
      </Card.Body>
      <Button variant="info" className="shadow-none" onClick={() => props.deleteTicket(props)}>
        <Trash />
      </Button>
    </Card>
  );
};

export default MyTicketList;
