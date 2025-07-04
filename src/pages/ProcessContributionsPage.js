import React from 'react';
import { Link } from 'react-router-dom';

class ProcessContributionsPage extends React.Component {
    render() {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Process Contributions</h2>
                    <Link to="/" className="btn btn-outline-secondary">
                        ← Back to Home
                    </Link>
                </div>
                
                <div className="alert alert-info">
                    This page is under construction. Functionality for processing contributions will be implemented soon.
                </div>
            </div>
        );
    }
}

export default ProcessContributionsPage;
