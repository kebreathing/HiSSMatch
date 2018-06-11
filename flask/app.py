from flask import Flask
from flask import jsonify
from flask_cors import *
import rawdata

app = Flask(__name__)
CORS(app, supports_credentials=True)
repoPath = './repositories/json/'

@app.route('/')
def hello_world():
    return 'hello, world!'

@app.route('/content/<name>')
def get_content(name):
    name = name.upper()
    if name == 'CSA CCM':
        l = rawdata.read_xlsjson(repoPath + 'CCM.json')
        return jsonify(l)
    elif name == 'ISO27001':
        l = rawdata.read_xlsjson(repoPath + 'ISO27001.json')
        return jsonify(l)
    else:
        return 'sorry.'

@app.route('/match/<obj>/<sub>')
def get_match(obj, sub):
    return obj + sub
