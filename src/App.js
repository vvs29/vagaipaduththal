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

// function getTimestamp() {
//     var today = new Date();
//     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//     return date;
// }

class AppHeader extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">
                    <img src={logo} alt="" style={{ width: '5em' }} />
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
        taggedData: null,
        members: null,
        loadingUnidentified: false,
        loadError: null
    };

    readAsTextFile = (file) => {
        return new Promise((resolve, reject) => {
            var r = new FileReader();
            r.onload = function (e) {
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
                let suggestionResp = response.data;
                axios.get('http://localhost:8081/user')
                    .then((response) => {
                        console.log("getMemberResp:" + JSON.stringify(response));
                        this.setState({ 
                            members: response.data, 
                            taggedData: suggestionResp,
                            loadError: null 
                        });
                    })
                    .catch((error) => {
                        console.log("getMemberErr:" + error);
                        this.setState({ loadError: "Failed to load member data" });
                    });

            })
            .catch((error) => {
                console.log("suggErr:" + error);
                this.setState({ loadError: "Failed to load suggestions" });
            });
    }

    onFetchUnidentified = () => {
        this.setState({ loadingUnidentified: true, loadError: null });
        
        axios.get('http://localhost:8081/api/unidentified-deposits')
            .then((response) => {
                console.log("Unidentified records:", JSON.stringify(response.data));
                
                // We have the unidentified records data in response.data
                // Set it directly to taggedData without calling suggestions API
                axios.get('http://localhost:8081/user')
                    .then((memberResponse) => {
                        console.log("Members:", JSON.stringify(memberResponse.data));
                        this.setState({ 
                            members: memberResponse.data, 
                            taggedData: response.data,
                            fileInputStrings: null, // Clear any previously loaded file data
                            loadingUnidentified: false,
                            loadError: null
                        });
                    })
                    .catch((error) => {
                        console.log("Error fetching members:", error);
                        this.setState({ 
                            loadingUnidentified: false, 
                            loadError: "Failed to load member data" 
                        });
                    });
            })
            .catch((error) => {
                console.log("Error fetching unidentified records:", error);
                this.setState({ 
                    loadingUnidentified: false, 
                    loadError: "Failed to load unidentified entries" 
                });
            });
    }

    render() {
        return (
            <div>
                {/* Only show file upload and classify buttons if no data is loaded */}
                {this.state.taggedData == null && (
                    <div>
                        <input
                            type="file"
                            onChange={this.onFileChange}
                        />
                        <button onClick={this.onFileUpload}>
                            Submit
                        </button>
                        <button 
                            onClick={this.onFetchUnidentified}
                            style={{ marginLeft: '10px' }}
                        >
                            Classify unidentified records
                        </button>
                    </div>
                )}
                
                {this.state.loadError && (
                    <div style={{ 
                        color: 'red', 
                        backgroundColor: '#ffeeee', 
                        padding: '10px', 
                        margin: '10px 0', 
                        borderRadius: '5px',
                        border: '1px solid red'
                    }}>
                        Error: {this.state.loadError}
                    </div>
                )}
                
                {console.log(this.state.fileInputStrings)}
                {(this.state.taggedData != null) ?
                    <Classifier
                        inputStrings={Object.keys(this.state.taggedData)}
                        taggedData={this.state.taggedData}
                        members={this.state.members}
                    />
                    : <div></div>}
            </div>
        );
    }
}


export default App;
