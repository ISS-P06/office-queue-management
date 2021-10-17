import { Navbar, Col, Button, Row } from 'react-bootstrap';
import { useState } from 'react';
import { api_callNextClient } from '../api';

// --- Renders the application navbar
function NextClientWindow(props) {
    
  const idCounter=1;
  const idTicket=1;

  const callNextClient = () => {
   api_callNextClient(idCounter, idTicket);
  };

  return (
    <Row className="justify-content-center"> 
      <h1  className="mt-5"> Counter n°: {idCounter}</h1>
      <h3>You are serving ticket n°: {idTicket}</h3>
      <Col xs="6" md="3">
      <Button  size="lg" className="mt-3" onClick={callNextClient}> Serve the next client </Button>
      </Col>   
    </Row>

  );
}

export default NextClientWindow;