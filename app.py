from flask import Flask
from flask import render_template, jsonify
import requests

app = Flask(__name__)
URL="http://flaskosa.herokuapp.com/cmd/"

#main page
@app.route('/')
def hello():
    return render_template("index.html")

#return device identification string
@app.route('/api/IDN')
def idn():
    r = requests.get(URL + "IDN")
    return parseString(r.text)

#return limit
@app.route('/api/LIM')
def lim():
    r = requests.get(URL + "LIM")
    res = parseString(r.text)
    if res == "error":
        return res
    else:
        res = res[1:-1]
        res = res.split(",")
        res = str(int(res[0])) + " " + str(int(res[1]))
        return res

#send query
@app.route('/api/ECHO/<query>')
def echo(query):
    r = requests.get(URL + "ECHO/" + query)
    return parseString(r.text)

#ping pong
@app.route('/api/PING')
def pingPong():
    r = requests.get(URL + "PING")
    return parseString(r.text)

#start the instrument
@app.route('/api/START')
def start():
    r = requests.get(URL + "START")
    return parseString(r.text)

#stop the instrument
@app.route('/api/STOP')
def stop():
    r = requests.get(URL + "STOP")
    return parseString(r.text)

#start a scanning
@app.route('/api/SINGLE')
def single():
    r = requests.get(URL + "SINGLE")
    return parseString(r.text)

#return the state of the instrument
@app.route('/api/STATE')
def state():
    r = requests.get(URL + "STATE")
    return parseString(r.text)

#get trace
@app.route('/api/TRACE')
def trace():
    r = requests.get(URL + "TRACE")
    try:
        r = r.json()
        return r
    except:
        return jsonify(error="Error")

#parse the result
def parseString(s):
    cs = "+READY>"
    if len(s) <= 7 or s[:7] != cs:
        return "error"
    else:
        return s[7:]

if __name__ == "__main__":
    app.run(debug=True)

