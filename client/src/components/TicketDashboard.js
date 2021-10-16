import { Row, Col, Container, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { api_getQueueData } from '../api';

const services = [
        {id: 1, name: "service 1", currentTicket: 17, update: false},
        {id: 2, name: "service 2", currentTicket: 42, update: true},
        {id: 3, name: "service 3", currentTicket: 66, update: false},
        {id: 4, name: "service 4", currentTicket: 3, update: false}
    ];

function TicketDashboard() {
    const [queueData, setQueueData] = useState(services);
    const [queueDataChunks, setQueueDataChunks] = useState([]);
    let splo = 0;

    const getQueueData = async () => {
        try {
            const data = services;//await api_getQueueData();
            let newData;

            if (data.length == queueData.length) {
                // if the lengths are the same, update the data contained in the 
                // current array
                newData = queueData;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].currentTicket != newData[i].currentTicket) {
                        // if the ticket number has changed, set update to true 
                        // to make it blink
                        newData[i].currentTicket = data[i].currentTicket;
                        newData[i].update = true;
                    }

                    newData[i].name = data[i].name;
                }
            }
            else {
                // otherwise, it means that either it's the first request for data
                // or the number of counters has changed (i.e. the system has been reset)
                for (let d of data) {
                    d.update = true;
                }
                newData = data;
            }

            newData.sort((a, b) => {
                    return (a.id - b.id);
                });

            console.log(newData);

            setQueueData(newData);
        } catch(err) {
            console.error(err);
        }

        splo++;
        console.log("ao" + splo);
    };

    useEffect(() => {
        setInterval(() => getQueueData(), 5000);
    }, []);

    useEffect(() => {
        let chunkSize = 3;
        let newData = [];

        // split up the service data array into chunks, each with size 3 at most
        for (let i = 0; i < queueData.length; i += chunkSize) {
            newData.push(queueData.slice(i, i + chunkSize));
        }

        console.log("ao part 2 - electric boogaloo");
        console.log(newData);
        setQueueDataChunks(newData);
    }, [queueData]);
    
    return (
        <>
        <Row className="text-light">
            <h3>
                Currently serving numbers...
            </h3>
        </Row>
       
        <Row className='p-2' fluid>
            <Col xs={2}/>
            <Col xs={8}>
                {
                    queueData.length <= 0 ?
                    <Row>
                        No queue data found
                    </Row>
                    :
                    queueDataChunks.map((s, i) => {
                        console.log("spatola" + i);
                        console.log(s);
                        return (
                            <TicketPanelRow
                                key = {i}
                                ticketDataArray = {s}
                                />
                        )
                    })
                }
            </Col>
            <Col xs={2}/>
        </Row>
        </>
    );
}

function TicketPanel(props) {
    /*
        ticketData contains:
        - id
        - currentTicket
        - name
        - update
    */  
    const ticketData = props.ticketData;
    /*
        blinkState; whether the number should be shown or not
        true = show
        false = don't show
    */
    const [blinkState, setBlinkState] = useState(true);
    const [mustUpdate, setMustUpdate] = useState(false);
    const [loaded, setLoaded] = useState(false);
    let nOfBlinks = 10;

    const stopBlink = () => {
        setBlinkState(true);
        nOfBlinks = 10;
    }

    const blinkNumber = () => {
        setBlinkState(!blinkState);
        nOfBlinks--;
        
        if (nOfBlinks <= 0) {
            stopBlink();
        }
        else {
            setTimeout(blinkNumber(), 500);
        }
    }

    useEffect(() => {

    }, );

    // useEffect used to make the number blink in case of an update
    useEffect(() => {
        if (mustUpdate) {
            nOfBlinks = 10;
            blinkNumber();
        }
    }, [mustUpdate]);

    return (
        <Col xs={4}>
            <Card>
                <Card.Title>
                    {ticketData.name}
                </Card.Title>
                <Card.Body>
                    <h3>
                        {blinkState? ticketData.currentTicket : ' '}
                    </h3>
                </Card.Body>
            </Card>
        </Col>
        
    );
}

function TicketPanelRow(props) {
    const ticketDataArray = props.ticketDataArray;
    
    return (
        <Row className="pt-1 pb-1">
            {
                ticketDataArray.map((t, i) => {
                    return (
                        <TicketPanel
                            ticketData={t}/>
                    );
                })
            }
        </Row>
    );
}

export default TicketDashboard;
