import React, {Component} from 'react';
import StockDay from './StockDay/StockDay'
import Navbar from './Navbar/Navbar';
import {Container} from 'react-bootstrap';


class App extends Component {

  render() {
    return <div>
      <Navbar/>
      <Container>
      <StockDay/>
      </Container>
    </div>
  }
}

export default App
