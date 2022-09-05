import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LoginToChatComponent from "./LoginToChatComponent";
import MessageComponent from "./MessageComponent";
import ShowChatsComponent from "./ShowChatsComponent";
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
      showChats: false,
      messageBoxData: {
        variant: "",
        text: "",
        title: "",
      },
      signalRConnection: connection,
      signalRData: {
        connectedWithHub: false,
        userDto: {
          UserName: "",
          ChatRoomName: "",
        },
      },
    };
  }

  displayMessageBox = (messageBoxData) => {
    this.setState({
      showMessageBox: true,
      messageBoxData: messageBoxData,
    });
  };

  closeMessageBox = () => {
    this.setState({
      showMessageBox: false,
      messageBoxData: {
        variant: "",
        text: "",
        title: "",
      },
    });
  };

  handleDirectives = (directive) => {
    switch (directive.command) {
      case "UserNotJoinedToChat":
        this.setState({ showChats: true, showLoginPage: false });
      default:
    }
  };

  connectToChat = (userName) => {
    this.setState(
      {
        signalRData: {
          ...this.state.signalRData,
          userDto: { UserName: userName, ChatRoomName: "" },
        },
      },
      () => {
        this.state.signalRConnection
          .invoke("ConnectToChat", this.state.signalRData.userDto)
          .then(() => {});
      }
    );
  };

  componentDidMount() {
    this.state.signalRConnection
      .start()
      .then(() => {
        this.setState({
          signalRData: { ...this.state.signalRData, connectedWithHub: true },
        });
        //handle all responses
        this.state.signalRConnection.on("ReciveDirective", (directive) => {
          this.handleDirectives(directive);
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
            closeFunc={this.closeMessageBox}
          />
        ) : null}
        {this.state.showLoginPage ? (
          <LoginToChatComponent
            isConnectedWithHub={this.state.signalRData.connectedWithHub}
            connectToChat={this.connectToChat}
            displayMessageBox={this.displayMessageBox}
          />
        ) : null}
        {this.state.showChats ? (
          <ShowChatsComponent displayMessageBox={this.displayMessageBox} userDto={this.state.signalRData.userDto}/>
        ) : null}
      </Container>
    );
  }
}
