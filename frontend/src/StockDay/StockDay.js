import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from 'recharts';
import {Button, Container, Row, Col, Form} from 'react-bootstrap';
import './StockDay.css';
import StockCard from '../StockCard/StockCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {SingleDatePicker, DateRangePicker} from 'react-dates';

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
      const jsx = <Line key={index} type="monotone" name={value} dataKey={'close-' + value} isAnimationActive={false} stroke={colors[color_count]} />;
      color_count++;
      return jsx;
    });
  }

  drawCards = () => {
    return this.state.stocks.map((value, index) => {
      return (<Row>
      <Col>
      <StockCard key={index} stock_name={value} close={() => this.handleDeleteStock(index)}>
      </StockCard>
      </Col>
      </Row>);
    });
  }

  getStockData = (stock_name, start_date, end_date) => {
    const stocks = [...this.state.stocks]
    console.log(`searching for stock ${stock_name}`);

    // If stock has already been searched for, skip http get request
    if (stocks.includes(stock_name)) {
      console.log('found stock name');
      this.setState({stock_name: ''});
      return null;
    }
    stocks.push(stock_name)
    this.setState({stocks: stocks});

    const stock_data = [...this.state.stock_data]

    axios.get('/stocks/' + stock_name, {
      params: {
        'start_date': start_date,
        'end_date': end_date
      }
    }).then(res => {
      const response = {...res.data};
      for (const val in response) {
        // Find the index of the date that has already been searched
        const idx = stock_data.findIndex((el) => {
          return el['date'] === val;
        });

        // If index was found, add data
        if (idx !== -1) {
          console.log(`Found copy at index ${idx}`);
          const rowObj = {...stock_data[idx]}
          rowObj['close-' + stock_name] = response[val]['close']
          stock_data[idx] = rowObj
        }
        // If index was not found
        else {
          const row = {};
          row['close-' + stock_name] = response[val]['close'];

          row['date'] = val;
          stock_data.push(row)
        }
      }

      this.setState({stock_data: stock_data, stock_name: ''})
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }

  handleChangeDates = (startDate, endDate) => {
    this.setState({startDate: startDate, endDate: endDate});

    // if both aren't defined
    if (!startDate || !endDate) {
      return false;
    }

    const start = startDate.format('YYYY-MM-DD');
    const end = endDate.format('YYYY-MM-DD');

    if (startDate !== this.state.startDate || startDate !== this.state.endDate) {
      const stocks = [...this.state.stocks];

      this.setState({stocks: [], stock_data: []}, function() {
        for (const stock in stocks) {
          this.getStockData(stocks[stock], start, end);
        }
      });
    }
  }

  handleChangeStockName = event => {
    this.setState({stock_name: event.target.value})
  }

  submitForm = event => {
    event.preventDefault();
    this.getStockData(this.state.stock_name);
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
    <DateRangePicker
      startDate={this.state.startDate} // momentPropTypes.momentObj or null,
      startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
      endDate={this.state.endDate} // momentPropTypes.momentObj or null,
      endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
      onDatesChange={({ startDate, endDate }) => this.handleChangeDates(startDate, endDate)} // PropTypes.func.isRequired,
      focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
      isOutsideRange={() => false}
      onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
    />
    </Col>
    </Row>
    <Row>
    <Col md={9}>
    <LineChart className="Chart"
      width={750}
      height={400}
      data={this.state.stock_data}
      >
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
    <Form className="StockForm" onSubmit={this.submitForm}>
    <Form.Group>
        <Form.Control type="text" placeholder="Stock Ticker" onChange={this.handleChangeStockName} value={this.state.stock_name}></Form.Control>
    </Form.Group>
    <Button onClick={() => this.getStockData(this.state.stock_name, this.state.startDate.format('YYYY-MM-DD'), this.state.endDate.format('YYYY-MM-DD'))}>Search</Button>
    </Form>
    </Col>
    </Row>
    </Container>
    </div>
  }
}

export default StockDay;
