require('./styles/App.css');
require('./styles/Login.css');

import React from 'react';

import {Messages,ChatInput,ChatApp} from './components.js';

const script = require('json-loader!yaml-loader!../data/scripts/basic.yaml');


// App logic
function handleEvent(name, payload, sender) {
    console.log('event', name, payload);

    //console.log('fb', fbMessages);
    console.log('data', script);

    // FIXME: look up in props
    const messages = script.messages;

    for (var message of messages) {
   
        const isUser = (message.role == 'user')
        console.log('m', message, isUser);

        // TODO: also support images
        const mes = {
            name: isUser ? script.names.user : script.names.bot,
            message: message.text,
            fromMe: isUser,
        };
        sender.addMessage(mes);
    }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };

    // Bind 'this' to event handlers. React ES6 does not do this by default
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
  }

  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.setState({ submitted: true, username: this.state.username });
  }

  render() {
    if (this.state.submitted) {
      // Form was submitted, now show the main App
      return (
        <ChatApp username={this.state.username} onEvent={this.props.onEvent}/>
      );
    }

    // Initial page load, show a simple login form
    return (
      <form onSubmit={this.usernameSubmitHandler} className="username-container">
        <h1>React Instant Chat</h1>
        <div>
          <input
            type="text"
            onChange={this.usernameChangeHandler}
            placeholder="Enter a username..."
            required />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }

}
App.defaultProps = {
    //fbMessages: fbMessages,
    onEvent: handleEvent,
};


export default App;
