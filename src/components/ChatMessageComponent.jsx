import React from "react";
import Card from "react-bootstrap/Card";

const ChatMessageComponent = (props) => {
  return (
    <Card className="chat_message mb-2">
      <Card.Header className="text-muted d-flex justify-content-between"><span>{props.message.userName}</span><span className="message_date align-self-center">{props.message.time}</span></Card.Header>
      <Card.Body>
        <Card.Text className="fw-light">{props.message.message}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ChatMessageComponent;
