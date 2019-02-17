import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import './Navbar.css';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';

const navbar = () => {
  return (
  <Navbar bg="dark" variant="dark">
  <Nav className="mr-auto">
    <Navbar.Brand href="/"><img src="arrow.svg" id="logo"/>
    Restocks</Navbar.Brand>
    <IndexLinkContainer to="/">
      <Nav.Link>Stocks</Nav.Link>
    </IndexLinkContainer>
    <LinkContainer to="/financials">
      <Nav.Link>Financials</Nav.Link>
    </LinkContainer>
  </Nav>
  </Navbar>
  );
}

export default navbar
