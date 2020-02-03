import React from 'react';
import logo from './logo.svg';
import './App.css';
import Classifier from './Classifier';

function App() {
  return (
    <div className="App">
        <AppHeader />
    </div>
  );
}

function getTimestamp() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return date;
}

class AppHeader extends React.Component {
  render() {
    return (
      <div className="AppHeader">
        <img src={logo} style={{width:'5em'}} />
        <div>
            <span className="ProfileButton">Guest</span>
            <span>{getTimestamp()}</span>
        </div>
      </div>
    );
  }
}

class AppBody extends React.Component {
    render() {
        return (
            <Classifier />
        );
    }
}


export default App;
