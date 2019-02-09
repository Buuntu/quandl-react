#!/usr/bin/env python

import os
from flaskr import create_app
app = create_app()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
