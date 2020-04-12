import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import CreateMember from './CreateMember'
import Suggestions from './Suggestions'

class InputString extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button variant="outline-secondary">{this.props.value}</Button>
        );
    }
}

class Classifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {activePage: 1}
    }

    getRows() {
        var templateRow = this.props.inputStrings.map((input, i) => <div><InputString value={input} /></div>);
        return templateRow;

    }

    render() {
        // save button
        // add pagination
        // save selection upon page change
        // overview of selections
        // write selections to file (transaction description to memberid map)
        var activeInput = this.props.inputStrings[this.state.activePage];
        return (
            <div>
                <div style={{marginTop:1 + "em"}} />
                <InputString value={activeInput}/>
                <div style={{marginTop:2 + "em"}} />
                <Container>
                    <Row>
                        <Col xs={12} md={6}><Suggestions inputString={activeInput} /></Col>
                        <Col xs={12} md={6}><CreateMember/></Col>
                    </Row>
                </Container>

            </div>
        );
    }
}

export default Classifier;