import React from 'react';
import logo from './logo.svg';
import './App.css';
import Classifier from './Classifier';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from "axios";

function App() {
  return (
    <div className="App">
        <AppHeader />
        <AppBody />
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
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
                <img src={logo} alt="" style={{width:'5em'}} />
                Vagaipaduththal
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="mr-auto">
                    <Nav.Link href="https://www.imaigal.org/">Imaigal</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown title="Guest" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">Sign In</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
  }
}

class AppBody extends React.Component {
    getInputStrings() {
        var inputStrings = ["BIL/001462403187/Imaigal_Kavimuthu/NSP", "BIL/001462423482/VenkatAmaz-Imgl/NSP",
            "INF/020557394501/RSUP005 Rice Annai Il", "NEFT-SBIN518152086947-Miss  ANEETHA  M-/ATTN//INB",
        "UPI/815219810812/June/kmadhuraganesh@/HDFC BANK L"];
        return inputStrings
    }
    state = {
        fileInputStrings: null,
        taggedData : null,
    };
 
    readAsTextFile = (file) => {
        return new Promise((resolve, reject) => {
            var r = new FileReader();
            r.onload = function(e) { 
                resolve(e.target.result);
            }
            r.onerror = reject;
            r.readAsText(file);
        })
    };

    onFileChange = (event) => {
        this.readAsTextFile(event.target.files[0])
        .then((fileContents) => {
            this.setState({ fileInputStrings: fileContents })
        })
        .catch((error) => {
            console.error(error)
        })
    };

    onFileUpload = () => {
        axios.post('http://localhost:8081/api/suggestions', {
            csv: this.state.fileInputStrings,
          })
          .then((response) => {
            console.log("suggResp:" + JSON.stringify(response));
            this.setState({taggedData : response.data});
          })
          .catch((error) => {
            console.log("suggErr:" + error);
          });
    }

    render() {

        return (
            <div><input
                type="file"
                onChange={this.onFileChange}
            />
            <button onClick={this.onFileUpload}>
                Submit
            </button>
            {console.log(this.state.fileInputStrings)}
            {(this.state.taggedData != null) ?
           <Classifier inputStrings={Object.keys(this.state.taggedData)} taggedData={this.state.taggedData}/> : <div></div>}</div>
        );
    }
}


export default App;
