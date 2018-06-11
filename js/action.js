class Controller {
  constructor () {
    this.objel = undefined  // 主体
    this.subel = undefined  // 客体
    this.pageSize = undefined // 每页条数
    this.status = 0         // 状态值 0: 两者都不可用 1:content 2:match
  }

  init () {
    var that = this
    $('.btn-obj').bind('click', function (e) {
      if (that.objel == undefined) {
        let _newObjClass = this.className.replace('normal', 'active')
        this.className = _newObjClass
        that.objel = this
      } else if (that.objel != this){
        let _oldObjClass = that.objel.className.replace('active', 'normal')
        let _newObjClass = this.className.replace('normal', 'active')
        that.objel.className = _oldObjClass
        this.className = _newObjClass
        that.objel = this
      } else {
        let _newObjClass = this.className.replace('active', 'normal')
        this.className = _newObjClass
        that.objel = undefined
      }

      if (that.objel !== undefined && that.subel !== undefined) {
        that.active_match()
      } else if (that.objel !== undefined || that.subel !== undefined) {
        that.active_content()
      } else if (that.objel == undefined && that.subel == undefined) {
        that.normal_all()
      }
    })

    $('.btn-sub').bind('click', function (e) {
      if (that.subel == undefined) {
        let _newObjClass = this.className.replace('normal', 'active')
        this.className = _newObjClass
        that.subel = this
      } else if (that.subel != this){
        let _oldObjClass = that.subel.className.replace('active', 'normal')
        let _newObjClass = this.className.replace('normal', 'active')
        that.subel.className = _oldObjClass
        this.className = _newObjClass

        that.subel = this
      } else {
        let _newObjClass = this.className.replace('active', 'normal')
        this.className = _newObjClass
        that.subel = undefined
      }

      if (that.objel !== undefined && that.subel !== undefined) {
        that.active_match()
      } else if (that.objel !== undefined || that.subel !== undefined) {
        that.active_content()
      } else if (that.objel == undefined && that.subel == undefined) {
        that.normal_all()
      }
    })

    $('.btn-pagesize').bind('click', function (e) {
      if (that.pageSize == undefined) {
        let _newObjClass = this.className.replace('normal', 'numactive')
        this.className = _newObjClass
        that.pageSize = this
      } else {
        let _oldObjClass = that.pageSize.className.replace('numactive', 'normal')
        let _newObjClass = this.className.replace('normal', 'numactive')
        that.pageSize.className = _oldObjClass
        this.className = _newObjClass

        // swiper objects
        that.pageSize = this
      }
    })
  }

  normal_all () {
    $('#btn-match').css('background', '#B4B1B1')
    $('#btn-content').css('background', '#B4B1B1')
    $('#btn-modi').css('background', '#B4B1B1')
    this.status = 0
  }

  active_match () {
    if (this.objel.innerHTML === this.subel.innerHTML) {
      this.active_content()
      return
    }
    $('#btn-match').css('background', 'rgba(255,193,7,1)')
    $('#btn-content').css('background', '#B4B1B1')
    $('#btn-modi').css('background', 'rgba(255,65,7,1)')
    this.status = 2
  }

  active_content () {
    $('#btn-content').css({'background':'rgba(58,116,255,1)'})
    $('#btn-match').css('background', '#B4B1B1')
    $('#btn-modi').css('background', '#B4B1B1')
    this.status = 1
  }

  get_info () {
    var that = this
    return {
      obj : that.get_obj(),
      sub : that.get_sub(),
      pageSize : that.get_pagesize()
    }
  }

  get_obj () {
    if (this.objel != undefined) {
      return this.objel.children[1].innerHTML
    } else {
      return undefined
    }
  }

  get_sub () {
    if (this.subel != undefined) {
      return this.subel.children[1].innerHTML
    } else {
      return undefined
    }
  }

  get_pagesize () {
    if (this.pageSize != undefined) {
      return this.pageSize.children[0].innerHTML
    } else {
      return 5
    }
  }

  get_status () {
    return this.status
  }
}

function onClickContent (e) {
  if (controller.get_status() == 1) {
    var params = controller.get_info()
    var paramStr = ''
    if (params.obj != undefined) paramStr = 'name=' + params.obj
    if (params.sub != undefined) paramStr = 'name=' + params.sub
    paramStr += '&pageSize=' + params.pageSize
    var url = 'content.html?' + paramStr

    location.href = url
  }
}

function onClickMatch (e) {
  if (controller.get_status() == 2) {
    var params = controller.get_info()
    var paramStr = ''
    if (params.obj != undefined) paramStr += 'obj=' + params.obj
    if (params.sub != undefined) paramStr += '&sub=' + params.sub
    paramStr += '&pageSize=' + params.pageSize
    var url = 'match.html?' + paramStr

    location.href = url
  }
}

function onClickModi (e) {
  if (controller.get_status() == 2) {
    var params = controller.get_info()
    var paramStr = ''
    if (params.obj != undefined) paramStr += 'obj=' + params.obj
    if (params.sub != undefined) paramStr += '&sub=' + params.sub
    paramStr += '&pageSize=' + params.pageSize
    var url = 'modi.html?' + paramStr
    location.href = url
  }
}

var controller = new Controller()
controller.init()

$(document).ready(function () {
  let url = location.href
  let character = url.charAt(url.length-1)
  switch (character) {
    case 'g':
      $('#btn-content').css('background', '#B4B1B1')
      $('#btn-match').css('background', '#B4B1B1')
      $('#btn-modi').css('display', 'none')
      break
    case 'w':
      $('#btn-content').css('background', '#B4B1B1')
      $('#btn-match').css('background', '#B4B1B1')
      $('#btn-modi').css('background', '#B4B1B1')
      $('#btn-modi').css('display', 'block')
      break
    default:
      return
  }
})
