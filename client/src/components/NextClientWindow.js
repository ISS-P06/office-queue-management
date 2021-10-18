import { Navbar, Col, Button, Row } from 'react-bootstrap';
import { useState } from 'react';
import { api_callNextClient } from '../api';

import Store from '../store';

// --- Renders the application navbar
function NextClientWindow(props) {
  const [idTicket, setIdTicket] = useState(Store.get('idTicket') || 0);

  const idCounter = 1;

  const callNextClient = () => {
    api_callNextClient(idCounter, idTicket)
      .then(({ nextId }) => {
        setIdTicket(nextId);
        saveTicket(nextId);
      })
      .catch((e) => console.log(e));
  };

  const saveTicket = (id) => {
    if (id !== 0) {
      Store.set('idTicket', id);
    } else {
      Store.remove('idTicket');
    }
  };

  return (
    <Row className="justify-content-center">
      <h1 className="mt-5"> Counter n°: {idCounter}</h1>
      <h3>
        {idTicket !== 0 ? `You are serving ticket n°: ${idTicket}` : 'Call the next to serve'}
      </h3>
      <Col xs="6" md="3">
        <Button size="lg" className="mt-3" onClick={callNextClient}>
          Serve the next client
        </Button>
      </Col>
    </Row>
  );
}

export default NextClientWindow;
