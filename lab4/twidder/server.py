# from __init__ import app
from flask import Flask, request, jsonify
import database_helper
import json
import random
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

app = Flask(__name__, template_folder='.', static_folder='static')
app.debug = True
logged_user = {}


@app.route("/")
def root():
    return app.send_static_file(filename="client.html")


@app.route("/signin", methods=['POST', 'GET'])
def sign_in():
    print("sign in")
    input_data = request.get_json()
    input_email = input_data['email']
    input_password = input_data['password']

    db_user = database_helper.get_user_by_email(input_email)
    if (db_user is not None and db_user['password'] == input_password):
        # if input_email in logged_user:
        #     message = {'message': "logged in other place"}
        #     try:
        #         logged_user[input_email].send(json.dumps(message))
        #     except:
        #         pass
        # token = create token
        letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        token = ""
        for i in range(36):
            token += letters[random.randrange(0, len(letters))]
        # insert token and email to db
        database_helper.save_token(token, input_email)
        return json.dumps({"success": True, "message": "Successfully signed in.", "data": token})
    else:
        return json.dumps({"success": False, "message": "Wrong username or password."})


@app.route("/signup", methods=["POST"])
def sign_up():
    input_data = request.get_json()
    input_email = input_data['email']
    # print(input_email)
    if database_helper.get_user_by_email(input_email) is None:
        password = input_data['password']
        if len(password) < 4:
            json.dumps({"success": False, "message": "Password too short."})
        firstname = input_data['firstname']
        familyname = input_data['familyname']
        gender = input_data['gender']
        city = input_data['city']
        country = input_data['country']
        response = database_helper.save_user(
            input_email, password, firstname, familyname, gender, city, country)
        if response:
            return json.dumps({"success": True, "message": "Successfully created a new user."})
        else:
            return json.dumps({"success": False, "message": "Form data missing or incorrect type."})
    else:
        return json.dumps({"success": False, "message": "User already exists."})
    return False


@app.route("/signout", methods=["POST"])
def sign_out():
    input_data = request.get_json()
    token = input_data['token']
    if database_helper.del_token(token):
        return json.dumps({"success": True, "message": "Successfully signed out."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route("/changepassword", methods=["POST"])
def change_password():
    input_data = request.get_json()
    token = input_data['token']
    email = database_helper.get_email_by_token(token)
    if email:
        # user logged in
        user_data = database_helper.get_user_by_email(email)
        if input_data['oldPassword'] == user_data['password']:
            database_helper.change_password(email, input_data['newPassword'])
            return json.dumps({"success": True, "message": "Password changed."})
        else:
            return json.dumps({"success": False, "message": "Wrong password."})
    else:
        return json.dumps({"success": False, "message": "You are not logged in."})


@app.route("/get_user_data_by_token", methods=["POST", "GET"])
def get_user_data_by_token():
    input_data = request.get_json()
    token = input_data['token']
    email = database_helper.get_email_by_token(token)
    if email:
        user_data = database_helper.get_user_by_email(email)
        if user_data:
            return json.dumps({"success": True, "message": "User data retrieved.", "data": user_data})
        else:
            return json.dumps({"success": False, "message": "No such user."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route("/get_user_data_by_email", methods=["POST"])
def get_user_data_by_email():
    input_data = request.get_json()
    token = input_data['token']
    email_query = input_data['email']
    email_user = database_helper.get_email_by_token(token)
    if email_user:
        user_data = database_helper.get_user_by_email(email_query)
        if user_data:
            return json.dumps({"success": True, "message": "User data retrieved.", "data": user_data})
        else:
            return json.dumps({"success": False, "message": "No such user."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route("/get_user_messages_by_token", methods=["POST"])
def get_user_messages_by_token():
    input_data = request.get_json()
    token = input_data['token']
    email = database_helper.get_email_by_token(token)
    if email is not None:
        messages = database_helper.get_messages_by_email(email)
        # if messages is not None:
        return json.dumps({"success": True, "message": "User messages retrieved.", "data": messages})
        # else:
        #     return json.dumps({"success": False, "message": "No message."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route("/get_user_messages_by_email", methods=["POST"])
def get_user_messages_by_email():
    input_data = request.get_json()
    email = input_data['email']
    token = input_data['token']
    login_email = database_helper.get_email_by_token(token)
    if login_email is not None:
        if database_helper.get_user_by_email(email) is not None:
            messages = database_helper.get_messages_by_email(email)
            # if messages is not None:
            return json.dumps({"success": True, "message": "User messages retrieved.", "data": messages})
            # else:
            #     return json.dumps({"success": False, "message": "No message."})
        else:
            return json.dumps({"success": False, "message": "No such user."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})


@app.route("/post_message", methods=["POST"])
def post_message():
    input_data = request.get_json()
    # fromEmail = input_data['fromEmail']
    message = input_data['message']
    token = input_data['token']
    fromEmail = database_helper.get_email_by_token(token)
    if fromEmail is not None:
        toEmail = input_data['email']
        if toEmail == "own":
            toEmail = fromEmail
        if database_helper.get_user_by_email(toEmail) is not None:
            database_helper.save_message(fromEmail, toEmail, message)
            return json.dumps({"success": True, "message": "Message posted"})
        else:
            return json.dumps({"success": False, "message": "No such user."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})
    return False


@app.route('/socket')
def socket():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        while True:
            try:
                message = json.loads(ws.receive())
            except:
                break
            if message is not None:
                user_token = message["token"]
                print(user_token)
                user_email = database_helper.get_email_by_token(user_token)
                print(user_email)
                for logged_token in logged_user:
                    if user_email == database_helper.get_email_by_token(logged_token):
                        prev_socket = logged_user[logged_token]
                        try:
                            prev_socket.send(json.dumps(
                                {"message": "logged in elsewhere"}))
                        except:
                            pass
                logged_user[user_token] = ws

    return None


if __name__ == "__main__":
    # init()
    # app.debug = True
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
