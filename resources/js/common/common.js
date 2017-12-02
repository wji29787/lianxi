/*公共js*/
//改变rem
;
(function (win, doc) {
    var rem = 100 * doc.documentElement.clientWidth / 1920;
    doc.documentElement.style.fontSize = rem + 'px';
    win.onresize = function () {
        rem = 100 * doc.documentElement.clientWidth / 1920;
        doc.documentElement.style.fontSize = rem + 'px';
    };
})(window, document);
/*
 * author:"王肖"， introduce;'运维管理左侧下三个子页面三个导航，含子导航数据传入组件序号，组件字段message,例子：<nav-operation
 * message='1'></nav-operation 组件根据传入数字，给其相应导航添加 active 类 '
 */
Vue.component(
    'nav-operation',
    {
        props: ['message'],
        mounted: function ()// 初始化控制active
        {
            this.classA = '';
            this.classB = '';
            this.classC = '';
            this.classD = '';
            switch (this.message) {
                case '1':
                    this.classA = 'active';
                    break;
                case '2':
                    this.classB = 'active';
                    break;
                case '3':
                    this.classC = 'active';
                    break;
                case '4':
                    this.classD = 'active';
                    break;
            }
            ;
        },
        template: '<ul class="nav-level-one">' +
        '<li><a href="javascript:;" @click="fnRedirect(\'operationManagement/deviceManagement/deviceManagement.do\')" :class="classA" ><i class="fl iconfont icon-bijibendiannao icon-odevice" ></i>设备管理</a></li>' +
        '<li><a href="javascript:;" :class="classB" @click="fnRedirect(\'operationManagement/logManagement/logManagement.do\')"><i class="fl iconfont icon-rizhi"></i>日志管理</a></li>' +
        '<li><a href="javascript:;" :class="classC" @click="fnRedirect(\'operationManagement/systemConfiguration/systemConfiguration.do\')"><i class="fl iconfont icon-xitongpeizhi"></i>系统配置</a></li>' +
        '<li><a href="javascript:;" :class="classD" @click="fnRedirect(\'operationManagement/systemConfiguration/getCascadeManagement.do\')"><i class="fl iconfont icon-cascader"></i>级联管理</a></li>' +
        '</ul>',
        data: function () {
            return {
                classA: '',
                classB: '',
                classC: '',
                classD: ''
            };
        },
        methods: {
            fnRedirect: function (url)// 重定向页面
            {
                window.location = home_path + url;
            }
        }
    });
/*
 * author:"李福旭"， introduce;'个人资源左侧下三个子页面三个导航，含子导航数据传入组件序号，组件字段message,例子：<nav-operation
 * message='1'></nav-operation 组件根据传入数字，给其相应导航添加 active 类 '
 */
Vue.component(
    'nav-personal',
    {
        props: ['message'],
        mounted: function () {
            this.classA = '';
            this.classB = '';
            this.classC = '';
            this.classD = '';
            switch (this.message) {
                case '1':
                    this.classA = 'active';
                    break;
                case '2':
                    this.classB = 'active';
                    break;
                case '3':
                    this.classC = 'active';
                    break;
                case '4':
                    this.classD = 'active';
                    break;
            }
            ;
        },
        template: '<ul class="nav-level-one"><li><a href="javascript:;" @click="redirect(\'personalResources/recordingTask/realTimeRecording.do\')" :class="classA" ><i class="fl iconfont icon-luxiangxian" ></i>实时录制</a></li><li><a href="javascript:;" :class="classD" @click="redirect(\'personalResources/videoResource/transcoding.do\')"><i class="fl iconfont icon-shishizhuanma"></i>实时转码</a></li><li><a href="javascript:;" :class="classB" @click="redirect(\'personalResources/videoResource/mediaFile.do\')"><i class="fl iconfont icon-folderwenjianjia"></i>媒体文件</a></li><li><a href="javascript:;" :class="classC" @click="redirect(\'personalResources/recoveryResources/recycleBin.do\')"><i class="fl iconfont icon-iconfontshanchu"></i>回收站</a></li></ul>',
        data: function () {
            return {
                classA: '',
                classB: '',
                classC: '',
                classD: ''
            };
        },
        methods: {
            redirect: function (url) {
                window.location = home_path + url;
            }
        }
    });
/** 用户权限过滤器* */
Vue.filter('permissions-filter', function (value) {
    var text;
    if (!value) {
        text = "";
    }
    switch (value) {
        case 0:
            text = "超级管理员";
            break;
        case 1:
            text = "管理员";
            break;
        case 2:
            text = "普通用户";
            break;
    }
    ;
    return text;
});
/** 自定义filter名称为'time'---转化时间过滤器* */
Vue.filter('time',
    /* value 格式为13位unix时间戳 */
    /* 10位unix时间戳可通过value*1000转换为13位格式 */
    function (value) {
        return timeYmdHms(value);
    });

/** 把秒转换成 00:00:00时间格式 筛选器* */
Vue.filter('stime', function (value) {
    return timeHms(value);
});

/* 时间转换成年月日时分秒 */
function timeYmdHms(value) {

    if (!value) {
        return '';
    }

    var date = new Date(value);
    Y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate(),
        H = date.getHours(), i = date.getMinutes(), s = date.getSeconds();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (i < 10) {
        i = '0' + i;
    }
    if (s < 10) {
        s = '0' + s;
    }
    var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
    /* var t = Y + '-' + m + '-' + d; 年月日 */
    return t;
};

// 把字符串拼接的时间格式改为时分秒--时长
function timeHms(val) {
    var _txt = '';
    if (!val) {
        return "00:00:00";
    }

    var _h = addZero(parseInt(val / 3600)), _m = addZero(parseInt(val % 3600 / 60)), _s = addZero(val % 60);

    _txt = _h + ':' + _m + ':' + _s;

    return _txt;
}

// 补零函数
function addZero(_v) {
    return _v > 9 ? _v : '0' + _v;
}

// 把字符串拼接的undefind换成''或者0
function returnEmpty(val) {
    if (val === 0 || val === '0') {
        return 0;
    } else if (!val) {
        return '';
    } else {
        if (val == 'null' || val == 'undefined') {
            return '';
        } else {
            return val;
        }
    }
}

// 空值返回0
function returnZero(val) {
    if (!val) {
        return 0;
    }
    return val;
}

// 数组通过某一属性排序参数为属性名，返回数据
function arrSort(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    };
}

/**
 * 判断浏览器类型
 *
 * @returns {String}
 */
function getBrowserType() {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    // 判断是否Opera浏览器
    if (isOpera) {
        return "Opera";
    } else if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } else if (userAgent.indexOf("Chrome") > -1) {// 判断是否Firefox浏览器
        return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {// 判断是否Safari浏览器
        return "Safari";
    } else if (userAgent.indexOf("compatible") > -1
        && userAgent.indexOf("MSIE") > -1 && !isOpera) {// 判断是否IE浏览器
        return "IE";
    } else {
        return "IE";
    }

}

function fullScreen() { // 全屏方法
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen
        || el.mozRequestFullScreen || el.msRequestFullScreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function exitFullScreen() { // 退出全屏方法
    var el = document, cfs = el.cancelFullScreen || el.webkitCancelFullScreen
        || el.mozCancelFullScreen || el.exitFullScreen, wscript;

    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

// 转化硬盘容量 默认传过来的为Mb
function diskSize(value) {
    if (!value) {
        return 0;
    } else {
        var _size = value / 1024; // G
        if (_size >= 1024) {
            return (parseInt(_size / 1024) + ((_size % 1024 / 1024).toFixed(2) - 0))
                + 'T';
        } else {
            return _size.toFixed(2) + 'G';
        }
    }
}


// 文件大小,单位为kb
function videoFileSize(value) {
    if (!value) {
        return 0;
    } else {
        var _sizeMb = parseInt(value / 1024); // mb
        if (_sizeMb >= 1024) {
            var _sizeG = parseInt(_sizeMb / 1024);
            if (_sizeG >= 1024) {
                return (parseInt(_sizeG / 1024) + ((_sizeG % 1024 / 1024).toFixed(2) - 0)) + 'TB';
            } else {
                return (_sizeG + ((_sizeMb % 1024 / 1024).toFixed(2) - 0)) + 'GB';
            }
        } else if (_sizeMb < 1) {
            return value % 1024 + 'KB';
        } else {
            return _sizeMb + 'MB';
        }
    }
}

// 码率转换 
function rateNum(value) {
    if (!value) {
        return 0;
    } else {
        var _sizeKb = parseInt(value / 1000);
        if (_sizeKb >= 1000) {
            var _sizeMb = parseInt(_sizeKb / 1000);
            return (_sizeMb + ((_sizeMb % 1000 / 1000).toFixed(2) - 0)) + 'mb/s';
        } else if (_sizeKb < 1000 && _sizeKb >= 1) {
            return (_sizeKb + ((value % 1000 / 1000).toFixed(2) - 0)) + 'kb/s';
        } else {
            return (value % 1000 / 1000).toFixed(2) + 'b/s';
        }
    }
}

//采样率

function samplingRate(value) {
    if (!value) {
        return 0;
    } else {
        return (value / 1000).toFixed(1) + 'khz';
    }
}

/**
 * 文件大小转换函数
 *
 * @param value
 *            num类型，单位为Kb
 */
function fileSize(value) {
    if (!value) {
        return '';
    }
    return value;
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
        _str2 = _url.substring(_in + 4, _len);// 截取后面的字符
    if (_url.lastIndexOf('.flv') == _len - 4) {
        return _str1 + 'flv:' + _str2;
    } else if (_url.lastIndexOf('.mp4') == _len - 4) {
        return _str1 + 'mp4:' + _str2;
    } else {
        return '';
    }
}

/*
 * 补零函数
 */
function add0(m) {
    return m < 10 ? '0' + m : m;
}

/*
 * 根据时间戳转换成具体时间
 */
function format(timestamp) {
    // timestamp是整数，否则要parseInt转换,不会出现少个0的情况

    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
}

/*******************************************************************************
 * 毫秒数转为时:分:秒
 *
 * @param value
 *            毫秒数
 * @returns 格式化后的时间
 */
function formatSeconds(value) {
    var theTime = parseInt(value); // 秒
    var theTime1 = 0; // 分
    var theTime2 = 0; // 小时
    // alert(theTime);
    if (theTime >= 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        // alert(theTime1+"-"+theTime);
        if (theTime1 >= 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    // 秒
    var second = parseInt(theTime) == 0 ? ":00"
        : (parseInt(theTime) + "").length == 1 ? ":0" + parseInt(theTime)
            : ":" + parseInt(theTime);
    // 分钟
    var minute = parseInt(theTime1) == 0 ? ":00"
        : (parseInt(theTime1) + "").length == 1 ? ":0" + parseInt(theTime1)
            : ":" + parseInt(theTime1);
    // 小时
    var hour = parseInt(theTime2) == 0 ? "00"
        : (parseInt(theTime2) + "").length == 1 ? "0" + parseInt(theTime2)
            : parseInt(theTime2);
    var result = hour + minute + second;
    return result;
}

// 补零函数
function toDou(iNum) {
    return iNum < 10 ? '0' + iNum : '' + iNum;
}

// 把秒转换成 00:00：00时间格式
function getT(t) {
    var h = Math.floor(t / 3600);
    t = Math.floor(t % 3600);
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return toDou(h) + ':' + toDou(m) + ':' + toDou(s);
}

//过滤所有input输入时的字符，去除特殊字符以及空格
function filterChara(target) {
    var ref = /[\s""“”''‘’。\?？\*\$%<>《》]/g;
    var strval = target.value;
    if (ref.test(strval)) {
        target.value = strval.replace(/[\s""“”''‘’。\?？\*\$%<>《》]/g, '');
        layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
    }

}

//搜索input提交时进行字符串处理
function formatStringInSubmit(val) {
    var _aVal = val.split(' ');
    for (var i = 0; i < _aVal.length; i++) {
        if (!_aVal[i]) {
            /*if(_aVal[i]==_aVal[i+1]){
                _aVal.splice(i,1);
                i--;
            }*/
            _aVal.splice(i, 1);
            i--;
        }
    }
    return _aVal.join(' ');
}

/**
 *
 * 判断当前操作系统
 *
 */
function systemType() {
    var _platForm = navigator.platform;
    var _userAgent = navigator.userAgent;

    if (_platForm == 'Win32' || _platForm == 'Windows') {

        var sNT = _userAgent.substr(_userAgent.indexOf("Windows NT ") + 11, 3);

        switch (sNT) {
            case '5.0':
                return 'Win2000';
                break;
            case '5.1':
                return 'Windows XP';
                break;
            case '5.2':
                return 'Windows 2003';
                break;
            case '6.0':
                return 'WindowsVista';
                break;
            case '6.1':
                return 'Windows7';
                break;
            case '6.2':
                return 'Windows8';
                break;
            case '10.0':
                return 'Windows10';
                break;
        }
        if (_userAgent.indexOf('Windows NT 10.0') != -1) {
            return 'Windows10';
        } else {
            return '未知Windows系统';
        }
    } else if (_platForm == 'Mac68K' || _platForm == 'MacPPC'
        || _platForm == 'Macintosh' || _platForm == 'MacIntel') {
        return 'Mac';
    } else if (_platForm.indexOf("Linux") != -1) {
        return 'Linux';
    } else if (_platForm == 'X11') {
        return 'Unix';
    } else {
        return '未知系统';
    }
}

// 视频正在播放接口
function videoStartPlay(data) {
    var _type = '';

    switch (data.type) {
        case 1:
            _type = '实时录制';
            break;
        case 2:
            _type = '媒体文件';
            break;
        case 3:
            _type = '云端资源';
            break;
        case 4:
            _type = '微信点播';
            break;
        default:
            _type = "未知模块";
            break;
    }

    $.ajax({
        url: "main/resourcePlayHistory/playStart.do",
        type: "POST",
        data: {
            "OS": systemType(),
            "fromType": _type,
            "resourceName": data.resName,
            "resourceUrl": data.resUrl,
            "resourceId": data.resId,
            "userAgent": navigator.userAgent
        },
        dataType: "JSON"
    });
}

// 视频结束播放接口
function videoStopPlay(data) {
    var _type = '';
    switch (data.type) {
        case 1:
            _type = '实时录制';
            break;
        case 2:
            _type = '媒体文件';
            break;
        case 3:
            _type = '云端资源';
            break;
        case 4:
            _type = '微信点播';
            break;
        default:
            _type = '未知来源';
            break;
    }
    $.ajax({
        url: "main/resourcePlayHistory/playEnd.do",
        type: "POST",
        data: {
            "OS": systemType(),
            "fromType": _type,
            "resourceName": data.resName,
            "resourceUrl": data.resUrl,
            "resourceId": data.resId,
            "userAgent": navigator.userAgent
        },
        dataType: "JSON"
    });
}

/** **用户注销事件** */
function userExit() {

    $.post(
        'userManagement/logout.do',
        function (data) {
            if (data.result) {
                layer.msg(data.msg);
            } else {
                layer.msg(data.msg);
            }
            if (data.logon_error) {
                window.location.href = "/cms/userManagement/login.do";
            }
            window.location.href = "/cms/userManagement/login.do";
        }, function (data) {
            layer.msg(data.msg);
        },
        'JSON'
    );
}

/*
 * 判断用户session是否有效
 */
function isLogonError(data) {
    if (data.logon_error) {
        window.location.href = "userManagement/login.do";
        return false;
    }
    return true;
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
    if (!data) {//判断为空
        return;
    } else if (Array.isArray(data)) {//判断为数组
        if (data.length) {//判断数组是否为空
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
            cursorcolor: _color,//#CC0071 光标颜色
            cursoropacitymax: _opacity, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            cursorwidth: _width, //像素光标的宽度
            cursorborder: "0", // 游标边框css定义
            railpadding: {"right": _right},
            autohidemode: false //是否隐藏滚动条
        });
    }
}

//input只能输入数字
function inputNumber(target) {
    target.value = target.value.replace(/[\D]/g, '');
}


/*******************************************************************************
 * 用于ajax访问springmvc跳转页面
 */
$.extend({
    StandardPost: function (url, args) {
        var form = $("<form id='form-post' method='post'></form>"), input;
        form.attr({
            "action": url
        });
        $.each(args, function (key, value) {
            input = $("<input type='hidden'>");
            input.attr({
                "name": key
            });
            input.val(value);
            form.append(input);
        });
        // form.removeAttr("onsubmit");
        form.appendTo(document.body).submit();
    }
});

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};

String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};