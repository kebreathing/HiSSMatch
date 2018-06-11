# -*- coding: UTF-8 -*-
import rawdata

# 获取数据并进行处理

# repo = rawdata.rawdata_process('CCM', './repositories/xlsx/CCM.xlsx')
repo = rawdata.read_refined_json('./repositories/tree/CCM.json')
# print(repo)

# function: 遍历安全域信息
def iterate_domain (repo):
    for domain in repo['children']:
        # children is target
        print('[Info] Iterating domain', domain , '...')
        iterate_target(repo['children'][domain])
        break


# function: 遍历安全目标信息
def iterate_target (domain):
    # print('Domain: %s has %d subitems' % (domain['name'], len(domain['children'])))
    # 将所有description综合成一段话，对该话进行words count或tf-idf
    _desc = ''
    for target in domain['children']:
        description = domain['children'][target]['description']
        _desc = _desc + ' ' + description
        # print(str(domain['children'][target]) + '\n')

    # print('In a sentence:\n %s' % _desc)
    # 分句分词
    process.tokenize(_desc)

iterate_domain(repo)
