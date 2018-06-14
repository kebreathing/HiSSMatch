const _DOMAIN_BTN = {
  btn: function (domain) {
    return '<button class="domain_btn domain_btn--normal"><span>' + domain + '</span></button>'
  }
}

const _DIV_INFO_STR = {
  continer: function () {
    return '<div class="div-i"></div>'
  },
  view: function () {
    return '<div class="div_info"></div>'
  },
  left_view: function (index, desc) {
    return '<div class="left-view"><h3>' + index + '</h3><p>' + desc + '</p></div>'
  },
  right_view: function () {
    return '<div class="right-view"></div>'
  },
  spliter: function () {
    return '<div class="spliter"></div>'
  },
  hiddenImg: function () {
    return '<img class="div_info-img" src="./image/close.png" onclick="$(this).parent().css(\'visibility\', \'hidden\')"/>'
  },
  iImg: function () {
    return '<img class="img-i" src="./image/i.png"/>'
  },
  tr: function () {
    return '<tr></tr>'
  },
  td: function () {
    return '<td></td>'
  }
}

const _TD_STR = {
  tr: function () {
    return '<tr style="border-bottom: 1px grey solid;"></tr>'
  },
  td1: function () {
    return '<td><div class="div-i"><img class="img-i" src="./image/i.png"/></div></td>'
  },
  td2: function (domain, index) {
    return '<td class="col_domain1"><div><span>' + domain + '</span></div><div><span>' + index + '</span></div></div>'
  },
  td3: function (target) {
    return '<td class="col_target1"><span>' + target + '</span></td>'
  },
  td4_container: function () {
    return '<td class="col_domain2"></div>'
  },
  td4_content: function (domain, index) {
    return '<div class="mtable-col3-row"><div><span>' + domain + '</span></div><div><span>' + index + '</span></div></div>'
  },
  td5_container: function () {
    return '<td class="col_target2"></div>'
  },
  td5_content: function (target) {
    return '<div style="height:2.5rem"><span>' + target + '</span></div>'
  }
}

class Controller {
  constructor () {
    this.name = undefined
    this.pageSize = undefined
    this.status = 0 // 0：全部，1：候选项

    // 显示的候选项
    this.domains = new Set()
    this.candidates = new Set()
  }
  initParams (obj, sub, pageSize, matches) {
    $('#obj').text(obj)
    $('#sub').text(sub)

    this.obj = obj
    this.sub = sub
    this.pageSize = pageSize
    this.showdata = matches
    this.matches = matches

    this.set_datasource(this.matches)
    this.initDomain()
    this.init()
    this.set_showdata(this.showdata)
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

      // 改变当前显示的数据
      that.observe_domains()
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
  /**
  * 设置数据集
  **/
  set_datasource(matches) {
    this.matches = matches
    // 设置domain
    let _domains = new Set()
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].obj === null) {
        continue
      }
      _domains.add(matches[i].obj.object)
    }
    this.domains = _domains
  }

  initDomain() {
    if (this.domains.length === 0) {
      return
    }

    this.domains.forEach(domain => {
          $('#domains').append(_DOMAIN_BTN.btn(domain))
    })
  }

  // 观察domain的变化一旦其发生变化，要立马做修改
  observe_domains () {
    var that = this
    if (this.candidates.size === 0 || this.candidates.has('全部内容')) {
      this.showdata = this.matches
    } else {
      this.showdata = this.matches.filter(match => {
        return match.obj !== null
              && match.obj.object !== null
              && that.candidates.has(match.obj.object)
      })
    }

    this.set_showdata(this.showdata)
  }

  set_showdata(data) {
    var table = $('#table-data')
    table.children().remove()
    for (let i = 0; i < data.length; i++) {
      let obj = data[i].obj
      let subs = data[i].subs

      if (obj == null) {
        continue
      }

      let tr = $(_TD_STR.tr())
      let td1 = $(_TD_STR.td1())
      let td2 = $(_TD_STR.td2(obj.object, obj.index))
      let td3 = $(_TD_STR.td3(obj.target))

      // 需要添加内容
      let td4_container = $(_TD_STR.td4_container())
      let td5_container = $(_TD_STR.td5_container())

      for (let i = 0; i < subs.length; i++) {
        let sub = subs[i]
        if (sub == null) {
          continue
        }
        td4_container.append($(_TD_STR.td4_content(sub.object, sub.index)))
        td5_container.append($(_TD_STR.td5_content(sub.target)))
      }

      tr.append(td1)
          .append(td2)
            .append(td3)
              .append(td4_container)
                .append(td5_container)
      table.append(tr)
    }
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

  var objname = map.get('obj')
  var subname = map.get('sub')
  var url = 'http://localhost:5000/match/' + objname + '/' + subname
  $.ajax({
    type: 'get',
    url: url,
    success: function (res) {
      controller.initParams(objname, subname, map.get('pageSize'), res.res)
    },
    fail: function (res) {
      console.log(res)
    }
  })
  popController.init()
})
