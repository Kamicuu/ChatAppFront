import React, { Component } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import ChatMessageComponent from "./ChatMessageComponent";

class MainChatComponent extends Component {
  constructor(props) {
    super(props);
    this.chatTextareaRef = React.createRef();
    this.state = {
      chatMessages: [],
      disableSendButtond: false,
    };
  }

  componentDidMount() {
    this.props.signalRConnection.on("ReciveMessage", (message) => {
      this.handleMessage(message);
    });
  }

  componentWillUnmount() {
    this.props.signalRConnection.off("ReciveMessage");
  }

  handleMessage = (message) => {
    let messagesArray = this.state.chatMessages;
    message.time = new Date().toLocaleString();
    messagesArray.push(message);
    this.setState({ chatMessages: messagesArray });
  };

  sendMessage = () => {
    const signalR = this.props.signalRConnection;

    if (signalR.state === "Connected") {
      signalR
        .invoke("SendMessage", {
          UserName: this.props.userDto.UserName,
          Message: this.chatTextareaRef.current.value,
        })
        .then(() => (this.chatTextareaRef.current.value = ""));
    } else {
      this.setState({ disableSendButtond: true });
      this.props.displayMessageBox({
        variant: "danger",
        title: "Error while sending message",
        text: "Connection problems with chathub, please refresh app.",
      });
    }
  };

  render() {
    return (
      <Row className="main_chat_container">
        <Col sm={3} className="chat_left_panel border border-2 my-5">
          <Row className="m-2 d-flex">
            <Row className="mb-1">
              <Col className="additional_info_titles align-self-center">
                Disconnect:
              </Col>
              <Col className="fw-bolder align-self-center">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => this.props.disconnectFromChat()}
                >
                  X
                </Button>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col className="additional_info_titles align-self-center">
                Current chat:
              </Col>
              <Col className="fw-bolder align-self-center">
                {this.props.userDto.ChatRoomName}
              </Col>
            </Row>
          </Row>
        </Col>
        <Col sm={9}>
          <Row className="chat_window border border-2 m-5 align-content-start p-1">
            {this.state.chatMessages.map((ele, index) => {
              return <ChatMessageComponent key={index} message={ele} />;
            })}
          </Row>
          <Row className="chat_textbox border border-2 m-5">
            <Form className="p-2 d-flex flex-column">
              <Form.Group className="mb-3" controlId="messagesArea">
                <Form.Control
                  as="textarea"
                  placeholder="Message content..."
                  className="chat_textarea"
                  rows={6}
                  ref={this.chatTextareaRef}
                />
              </Form.Group>
              <Button
                disabled={this.state.disableSendButtond}
                className="w-25 align-self-end"
                onClick={(event) => {
                  event.preventDefault();
                  this.sendMessage();
                }}
              >
                Send
              </Button>
            </Form>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default MainChatComponent;
