import React from 'react';
import Alert from 'react-bootstrap/Alert';

const MessageComponent = (props) => {

  React.useEffect(() => {
    if(props.data.disposeTime>0){
      setTimeout(() => props.closeFunc(), props.data.disposeTime*1000);
    }
  });

    return (
    <Alert className="fixed-top w-75 start-50 translate-middle-x mt-3" variant={props.data.variant} onClose={props.closeFunc} dismissible>
      <Alert.Heading>{props.data.title}</Alert.Heading>
      <p>
        {props.data.text}
      </p>
    </Alert>
    );
};

export default MessageComponent;