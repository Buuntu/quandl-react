import pytest
import json


def test_stock_data(client):
    response = client.get('/stocks/NFLX')

    assert response.status_code == 200
    assert len(response.json) > 1


def test_stock_data_params(client):
    response = client.get('/stocks/NFLX?limit=1')

    assert response.status_code == 200
    assert len(response.json) == 1
    assert 'date' in response.json[0]


def test_404(client):
    response = client.get('/stocks/FAKE')

    assert response.status_code == 404
    assert response.json['error'] == 'Not found'
