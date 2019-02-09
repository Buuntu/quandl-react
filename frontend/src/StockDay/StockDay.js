import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis} from 'recharts';

import axios from 'axios';

const data = [
    { x: 1, y: 20 },
    { x: 2, y: 10 },
    { x: 3, y: 25 }
];

class StockDay extends Component {
  state = {
    stock_data: [
    ]
  }

  componentDidMount() {
    axios.get('/stocks/NFLX?limit=10').then(res => {
      console.log(res.data)
      this.setState({stock_data: res.data})

    })
  }
  // add input to select for stocks

  render() {
    return <LineChart
      width={400}
      height={400}
      data={this.state.stock_data}>
    <XAxis dataKey="date"/>
    <YAxis dataKey="adj-close"/>
    <Line type="monotone" dataKey="adj-close" stroke="#8884d8" />
    </LineChart>
  }
}

export default StockDay;
