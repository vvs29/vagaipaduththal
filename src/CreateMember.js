import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from "react-bootstrap/Col";

class CreateMember extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('Event: Form Submit');
    };

    render() {
        // add to memberInfo.json file
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="mid">
                            <Form.Label>Member ID</Form.Label>
                            <Form.Control required type="id" />
                        </Form.Group>
                        <Form.Group  as={Col} controlId="joiningDate">
                            <Form.Label>Joining Date</Form.Label>
                            <Form.Control required type="date" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} xs={12} lg={6} controlId="fullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control required type="name" />
                        </Form.Group>
                        <Form.Group as={Col} xs={12} lg={6} controlId="nickname">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control type="name" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} xs={12} lg={6} controlId="email">
                            <Form.Label>e-mail ID</Form.Label>
                            <Form.Control required type="email" />
                        </Form.Group>
                        <Form.Group as={Col} xs={12} lg={6} controlId="phone">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type="phone" />
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" type="submit">
                        Create
                    </Button>
                </Form>
            </div>
        );
    }
}

export default CreateMember;