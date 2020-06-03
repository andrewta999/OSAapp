from flask import Flask
from flask import render_template, jsonify, request
import requests
import json
from os import path

app = Flask(__name__)
URL="http://flaskosa.herokuapp.com/cmd/"
TIMEOUT=5

#main page
@app.route('/')
def hello():
    return render_template("index.html")

#return device identification string
@app.route('/api/IDN')
def idn():
    try:
        r = requests.get(URL + "IDN", timeout=TIMEOUT)
        return parseString(r.text)
    except:
        return "SERVER TIMEOUT"

#return limit
@app.route('/api/LIM')
def lim():
    try:
        r = requests.get(URL + "LIM", timeout=TIMEOUT)
        res = parseString(r.text)
    except:
        return "SERVER TIMEOUT"

    if res == "ERROR":
        return res
    else:
        res = res[1:-1]
        res = res.split(",")
        res = str(int(res[0])) + " " + str(int(res[1]))
        return res

#send query
@app.route('/api/ECHO/<query>')
def echo(query):
    try:
        r = requests.get(URL + "ECHO/" + query, timeout=TIMEOUT)
    except:
        return "SERVER TIMEOUT"
    return parseString(r.text)

#ping pong
@app.route('/api/PING')
def pingPong():
    try:    
        r = requests.get(URL + "PING", timeout=TIMEOUT)
    except:
        return "SERVER TIMEOUT"
    return parseString(r.text)

#start the instrument
@app.route('/api/START')
def start():
    try:
        r = requests.get(URL + "START", timeout=TIMEOUT)
    except:
        return "SERVER TIMEOUT"
    return parseString(r.text)

#stop the instrument
@app.route('/api/STOP')
def stop():
    try:
        r = requests.get(URL + "STOP", timeout=TIMEOUT)
    except:
        return "SERVER TIMEOUT"
    return parseString(r.text)

#start a scanning
@app.route('/api/SINGLE')
def single():
    try:
        r = requests.get(URL + "SINGLE", timeout=10)
    except:
        return "SERVER TIMEOUT"
    return parseString(r.text)

#return the state of the instrument
@app.route('/api/STATE')
def state():
    try:
        r = requests.get(URL + "STATE", timeout=TIMEOUT)
    except:
        return "SERVER TIMEOUT"
    return parseString(r.text)

#get trace
@app.route('/api/TRACE')
def trace():
    try:
        r = requests.get(URL + "TRACE", timeout=TIMEOUT)
    except:
        return jsonify(error="SERVER TIMEOUT")

    try:
        r = r.json()
        return r
    except:
        return jsonify(error="ERROR")

#send query
@app.route('/api/QUERY')
def query():
    queryInput = request.args["queryInput"]
    r = requests.get("http://flaskosa.herokuapp.com" + queryInput)
    try:
        res = r.text 
        return res 
    except:
        pass

    try: 
        res = r.json()
        return r
    except:
        return jsonify(error="ERROR")

@app.route('/api/UPLOAD', methods=['POST'])
def upload():
    graph = jsonify(error="data")
    with open('graph.txt', 'w') as outfile:
        json.dump(graph, outfile)
    return "Successfully Saved File"

@app.route('/api/GET')
def get():
    if path.exists('graph.txt'):
        with open('graph.txt') as json_file:
            data = json.load(json_file)
            return data
    else:
        return jsonify(error="NO GRAPH AVAILABLE")



#parse the result
def parseString(s):
    cs = "+READY>"
    if len(s) <= 7 or s[:7] != cs:
        return "ERROR"
    else:
        return s[7:]

if __name__ == "__main__":
    app.run(debug=True)

