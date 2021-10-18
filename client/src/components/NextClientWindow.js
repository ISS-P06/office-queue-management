import { Navbar, Col, Button, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { api_callNextClient } from '../api';
import AlertBox from './Message';

import Store from '../store';

// --- Renders the application navbar
function NextClientWindow(props) {

  const [idTicket, setIdTicket] = useState( 1 || Store.get('idTicket')); /*TODO: change 1 to null and the order*/
  const [numberTicket, setNumberTicket] = useState( 1 || Store.get('numberTicket')); /*TODO: change 1 to null and the order*/

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message !== "") {
      setAlert(true);
    }
  }, [message]);

   useEffect(() => {
    if (!idTicket) { //if the id ticket is null, so the officer is not serving any client, verify if a new client is arrived
        const timeId = setTimeout(() => {
           callNextClient(props.counter.id,idTicket);
        }, 10000)
        return () => {
            clearTimeout(timeId)
        }
    }
    else{
      setAlert(false);
    }

  });


   // show error message in alert
   const handleErrors = (err) => {
    setMessage({ msg: err, type: 'danger' });
   }



  const callNextClient = () => {
   api_callNextClient(props.counter.id, idTicket).then((nextTicked)=>{
      setIdTicket(nextTicked.ticketId);
      setNumberTicket(nextTicked.ticketNumber);
      saveTicket(nextTicked.ticketId);
   }).catch((err)=>{
      handleErrors("There is no client to serve");
      setIdTicket(null);
      setNumberTicket(null);
   });
  };

  
  const saveTicket = (id) => {
    if (!id) {
      Store.set('idTicket', id);
    } else {
      Store.remove('idTicket');
    }
  };

  return (
    <>
    <AlertBox alert={alert} setAlert={setAlert} message={message} />
    <Row className="justify-content-center"> 
      <h1  className="mt-5"> Counter n°: {props && props.counter ? props.counter.number : ""} </h1>
      {idTicket?       <h3>You are serving ticket n°: {numberTicket}</h3>
      :  <h3>You are not serving anyone, click on the button for serving a client</h3> }
        <Col xs="6" md="3">
        <Button size="lg" className="mt-3" onClick={callNextClient}>
          Serve the next client
        </Button>
      </Col>
      </Row>
    
    </>
  );
}

export default NextClientWindow;
