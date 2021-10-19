import React from 'react';
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './Authenticator.css';

function Authenticator(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    const credentials = { username, password };
    let valid = true;

    if (username === '' || password === '' || password.length < 5) valid = false;

    if (valid) {
      props.login(credentials);
    } else {
      setErrorMessage('Error(s) in the form, please fix it.');
    }
  };

  return (
    <div className="main">
      <Form className="LoginForm">
        <div>
          <h2>Login</h2>
        </div>
        {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : ''}
        <Form.Group calssName="mb-3" controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            className="mb-3"
            type="text"
            value={username}
            placeholder="Insert username"
            onChange={(e) => setUsername(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            className="mb-3"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Button id="login-button" variant="primary" onClick={handleSubmit}>
          Login
        </Button>
      </Form>
    </div>
  );
}

export default Authenticator;
