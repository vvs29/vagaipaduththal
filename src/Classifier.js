import React from 'react';
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CreateMember from './CreateMember'
import Suggestions from './Suggestions'

class InputString extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card bg="light" style={{display:"inline-block"}}>
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
        this.state = {activePage: 1, selectedmid: []}
    }

    getRows() {
        var templateRow = this.props.inputStrings.map((input, i) => <div><InputString value={input}/></div>);
        return templateRow;

    }

    handleSave = e => {
        let temp = [...this.state.selectedmid];
        temp[this.state.activePage] = e;
        this.setState({selectedmid: temp});
    }

    handlePageChange = e => {
        this.setState({activePage: e.target.id});
    }

    render() {
        // overview of selections
        // write selections to file (transaction description to memberid map)
        this.activeInput = this.props.inputStrings[this.state.activePage];
        var MemberInfo = require("./MemberInfo");
        return (
            <div>
                <div style={{marginTop: 1 + "em"}}/>
                <InputString value={this.activeInput}/>
                <div style={{marginTop: 2 + "em"}}/>
                <Container>
                    <Row>
                        <Col xs={12} md={6}><Suggestions inputString={this.activeInput}
                                                         callback={this.handleSave}/></Col>
                        <Col xs={12} md={6}><CreateMember/></Col>
                    </Row>
                    {(this.state.selectedmid[this.state.activePage] !== undefined) ?
                        <Row style={{marginTop: 1 + "em"}}>
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
                <div style={{display: "inline-block", marginTop:1 + "em"}}>
                    <Pagination>
                        {this.props.inputStrings.map((input, i) =>
                            <Pagination.Item id={i} onClick={this.handlePageChange}>{i + 1}</Pagination.Item>)}
                    </Pagination>
                </div>
            </div>
        );
    }
}

export default Classifier;