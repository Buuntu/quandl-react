import os
import quandl
from flask import jsonify, Flask, make_response, abort, request
from quandl.errors.quandl_error import NotFoundError


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
    quandl_key = os.environ['QUANDL_API_KEY']
    quandl.ApiConfig.api_key = quandl_key


    ### ROUTES ###
    @app.route("/stocks/<stock_id>")
    def get_stock_info(stock_id):
        try:
            limit = request.args.get('limit')
            parameters = {}
            if limit:
                parameters = {"limit": limit}
            data = quandl.Dataset('WIKI/' + stock_id).data(params=parameters)
            new_data = []
            for i, row in enumerate(data.to_list()):
                new_data.append({
                    'date': row[0],
                    'open': row[1],
                    'high': row[2],
                    'low': row[3],
                    'close': row[4],
                    'volume': row[5],
                    'ex-dividend': row[6],
                    'split-ratio': row[7],
                    'adj-open': row[8],
                    'adj-high': row[9],
                    'adj-low': row[10],
                    'adj-close': row[11],
                    'adj-volume': row[12],
                })
            data = new_data
        except NotFoundError:
            abort(404)
        # if data.status_code == 404:
        #     abort(404)

        return jsonify(data)


    @app.errorhandler(404)
    def not_found(error):
        return make_response(jsonify({'error': 'Not found'}), 404)

    return app
