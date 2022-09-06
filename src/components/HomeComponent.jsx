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
        disposeTime: 0,
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
        disposeTime: 0,
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
        this.displayMessageBox({
          variant: "info",
          text: "User connected with chat: " + directive.message,
          title: "Connected with chat!",
          disposeTime: 3,
        });
        break;
      case "UserJoinedToExistingChat":
        this.setState({
          showChats: false,
          showLoginPage: false,
          showChatPage: true,
          signalRData: {
            ...this.state.signalRData,
            userDto: {
              ...this.state.signalRData.userDto,
              ChatRoomName: directive.message,
            },
          },
        });
        this.displayMessageBox({
          variant: "info",
          text: "User reconnected with chat: " + directive.message,
          title: "Connected with chat!",
          disposeTime: 3,
        });
        break;
      case "MessageNotSend":
        this.displayMessageBox({
          variant: "danger",
          text: directive.message,
          title: "Cannot send message!",
          disposeTime: 4,
        });
        break;
      case "UserDisconnectedFromChat":
        this.displayMessageBox({
          variant: "success",
          text: directive.message,
          title: "Disconnected form chat.",
        });
        break;
      default:
    }
  };

  connectToChat = (userName, chatName) => {
    const signalR = this.state.signalRConnection;

    if (signalR.state === "Connected") {
      this.setState(
        {
          signalRData: {
            ...this.state.signalRData,
            userDto: { UserName: userName, ChatRoomName: chatName },
          },
        },
        () => {
          signalR.invoke("ConnectToChat", this.state.signalRData.userDto);
        }
      );
    } else {
      this.setState({
        signalRData: {
          connectedWithHub: false,
          userDto: {
            UserName: "",
            ChatRoomName: "",
          },
        },
      });
      this.displayMessageBox({
        variant: "danger",
        title: "Error while connecting to chat!",
        text: "Connection problems with chathub, please refresh app.",
      });
    }
  };

  disconnectFromChat = () => {
    const signalR = this.state.signalRConnection;

    if (signalR.state === "Connected") {
      signalR
        .invoke("DisconnectFromChat", this.state.signalRData.userDto)
        .then(() => {
          this.setState({
            showChats: false,
            showLoginPage: true,
            showChatPage: false,
            signalRData: {
              ...this.state.signalRData,
              userDto: {
                UserName: "",
                ChatRoomName: "",
              },
            },
          });
        });
    } else {
      this.displayMessageBox({
        variant: "danger",
        title: "Error while disconnecting from chat!",
        text: "Connection problems with chathub, please refresh app.",
      });
    }
  };

  componentDidMount() {
    this.state.signalRConnection
      .start()
      .then(() => {
        this.setState({
          signalRData: { ...this.state.signalRData, connectedWithHub: true },
        });
        //handle all directive responses
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
            displayMessageBox={this.displayMessageBox}
            disconnectFromChat={this.disconnectFromChat}
            signalRConnection={this.state.signalRConnection}
            userDto={this.state.signalRData.userDto}
          />
        ) : null}
      </Container>
    );
  }
}
