import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Qrscanner from './Qrscanner';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p> Please scan xDai address </p>
        </header>
        <Qrscanner />
      </div>
    );
  }
}

export default App;
