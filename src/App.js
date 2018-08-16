require('./styles/common.css');
require('./styles/App.css');
require('./styles/Login.css');

import React from 'react';

import {Messages,ChatInput,ChatApp} from './components.js';

const scripts = {
    'decisions': require('json-loader!yaml-loader!../data/scripts/decisions.yaml'),
    'smalltalk': require('json-loader!yaml-loader!../data/scripts/smalltalk.yaml'),
    'images': require('json-loader!yaml-loader!../data/scripts/images.yaml'),
}

// TODO:
// Add names to chat. Per message or on top
// Support images in messages

// Maybe
// Support manually adding 
// 

function chatMessageFromScript(message, script) {
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

}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playingscript: false, messages: [] };

    // Bind 'this' to event handlers. React ES6 does not do this by default
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);


    this.runScript = this.runScript.bind(this);
    this.toStart = this.toStart.bind(this);
  }

  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();

  }

  runScript(scriptName) {
    const script = scripts[scriptName];

    this.setState({ playingscript: true });
    console.log('script play');

    const sendScriptMessage = (m) => {
        var messages = Array.from(this.state.messages);
        messages.push(chatMessageFromScript(m, script));
        this.setState({ messages: messages });
    }


    playbackScript(script, sendScriptMessage, () => {
        console.log('script done');
    })

  }

  toStart() {
    this.setState({playingscript: false, messages: []});
  }

  render() {
    if (this.state.playingscript) {
      // Form was submitted, now show the main App
      return (
        <ChatApp username={this.state.username} messages={this.state.messages} onChatMessage={this.toStart}/>
      );
    }

    // Initial page load, show a simple login form
    return (
      <section className="username-container">
        <h1>AI Partner</h1>
        <button onClick={(e) => this.runScript('decisions', e)}>Decisions</button>
        <button onClick={(e) => this.runScript('images', e)}>Images</button>
        <button onClick={(e) => this.runScript('smalltalk', e)}>Smalltalk</button>
      </section>
    );
  }

}
App.defaultProps = {
    onEvent: handleEvent,
};


export default App;
