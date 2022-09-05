import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LoginToChatComponent from "./LoginToChatComponent";
import MessageComponent from "./MessageComponent";
import * as signalR from "@microsoft/signalr";

export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44360/chat")
      .build();
    this.state = {
      showLoginPage: true,
      showMessageBox: false,
      messageBoxData: {
        variant: "",
        text: "",
        title: "",
      },
      signalRConnection: connection,
      signalRData: {
        connectedWithHub: false,
      },
    };
  }

  closeFunc = () => {
    this.setState({
      showMessageBox: false,
      messageBoxData: {
        ...this.state.messageBoxData.closeFunc,
        variant: "",
        text: "",
        title: "",
      },
    });
  };

  componentDidMount() {
    this.state.signalRConnection
      .start()
      .then(() => {
        this.setState({
          signalRData: { ...this.state.signalRData, connectedWithHub: true },
        });
      })
      .catch((err) => {
        this.setState({
          messageBoxData: {
            variant: "danger",
            title: "Error while connecting with hub",
            text: "Details information: " + err,
          },
          showMessageBox: true,
        });
      });
  }

  render() {
    return (
      <Container className="main_container">
        {this.state.showMessageBox ? (
          <MessageComponent
            data={this.state.messageBoxData}
            closeFunc={this.closeFunc}
          />
        ) : null}
        {this.state.showLoginPage ? (
          <LoginToChatComponent
            isConnectedWithHub={this.state.signalRData.connectedWithHub}
          />
        ) : null}
      </Container>
    );
  }
}
