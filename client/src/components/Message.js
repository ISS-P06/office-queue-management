import { Alert } from 'react-bootstrap/';
import { useEffect } from 'react';

function AlertBox(props) {
    const { alert, setAlert, message } = props;

    // On componentDidMount set the timer
    useEffect(() => {
        if (alert) {
            const timeId = setTimeout(() => {
                // After 4 seconds set the show value to false
                setAlert(false)
            }, 4000)
            return () => {
                clearTimeout(timeId)
            }
        }
    }, [alert, setAlert]);


    if (alert) {
        return (
            <Alert className='mt-3 pb-0' variant={message.type} onClose={() => setAlert(false)} dismissible>
            {message.type === "danger" ? <Alert.Heading>Oh snap..{message.msg}</Alert.Heading> : <></>}
        </Alert>
        );
    } else {
        return <> </>;
    }
}

export default AlertBox;