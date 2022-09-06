import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

const LoginToChatComponent = (props) => {
  const loginRef = React.useRef("");

  const validateAndConnectToChat = (username) => {
    const res = /^[A-Za-z0-9_.]+$/.exec(username);
    if (res && username.length > 3) {
      props.connectToChat(username, "");
    } else
      props.displayMessageBox({
        variant: "warning",
        text: "Username must contains at least 4 characters and letters case insensitive (a-z), numbers (0-9), Dots (.), Underscores (_)",
        title: "Invalid username",
      });
  };

  return (
    <Row>
      <Col>
        <Form>
          <Form.Group className="mb-3" controlId="formUserName">
            <Form.Label>
              Welcome to ChatAppp! Please provide your username.
            </Form.Label>
            <Form.Control type="text" placeholder="Username" ref={loginRef} />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={!props.isConnectedWithHub}
            onClick={(event) => {
              event.preventDefault();
              validateAndConnectToChat(loginRef.current.value);
            }}
          >
            Connect
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginToChatComponent;
