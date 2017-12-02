;(function(win, doc) {
  var rem = 100 * doc.documentElement.clientWidth / 1920;
  doc.documentElement.style.fontSize = rem + 'px';
  win.onresize = function() {
    rem = 100 * doc.documentElement.clientWidth / 1920;
    doc.documentElement.style.fontSize = rem + 'px';
  };
})(window, document);


var allDataIndex = 0; //下标

;
$(function() {
  if (!$navigate.length) { //如果没有数据页面没空
    return;
  }
  setNiceScroll($('.dianbo-content-box'));
  getTabList();
});

//获取对应标签下的数据内同
function getTabList() {
  for (var i = 0, _len = $navigate.length; i < _len; i++) {
    $.ajax({
      async: false,
      url: '../publish_data/' + $navigate[i].dataJsonName + '.json',
      type: "GET",
      dataType: "jsonp"
    });
  }
}

function _callback(data) {
  $navigate[allDataIndex].isCon = data;
  allDataIndex++;
  if (allDataIndex == $navigate.length) {
    creatDom(); //创建dom
    allDataIndex = 0; //还原为0
  }
}

//拼接页面结构
function creatDom() {
  var _str = '';
  for (var i = 0, _len = $navigate.length; i < _len; i++) {
    _str += '<div class="c-item">\
       <h3  class="c-item-title" title="' + $navigate[i].categoryName + '">' + $navigate[i].categoryName + '</h3>\
       <div class="c-item-content">\
         <i class="arrow-left prev"></i>\
         <div class="c-item-center">\
           <ul class="cl c-item-center-ul">';
    for (var j = 0, _len2 = $navigate[i].isCon.length; j < _len2; j++) {
      var _itemCon = $navigate[i].isCon[j];
      _str += '<li class="item-center-li" data-v2vurl="'+_itemCon.v2vurl+'" data-name="' + _itemCon.capturename + '" data-v2vid="' + _itemCon.v2vid + '" data-url="' + _itemCon.flvpath + '"data-simg="' + _itemCon.picpath + '"  data-id="' + _itemCon.taskid + '" tabindex="'+j+'">\
                <div class="img" tabindex="0">\
                          <img src="' + $navigate[i].isCon[j].httpPicPath + '" onerror="this.src=\'images/error.png\'" alt="">\
                      </div>\
                      <p class="txt text-overflow1" title="' + $navigate[i].isCon[j].capturename + '">' + $navigate[i].isCon[j].capturename + '</p>\
              </li>';
    }
    _str += '</ul>\
         </div>\
         <i class="arrow-right next"></i>\
       </div>\
      </div>';
  }

  $('.dianbo-content-box').html(_str);

  jQuery(".c-item-content").slide({
    mainCell: ".c-item-center-ul",
    pnLoop: false,
    effect: "left",
    vis: 3,
    scroll:3,
    autoPage:true,
    trigger: "click"
  });

  $('.item-center-li').click(function() { //点击的操作
    var id = $(this).data('id'),
      v2vid = $(this).data('v2vid'),
      v2vurl = $(this).data('v2vurl');
    try {　　
        var id = $(this).data('id'),
          v2vid = $(this).data('v2vid'),
          v2vurl = $(this).data('v2vurl');
        var requestJson = vvRequestJson({
          "command": "CMD_SPDB_PLAY",
          "params": {
            "channelNum": v2vid,
            "id": id,
            "v2vurl":v2vurl
          }
        });
        VodModule.postMessage(requestJson);
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
