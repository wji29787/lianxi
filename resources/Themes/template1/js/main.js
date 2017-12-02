;
(function(win, doc) {
  var rem = 100 * doc.documentElement.clientWidth / 1920;
  doc.documentElement.style.fontSize = rem + 'px';
  win.onresize = function() {
    rem = 100 * doc.documentElement.clientWidth / 1920;
    doc.documentElement.style.fontSize = rem + 'px';
  };
})(window, document);


;
$(function() {

  if (!$navigate.length) {
    $('.dianbo-nav-op').hide();
    return;
  }
  //$navigate
  setNiceScroll($('.dianbo-con-type-box'));
  var oNav = $('#dianbo-nav-ul'); //导航父级元素
  var _navstr = ''; //循环导航的内容

  for (var i = 0, _len = $navigate.length; i < _len; i++) {
    _navstr += '<li data-json="' + $navigate[i].dataJsonName + '" title="' + $navigate[i].categoryName + '">' + $navigate[i].categoryName + '</li>';
  }
  oNav.html(_navstr); //动态设置nav内容

  //li操作点击更换数据等
  var aNavLi = oNav.find('li'),
    nLiWidht = aNavLi.eq(0).outerWidth(true),
    oBol = true;

  oNav.css('width', nLiWidht * $navigate.length); //给ul动态设置width

  //请求默认第一个数据
  aNavLi.eq(0).addClass('active');
  getTabList(aNavLi.eq(0).data('json'));



  aNavLi.on('click', function() {
    var _str = '',
      _jsonUrl = $(this).data('json');
    $(this).addClass('active').siblings().removeClass('active');
    getTabList(_jsonUrl);
  });

  //导航操作
  $('#op-r').click(function() {
    if (!oBol) {
      return;
    }

    var _val = Math.abs(parseInt(oNav.css('left'))) + $('.dianbo-nav-content').outerWidth(true);
    if (_val >= oNav.width()) {
      return;
    }

    oBol = false;
    var _l = getNavLeft(0);
    oNav.animate({
      left: _l
    }, function() {
      oBol = true;
    })

  })

  /*右按钮往左走*/
  $('#op-l').click(function() {
    if (!oBol) {
      return;
    }

    var _val = parseInt(oNav.css('left'));

    if (_val >= 0) {
      return;
    }

    oBol = false;
    var _l = getNavLeft(1);
    oNav.animate({
      left: _l
    }, function() {
      oBol = true;
    });
  })

  function getNavLeft(type) {
    if (type == 0) { //left
      return parseInt(oNav.css('left')) - 2 * nLiWidht;
    } else { //right
      return parseInt(oNav.css('left')) + 2 * nLiWidht;
    }
  }
});

//获取对应标签下的数据内同
function getTabList(_url) {
  $.ajax({
    async: false,
    url: '../publish_data/' + _url + '.json',
    type: "GET",
    dataType: "jsonp"
  });
}

function _callback(data) {
  $(".dianbo-con-type-box").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
  var _str = '<div class="dianbo-con-type cl">';
  for (var i = 0; i < data.length; i++) {
    _str += '<div class="dianbo-con-item" data-v2vurl="'+data[i].v2vurl+'" data-name="' + data[i].capturename + '" data-v2vid="' + data[i].v2vid + '" data-url="' + data[i].flvpath + '"data-simg="' + data[i].picpath + '"  data-id="' + data[i].taskid + '" data-type="' + data[i].type + '" tabindex="'+i+'">\
           <div class="img" tabindex="0">\
               <img src="' + data[i].httpPicPath + '" onerror="this.src=\'images/error.png\'" alt="">\
           </div>\
           <div class="msg">\
              <h3 title="' + data[i].capturename + '">' + data[i].capturename + '</h3>\
               <p class="time">' + timeHms(data[i].duration) + '</p>\
              <div class="ms"><span title="' + data[i].userAccount + '">' + data[i].userAccount + '</span><span class="date">' + timeYmdHms(data[i].starttime) + '</span></div>\
          </div>\
       </div>';
  }
  _str += '</div>';
  $(".dianbo-con-type-box").html(_str); //页面赋值

  $('.dianbo-con-item').click(function() { //每相的点击播放或者盒子功能

    try {　　
        var id = $(this).data('id'),
         type = $(this).data('type'),
          v2vid = $(this).data('v2vid'),
          v2vurl = $(this).data('v2vurl');
        var requestJson = vvRequestJson({
          "command": "CMD_SPDB_PLAY",
          "params": {
            "channelNum": v2vid,
            "id": id+"_"+type,
            "v2vurl":v2vurl
          }
        });
        VodModule.postMessage(requestJson);//VodModule 这个是Android内部的一个对象，如果不是在终端上播放的话，这个对象是undefined的
    } catch (error) {　　 // 此处是负责例外处理的语句
      var _plvpath = addVideoPath($(this).data('url')), //处理过后的视频地址
        _name = $(this).data('name'), //名称
        _simg = $(this).data('simg'); //视频缩略图
      var _str = '';
      _str += '<div class="zlayer">\
              <div class="zlayer-header">\
                <div class="zlayer-title">视频播放</div>\
                <h2 class="zlayer-txt" data-flvpath="' + _plvpath + '">' + _name + '</h2>\
                <span class="zlayer-close">\
                  <i>X</i>\
                </span>\
              </div>\
                <div class="zlayer-main">\
                  <div class="layer-video" id="container"></div>\
                </div>\
              </div>';

      var jwplay = null;
      var _index = layer.open({
        type: 1,
        title: false,
        area: ['100%', '100%'],
        resize: false,
        scrollbar: false,
        shadeClose: false, //点击遮罩关闭
        closeBtn: 0, //不显示关闭按钮
        shade: [0.7],
        content: _str,
        success: function() {
          $('.zlayer-close').click(function() {
            layer.close(_index);
          })
          jwplay = objJwplayer(_plvpath, _simg); //返回jwplayer对象
        },
        end: function() {
          jwplay.remove(); //层结束清除jwplay对象
        }
      });
    }
  })
}

/**
 * 滚动条函数-ztw
 * @param obj:niceScroll对象，如果页面中多个需要调用参数为数组把目标传过来即可
 * width为滚动条的宽度 right为滚动条的偏移量如-15 opacity为滚动条的透明度 color为滚动条的颜色 obj为初始化滚动条的对象
 * 当不需要其他的参数设置时，可以直接传对象不需要json格式如：setNiceScroll(div1) setNiceScroll([div1,{obj:div2,width:3px}])
 */
function setNiceScroll(data) {
  var _defaultColor = "#536597",
    _defaultWidth = '3px',
    _defaultOpacity = 1,
    _defaultRight = 0;
  if (!data) { //判断为空
    return;
  } else if (Array.isArray(data)) { //判断为数组
    if (data.length) { //判断数组是否为空
      for (var i = 0, _len = data.length; i < _len; i++) {
        fnScroll(data[i]);
      }
    } else {
      return;
    }
  } else {
    fnScroll(data);
  }

  function fnScroll(obj) {
    var _color = obj.color ? obj.color : _defaultColor, //颜色
      _width = parseInt(obj.width) ? obj.width : _defaultWidth, //宽度因为jquery对象有width方法所以parseInt下
      _opacity = obj.opacity ? obj.opacity : _defaultOpacity, //透明度
      _right = obj.right ? parseInt(obj.right) : _defaultRight; //right偏移量

    if (typeof obj == 'object' && !obj.length && obj.length != 0) { //判断是否为json类型
      obj = obj.obj;
    }

    obj.niceScroll({
      cursorcolor: _color, //#CC0071 光标颜色
      cursoropacitymax: _opacity, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
      touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
      cursorwidth: _width, //像素光标的宽度
      cursorborder: "0", // 游标边框css定义
      autohidemode: false //是否隐藏滚动条
    });
  }
}

/**
 * 返回Jwplayer对象函数Beautify
 */
function objJwplayer(_path, _previewImg) {
  return jwplayer('container').setup({
    flashplayer: "jwplayer/jwplayer.flash.swf",
    file: _path,
    width: '100%', //屏幕可视区
    height: '100%',
    image: _previewImg, //视频预览图片
    dock: false,
    autostart: true,
    logo: {
      prefix: "jwplayer",
      file: '/logo.png',
      link: 'http://www.visionvera.com/',
      hide: false,
      timeout: 10
    },
    rtmp: {
      bufferlength: 0.5
    }
  });
}

/* 时间转换成年月日 */
function timeYmdHms(value) {

  if (!value) {
    return '';
  }

  var date = new Date(value);
  Y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  if (m < 10) {
    m = '0' + m;
  }
  if (d < 10) {
    d = '0' + d;
  }

  var t = Y + '-' + m + '-' + d;
  /* var t = Y + '-' + m + '-' + d; 年月日 */
  return t;
};

// 把字符串拼接的时间格式改为时分秒--时长
function timeHms(val) {
  var _txt = '';
  if (!val) {
    return "00:00:00";
  }

  var _h = addZero(parseInt(val / 3600)),
    _m = addZero(parseInt(val % 3600 / 60)),
    _s = addZero(val % 60);

  _txt = _h + ':' + _m + ':' + _s;

  return _txt;
}

// 补零函数
function addZero(_v) {
  return _v > 9 ? _v : '0' + _v;
}

/**
 * 通过传过来的值进行判断flv格式和mp4格式进行路径拼接
 *
 * @param _ur
 *            string 返回拼接后的正确的路径
 */
function addVideoPath(_url) {
  var _len = _url.length, // 字符的长度
    _in = _url.indexOf('vod/'), // 找到vod/在索引
    _str1 = _url.substring(0, _in + 4), // 截取前面的字符
    _str2 = _url.substring(_in + 4, _len); // 截取后面的字符
  if (_url.lastIndexOf('.flv') == _len - 4) {
    return _str1 + 'flv:' + _str2;
  } else if (_url.lastIndexOf('.mp4') == _len - 4) {
    return _str1 + 'mp4:' + _str2;
  } else {
    return '';
  }
}
