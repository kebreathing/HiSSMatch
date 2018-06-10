var _domains = [
  'Application & Interface Security',
  'Encryption & Key Management',
  'Governance and Risk Management'
]

class Controller {
  constructor () {
    this.name = undefined
    this.pageSize = undefined
    this.status = 0 // 0：全部，1：候选项

    this.candidates = new Set()
    this.searchares = new Set()
    this.keyword = undefined
  }
  initParams (name, pageSize) {
    $('#ssname').text(name)

    this.name = name
    this.pageSize = pageSize
    this.init()
  }
  init () {
    // 读取数据源
    var that = this
    $('.domain_btn').bind('click', function (e) {
      let _className = this.className
      let _span = this.children[0].innerHTML.replace('amp;', '')
      if (_className.indexOf('normal') >= 0) {
        _className = _className.replace('normal', 'active')
        that.candidates.add(_span)
      } else {
        _className = _className.replace('active', 'normal')
        that.candidates.delete(_span)
      }
      this.className = _className

      if (that.candidates.size === 0) {
        that.status = 0
        $('#domain_all').removeClass('domain_btn--normal').addClass('domain_btn--active')
      } else {
        that.status = 1
        $('#domain_all').removeClass('domain_btn--active').addClass('domain_btn--normal')
      }
    })
  }
  setKeyword (keyword) {
    this.keyword = keyword
    console.log(keyword)
  }
}

function onClickSearch (e) {
  var keyword = $('#input-key').val().trim()
  $('#input-key').val('  ')
  controller.setKeyword(keyword)
}

var controller = new Controller()

$(document).ready(function () {
  var url = location.href
  var params = url.split('?')[1].split('&')
  var map = new Map()
  for (let i = 0; i < params.length; i++) {
    let str = params[i]
    let key = str.split('=')[0]
    let value = str.split('=')[1].replace('%20', ' ')
    map.set(key, value)
  }

  controller.initParams(map.get('name'), map.get('pageSize'))

  $('#input-key').bind('input propertychange', function (e) {
    let _val = $(this).val().trim()
    $(this).val('  ' + _val)
  })
})
