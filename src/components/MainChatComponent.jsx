import React, { Component } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import ChatMessageComponent from "./ChatMessageComponent";

class MainChatComponent extends Component {
  constructor(props) {
    super(props);
    this.chatTextareaRef = React.createRef();
    this.state = {
      chatMessages: [],
    };
  }

  componentDidMount() {
    this.props.signalRConnection.on("ReciveMessage", (message) => {
      this.handleMessage(message);
    });
  }

  handleMessage = (message) => {
    let messagesArray = this.state.chatMessages;
    message.time = new Date().toLocaleString();
    messagesArray.push(message);
    this.setState({ chatMessages: messagesArray });
  };

  sendMessage = () => {
    this.props.signalRConnection
      .invoke("SendMessage", {
        UserName: this.props.userDto.UserName,
        Message: this.chatTextareaRef.current.value,
      })
      .then(() => (this.chatTextareaRef.current.value = ""));
  };

  render() {
    return (
      <Row className="main_chat_container">
        <Col sm={3} className="chat_left_panel border border-2 my-5"></Col>
        <Col sm={9}>
          <Row className="chat_window border border-2 m-5 align-content-start p-1">
            {this.state.chatMessages.map((ele)=>{
                return(<ChatMessageComponent message={ele}/>)
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
