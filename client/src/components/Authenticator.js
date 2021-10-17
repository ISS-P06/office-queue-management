import React from 'react';
import { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import './Authenticator.css';

function Authenticator(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = () => {
        
        const credentials = { username, password };
        let valid = true;
        
        if(username === '' || password === '' || password.length < 6)
            valid = false;
      
        if(valid) {
            props.login(credentials);
        }


    };

    return (
        <div className="main">
        <Form calssName="LoginForm">
            <div>
            <h2>Login</h2>
            </div>
            <Form.Group calssName="mb-3" controlId='username'>
                <Form.Label>
                    Username:
                </Form.Label>
                <Form.Control 
                    className="mb-3"
                    type="text" 
                    onChange = {(e)=> setUsername(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group calssName="mb-3" controlId='password'>
                <Form.Label>
                    Password:
                </Form.Label>
                <Form.Control  
                    type="password"
                    onChange = {(e)=> setPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Button calssName="LoginButton"
                variant="primary"               
                onClick={handleSubmit}>
                Login</Button>
        </Form>
        </div>
    );

}

export default Authenticator;