import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import './Navbar.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';

const navbar = () => {
  return (
  <Navbar bg="dark" variant="dark">
  <Navbar.Brand href="#home"><a href="#"><img src="arrow.svg" id="logo"/></a>
  Restocks</Navbar.Brand>
  <Nav className="mr-auto">
    <LinkContainer to="/">
      <Nav.Link>Stocks</Nav.Link>
    </LinkContainer>
    <LinkContainer to="/financials">
      <Nav.Link>Financials</Nav.Link>
    </LinkContainer>
  </Nav>
  </Navbar>
  );
}

export default navbar
