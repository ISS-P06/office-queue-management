import { Row, Col, Container,  } from 'react-bootstrap';
import { useState } from 'react';

const services = [
        {id: 1, name: "service 1", currentTicket: 17, update: false},
        {id: 2, name: "service 2", currentTicket: 42, update: false},
        {id: 3, name: "service 3", currentTicket: 66, update: false}
    ];

function TicketDashboard(props) {
    const [serviceData, setServiceData] = useState(services);

    useEffect(() => {
        
    }, []);
    
    return (
        <Container >
            <Col xs={2}/>
            <Col>
                
            </Col>
            <Col xs={2}/>
        </Container>
    );
}

function TicketPanel(props) {
    const ticketNumber = props.ticketNumber;
    const serviceName = props.serviceName;

    return (
        <Container>
            <Col xs={4}>
                
            </Col>
        </Container>
    );
}

function TicketPanelRow(props) {
    const ticketData = props.ticketData;

    return(
        <Container>
            
        </Container>
    )
}

export default TicketDashboard;
