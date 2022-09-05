import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Form, Button } from "react-bootstrap";

class ShowChatsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatList: [],
      createNewChat: false,
      newChatName: "",
    };
  }

  componentDidMount() {
    this.fetchChats();
  }

  fetchChats = () => {
    axios({
      method: "get",
      url: "https://localhost:44360/api/chats",
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        this.setState({ chatList: resp.data });
      })
      .catch((err) => {
        this.props.displayMessageBox({
          variant: "danger",
          title: "Failed to load chat list.",
          text: err.message,
        });
      });
  };

  createNewChat = () => {
    let chatName = this.state.newChatName;
    let request = {
      ChatRoomName: chatName,
      CreatedBy: this.props.userDto.UserName,
    };
    const res = /^[A-Za-z0-9_\.]+$/.exec();
    if (res && chatName.length > 2) {
      axios({
        method: "post",
        url: "https://localhost:44360/api/chat",
        headers: { "Content-Type": "application/json" },
        data: request,
      })
        .then((resp) => {
          this.props.displayMessageBox({
            variant: "success",
            text: resp.data.message,
            title: "Chat was created!",
          });
        })
        .then(() => {
          this.fetchChats();
        })
        .catch((err) => {
          this.props.displayMessageBox({
            variant: "danger",
            title: "Failed to create chat.",
            text: err.message,
          });
        });
    } else
      this.props.displayMessageBox({
        variant: "warning",
        text: "Chat name must contains at least 3 characters and letters case insensitive (a-z), numbers (0-9), Dots (.), Underscores (_)",
        title: "Invalid chat name",
      });
  };

  render() {
    return (
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="formSelectChat">
              <Form.Label>Select the chat you want to connect to</Form.Label>
              <Form.Select id="chatSelect">
                {this.state.chatList.map((option, index) => {
                  return (
                    <option key={index} value={option.chatRoomName}>
                      {option.chatRoomName}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCreateNewCheckbox">
              <Form.Check
                type="checkbox"
                label="Create a new chat"
                onChange={() => {
                  this.state.createNewChat
                    ? this.setState({ createNewChat: false })
                    : this.setState({ createNewChat: true });
                }}
              />
            </Form.Group>
            {this.state.createNewChat ? (
              <div>
                <Form.Group className="mb-3" controlId="formNewChatName">
                  <Form.Label>Type chat name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Chat name"
                    onChange={(event) =>
                      this.setState({ newChatName: event.target.value })
                    }
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    this.createNewChat();
                  }}
                >
                  Create new chat
                </Button>
              </div>
            ) : (
              <Button variant="primary" type="button">
                Connect to chat
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    );
  }
}

export default ShowChatsComponent;
