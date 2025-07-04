import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

// Import page components
import HomePage from './pages/HomePage';
import MapTransactionPage from './pages/MapTransactionPage';
import ProcessContributionsPage from './pages/ProcessContributionsPage';

function App() {
    return (
        <div className="App">
            <AppHeader />
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/map-transaction" component={MapTransactionPage} />
                <Route path="/processContributions" component={ProcessContributionsPage} />
            </Switch>
        </div>
    );
}

class AppHeader extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to="/">
                    <img src={logo} alt="" style={{ width: '5em' }} />
                    Vagaipaduththal
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" >
                    <Nav className="mr-auto">
                        <Nav.Link href="https://www.imaigal.org/" target="_blank">Imaigal</Nav.Link>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/processContributions">Process Contributions</Nav.Link>
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


export default App;
