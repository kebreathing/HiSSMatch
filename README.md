# HiSSMatch
安全标准对标：以CSA CCM安全标准为基准，对标现有安全标准，提供标准间安全目标与安全目标之间的匹配。
## 运行方式
1. 运行Flask服务器
```
  # 进入flask目录，app.py为服务器启动文件，默认暴露URL为：http://localhost:5000/
  # 相关接口的定义可直接进入app.py进行查阅
  # 根据系统不同，选择不同的启动方式，以linux为例
  set FLASK_APP = app.py
  flask run
```
2. 服务器成功运行之后，直接打开当前目录下的hissmatch.html即可使用
```
  目录说明：
  HiSSMatch
    -- css文件夹: web样式文件存储
    -- design文件夹: web原型设计稿存储
    -- flask文件夹: python服务器
    -- image文件夹: web相关图片资源存储
    -- js文件夹: web数据、业务控制脚本
    -- action.html: 操作页
    -- content.html: 单一标准内容查看页
    -- hissmatch.html: 首页
    -- match.html: 匹配结果页
    -- modi.html: 匹配结果修改页
```

## 关于
邮箱: up_chris@qq.com or kebreathing@gmail.com
