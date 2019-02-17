import React, {Component} from 'react';
import {InputGroup, FormControl, Button, Container, Row, Col, Form} from 'react-bootstrap';
import axios from 'axios';


class Financials extends Component {
  state = {
    stock_name: '',
    reports: []
  }

  getFinancialData = stock => {
    console.log(stock);
    axios.get('https://api.iextrading.com/1.0/stock/' + encodeURIComponent(stock) + '/financials',
      { crossdomain: true, responseType: 'json'
      }).then(res => {
      const reports = res.data.financials;
      console.log(reports);
      this.setState({reports: reports});
    });
    this.setState({stock_name: ''});
  }

  handleChangeStockName = event => {
    this.setState({stock_name: event.target.value});
  }

  onSubmit = event => {
    event.preventDefault()
    this.getFinancialData(this.state.stock_name)
  }

  showReports = () => {
    if (this.state.reports.length > 0) {
      return <h4>Found {this.state.reports.length} reports</h4>
    }
  }

  render() {

    return <div>
    <Form className="StockForm" onSubmit={this.onSubmit}>
    <Form.Group>
        <Form.Control type="text" placeholder="Stock Ticker" onChange={this.handleChangeStockName} value={this.state.stock_name}></Form.Control>
    </Form.Group>
    <Button onClick={() => this.getFinancialData(this.state.stock_name)}>Search</Button>
    </Form>
    {this.showReports()}
    </div>
  }
}

export default Financials;
