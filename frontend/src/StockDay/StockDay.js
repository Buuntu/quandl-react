import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts';
import {InputGroup, FormControl, Button, Container, Row, Col, Form} from 'react-bootstrap';
import './StockDay.css';

import axios from 'axios';

const data = [
    { x: 1, y: 20 },
    { x: 2, y: 10 },
    { x: 3, y: 25 }
];

class StockDay extends Component {
  state = {
    stock_data: [
    ],
    stock_name: 'NFLX',
    chart_name: 'NFLX'
  }

  componentDidMount() {
    this.getStockData(this.state.stock_name);
  }

  getStockData = stock_name => {
    axios.get('/stocks/' + stock_name + '?limit=10').then(res => {
      console.log(res.data)
      this.setState({stock_data: res.data, chart_name: stock_name})
    });
  }

  handleChangeStockName = event => {
    this.setState({stock_name: event.target.value})
  }
  // add input to select for stocks

  render() {
    return <div className="StockDay">
    <LineChart className="Chart"
      width={800}
      height={400}
      data={this.state.stock_data}>
    <XAxis dataKey="date" label="Date" interval="preserveStartEnd" ticks={[...Array(this.state.stock_data.length).keys()]}/>
    <YAxis dataKey="adj-close" label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}/>
    <Legend verticalAlign="top" height={36} />
    <Line type="monotone" name={this.state.chart_name} dataKey="adj-close" stroke="#8884d8" />
    <Tooltip/>
    </LineChart>
    <Form className="StockForm">
    <Form.Group>
        <Form.Control type="text" placeholder="Stock Ticker" onChange={this.handleChangeStockName}></Form.Control>
    </Form.Group>
    <Button onClick={() => this.getStockData(this.state.stock_name)}>Submit</Button>
    </Form>
    </div>
  }
}

export default StockDay;
