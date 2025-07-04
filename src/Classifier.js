import React from 'react';
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import CreateMember from './CreateMember'
import Suggestions from './Suggestions'
import PreviewTransactions from './PreviewTransactions'
import axios from 'axios'

class InputString extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <Card bg="light" style={{ display: "inline-block" }}>
                <Card.Body>
                    <Card.Title>{this.props.value}</Card.Title>
                </Card.Body>
            </Card>
            //<Button variant="outline-secondary">{this.props.value}</Button>
        );
    }
}

class Classifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activePage: 0,
            selectedmid: [],
            transactionTypes: [], // Array to store transaction types
            gotoPage: '',
            sortedInputStrings: this.sortInputStrings(props.inputStrings, props.taggedData),
            isUpdating: false,
            updateSuccess: false,
            updateError: null,
            validationError: null,
            showPreview: false // Flag to toggle between classifier and preview modes
        }
    }

    // Sort input strings so entries with missing or "na" mid appear first
    sortInputStrings(inputStrings, taggedData) {
        return [...inputStrings].sort((a, b) => {
            const aData = taggedData[a];
            const bData = taggedData[b];

            // Check if mid is missing or "na"
            const aHasMid = aData && aData.mid && aData.mid !== "na";
            const bHasMid = bData && bData.mid && bData.mid !== "na";

            // If one has mid and the other doesn't, prioritize the one without mid
            if (aHasMid && !bHasMid) return 1;
            if (!aHasMid && bHasMid) return -1;

            // Otherwise maintain original order
            return 0;
        });
    }

    getRows() {
        var templateRow = this.props.inputStrings.map((input, i) => <div><InputString value={input} /></div>);
        return templateRow;

    }

    handleSave = e => {
        let temp = [...this.state.selectedmid];
        temp[this.state.activePage] = e;
        this.setState({ selectedmid: temp });
    }
    
    handleTypeChange = (e) => {
        let temp = [...this.state.transactionTypes];
        const newType = e.target.value;
        temp[this.state.activePage] = newType;
        
        // If the type is 'INT' (Interest Credit), reset the member_id to null
        if (newType === 'INT') {
            let selectedMidTemp = [...this.state.selectedmid];
            selectedMidTemp[this.state.activePage] = undefined;
            this.setState({ 
                transactionTypes: temp,
                selectedmid: selectedMidTemp
            });
        } else {
            this.setState({ transactionTypes: temp });
        }
    }

    handlePageChange = e => {
        this.setState({ activePage: parseInt(e.target.id) });
    }

    handleFirstPage = () => {
        this.setState({ activePage: 0 });
    }

    handlePrevPage = () => {
        if (this.state.activePage > 0) {
            this.setState({ activePage: this.state.activePage - 1 });
        }
    }

    handleNextPage = () => {
        if (this.state.activePage < this.state.sortedInputStrings.length - 1) {
            this.setState({ activePage: this.state.activePage + 1 });
        }
    }

    handleLastPage = () => {
        this.setState({ activePage: this.state.sortedInputStrings.length - 1 });
    }

    componentDidMount() {
        let selectedmidUpdated = [...this.state.selectedmid];
        let transactionTypesUpdated = [...this.state.transactionTypes];
        
        this.state.sortedInputStrings.forEach((element, index) => {
            const suggestions = this.props.taggedData[element];
            if (suggestions && suggestions.mid && suggestions.mid !== "na") {
                selectedmidUpdated[index] = this.props.members[suggestions.mid];
            }
            
            // Initialize all transaction types to 'REG' by default
            transactionTypesUpdated[index] = 'REG';
        });
        
        this.setState({ 
            selectedmid: selectedmidUpdated,
            transactionTypes: transactionTypesUpdated
        });
    }

    handleGotoPageChange = (e) => {
        this.setState({ gotoPage: e.target.value });
    }

    handleGotoPageSubmit = (e) => {
        e.preventDefault();
        const pageNum = parseInt(this.state.gotoPage) - 1;
        if (pageNum >= 0 && pageNum < this.state.sortedInputStrings.length) {
            this.setState({ activePage: pageNum, gotoPage: '' });
        } else {
            alert('Invalid page number');
            this.setState({ gotoPage: '' });
        }
    }

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
    }

    // Show preview of all transactions before updating the database
    handleShowPreview = () => {
        // Validate all transaction data first
        let validationError = null;
        
        for (let i = 0; i < this.state.sortedInputStrings.length; i++) {
            const inputString = this.state.sortedInputStrings[i];
            const transactionData = this.props.taggedData[inputString];
            
            const error = this.validateTransactionData(transactionData, inputString);
            if (error) {
                this.setState({ validationError: error });
                return;
            }
        }
        
        // If validation passes, show the preview
        this.setState({ 
            showPreview: true,
            validationError: null
        });
    }
    
    // Go back to classifier mode from preview
    handleBackToClassifier = () => {
        this.setState({ showPreview: false });
    }
    
    // Handle edit transaction from preview mode
    handleEditTransaction = (index) => {
        this.setState({ 
            showPreview: false,
            activePage: index
        });
    }

    render() {
        // overview of selections
        // write selections to file (transaction description to memberid map)
        this.activeInput = this.state.sortedInputStrings[this.state.activePage];
        var MemberInfo = require("./MemberInfo");
        
        // If in preview mode, show the PreviewTransactions component
        if (this.state.showPreview) {
            return (
                <PreviewTransactions 
                    inputStrings={this.state.sortedInputStrings}
                    taggedData={this.props.taggedData}
                    selectedMembers={this.state.selectedmid}
                    transactionTypes={this.state.transactionTypes}
                    onBackToClassifier={this.handleBackToClassifier}
                    onEditTransaction={this.handleEditTransaction}
                />
            );
        }
        
        // Otherwise show the classifier interface
        return (
            <div>
                <div style={{ marginTop: 1 + "em" }} />
                <InputString value={this.activeInput} />
                <div style={{ marginTop: 2 + "em" }} />
                <Container>
                    <Row>
                        <Col xs={12} md={6}>
                            <Suggestions 
                                inputString={this.activeInput}
                                taggedData={this.props.taggedData}
                                members={this.props.members}
                                selectionCallback={this.handleSave} 
                            />
                            
                            {/* Transaction Type Radio Buttons */}
                            <div className="transaction-type-selector mt-3">
                                <Form.Group>
                                    <Form.Label><strong>Transaction Type:</strong></Form.Label>
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            id="type-reg"
                                            label="Regular Contribution"
                                            name="transactionType"
                                            value="REG"
                                            checked={this.state.transactionTypes[this.state.activePage] === 'REG'}
                                            onChange={this.handleTypeChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="type-onetime"
                                            label="One time"
                                            name="transactionType"
                                            value="ONETIME"
                                            checked={this.state.transactionTypes[this.state.activePage] === 'ONETIME'}
                                            onChange={this.handleTypeChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="type-int"
                                            label="Interest Credit"
                                            name="transactionType"
                                            value="INT"
                                            checked={this.state.transactionTypes[this.state.activePage] === 'INT'}
                                            onChange={this.handleTypeChange}
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                        </Col>
                        <Col xs={12} md={6}><CreateMember /></Col>
                    </Row>
                    {(this.state.selectedmid[this.state.activePage] !== undefined) ?
                        <Row style={{ marginTop: 1 + "em" }}>
                            <Col xs={12}>
                                Selected: {MemberInfo.getMemberInfoAsString(this.state.selectedmid[this.state.activePage])}
                            </Col>
                        </Row>
                        : ""
                    }
                    <Row>
                        <Col xs={12}>
                        </Col>
                    </Row>
                </Container>
                <div style={{
                    display: "block",
                    alignItems: "center",
                    marginTop: "1em",
                    marginRight: "1em",
                    marginLeft: "1em"
                }}>
                    Identified: {this.state.selectedmid.reduce((x, value) => typeof value !== "undefined" ? x + 1 : x, 0)} of {this.state.sortedInputStrings.length} total
                    <div style={{ marginTop: "1em" }}>
                        <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={this.handleShowPreview}
                        >
                            Preview Before Update
                        </Button>
                        
                        {this.state.validationError && 
                            <Alert variant="warning" className="mt-2">
                                {this.state.validationError}
                            </Alert>
                        }
                    </div>
                </div>
                <div style={{
                    display: "inline-block",
                    alignItems: "center",
                    marginTop: "1em",
                    marginRight: "1em",
                    marginLeft: "1em"
                }}>
                    <Pagination>
                        <Pagination.First onClick={this.handleFirstPage} />
                        <Pagination.Prev onClick={this.handlePrevPage} />

                        {(() => {
                            const totalPages = this.state.sortedInputStrings.length;
                            const currentPage = this.state.activePage;
                            const maxButtons = 5;

                            // Calculate start and end page numbers to display
                            let startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
                            let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

                            // Adjust startPage if we're near the end
                            if (endPage - startPage + 1 < maxButtons) {
                                startPage = Math.max(0, endPage - maxButtons + 1);
                            }

                            // Create array of page numbers to display
                            const pages = [];
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                            }

                            return pages.map(i => (
                                <Pagination.Item
                                    key={i}
                                    id={i}
                                    onClick={this.handlePageChange}
                                    active={i === currentPage}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ));
                        })()}

                        <Pagination.Next onClick={this.handleNextPage} />
                        <Pagination.Last onClick={this.handleLastPage} />
                    </Pagination>
                </div>
                <div style={{
                    display: "inline-block",
                    alignItems: "center",
                    marginTop: "1em",
                    marginRight: "1em",
                    marginLeft: "1em"
                }}>
                    <form onSubmit={this.handleGotoPageSubmit} style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "0.5em" }}>Go to page:</span>
                        <input
                            type="number"
                            min="1"
                            max={this.state.sortedInputStrings.length}
                            value={this.state.gotoPage}
                            onChange={this.handleGotoPageChange}
                            style={{ width: "60px", marginRight: "0.5em" }}
                        />
                        <button type="submit" className="btn btn-sm btn-primary">Go</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Classifier;
