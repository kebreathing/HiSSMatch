var _domains = [
  'Application & Interface Security',
  'Encryption & Key Management',
  'Governance and Risk Management'
]

var _DOMAIN_STR = {
  domain: function (str) {
    return '<button class="domain_btn domain_btn--normal"><span>' + str + '</span></button>'
  }
}

var _ROW_STR = {
  tr: '<tr></tr>',
  domain: function (domain) {
    return '<td class="col_domain"><span>' + domain + '</span></td>'
  },
  index: function (index) {
    return '<td class="col_index"><span>' + index + '</span></td>'
  },
  target: function (target) {
    return '<td class="col_target"><span>' + target + '</span></td>'
  },
  goal: function (goal) {
    return '<td class="col_goal"><div>' + goal + '</div></td>'
  }
}

class Controller {
  constructor () {
    this.name = undefined
    this.pageSize = undefined
    this.status = 0 // 0：全部，1：候选项

    this.candidates = new Set()
    this.searchareas = new Set()

    // 数据源
    this.datasource = []
    // 域的数据源
    this.domains = []

    this.showdata = []
    this.searchareas.add('全部内容')
  }
  initParams (name, pageSize) {
    var that = this
    $('#ssname').text(name)

    this.name = name
    this.pageSize = pageSize
    this.initDatasoure()

    setTimeout(function () {
      that.init()
    }, 1000)
  }
  // 数据初始化
  initDatasoure () {
    var that = this
    var url = 'http://localhost:5000/content/' + that.name
    $.ajax({
      type: 'get',
      url:  url,
      success: function (res) {
        that.datasource = res
        that.setTableData(res)
        that.setDomainCandidates(res)
      },
      error: function (res) {
        console.log(res)
        alert('Error in requesting data from python.')
      }
    })
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
        that.setTableData(that.datasource)
      } else {
        that.status = 1
        $('#domain_all').removeClass('domain_btn--active').addClass('domain_btn--normal')
        let _data = that.datasource.filter(obj => {
          return that.candidates.has(obj.object)
        })
        that.setTableData(_data)
      }
    })

    $('.search-radio').bind('click', function (e) {
      let _className = this.className
      let _span = this.children[1].innerHTML
      if (_className.indexOf('active') >= 0) {
        _className = _className.replace('active', 'normal')
        that.searchareas.delete(_span)
      } else {
        _className = _className.replace('normal', 'active')
        that.searchareas.add(_span)
      }
      this.className = _className
    })
  }
  search (keyword) {
    keyword = keyword.trim()
    if (keyword == undefined || keyword.length === 0) {
      return;
    }
    var that = this
    var _data = []
    if (that.searchareas.has('全部内容') || that.searchareas.size === 0) {
      _data = that.datasource.filter(obj => {
        return obj.object.indexOf(keyword) >= 0
                || obj.index.indexOf(keyword) >= 0
                || obj.target.indexOf(keyword) >= 0
                || obj.description.indexOf(keyword) >= 0
      })
    } else {
      _data = that.datasource.filter(obj => {
        let b1 = that.searchareas.has('安全域') && obj.object.indexOf(keyword) >= 0
        let b2 = that.searchareas.has('索引') && obj.index.indexOf(keyword) >= 0
        let b3 = that.searchareas.has('安全目标') && obj.target.indexOf(keyword) >= 0
        let b4 = that.searchareas.has('具体要求') && obj.description.indexOf(keyword) >= 0
        return  b1 || b2 || b3 || b4
      })
    }
    that.setTableData(_data)
  }
  setDomainCandidates (data) {
    var that = this
    var set = new Set()
    data.forEach(row => {
      if (!set.has(row.object)) {
        set.add(row.object)
        that.domains.push(row.object)
      }
    })

    that.domains.forEach(domain => {
      let button = $(_DOMAIN_STR.domain(domain))
      $('#domains').append(button)
    })
  }
  setTableData (data) {
    this.showdata = data
    var table = $('#table-data')

    // 填充结果
    table.children().remove()
    for (let i = 0; i < data.length; i++) {
      let obj = data[i]
      let tr = $(_ROW_STR.tr)
      let domain = $(_ROW_STR.domain(obj.object))
      let index = $(_ROW_STR.index(obj.index))
      let target = $(_ROW_STR.target(obj.target))
      let goal = $(_ROW_STR.goal(obj.description))
      tr.append(domain)
          .append(domain)
            .append(index)
              .append(target)
                .append(goal)
      table.append(tr)
    }
  }
}

function onClickSearch (e) {
  var keyword = $('#input-key').val().trim()
  controller.search(keyword)
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
