import Alert from 'react-bootstrap/Alert'
import { useEffect } from 'react';

function AlertBox(props) {
    const { alert, setAlert, message } = props;

    if (alert) {
        return (
            <Alert className='mt-3 pb-0' variant={message.type} onClose={() => setAlert(false)}>
            {message.type === "danger" ? <Alert.Heading >Oh snap..{message.msg}</Alert.Heading> : <></>}
        </Alert>
        );
    } else {
        return <> </>;
    }
}

export default AlertBox;