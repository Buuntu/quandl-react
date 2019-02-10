import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis} from 'recharts';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
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
    stock_name: null
  }

  componentDidMount() {
    axios.get('/stocks/NFLX?limit=10').then(res => {
      console.log(res.data)
      this.setState({stock_data: res.data})

    })
  }

  getStockData = stock_name => {
    axios.get('/stocks/' + stock_name + '?limit=10').then(res => {
      console.log(res.data)
      this.setState({stock_data: res.data})
    });
  }

  handleChangeStockName = event => {
    this.setState({stock_name: event.target.value})
  }
  // add input to select for stocks

  render() {
    return <div className="StockDay">
    <LineChart
      width={400}
      height={400}
      data={this.state.stock_data}>
    <XAxis dataKey="date"/>
    <YAxis dataKey="adj-close"/>
    <Line type="monotone" dataKey="adj-close" stroke="#8884d8" />
    </LineChart>
    <InputGroup>
      <InputGroup.Prepend>
        <FormControl type="text" placeholder="Stock Ticker" onChange={this.handleChangeStockName}></FormControl>
        <Button onClick={() => this.getStockData(this.state.stock_name)}>Submit</Button>
      </InputGroup.Prepend>
    </InputGroup>
    </div>
  }
}

export default StockDay;
