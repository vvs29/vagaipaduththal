import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

class HomePage extends React.Component {
    state = {
        fileInputStrings: null,
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
                        // Navigate to map-transaction page with data
                        this.props.history.push({
                            pathname: '/map-transaction',
                            state: { 
                                taggedData: suggestionResp,
                                members: response.data
                            }
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
                        // Navigate to map-transaction page with data
                        this.props.history.push({
                            pathname: '/map-transaction',
                            state: { 
                                taggedData: response.data,
                                members: memberResponse.data
                            }
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
            <div className="container mt-4">
                <h2>Vagaipaduththal - Transaction Management</h2>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                Upload Transaction File
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={this.onFileChange}
                                    />
                                </div>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.onFileUpload}
                                    disabled={!this.state.fileInputStrings}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                Unidentified Records
                            </div>
                            <div className="card-body">
                                <p>Process records that haven't been identified yet.</p>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={this.onFetchUnidentified}
                                    disabled={this.state.loadingUnidentified}
                                >
                                    {this.state.loadingUnidentified ? 'Loading...' : 'Classify unidentified records'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {this.state.loadError && (
                    <Alert variant="danger" className="mt-3">
                        Error: {this.state.loadError}
                    </Alert>
                )}
                
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                Other Actions
                            </div>
                            <div className="card-body">
                                <Link to="/processContributions" className="btn btn-info">
                                    Process Contributions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
