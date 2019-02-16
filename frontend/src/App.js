import React, {Component} from 'react';
import StockDay from './StockDay/StockDay';
import Financials from './Financials/Financials';
import Navbar from './Navbar/Navbar';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';


class App extends Component {

  render() {
    return(
      <Router>
        <div>
        <Navbar/>
        <Container>
        </Container>

        <Route exact path="/" component={StockDay} />
        <Route path="/financials" component={Financials} />
        </div>
      </Router>
    );
  }
}

export default App
