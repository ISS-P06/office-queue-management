import {Navbar, Col, Button} from "react-bootstrap"; 
import {IoTicket} from "react-icons/io5";
import {useHistory} from "react-router-dom";
import {useState} from 'react';

// --- Renders the application navbar
function AppNavbar(props) {
    const loggedIn = props.loggedIn;
    const doLogout = props.doLogout;
    const history = useHistory();

    const handleClick = (path) => {
        history.push(path);
        props.doLogin();
    } 

    return (
        <Navbar className="bg-primary text-light" fluid>
            <Col className="d-flex justify-content-start">
                <IoTicket className = "p-1" size = "40"/>
                <h3>Office Queue Manager</h3>
            </Col>
            <Col
                className="pe-3 d-flex justify-content-end">
                {
                    loggedIn ?
                        <>
                            <LogoutButton
                                doLogout = {doLogout}/>
                        </>
                        :
                        <>
                            <Button variant="secondary" onClick={() => handleClick("/login")}>
                                Login
                            </Button>
                        </>
                }
            </Col>
        </Navbar>
    );
}

// --- Renders a logout button
//      Used in AppNavbar above
function LogoutButton(props) {
    return(
        <Button 
            className = "m-2"
            variant="secondary outline-light" 
            onClick={props.doLogout}>
            Logout
        </Button>
    )
}

export default AppNavbar;