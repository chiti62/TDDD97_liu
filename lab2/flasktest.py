# from flask import Flask
# app = Flask(__name__)

# @app.route("/")
# def hello():
#     return "Hello World!"

# if __name__ == "__main__":
#     app.run()
from flask import Flask
from flask_sockets import Sockets

app = Flask(__name__)
sockets = Sockets(app)


@sockets.route('/echo')
def echo_socket(ws):
    while True:
        message = ws.receive()
        ws.send(message)


@app.route('/')
def hello():
    return 'Hello World!'


if __name__ == "__main__":
    app.run()
