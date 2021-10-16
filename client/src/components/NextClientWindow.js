import { Navbar, Col, Button } from 'react-bootstrap';
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
    <Button variant="success" size="lg" onClick={callNextClient}> Serve the next client </Button>
  );
}

export default NextClientWindow;