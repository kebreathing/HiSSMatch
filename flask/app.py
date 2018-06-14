from flask import Flask
from flask import jsonify
from flask_cors import *
import rawdata

app = Flask(__name__)
CORS(app, supports_credentials=True)
repoPath = './repositories/json/'

def switch_standard(name):
    if name == 'CSA CCM':
        return rawdata.read_xlsjson(repoPath + 'CCM.json')
    elif name == 'ISO27001':
        return rawdata.read_xlsjson(repoPath + 'ISO27001.json')
    else:
        return 'sorry'

def switch_match(obj, sub):
    if obj == 'CSA CCM' and sub == 'ISO27001':
        return rawdata.read_match_result_csv('./repositories/xlsx/CSACCM-ISO27001.csv')

def search_obj_by_index(objs, index):
    for obj in objs:
        if obj['index'] == index:
            return obj

def search_sub_by_index(subs, index):
    for sub in subs:
        if sub['index'] == index:
            return sub

@app.route('/')
def hello_world():
    return 'hello, world!'

@app.route('/content/<name>')
def get_content(name):
    return jsonify(switch_standard(name.upper()))

@app.route('/match/<obj>/<sub>')
def get_match(obj, sub):
    obj = obj.upper()
    sub = sub.upper()
    objdata = switch_standard(obj)
    subdata = switch_standard(sub)
    # 读取匹配结果
    match_result = switch_match(obj, sub)

    # 生成匹配json
    _resJson = []
    for i in range(0, len(match_result)):
        row = match_result[i]
        _target = row['target']
        _indexes = row['indexes']

        _obj = search_obj_by_index(objdata, _target)
        if len(_indexes) == 0:
            _resJson.append({'obj': _obj, 'subs': []})
        else:
            _subs = []
            for j in range(0, len(_indexes)):
                # 找结果
                _subs.append(search_sub_by_index(subdata, _indexes[j]))
            _resJson.append({'obj': _obj, 'subs': _subs})

    return jsonify({'res': _resJson})
