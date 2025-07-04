import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';

const MemberInfo = require("./MemberInfo");

class PreviewTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdating: false,
            updateSuccess: false,
            updateError: null,
            validationError: null
        };
    }

    getTransactionTypeLabel = (type) => {
        switch(type) {
            case 'REG':
                return <Badge bg="primary">Regular</Badge>;
            case 'ONETIME':
                return <Badge bg="info">One Time</Badge>;
            case 'INT':
                return <Badge bg="success">Interest</Badge>;
            default:
                return <Badge bg="secondary">{type}</Badge>;
        }
    };

    handleEditTransaction = (index) => {
        // Call the parent component's function to go back to editing
        // and set the active page to the selected transaction
        this.props.onEditTransaction(index);
    };

    validateTransactionData = (transactionData, inputString) => {
        if (!transactionData) {
            return `Missing transaction data for: ${inputString}`;
        }
        
        if (!transactionData.transactionAmount) {
            return `Missing transaction amount for: ${inputString}`;
        }
        
        if (!transactionData.transactionDescription) {
            return `Missing transaction description for: ${inputString}`;
        }
        
        if (!transactionData.transactionDate) {
            return `Missing transaction date for: ${inputString}`;
        }
        
        if (!transactionData.transactionId) {
            return `Missing transaction ID for: ${inputString}`;
        }
        
        return null;
    };

    handleUpdateDatabase = () => {
        // Reset all status states
        this.setState({ 
            isUpdating: false, 
            updateSuccess: false, 
            updateError: null,
            validationError: null
        });
        
        // Validate all transaction data first
        let validationError = null;
        
        for (let i = 0; i < this.props.inputStrings.length; i++) {
            const inputString = this.props.inputStrings[i];
            const transactionData = this.props.taggedData[inputString];
            
            const error = this.validateTransactionData(transactionData, inputString);
            if (error) {
                validationError = error;
                break;
            }
        }
        
        if (validationError) {
            this.setState({ validationError });
            return;
        }
        
        // Set updating state
        this.setState({ isUpdating: true });

        // Prepare data for the API call
        const transactions = [];
        
        this.props.inputStrings.forEach((inputString, index) => {
            const transactionData = this.props.taggedData[inputString];
            const memberInfo = this.props.selectedMembers[index];
            const transactionType = this.props.transactionTypes[index] || 'REG';
            
            // Create a transaction object with fields matching the deposits table
            const transaction = {
                // If a member is assigned, use their ID, otherwise set to null
                member_id: memberInfo ? memberInfo.mid : null,
                amount: transactionData.transactionAmount,
                description: transactionData.transactionDescription,
                date: transactionData.transactionDate,
                type: transactionType, // Use the selected type for this transaction
                bank_trans_id: transactionData.transactionId
            };
            
            transactions.push(transaction);
        });

        // Create the final JSON structure to send to the backend
        const requestData = {
            transactions: transactions
        };

        console.log('Sending transaction data to backend:', requestData);

        // Make API call to the backend
        axios.post('http://localhost:8081/api/update-deposits', requestData)
        .then(response => {
            console.log('Database updated successfully:', response.data);
            this.setState({ 
                isUpdating: false, 
                updateSuccess: true,
                updateError: null
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                this.setState({ updateSuccess: false });
            }, 5000);
        })
        .catch(error => {
            console.error('Error updating database:', error);
            this.setState({ 
                isUpdating: false,
                updateSuccess: false,
                updateError: error.response?.data?.message || 'An unknown error occurred'
            });
        });
    };

    render() {
        return (
            <Container className="mt-4">
                <h2>Preview Transactions Before Update</h2>
                <p>Review the mapped data below. You can go back to edit any transaction if needed.</p>
                
                <Row className="mb-3">
                    <Col>
                        <Button 
                            variant="secondary" 
                            onClick={this.props.onBackToClassifier}
                            className="me-2"
                        >
                            ← Back to Classifier
                        </Button>
                        
                        <Button 
                            variant="success" 
                            onClick={this.handleUpdateDatabase}
                            disabled={this.state.isUpdating}
                        >
                            {this.state.isUpdating ? 'Updating...' : 'Confirm & Update Database'}
                        </Button>
                    </Col>
                </Row>
                
                {this.state.updateSuccess && 
                    <Alert variant="success" className="mt-2">
                        Database updated successfully!
                    </Alert>
                }
                
                {this.state.updateError && 
                    <Alert variant="danger" className="mt-2">
                        Error updating database: {this.state.updateError}
                    </Alert>
                }
                
                {this.state.validationError && 
                    <Alert variant="warning" className="mt-2">
                        {this.state.validationError}
                    </Alert>
                }
                
                <Row>
                    <Col>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Transaction Description</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Assigned Member</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.inputStrings.map((inputString, index) => {
                                        const transactionData = this.props.taggedData[inputString];
                                        const memberInfo = this.props.selectedMembers[index];
                                        const transactionType = this.props.transactionTypes[index] || 'REG';
                                        
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{inputString}</td>
                                                <td>
                                                    {transactionData && transactionData.transactionAmount ? 
                                                        `₹${transactionData.transactionAmount}` : 
                                                        'N/A'}
                                                </td>
                                                <td>
                                                    {transactionData && transactionData.transactionDate ? 
                                                        transactionData.transactionDate : 
                                                        'N/A'}
                                                </td>
                                                <td>{this.getTransactionTypeLabel(transactionType)}</td>
                                                <td>
                                                    {memberInfo ? 
                                                        MemberInfo.getMemberInfoAsString(memberInfo) : 
                                                        <span className="text-danger">Not assigned</span>}
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => this.handleEditTransaction(index)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                
                <Row className="mt-3">
                    <Col>
                        <div className="d-flex justify-content-between">
                            <div>
                                <strong>Total Transactions:</strong> {this.props.inputStrings.length}
                            </div>
                            <div>
                                <strong>Identified:</strong> {this.props.selectedMembers.filter(m => m !== undefined).length} of {this.props.inputStrings.length}
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <Row className="mt-3">
                    <Col>
                        <Button 
                            variant="success" 
                            onClick={this.handleUpdateDatabase}
                            disabled={this.state.isUpdating}
                            size="lg"
                        >
                            {this.state.isUpdating ? 'Updating...' : 'Confirm & Update Database'}
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default PreviewTransactions;
