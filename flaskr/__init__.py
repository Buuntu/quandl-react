import os
import quandl
from flask import jsonify, Flask, make_response, abort, request
from quandl.errors.quandl_error import NotFoundError
import pandas_datareader.data as web
from datetime import datetime, timedelta
import requests_cache

expire_after = timedelta(days=5)

session = requests_cache.CachedSession(
    cache_name='cache', backend='sqlite', expire_after=expire_after)


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Setup quandl API
    # quandl_key = os.environ['QUANDL_API_KEY']
    # quandl.ApiConfig.api_key = quandl_key

    ### ROUTES ###
    @app.route("/stocks/<stock_id>")
    def get_stock_info(stock_id):
        try:
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            if start_date:
                start = datetime.strptime(start_date, '%Y-%m-%d')
            else:
                start = datetime.today() - timedelta(days=10)

            if end_date:
                end = datetime.strptime(end_date, '%Y-%m-%d')
            else:
                end = datetime.today()

            data = web.DataReader(stock_id, 'iex', start, end, session=session)
        except:
            abort(404)

        return data.to_json(orient='index')

    @app.errorhandler(404)
    def not_found(error):
        return make_response(jsonify({'error': 'Not found'}), 404)

    return app
