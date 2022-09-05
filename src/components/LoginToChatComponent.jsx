import React from 'react';
import { Row, Col, Form, Button } from "react-bootstrap";

const LoginToChatComponent = (props) => {
    return (
        <Row>
            <Col>
                <Form>
                    <Form.Group className="mb-3" controlId="formUserName">
                        <Form.Label>Welcome to ChatAppp! Please provide your username.</Form.Label>
                        <Form.Control type="text" placeholder="Username" />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={!props.isConnectedWithHub}>
                        Connect
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default LoginToChatComponent;