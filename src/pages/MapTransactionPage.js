import React from 'react';
import { Link } from 'react-router-dom';
import Classifier from '../Classifier';

class MapTransactionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taggedData: null,
            members: null
        };
    }

    componentDidMount() {
        // Get data from location state (passed from HomePage)
        const { state } = this.props.location;
        if (state && state.taggedData && state.members) {
            this.setState({
                taggedData: state.taggedData,
                members: state.members
            });
        }
    }

    render() {
        const { taggedData, members } = this.state;

        if (!taggedData || !members) {
            return (
                <div className="container mt-4">
                    <div className="alert alert-warning">
                        No transaction data available. Please go back to the home page and upload a file or fetch unidentified records.
                    </div>
                    <Link to="/" className="btn btn-primary">
                        Back to Home
                    </Link>
                </div>
            );
        }

        return (
            <div className="container-fluid mt-4">
                <div className="mb-3">
                    <Link to="/" className="btn btn-outline-secondary">
                        ← Back to Home
                    </Link>
                </div>
                <h2>Map Transactions</h2>
                <Classifier
                    inputStrings={Object.keys(taggedData)}
                    taggedData={taggedData}
                    members={members}
                />
            </div>
        );
    }
}

export default MapTransactionPage;
