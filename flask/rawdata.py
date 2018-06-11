# -*- coding: UTF-8 -*-
# 1. 建立各自的安全标准库
# 2. 提供库中的安全域和安全目标的查询
# 3. 建立库的索引
# {
#     name: standard_name,
#     children: {
#         domain_key: {
#             name: domain_key,
#             children: {
#                 name: target_key,
#                 children: {
#                     name: target_key,
#                     description: description,
#                     index: index
#                 }
#             }
#         }
#     }
#     domains: ()
# }
import xlrd
import json
import os

def read_ccm_xls (table):
    dicts = []
    for i in range(1, table.nrows):
        # 各字段结果值
        _object = table.cell(i, 0).value.split("\n")[0]
        _target = table.cell(i, 1).value.split("\n")[1]
        _index = table.cell(i, 2).value
        _description = table.cell(i, 3).value.split("\n")[0]

        _dict = {
            'object': _object,
            'target': _target,
            'index': _index,
            'description': _description
        }
        dicts.append(_dict)
    return dicts

# 将CCM标准数据综合成大型仓库
# 以安全域为一级目录
# 以安全目标为二级目录
def build_ccm_repository (standard_name, standard_data):
    if standard_data is None and len(standard_data) == 0:
        # print("Error: data cannot be null")
        raise Exception("Error: data cannot be null")

    # 声明变量
    standard = {
        'name': standard_name,
        'children': {},
        'domains': set()
    }
    for item in standard_data:
        domain_key = item['object']
        # 不存在安全域就新建key
        if domain_key not in standard['children']:
            standard['children'][domain_key] = {'name': domain_key, 'children': {}}

        # 不存在安全目标就新建key
        target_key = item['target']
        if target_key not in standard['children'][domain_key]['children']:
            standard['children'][domain_key]['children'][target_key] = {
                'name': target_key,
                'description': item['description'],
                'index': item['index']
            }

        standard['domains'].add(domain_key)
    return standard

def read_iso27001_xls (table):
    dicts = []
    for i in range(0, table.nrows):
        _field1 = str(table.cell(i, 0).value)    # index
        _field2 = str(table.cell(i, 2).value)    # domain and target
        _field3 = str(table.cell(i, 4).value)    # description

        is_domain = False
        if _field1 is None:
            break

        levels = _field1.split('.')
        is_A_start = _field1.startswith('A')
        if not is_A_start and levels[1] == '0':
            is_domain = True
            _objectName = _field2
        elif is_A_start and len(levels) == 2:
            is_domain = True
            _objectName = _field2

        _object = {
            'object': _objectName,
            'target': _field2,
            'index': _field1,
            'description': _field3,
            'isDomain': is_domain
        }
        dicts.append(_object)
    return dicts

def build_iso_repository (standard_name, standard_data):
    if standard_data is None and len(standard_data) == 0:
        raise Exception("Error: data cannot be null")

    standard = {
        'name': standard_name,
        'children': {},
        'domains': set()
    }
    for item in standard_data:
        index = item['index']
        domain = item['object']
        target = item['target']
        description = item['description']

        # 安全域添加
        if item['isDomain']:
            standard['domains'].add(domain)
            standard['children'][domain] = {'name': domain, 'children': {}, 'description': description}
        else:
        # 安全目标，具有层级性
            standard['children'][domain]['children'][target] = {
                'name': target,
                'description': description,
                'index': index
            }
    return standard

def build_repository (standard_name, data):
    if standard_name == 'CCM':
        return build_ccm_repository(standard_name, data)
    elif standard_name == 'ISO27001':
        return build_iso_repository(standard_name, data)

# function: 从excel中读取文件，过滤中文生成data
# description: 目前针对带中文翻译的CCM
def read_xls_file (standard_name, xls_path):
    try:
        data = xlrd.open_workbook(xls_path)
    except:
        print("[Error] Fail to open ", xls_path, ".")
    else:
        table = data.sheets()[0]
        n = table.nrows
        print("[Info] The excel has ", n, "rows.")

        if standard_name == "CCM":
            return read_ccm_xls(table)
        elif standard_name == "ISO27001":
            return read_iso27001_xls(table)

# 将excel保存到json中
def save_xls_to_json (data, filename):
    with open(filename, "w") as fo:
        for item in data:
            fo.write(str(item) + "\n")
    print("Json file has been created as ", filename)

# 读取json文件
def read_xlsjson (filename):
    dicts = []
    with open(filename, 'r') as fi:
        for line in fi.readlines():
            dicts.append(eval(line))
    return dicts

# 保存树级结构到json
def save_refined_json (data, filename):
    with open(filename, 'w') as fo:
        fo.write(str(data))
    print("Refined json file has been created as ", filename)

def read_refined_json (filename):
    dicts = {}
    with open(filename, 'r') as fi:
        dicts = eval(fi.readline())
    return dicts

def rawdata_process (standard_name, xls_path):
    data = read_xls_file(standard_name, xls_path)

    # save to json
    save_xls_to_json(data, "./repositories/json/" + standard_name + ".json")

    # build repository
    json = build_repository(standard_name, data)

    # save to tree
    save_refined_json(json, "./repositories/tree/" + standard_name + ".json")

    # print Json
    return json

def batch_rawdata_process(xls_dir):
    xlsxs = os.listdir(xls_dir)
    for xlsx in xlsxs:
        if xlsx.startswith('~'):
            continue

        name = xlsx.split('.')[0]
        rawdata_process(name, xls_dir + '/' + xlsx)

# rawdata_process("CCM", "./repositories/xlsx/CCM.xlsx")
# rawdata_process("ISO27001", "./repositories/xlsx/ISO27001.xlsx")
# batch_rawdata_process('./repositories/xlsx')
# _dict = read_xlsjson('./repositories/json/CCM.json')
# print(_dict)
