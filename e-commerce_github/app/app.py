import stripe
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.wrappers import Response
from argon2 import PasswordHasher
import jwt
import time
from threading import Thread, ThreadError, Timer
#must import specific exceptions
import re

stripe.api_key=""
# url for frontend: http://127.0.0.1:5000/
# run command: python -m flask run
# flask --app run --debug

def create_connection(host_name, user_name, user_password):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password
        )
        print("Connection to MySQL successful")
    except Error as e:
        print(f"'{e}'")

    return connection

connection = create_connection("localhost", "root", "")
cursor = connection.cursor()
cursor.execute("USE {}".format("master_database"))
#TODO: add saving from database
token_blacklist = set()

#use triple quotes for database communcation 
def create_db():
    try:
        cursor.execute(
 "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format("master_database"))
        print("database created successfully!")
    except mysql.connector.Error as error:
        print(error)
    
def create_db_table():
    TABLES = {}
    #remember to include commas
    TABLES['Users'] = (
        "CREATE TABLE `Blacklist` ("
        "`token` varchar(100) NOT NULL,"
        "`id` int(11) NOT NULL AUTO_INCREMENT,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB"
    )
    for table_name in TABLES:
        try:
            cursor.execute("USE {}".format("master_database"))
            table_description = TABLES[table_name]
            cursor.execute(table_description)
            print("table created successfully!")
        except mysql.connector.Error as error:
            print(error)

def delete_all():
        cursor.execute("DELETE FROM master_database.users LIMIT 1000")
    

def procedures(): 
    return None

procedures()

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)
#TODO: store this in a config.py file 
    

@app.route("/")
def test():
    return "The backend is working"

def answerPreflight(): 
    resp = Response("")
    resp.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    resp.headers["Access-Control-Allow-Headers"] = "content-type, Session-Token, Refresh-Token"
    resp.headers["Access-Control-Allow-Credentials"] = "true"

    return resp

@app.route("/secret", methods=["OPTIONS"])
def secret_preflight():
    return answerPreflight()

@app.route("/secret", methods=["GET"])
def secret():
    intent = stripe.PaymentIntent.create(
    amount=50,
    currency="usd",
    )
    
    resp = jsonify(client_secret = intent.client_secret)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "content-type"
    return resp

@app.route("/signup", methods=["POST"])
def signup():
    json = request.get_json()
    username = json["username"]
    email = json["email"]
    password = json["password"]

    statusCode = verification(username, email, password)
    if statusCode == 200:

        query = ("SELECT username, email FROM Users "
                 "WHERE Users.username = %s OR Users.email = %s")
        
        cursor.execute(query, (username, email))
        result = cursor.fetchall()

        #checks for username/email uniqueness
        if len(result) > 0:
            duplicateUsername = False
            duplicateEmail = False
            #have to iterate through result instead of cursor
            for (stored_username, stored_email) in result:
                if stored_username == username:
                    duplicateUsername = True
                if stored_email == email:
                    duplicateEmail = True
            
            #returns error code based on number and identity of duplicate fields
            if duplicateUsername and duplicateEmail:
                return "", 600
            elif duplicateUsername:
                return "", 601
            else:
                return "", 602
        else:
            ph = PasswordHasher()
            hash = ph.hash(password)
            ph.verify(hash, password)

            while ph.check_needs_rehash(hash):
                hash = ph.hash(password)

            add_user = ("INSERT INTO Users "
                         "(username, email, password)"
                         "VALUES (%s, %s, %s)")
            values = (username, email, hash)

            cursor.execute(add_user, values)
            connection.commit()
            return "", statusCode
    else:
        return "", statusCode

@app.route("/login", methods=["OPTIONS"])
def login_preflight():
    return answerPreflight()
        
@app.route("/login", methods=["POST"])
def login():
    json = request.get_json()
    username = json["username"]
    password = json["password"]
    ph = PasswordHasher()

    query = ("SELECT username, password FROM Users "
             "WHERE Users.username = %s OR Users.email = %s")

    #must pass in a tuple, even if the query only needs one thing
    cursor.execute(query, (username, username))
    result = cursor.fetchone()
    
    if result == None:
        return "", 400
    else:
        stored_username, hash = result
        try:
            ph.verify(bytes(hash, encoding='utf-8'), bytes(password, encoding='utf-8'))
            #pass jwt with user information back to frontend 
            secret = "2T<~N>i$G8*?^Nys^K!~{Xuy[Yf<5U"
            refresh_token_exp = int(time.time() + human_to_unix(hours=5))
            user_data = {
                "username" : stored_username,
                "exp": int(time.time()) + human_to_unix(minutes=10)
            }

            token = jwt.encode(
                key=secret,
                payload=user_data,
            )

            refresh_data = {
                "exp": refresh_token_exp
            }
            
            refresh_token = jwt.encode(
                key=secret,
                payload=refresh_data
            )
            resp = make_response(token, 200)
            #set cookie only works by default if the frontend and backend are running on the same domain
            resp.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
            resp.set_cookie(key="refresh_token", domain="127.0.0.1", value=refresh_token, expires=refresh_token_exp, samesite="None",
                httponly=True, secure=True)
            # must have this to allow cookie to be saved
            resp.headers["Access-Control-Allow-Credentials"] = "true"

        except Exception as e:
                print(e)
                return "", 400
        return resp

@app.route("/signout", methods=["OPTIONS"])
def signout_preflight():
    return answerPreflight()

@app.route("/signout", methods=["POST"])
def signout():
    accessToken = request.get_data()
    token_blacklist.add(accessToken)

    #removes the invalidated access token from the blacklist in 10 minutes, when it wil be expired anyway.
    t = Timer(600, remove_blacklisted_token, args=(accessToken,))
    t.start()

    resp = make_response("", 200)
    resp.set_cookie(key="refresh-token", domain="127.0.0.1", value="", expires=0, samesite="None",
    httponly=True, secure=True)
    return resp

    
def remove_blacklisted_token(token):
    token_blacklist.remove(token)
 
def verification(username, email, password):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if username == None or email == None or password == None:
        return 403
    elif len(username) < 4 or len(username) > 30:
        return 403
    elif len(password) < 6 or len(password) > 50:
        return 403
    elif re.fullmatch(regex, email) == None:
        return 403
    else:
        return 200

def human_to_unix(seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0):
    result = 0
    if seconds != 0:
        result += seconds
    if minutes != 0:
        result += (minutes * 60)
    if hours != 0:
        result += (hours * 3600)
    if days != 0:
        result += (days * 86400)
    if weeks != 0:
        result += (weeks * 604800)
    return result

    

