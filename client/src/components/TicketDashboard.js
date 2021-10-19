import './blink.css';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { api_getQueueData} from '../api';

// test data
const services = [
        {id: 1, name: "Service 1", currentTicket: 17, counter: 1, update: false},
        {id: 2, name: "Service 2", currentTicket: 42, counter: 1, update: true},
        {id: 3, name: "Service 3", currentTicket: 66, counter: 2, update: false},
        {id: 4, name: "Service 4", currentTicket: 3, counter: 2, update: false},
        {id: 5, name: "Service 5", currentTicket: 13, counter: 1, update: false}
    ];

function TicketDashboard() {
    const [loading, setLoading] = useState(true);
    const [queueData, setQueueData] = useState([{id: -1}]);
    const [queueDataChunks, setQueueDataChunks] = useState([]);

    const getQueueData = async () => {
        let newData = [];
        try {
            const data = await api_getQueueData();

            let updateList = [];

            if (data.length == queueData.length) {
                // if the lengths are the same, update the data contained in the 
                // current array
                newData = queueData;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].currentTicket != newData[i].currentTicket) {
                        // if the ticket number has changed, set update to true 
                        // to make it blink
                        newData[i].currentTicket = data[i].currentTicket;
                        //newData[i].update = true;
                        updateList.push(data[i].id);                        
                    }

                    newData[i].name = data[i].name;
                }
            }
            else {
                // otherwise, it means that either it's the first request for data
                // or the number of counters has changed (i.e. the system has been reset)
                for (let d of data) {
                    //d.update = true;
                    updateList.push(d.id);       
                    newData.push(d);        
                }
            }

            newData.sort((a, b) => {
                    return (a.id - b.id);
                });

            setQueueData(newData);
        } catch(err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getQueueData();
        const i = setInterval(() => getQueueData(), 10000);
        setLoading(false);

        return () => clearInterval(i);
    }, []);

    useEffect(() => {
        let chunkSize = 3;
        let newData = [];

        // split up the service data array into chunks, each with size 3 at most
        for (let i = 0; i < queueData.length; i += chunkSize) {
            newData.push(queueData.slice(i, i + chunkSize));
        }

        setQueueDataChunks(newData);
    }, [queueData]);
    
    return (
        <>
        <Row className="text-dark">
            <h3>
                Currently serving numbers...
            </h3>
        </Row>
       
        <Row className='p-1' fluid>
            <Col xs={2}/>
            <Col xs={8}>
                {
                    loading ?
                        <Row className='text-light'>
                            Loading queue data...
                        </Row>
                    :
                    queueData.length <= 0 ?
                        <Row className='text-light'>
                            No queue data found
                        </Row>
                        :
                        <QueueStatusTable
                            queueDataArray = {queueData}/>
                }
            </Col>
            <Col xs={2}/>
        </Row>
        </>
    );
}

function QueueStatusTable(props) {
    const queueDataArray = props.queueDataArray;

    return (
        <Row className="p-1 d-flex justify-content-center">
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Service</th>
                    <th>Ticket</th>
                    <th>Counter</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        queueDataArray.map((q, i) => {
                            if (q.id >= 0) {
                                let displayTicket = q.currentTicket && q.counter;

                                return (    
                                    <tr>
                                        <td>{q.name}</td>
                                        {
                                            q.update?
                                            <>
                                            <td className="blink">
                                                {displayTicket ? q.currentTicket : '-'}
                                            </td>
                                            <td className="blink">
                                                {displayTicket ? q.counter : '-'}
                                            </td>
                                            </>
                                            : 
                                            <>
                                            <td>
                                                {displayTicket ? q.currentTicket : '-'}
                                            </td>  
                                            <td>{displayTicket ? q.counter : '-'}</td>
                                            </>
                                        }
                                        
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </Table>
        </Row>
    );
}

// unused component
function TicketPanel(props) {
    /*
        ticketData contains:
        - id
        - currentTicket
        - name
        - update
    */  
    const ticketData = props.ticketData;

    return (
        <Col xs={4}>
            <Card>
                <Card.Title>
                    {ticketData.name}
                </Card.Title>
                {
                    ticketData.update === true?
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <Row class="text-center">
                                    Ticket
                                </Row>
                                <Row className='blink'>                            
                                    <h4>
                                        {ticketData.currentTicket}
                                    </h4>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row class="text-center">
                                    Counter
                                </Row>
                                <Row>
                                    <h4>
                                        {ticketData.counter}
                                    </h4>
                                </Row>
                            </Col>
                        </Row>                        
                    </Card.Body>
                    :
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <Row class="text-center">
                                    Ticket
                                </Row>
                                <Row>                            
                                    <h4>
                                        {ticketData.currentTicket}
                                    </h4>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row class="text-center">
                                    Counter
                                </Row>
                                <Row>
                                    <h4>
                                        {ticketData.counter}
                                    </h4>
                                </Row>
                            </Col>
                        </Row>  
                    </Card.Body>
                }
            </Card>
        </Col>
    );
}

// unused component
function TicketPanelRow(props) {
    const ticketDataArray = props.ticketDataArray;
    
    return (
        <Row className="p-1 d-flex justify-content-center">
            {
                ticketDataArray.map((t, i) => {
                    if (t.id >= 0) {
                        return (
                            <TicketPanel
                                ticketData={t}/>
                        );
                    }
                })
            }
        </Row>
    );
}

export default TicketDashboard;
