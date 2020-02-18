from flask import Flask, request, jsonify
import database_helper
import json
import random

app = Flask(__name__)

app.debug = True


@app.route("/signin", methods=['POST', 'GET'])
def sign_in():
    input_data = request.get_json()
    input_email = input_data['email']
    input_password = input_data['password']

    db_user = database_helper.get_user_by_email(input_email)
    if (db_user is not None and db_user['password'] == input_password):
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
def Change_password():
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


@app.route("/get_user_data_by_token", methods=["POST"])
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
        if database_helper.get_user_by_email(toEmail) is not None:
            database_helper.save_message(fromEmail, toEmail, message)
            return json.dumps({"success": True, "message": "Message posted"})
        else:
            return json.dumps({"success": False, "message": "No such user."})
    else:
        return json.dumps({"success": False, "message": "You are not signed in."})
    return False


if __name__ == "__main__":
    app.run()
