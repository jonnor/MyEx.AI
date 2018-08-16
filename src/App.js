require('./styles/App.css');
require('./styles/Login.css');

import React from 'react';

import {Messages,ChatInput,ChatApp} from './components.js';

const script = require('json-loader!yaml-loader!../data/scripts/basic.yaml');


// TODO:
// Button to load/play different scripts

function chatMessageFromScript(message) {
    const isUser = (message.role == 'user')

    // TODO: also support images
    const mes = {
        name: isUser ? script.names.user : script.names.bot,
        message: message.text,
        fromMe: isUser,
    };
    return mes;
}

function playbackScript(script, sendFunc, callback) {    

    const delayAvg = 500;
    const delayStd = 1000;

    console.log('playback script', script);

    const messages = Array.from(script.messages);
    const next = () => {
        console.log('script next');
        if (messages.length == 0) {
            return callback();
        }
        const m = messages.shift(); 
        sendFunc(m);
        const delay = delayAvg + (Math.random()-0.5)*delayStd;
        console.log('d', delay);
        return setTimeout(next, delay);
    }
    next();
}

// App logic
function handleEvent(name, payload, sender) {
    console.log('event', name, payload);


    // FIXME: look up in props
    const sendScriptMessage = (m) => {
        sender.addMessage(chatMessageFromScript(m));
    }

    console.log('script play');
    playbackScript(script, sendScriptMessage, () => {
        console.log('script done');
    })

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
