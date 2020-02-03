import React from 'react';
import logo from './logo.svg';
import './App.css';

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
        <img src={logo} style={{float: "left", width: "5em"}} />
        <div style={{float:"right"}}>
            <span className="ProfileButton">Guest</span>
            <span>{getTimestamp()}</span>
        </div>
        <div className="ClearFloat"></div>
      </div>
    );
  }
}

class AppBody extends React.Component {

}


export default App;
