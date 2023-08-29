import stripe
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.wrappers import Response
from argon2 import PasswordHasher
#must import specific exceptions
import re

stripe.api_key="sk_test_51NczmlFYi6KCR1Fw2kaJejWCYJElrH0y3LnJvvkhNdwu3OdhxvAOARPcoaIyeTZxtAJKRTETlMgJVArrSfqrUY2S00YjTEOzh3"
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

connection = create_connection("localhost", "root", "WdBy0ZM9Q7pk&WO82g9R$n0")
cursor = connection.cursor()
cursor.execute("USE {}".format("master_database"))

#use triple quotes for database communcation 
def create_db():
    #database is called "database".
    try:
        #you cannot name your database "database"
        cursor.execute(
 "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format("master_database"))
        print("database created successfully!")
    except mysql.connector.Error as error:
        print(error)
    
def create_db_table():
    TABLES = {}
    #remember to include commas
    TABLES['Users'] = (
        "CREATE TABLE `Users` ("
        "`username` varchar(30) NOT NULL,"
        "`email` varchar(70) NOT NULL,"
        "`password` varchar(107) NOT NULL,"
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
CORS(app)
#TODO: store this stuff in a config.py file 
    

@app.route("/")
def test():
    return "The backend is working"

def answerPreflight(): 
    resp = Response("")
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "content-type"
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

        #TODO: Change to where exists for e f f i c i e n c y, use CASE 
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

@app.route("/login", methods=["POST"])
def login():
    json = request.get_json()
    username = json["username"]
    password = json["password"]
    ph = PasswordHasher()

    query = ("SELECT password FROM Users "
             "WHERE Users.username = %s OR Users.email = %s")

    #must pass in a tuple, even if the query only needs one thing
    cursor.execute(query, (username, username))
    result = cursor.fetchone()
    
    if result == None:
        return "", 400
    else:
        for hash in result:
            try:
                ph.verify(bytes(hash, encoding='utf-8'), bytes(password, encoding='utf-8'))
            except:
                return "", 400
        return "", 200
    
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


    

