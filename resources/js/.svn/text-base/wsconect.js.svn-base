/// <reference path="_references.js" />
// 微信服务器版本2.0.5.0
var DeviceContect = {
    wsclent: null,
    boxid: 0,//id
    xinName: "",//微信公众号
    uName: "",//微信昵称
    boxno: "",//终端号码
    COrder: "",//命令
    uid: 0,//用户id
    LinkId: "",
    videotype: "",//视频类型
    opid: "",
    init: function (UserCONF) {
        oid = UserCONF.opid;
        xinName = UserCONF.xinName;
        uName = UserCONF.uName;
        uid = UserCONF.uid;
        boxid= UserCONF.boxid;
    },
    TimeOutConnection: function (boxid) {
        var _t = $("#" + boxid);
        _t.find("img").attr("src", "/images/info.png");
        _t.find(".weui_cell_ft_blue").text("已配对");
        _t.data('show', '0');
        $('#loadingToast').hide();
        localStorage.removeItem("box");
    },
    start: function (action) {
        var wsImpl = window.WebSocket || window.MozWebSocket;


        if (action == null || action == "") {
            return;
        }
        if (DeviceContect.wsclent != null) {
            if (DeviceContect.wsclent.url == action) {
                return;
            }
        }
        // 创建websocket并且连接到服务器
        window.ws = new WebSocket(action);

        DeviceContect.wsclent = window.ws;
        setTimeout(function () {
            if (DeviceContect.wsclent.readyState == 3) {
                
                /*Dialog("警告",'服务器连接已关闭或无法打开!');*/
            	//layer.alert('警告-服务器连接已关闭或无法打开!');
                return;
            } else if (DeviceContect.wsclent.readyState == 2) {
            	/*Dialog("警告",'服务器连接已关闭或无法打开!');*/
            	//layer.alert('警告-服务器连接已关闭或无法打开!');
                return;
            } else if (DeviceContect.wsclent.readyState == 0) {
            	/*Dialog("警告",'服务器连接已关闭或无法打开!');*/
            	//layer.alert('警告-服务器连接已关闭或无法打开!');
                return;
            } else if (DeviceContect.wsclent.readyState == 1) {
                //dialogShow('服务器连接成功!');
            	console.log('服务器连接成功!');
            }
        }, 3000)

        // 接收服务器发送的消息
        ws.onmessage = function (evt) {
        	clearTimeout(setTimeRequestIsAborted);
            console.log("收到的消息：" + evt.data);
            var jsondata = $.parseJSON(evt.data);
            if (jsondata.Order != "RsqMonitorStatus") {
                console.log("收到的消息：" + evt.data);
            }
            if (jsondata.Order == "Link") {
                sessionStorage.setItem("wxlinkid", jsondata.LinkID);
                DeviceContect.LinkId = jsondata.LinkID;
            }
            console.log(jsondata);
            DoMessage(jsondata);  
         
        };
        // 建立连接到服务器时
        ws.onopen = function () {
            //OpenMessage();
        	 console.log('链接成功');
        };
       
        // 与服务器连接关闭后
        ws.onclose = function () {
            //CloseMessage();
        }
    },
    //链接    
    Connection: function (did, boxnum, islock) {
        if (islock == null) {
            islock = 0;
        }
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"","Order":"ReqConnection","videotype":0,"islock":' + islock + ',"SystemType":2}';
            console.log("链接请求："+jsonmsg);
            if (DeviceContect.wsclent) {

                if (islock == 0) {
                    $('#loadingToast').show();
                }
                if (DeviceContect.wsclent.readyState == 1) {
                    console.log(jsonmsg);
                    DeviceContect.wsclent.send(jsonmsg);
                    setTimeout("DeviceContect.TimeOutConnection(" + did + ")", 31000);
                }
            }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }

    },
    //断开
    UnConnection: function (did, boxnum) {
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
		if (DeviceContect.wsclent.readyState == 1) {
	            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"","Order":"ReqUnConnection","videotype":0,"SystemType":2}';
	            console.log(jsonmsg);
	            DeviceContect.wsclent.send(jsonmsg);
		}
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }

    },
    Keepalive: function (did, boxnum) {
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
            if (DeviceContect.wsclent.readyState == 1) {
                var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":0,"MpName":"","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"","Order":"","videotype":0,"SystemType":2}';
                console.log('心跳' + jsonmsg);
                DeviceContect.wsclent.send(jsonmsg);
            }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }
    },
    ControlOrder: function (did, boxnum, COrder) {
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {

            if (DeviceContect.wsclent.readyState == 1) {
                var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"","Order":"' + COrder + '","videotype":0,"SystemType":2}';
                //  console.log(jsonmsg);
                // var str = '{ order: { mediaid:' + mediaid + ', userid:' + userid + ', username:' + username + ', status: ' + status + '} }';
                DeviceContect.wsclent.send(jsonmsg);
            }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }
    },
    //关闭录像播放
    SendCloseSaveVideo: function (boxid, boxnum, videonum, videotype) {
        if (videonum == "undefined" || videonum == null) {
            console.log("videonum:" + videonum);
        }
        else {
	    if (DeviceContect.wsclent.readyState == 1) {
                var video = videonum;
                // var video = '05190#20';
                var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxno + '","Userid":"' + uid + '","videono":"' + video + '","Order":"ReqCloseSendSaveVideo","videotype":"' + videotype + '","SystemType":2}';
                DeviceContect.wsclent.send(jsonmsg);
	    }
        }

    },

    SendSaveVideo: function (boxid, boxnum, video,videotype, startDate, endDate) {
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
            if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"' + video + '","Order":"ReqSendSaveVideo","videotype":"' + videotype + '","StartTime":"' + $("#startDate").val() + '","EndTime":"' + $("#endDate").val() + '","SystemType":2}';
            // console.log(jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
	    }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }
    },
    //实时播放
    SendVideo: function (did, boxnum, videonum, videotype) {
        //  videonum = "05245#42";
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
	    if (DeviceContect.wsclent.readyState == 1) {
                var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"' + videonum + '","Order":"ReqSendVideo","videotype":"' + videotype + '","SystemType":2}';
                //   console.log(jsonmsg);
                DeviceContect.wsclent.send(jsonmsg);
	    }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }
    },
    //实时播放停止
    StopRealPlay: function (did, boxnum, videonum, videotype) {
        // videonum = "05245#42";
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
	    if (DeviceContect.wsclent.readyState == 1) {
                var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"' + videonum + '","Order":"ReqCloseSendVideo","videotype":"' + videotype + '","SystemType":2}';
                console.log(jsonmsg);
                var jsonmsgback = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + did + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"' + videonum + '","Order":"ReqBack","videotype":"' + videotype + '","SystemType":2}';
                if (DeviceContect.wsclent != null)
                    DeviceContect.wsclent.send(jsonmsg);
                else
                { layer.alert("链接断开"); }
	    }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }
        //wsclent.send(jsonmsgback);
    },
    //定点播放
    SendSkipVideo: function (boxid, boxnum, videonum,videotype, skiptime) {
        if (did != "undefined" && did != null && boxnum != null && boxnum != "undefined") {
            // var video = '05190#20';
	    if (DeviceContect.wsclent.readyState == 1) {
            	var video = videonum;
            	var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"' + video + '","Order":"ReqSkipSaveVideo","videotype":"' + videotype + '","StartTime":"' + $("#skiptime").val() + '","SystemType":2}';
            	//   console.log(jsonmsg);
            	DeviceContect.wsclent.send(jsonmsg);
	    }
        }
        else {
            console.log("did:" + did + "boxnum" + boxnum);
        }
    },
    //cameid摄像头id
    //Order云台控制指令
    //   11	焦距变大(倍率变大)12	焦距变小(倍率变小)13	焦点前调14	焦点后调15	光圈扩大16	光圈缩小21	云台上仰22	云台下俯23	云台左转24	云台右转25	云台上仰和左转26	云台上仰和右转27	云台下俯和左转28	云台下俯和右转
    // stop;				 //0:开始    1：结束	1byte
    // step;				//云台速度1-8		1byte
    //boxnum 主消息号
    PTZOrder: function (boxid, boxnum, cameid, Order, stop, step) {
    	if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":1,"UserName":"","BoxNumber":' + boxnum + ',"Userid":"' + uid + '","videono":"' + cameid + '","PTZControl":' + Order + ',"Order":"ReqPTZOrder","videotype":0,"stop":' + stop + ',"step":' + step + ',"SystemType":2}';

            DeviceContect.wsclent.send(jsonmsg);
	}
    },
    PageLoadSendMsg: function () {
        if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + LinkId + '","DeviceId":' + boxid + ',"MessageType":0,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxno + '","Userid":"' + uid + '","videono":"","Order":"","videotype":0,"SystemType":2}';

            DeviceContect.wsclent.send(jsonmsg);
	}
    },
    //点播播放
    demandPlay: function (v2vurl, boxNum/*, boxid*/) {//boxid随便传个数字即可
	if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqPlayDemandOnVideo","videotype":0,"SystemType":2}';
            console.log('播放命令'+jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
	}
    },
    //点播暂停
    demandParse: function (v2vurl, boxNum) {
        var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqPauseDemandOnVideo","videotype":0,"SystemType":2}';
        console.log('暂停命令' + jsonmsg);
        DeviceContect.wsclent.send(jsonmsg);
    },
    //点播继续
    demandContinue: function (v2vurl, boxNum) {
	if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqContinuePlayDemandOnVideo","videotype":0,"SystemType":2}';
            console.log('继续命令' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
	}
    },
    //点播停止
    demandStop: function (v2vurl, boxNum/*, boxid*/) {//boxid随便传个数字即可
	if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"'+v2vurl+'","Order":"ReqStopDemandOnVideo","videotype":0,"SystemType":2}';
            console.log('停止命令' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
	}
    },

    //获取播放位置
    demandGetPlayAddress: function (v2vurl, boxNum) {
	if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqGetSeekTimeDemandOnVideo","videotype":0,"SystemType":2}';
            console.log('获取位置命令' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
        }
    },
    //获取视频时长
    demandGetPlayTime: function (v2vurl, boxNum) {
	if (DeviceContect.wsclent.readyState == 1) {
 	    var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqGetTimeDemandOnVideo","videotype":0,"SystemType":2}';
            console.log('获取文件时长命令' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
        }
    },
    //点播定点播放
    demandFixedSpeed: function (v2vurl, boxNum, SeekSecond) {
	if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqSeekDemandOnVideo","videotype":0,"SeekSecond":' + SeekSecond + ',"SeekType":2,"SystemType":2}';
            console.log('定点播放命令' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
	}
    },
    //点播快进
    demandSpeed: function (v2vurl, boxNum, SeekSecond) {
	if (DeviceContect.wsclent.readyState == 1) {
        var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqSeekDemandOnVideo","videotype":0,"SeekSecond":' + SeekSecond + ',"SeekType":0,"SystemType":2}';
        console.log('快进命令' + jsonmsg);
        DeviceContect.wsclent.send(jsonmsg);
	}
    },
    //点播后退
    demandBack: function (v2vurl, boxNum, SeekSecond) {
        if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":4,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"' + v2vurl + '","Order":"ReqSeekDemandOnVideo","videotype":0,"SeekSecond":' + SeekSecond + ',"SeekType":1,"SystemType":2}';
            console.log('后退命令' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
        }
    },
    //音量获取
    volumeGet: function (boxNum) {
        if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"","Order":"ReqGetVoulmeValue","videotype":0,"volume":0,"SystemType":2}';
            console.log('音量获取' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
        }
    },
    //音量设置
    volumeSet: function (boxNum, volume) {
        if (DeviceContect.wsclent.readyState == 1) {
            var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":2,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxNum + '","Userid":"' + uid + '","videono":"","Order":"ReqSetVoulmeValue","videotype":0,"volume":' + volume + ',"SystemType":2}';
            console.log('设置音量' + jsonmsg);
            DeviceContect.wsclent.send(jsonmsg);
        }
    },
    //videonum 00165#74
    GetMonitorSaveFile: function (boxid, boxnum, videonum, videotype, startdate, enddate) {
    	if (bid != "undefined" && bid != null && boxnum != null && boxnum != "undefined") {
            if (DeviceContect.wsclent.readyState == 1) {
            	var jsonmsg = '{"LinkId":"' + DeviceContect.LinkId + '","DeviceId":' + boxid + ',"MessageType":1,"MpName":"' + xinName + '","UserName":"' + uName + '","BoxNumber":"' + boxnum + '","Userid":"' + uid + '","videono":"' + videonum + '","Order":"ReqGetMonitorSaveFile","videotype":"' + videotype + '","StartTime":"' + startdate + '","EndTime":"' + enddate + '","SystemType":2}';
                // console.log(jsonmsg);
                DeviceContect.wsclent.send(jsonmsg);
            }
        }
        else {
    		console.log("did:" + bid + "boxnum" + boxnum);
        }
    }
};

