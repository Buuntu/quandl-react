import React from 'react';
import {Card} from 'react-bootstrap';
import './StockCard.css';

const stock_card = props => {
  return (
    <Card className="StockCard">
      <Card.Body>
        <Card.Title>{props.stock_name}</Card.Title>
        <button type="button" class="close" aria-label="Close" class="close" onClick={props.close}>
          <span aria-hidden="true">&times;</span>
        </button>
      </Card.Body>
    </Card>
  );
}

export default stock_card;
