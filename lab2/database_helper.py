import sqlite3
from flask import g

DATABASE_URI = 'database.db'


def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = sqlite3.connect(DATABASE_URI)
    return db


def disconnect_db():
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
        g.db = None


def get_user_by_email(email):
    cursor = get_db().execute('select * from user where email = ?', [email])
    rows = cursor.fetchall()
    cursor.close()
    if len(rows) != 0:
        content = rows[0]
        if email in content:
            user_data = {
                'email': content[0],
                'password': content[1],
                'firstname': content[2],
                'familyname': content[3],
                'gender': content[4],
                'city': content[5],
                'country': content[6]}
        else:
            user_data = None
    else:
        user_data = None
    return user_data


def save_token(token, email):
    try:
        get_db().execute(
            "insert into token (token, user_email) values(?, ?);", [token, email])
        get_db().commit()
        return True
    except:
        return False


def save_user(email, password, firstname, familyname, gender, city, country):
    try:
        get_db().execute("insert into user (email, password, firstname, familyname, gender, city, country) values(?, ?, ?, ?, ?, ?, ?);",
                         [email, password, firstname, familyname, gender, city, country])
        get_db().commit()
        return True
    except:
        return False


def get_email_by_token(token):
    cursor = get_db().execute(
        'select user_email from token where token = ?', [token])
    rows = cursor.fetchall()
    cursor.close()
    if len(rows) != 0:
        return rows[0][0]
    else:
        return None


def del_token(token):
    if get_email_by_token(token):
        try:
            get_db().execute("delete from token where token = ?", [token])
            get_db().commit()
            return True
        except:
            return False
    else:
        return False


def change_password(email, new_password):
    try:
        get_db().execute("update user set password=? where email =?",
                         [new_password, email])
        get_db().commit()
        return True
    except:
        return False


def save_message(sender, receiver, message):
    try:
        get_db().execute("insert into messages (sender_email, receiver_email, message) values(?, ?, ?);",
                         [sender, receiver, message])
        get_db().commit()
        return True
    except:
        return False


def get_messages_by_email(receiver_email):
    cursor = get_db().execute(
        'select * from messages where receiver_email = ?', [receiver_email])
    rows = cursor.fetchall()
    cursor.close()
    if len(rows) != 0:
        messages = [{'id': msg[0], 'sender': msg[1], 'receiver': msg[2],
                     'message': msg[3]}
                    for msg in rows]
        return messages
    else:
        return []
