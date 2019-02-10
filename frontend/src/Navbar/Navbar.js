import React from 'react';
import {Navbar} from 'react-bootstrap';
import './Navbar.css';

const navbar = () => {
  return (
  <Navbar bg="dark" variant="dark">
  <Navbar.Brand href="#home"><a href="#"><img src="arrow.svg" id="logo"/></a>
  Restocks</Navbar.Brand>
  </Navbar>
  );
}

export default navbar
