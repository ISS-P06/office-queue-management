import { Navbar, Col, Button, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { api_callNextClient } from '../api';
import AlertBox from './Message';

// --- Renders the application navbar
function NextClientWindow(props) {

  const [idTicket, setIdTicket] = useState(1);
  const idCounter=1;

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
           callNextClient(idCounter,idTicket);
        }, 10000)
        return () => {
            clearTimeout(timeId)
        }
    }
  });


   // show error message in alert
   const handleErrors = (err) => {
    setMessage({ msg: err, type: 'danger' });
   }

    // On componentDidMount set the timer
    useEffect(() => {
      if (alert) {
          const timeId = setTimeout(() => {
              // After 5 seconds set the show value to false
              setAlert(false)
          }, 5000)
          return () => {
              clearTimeout(timeId)
          }
      }
  }, [alert, setAlert]);


  const callNextClient = () => {
   const nextTickedID=api_callNextClient(idCounter, idTicket).then((nextTickedID)=>{
      setIdTicket(nextTickedID);
   }).catch((err)=>{
      handleErrors("There is no client to serve");
      setIdTicket(null);
   });
  };

  return (
    <>
    <AlertBox alert={alert} setAlert={setAlert} message={message} />
    <Row className="justify-content-center"> 
      <h1  className="mt-5"> Counter n°: {idCounter}</h1>
      {idTicket?       <h3>You are serving ticket n°: {idTicket}</h3>
      :  <h3>You are not serving anyone, click on the button for serving a client</h3> }

      <Col xs="6" md="3">
      <Button  size="lg" className="mt-3" onClick={callNextClient}> Serve the next client </Button>
      </Col>   
    </Row>
    </>

  );
}

export default NextClientWindow;