class Controller {
  constructor () {
    this.name = undefined
    this.pageSize = undefined
    this.status = 0 // 0：全部，1：候选项

    // 显示的候选项
    this.candidates = new Set()
  }
  initParams (obj, sub, pageSize) {
    $('#obj').text(obj)
    $('#sub').text(sub)

    this.obj = obj
    this.sub = sub
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

    $('.img-i').hover(function () {
      $(this).next().css('visibility', 'visible')
    })

    $('.btn-delete').click(function () {
      // img - div - mtable-col3-row
      $(this).parent().parent().remove()
    })

    $('.btn-add').click(function () {
      $('#pop-dialog').css('visibility', 'visible')
    })
  }
}

class PopDialogController {
  constructor () {
    this.domains = []
    this.targets = []
    this.selecteds = []

    this.current_domain = undefined
  }

  init () {
    var that = this
    $('.pop-btn').bind('click', function (e) {
      let _className = this.className
      let _oldClassName = _className
      let _txt = this.innerHTML
      if (_className.indexOf('active') >= 0) {
        _className = _className.replace('active', 'normal')
      } else {
        _className = _className.replace('normal', 'active')
      }

      if (that.current_domain !== undefined) {
        that.current_domain.className = _oldClassName
      }

      that.current_domain = this
      this.className = _className

      // TODO: 改变 targets
      that.set_targets()
    })

    $('.search-radio').bind('click', function (e) {

      let _className = this.className
      let _txt = this.children[1].innerHTML

      if (_className.indexOf('active') >= 0) {
        _className = _className.replace('active', 'normal')
      } else {
        _className = _className.replace('normal', 'active')
      }

      this.className = _className

      that.set_selecteds()
    })

    $('.frame-cancel').click(function (e) {
      that.clear()
    })

    $('.frame-ok').click(function (e) {
      that.clear()
    })
  }

  // 清空数据并隐藏
  clear () {
    $('#pop-dialog').css('visibility', 'hidden')
    this.targets = []
    this.selecteds = []
    this.current_domain = []
  }

  set_targets () {
    // TODO: 改变selected
    console.log('todo: targets')
  }

  set_selecteds () {
    // TODO: 改变selected
    console.log('todo: selected')
  }

  get_selecteds () {
    return this.selecteds
  }
}

var controller = new Controller()
var popController = new PopDialogController()

$(document).ready(function () {
  var paramStr = location.href.split('?')[1]
  var params = paramStr.split('&')
  var map = new Map()
  for (let i = 0; i < params.length; i++) {
    let kv = params[i].split('=')
    let key = kv[0]
    let value = kv[1].replace('%20', ' ')
    map.set(key, value)
  }

  controller.initParams(map.get('obj'), map.get('sub'), map.get('pageSize'))
  popController.init()
})
