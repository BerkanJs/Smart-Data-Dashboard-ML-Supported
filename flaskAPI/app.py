from flask import Flask
from routes import impute_routes
from flask_cors import CORS
import sys


sys.path.append('C:/Users/Berkan Özcelik/Desktop/Ml Project/Project/flaskAPI')


app = Flask(__name__)


CORS(app, origins=["https://smart-data-dashboard-ml-supported-1.onrender.com"])


app.register_blueprint(impute_routes)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
