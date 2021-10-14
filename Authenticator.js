import React from 'react';
import {Form, Button} from 'react-bootstrap'
import './Authenticator.css'

class Authenticator extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value,
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    handleSubmit(event) {
        /*TO DO*/
        fetch('/api/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
          });
    }
    
    render() {

        return (
            <div className="main">
            <Form>
                <div>
                <h2>Login</h2>
                </div>
                <Form.Group calssName="mb-3">
                    <Form.Label>
                        Username:
                    </Form.Label>
                        <Form.Control 
                        className="mb-3"
                        type="text" 
                        value={this.state.username}
                        onChange = {this.handleUsernameChange}>
                    </Form.Control>
                </Form.Group>
                <Form.Group calssName="mb-3">
                    <Form.Label>
                        Password:
                    </Form.Label>
                    <Form.Control  
                        type="password"
                        value={this.state.password}
                        onChange = {this.handlePasswordChange}>
                    </Form.Control>
                </Form.Group>
                <Button 
                    variant="primary" 
                    type="submit" 
                    value="Submit" 
                    onSubmit={this.handleSubmit}>
                    Submit</Button>
            </Form>
            </div>
        );
    }
}

export default Authenticator;