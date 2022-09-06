import React, { Component } from "react";
import { Container } from "react-bootstrap";
import LoginToChatComponent from "./LoginToChatComponent";
import MessageComponent from "./MessageComponent";
import ShowChatsComponent from "./ShowChatsComponent";
import MainChatComponent from "./MainChatComponent";
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
      showChatPage: false,
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
        this.setState({
          showChats: true,
          showLoginPage: false,
          showChatPage: false,
        });
        break;
      case "UserJoinedChat":
        this.setState({
          showChats: false,
          showLoginPage: false,
          showChatPage: true,
        });
        break;
      case "UserJoinedToExistingChat":
        this.setState({
          showChats: false,
          showLoginPage: false,
          showChatPage: true,
        });
        break;
      default:
    }
  };

  connectToChat = (userName, chatName) => {
    this.setState(
      {
        signalRData: {
          ...this.state.signalRData,
          userDto: { UserName: userName, ChatRoomName: chatName },
        },
      },
      () => {
        this.state.signalRConnection.invoke(
          "ConnectToChat",
          this.state.signalRData.userDto
        );
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
            displayMessageBox={this.displayMessageBox}
            connectToChat={this.connectToChat}
            isConnectedWithHub={this.state.signalRData.connectedWithHub}
          />
        ) : null}
        {this.state.showChats ? (
          <ShowChatsComponent
            displayMessageBox={this.displayMessageBox}
            connectToChat={this.connectToChat}
            userDto={this.state.signalRData.userDto}
          />
        ) : null}
        {this.state.showChatPage ? (
          <MainChatComponent
          signalRConnection = {this.state.signalRConnection}
            userDto={this.state.signalRData.userDto}
          />
        ) : null}
      </Container>
    );
  }
}
