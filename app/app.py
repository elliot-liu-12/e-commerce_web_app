import stripe
from flask import Flask, jsonify
from markupsafe import escape
from werkzeug.wrappers import Response

stripe.api_key="sk_test_51NczmlFYi6KCR1Fw2kaJejWCYJElrH0y3LnJvvkhNdwu3OdhxvAOARPcoaIyeTZxtAJKRTETlMgJVArrSfqrUY2S00YjTEOzh3"
# url for frontend: http://127.0.0.1:5000/
# run command: python -m flask run



app = Flask(__name__)

@app.route("/")
def test():
    return "The backend is working"

@app.route("/secret", methods=["OPTIONS"])
def answerPreflight(): 
    resp = Response("")
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "content-type"
    return resp

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

