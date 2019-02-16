import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label, CartesianGrid} from 'recharts';
import {InputGroup, FormControl, Button, Container, Row, Col, Form} from 'react-bootstrap';
import './StockDay.css';
import StockCard from '../StockCard/StockCard';

import axios from 'axios';

const colors = [
  '#008000', // green
  '#00FFFF', // aqua
  '#008080', // teal
  '#0000FF', // blue
  '#8884d8', // purple
];
let color_count = 0;

class StockDay extends Component {
  state = {
    stocks: [], // Holds the names of the stocks
    stock_data: [], // Holds the data of the all the stocks (one row per date)
    stock_name: '', // Search bar value
  }

  componentDidMount() {
    this.getStockData('NFLX');
  }

  drawLines = () => {
    color_count = 0;
    return this.state.stocks.map((value, index) => {
      const jsx = <Line type="monotone" name={value} dataKey={'adj-close-' + value} stroke={colors[color_count]} />;
      color_count++;
      return jsx;
    });
  }

  drawCards = () => {
    return this.state.stocks.map((value, index) => {
      return (<Row>
      <Col>
      <StockCard stock_name={value} close={() => this.handleDeleteStock(index)}>
      </StockCard>
      </Col>
      </Row>);
    });
  }

  getStockData = stock_name => {
    const stocks = [...this.state.stocks]

    // If stock has already been searched for, skip http get request
    if (stocks.includes(stock_name)) {
      this.setState({stock_name: ''});
      return null;
    }
    stocks.push(stock_name)
    this.setState({stocks: stocks});

    const stock_data = [...this.state.stock_data]

    axios.get('/stocks/' + stock_name + '?limit=10').then(res => {
      const response = [...res.data];
      for (const val of response) {
        // Find the index of the date that has already been searched
        const idx = stock_data.findIndex((el) => {
          return el.date === val.date;
        });
        console.log(idx);

        // If index was found, add data
        if (idx > -1) {
          console.log(`Found copy at index ${idx}`);
          const rowObj = {...stock_data[idx]}
          rowObj['adj-close-' + stock_name] = val['adj-close']
          stock_data[idx] = rowObj
        }
        // If index was not found
        else {
          //stock_data = [...res.data];
          val['adj-close-' + stock_name] = val['adj-close'];
          delete val['adj-close'];
          stock_data.push(val);
        }
      }

      this.setState({stock_data: stock_data, stock_name: ''})
    });
  }

  handleChangeStockName = event => {
    this.setState({stock_name: event.target.value})
  }

  handleDeleteStock = index => {
    const stocks = [...this.state.stocks];

    stocks.splice(index, 1);
    this.setState({stocks: stocks});
  }
  // add input to select for stocks

  render() {
    return <div className="StockDay">
    <Container>
    <Row>
    <Col md={9}>
    <LineChart className="Chart"
      width={750}
      height={400}
      data={this.state.stock_data}>
    <CartesianGrid strokeDasharray="3 3"/>
    <XAxis dataKey="date" label="Date" interval="preserveStartEnd" ticks={[...Array(10).keys()]}/>
    <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}/>
    <Legend verticalAlign="top" height={36} />
    {this.drawLines()}
    <Tooltip/>
    </LineChart>
    </Col>
    <Col md={3}>
    {this.drawCards()}
    </Col>
    </Row>
    <Row>
    <Col md={9}>
    <Form className="StockForm">
    <Form.Group>
        <Form.Control type="text" placeholder="Stock Ticker" onChange={this.handleChangeStockName} value={this.state.stock_name}></Form.Control>
    </Form.Group>
    <Button onClick={() => this.getStockData(this.state.stock_name)}>Search</Button>
    </Form>
    </Col>
    </Row>
    </Container>
    </div>
  }
}

export default StockDay;
