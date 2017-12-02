/**
 * 请求json
 */
function vvRequestJson(opt) {
    return new vvMessage(opt).request();
}

function vvResponseJson(opt) {
    return new vvMessage(opt).response();
}

var vvMessage = function (opt) {
    this.default = {
        "type": "request",
        "command": "UNKNOWN",
        "token": getToken(),
        "params": {}
    },
		this.options = $.extend(true, this.default, opt);
    this.request = function () {
        var msg = {
            "type": "request",
            "command": this.options.command,
            "token": this.options.token,
            "params": this.options.params
        }
        return JSON.stringify(msg);
    }
    this.response = function () {
        var msg = {
            "type": "response",
            "command": this.options.command,
            "token": this.options.token,
            "params": this.options.params
        }
        return JSON.stringify(msg);
    }
};

/***
 * 获取token
 * token格式：hhmmss随机5位字符
 */
function getToken() {
    return getHours() + getMinutes() + getSeconds() + randomString(5);
}

/**
 * 获取月份 
 */
function getMonth() {
	var month = new Date().getMonth() + 1 + "";
	return month.length == 1 ? "0" + month : month;
}

/**
 * 名称添加&nbsp; 
 * @param {Object} name
 */
function subName(name) {
	var len = name.length;
//	console.log(len);
	if(len>=2){
		var reg = new RegExp("(\\S{1})","g");
		var str = name.replace(reg,"$1&nbsp;");
//		console.log(str);
		return str;
	}
}

/**
 * 获取几号 
 */
function getDate() {
	var date = new Date().getDate() + "";
	return date.length == 1 ? "0" + date : date;
}

/**
 * 获取星期
 */
function getWeekDay() {
	var num = new Date().getDay();
	var weekday = new Array(7);
	weekday[0] = "星期日";
	weekday[1] = "星期一";
	weekday[2] = "星期二";
	weekday[3] = "星期三";
	weekday[4] = "星期四";
	weekday[5] = "星期五";
	weekday[6] = "星期六";
	return weekday[num];
}

/**
 * 获取小时
 */
function getHours() {
	var hours = new Date().getHours() + "";
	return hours.length == 1 ? "0" + hours : hours;
}

/**
 * 获取分钟 
 */
function getMinutes() {
	var minutes = new Date().getMinutes() + "";
	return minutes.length == 1 ? "0" + minutes : minutes;
}

/**
 * 获取秒 
 */
function getSeconds(){
	var seconds =  new Date().getSeconds() + "";
	return seconds.length == 1 ? "0" + seconds : seconds;
}
/***
 * 格式化日期和月份
 * @param {Object} date
 */
function formatDate(date) {
	date = date + "";
	return date.length == 1 ? "0" + date : date;
}

/***
 * 获取星期 
 * @param {Object} num
 */
function getWeek(num) {
	var weekday = new Array(7);
	weekday[0] = "星期日";
	weekday[1] = "星期一";
	weekday[2] = "星期二";
	weekday[3] = "星期三";
	weekday[4] = "星期四";
	weekday[5] = "星期五";
	weekday[6] = "星期六";
	return weekday[num];
}
/***
 * 创建随机字符
 * @param {Object} len 字符长度
 * 默认32位字符
 */
function randomString(len) {
    len = len || 32;
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//获得链接参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}