/*云空间*/
window.onbeforeunload = function () {
    /*var n = window.event.screenX - window.screenLeft;
        var b = n > document.documentElement.scrollWidth - 20;
        if (b && window.event.clientY < 0 || window.event.altKey) {
            console.log("是关闭而非刷新");
            window.event.returnValue = ""; //这里可以放置你想做的操作代码
        } else {
            console.log("是刷新而非关闭");
        }*/
    $('.vid-stop').click();
};

var sh = '';//用来标记心跳定时器
var v2vUrl = '';//用来记录视频的链接
var st = '';//进度条的位移定时器
var setTimeRequestIsAborted = "";//请求是否有回应
var loadIndex = -1;//loading层的index
var loadSetTime = '';//loading定时器的标记
var ls = 0;//坐标标记的时间
var second = 0;//记录视频的总时长
var oNiceScroll = false; //禁止请求
var nLayerNum = -1; //弹层
;$(function () {
    $(".cloud-page").addClass("active");//给头部导航增加选中状态

    /*=============websocket==================*/
    //var deviceNum=0;//设备号码
    var $userName = $('#user_name').val();
    var UserCONF = {
        "opid": '',
        'xinName': 'admin',
        "uName": $userName,
        "uid": 1,
        "boxid": 9
    };

//*****	 $.get('operationManagement/systemConfiguration/getSystemConfig.do',function(str){
//		 var data=eval('('+str+')');
//		 /*console.log(data);*/
//		 if(!isLogonError(data)){
//				return ;
//			}
//		 if(data.list){
//			 for(var i=0; i<data.list.length; i++ ){
//				 if(data.list[i]["func"]=="wx_server"){
//					 DeviceContect.init(UserCONF);
//					 DeviceContect.start(data.list[i]["val"]);//243 223
//					 break;
//				 }
//			 }
//		 }
//	 });


//	 DeviceContect.init(UserCONF);
//	 DeviceContect.start('ws://192.168.10.76:8899');//243 223

    var vm = new Vue({
        el: '#cloudResources',
        mounted: function () {
            this.getLeftNav();
        },
        data: {
            nav_left: [],
            userId: $('#userId').val() - 0,
            userPermissions: $('#userPermissions').val() - 0, //用户状态
            userCloudState: 0, //当前用户在此空间的身份信息
            odataList: "",
            tabFlag: true, /*切换空间资源和空间成员*/
            sIsShow: true, /*标记批量操作显隐*/
            searchWord: "",
            cloudName: '',
            ocloudId: "", /*云空间ID*/
            navClickIndex: 0,//记录点击的云空间数据索引
            navEditTxt: '',//记录要修改的文本
            pageNum: 1,
            isSelectAll: 0,//全选标记
            deleteData: [], //要删除的数据
            pageSize: 15,
            checkNum: 0, //选中的数量
            checkAllNum: 0, //选中最大的数量
            scrollBol: true, //防止滚动重复加载
            opState: 0, //判断当前点击的是删除还是共享资源/添加成员
            aPreData: [],//记录上一次的数据
            opConfig: { //记录当前点击的位置等
                which: 0, //0：云端资源  1：空间成员
                state: 0, //0：默认加载对应云空间下的资源或者成员 1共享资源或者添加用户 -1删除资源或者删除用户

            },
            bScrollNo: true,
            playBol: true, //防止重复点击播放
            timeSort: true
        },
        watch: {
            searchWord: function (value) {
                this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g, '');
                /*去前空格和敏感字符*/
            },
            cloudName: function (value) {
                this.cloudName = value.replace(/(^\s*)|(\s*$)/g, '');
                /*去前后空格*/
            },
            navEditTxt: function (value) {
                this.navEditTxt = value.replace(/(^\s*)|(\s*$)/g, '');
                /*去前后空格*/
            }
        },
        methods:
            {
                /*查询左侧导航数据*/
                getLeftNav: function () {

                    /*console.log('执行了左侧导航请求');*/
                    var _this = this;
                    $.ajax({
                        url: "cloudResources/cloudSpace/list.do",
                        type: "POST",
                        data: {
                            pageSize: 99999
                        },
                        dataType: "json",
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            var result = data.result;
                            if (result) {
                                /**查询成功**/
                                var list = data.list.list;

                                /* console.log('请求结束，数据为');
		  				  console.log(list); */
                                _this.nav_left.length = 0; //清空以前的数据
                                if (list.length) {
                                    for (var i = 0; i < list.length; i++) {
                                        if (i == 0) {
                                            ostate = 1;
                                            /*选中状态*/
                                            _this.ocloudId = list[i].cloudSpaceId;
                                        } else {
                                            ostate = 0;
                                            /*未选中状态*/
                                        }
                                        _this.nav_left.push({
                                            id: list[i].cloudSpaceId,
                                            txt: list[i].cloudSpaceName,
                                            state: ostate,
                                            edit: 0,
                                            version: list[i].version
                                        });
                                    }
                                    ;
                                    _this.getList();
                                    /*请求列表数据*/
                                }
                            } else {
                                /**查询失败**/
                                layer.msg("<p style='text-align:center'>查询失败!</p>");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });

                },
                /*查询列表数据*/
                getList: function (pageNum, type) {
                    /*console.log('执行了右侧内容请求');
			   console.log('当前是在'+vm.opConfig.which);
			   console.log('当前操作'+vm.opConfig.state);*/

                    var url, _data;
                    var _this = this;

                    if (type == 'timeSort') {
                        _this.timeSort = !_this.timeSort;
                    }

                    if (!pageNum) {
                        vm.pageNum = 1;
                        _this.bScrollNo = true;
                    }

                    if (!_this.bScrollNo) {
                        return;
                    }


                    _this.scrollBol = false; //防止重复加载

                    _data = {
                        "cloudId": _this.ocloudId,
                        "searchWord": formatStringInSubmit(_this.searchWord),
                        pageSize: 15,
                        "pageNum": vm.pageNum ? vm.pageNum : 1,
                    };

                    if (_this.tabFlag) {

                        if (vm.opConfig.state == 1) { //资源添加
                            url = "cloudResources/cloudResource/getResourceNotInCloud.do";
                        } else if (vm.opConfig.state == 0) {
                            url = "cloudResources/cloudResource/getResourceFromCloud.do";
                        }

                        _data.shareTimeSort = _this.timeSort ? 'desc' : 'asc';

                    } else {

                        if (vm.opConfig.state == 1) {//人员添加
                            url = "cloudResources/cloudUser/getUserNotInCloud.do";
                        } else if (vm.opConfig.state == 0) {
                            url = "cloudResources/cloudUser/getUserFromCloud.do";
                        }
                        _data.createTimeSort = _this.timeSort ? 'desc' : 'asc';
                    }

                    $.post(
                        'cloudResources/cloudUser/getUserCloudSpaceIdentify.do',
                        {groupId: _this.ocloudId},
                        function (data) {
                            if (data.result) {
                                _this.userCloudState = data.data.cloudSpaceStatus; //获取当前云空间下用户的权限
                            }
                        },
                        'JSON'
                    );

                    $.ajax({
                        url: url,
                        type: "POST",
                        data: _data,
                        dataType: "json",
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            var result = data.result;
                            if (result) {

                                setTimeout(function () {
                                    _this.scrollBol = true;
                                }, 350);

                                if (data.list.isLastPage) {
                                    vm.bScrollNo = false; //数据最后赋值不让请求
                                }

                                /**查询成功**/
                                if (_this.odataList) {
                                    if (!pageNum) { //不存在时是因为搜索
                                        if (data.list.list) {//搜索时重新赋值
                                            _this.odataList = data.list.list;
                                            $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                        } else {
                                            _this.odataList = [];
                                        }
                                    } else {
                                        _this.odataList = _this.odataList.concat(data.list.list); //存在时追加
                                    }
                                    _this.isSelectAll = 0;
                                } else {
                                    _this.odataList = data.list.list; //页面加载时数据赋值
                                    $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                }

                                _this.checkAllNum = _this.odataList.length; //每次请求数据时改变最大值
                            } else {
                                /**查询失败**/
                                layer.msg("<p style='text-align:center'>查询失败!</p>");
                            }

                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            setTimeout(function () {
                                _this.scrollBol = true;
                            }, 350);
                        }
                    });
                },

                /*
		    * 授权
		    * 1授权 -1取消
		    * */
                warrant: function (_index, _type) {
                    var _url = '';
                    if (_type == 1) {
                        _url = 'cloudResources/cloudSpace/updateImpowerSystem.do';
                    } else {
                        _url = 'cloudResources/cloudSpace/deleteImpowerSystem.do';
                    }
                    //cloudSpaceStatus
                    $.ajax({
                        url: _url,
                        data: {
                            groupId: vm.ocloudId,
                            userId: vm.odataList[_index].userId
                        },
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            if (data.result) {
                                var _str = '';
                                if (_type == 1) {
                                    _str = '授权成功';
                                    vm.odataList[_index].cloudSpaceStatus = 1;
                                } else {
                                    _str = '取消授权成功';
                                    vm.odataList[_index].cloudSpaceStatus = 0;
                                }
                                layer.msg("<p style='text-align:center'>" + _str + "!</p>");
                            } else {
                                layer.msg("<p style='text-align:center'>" + data.msg + "!</p>");
                            }
                        },
                        error: function (data) {
                            layer.msg("<p style='text-align:center'>" + data.msg + "!</p>");
                        },
                        type: 'POST',
                        dataType: 'JSON'
                    });
                },

                /*删除*/
                /**
                 * _data为要删除的数据,为[{}]格式
                 * ocloudId:""云空间ID
                 navClickIndex:0,//记录点击的云空间数据索引
                 */
                delete_data: function (_data) {

                    if (vm.opConfig.state == 1) {//添加
                        var _str = "<div class='z-comm-layer-wrap'>";
                        _str += '<div class="z-comm-layer-box z-delete">';
                        _str += "<div class='layer-top clearfix'><span class='layer-title'>温馨提醒</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                        _str += '<div class="z-comm-layer-delete-box">';
                        if (vm.opConfig.which) {
                            _str += '<p>您确定要添加成员吗？</p>';
                        } else {
                            _str += '<p>您确定要共享资源吗？</p>';
                        }
                        _str += '<div class="btn-box">\
								<button class="z-layer-sure">确定</button>\
								<button class="z-layer-cancel">取消</button>\
							</div></div>';
                        _str += '</div></div>';

                        var index = layer.open({
                            type: 1,
                            closeBtn: 0,
                            shade: [0.7],
                            title: false,
                            area: [],
                            resize: false,
                            scrollbar: false,
                            shadeClose: false, //点击遮罩关闭
                            content: _str,
                            success: function () {
                                $('.z-layer-close').click(function () {
                                    layer.close(index);
                                });
                                $('.z-layer-sure').click(function () {
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    vm.deleteData = _data;
                                    del(_data);
                                });
                                $('.z-layer-cancel').click(function () {
                                    layer.close(index);
                                });
                            }
                        });

                    } else {
                        var _str = "<div class='z-comm-layer-wrap'>";
                        _str += '<div class="z-comm-layer-box z-delete">';
                        _str += "<div class='layer-top clearfix'><span class='layer-title'>温馨提醒</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                        _str += '<div class="z-comm-layer-delete-box">';
                        if (vm.opConfig.which) {
                            _str += '<p>成员一旦删除将无法恢复，您确定要删除吗？</p>';
                        } else {
                            _str += '<p>资源一旦删除将无法恢复，您确定要删除吗？</p>';
                        }

                        _str += '<div class="btn-box">\
								<button class="z-layer-sure">确定</button>\
								<button class="z-layer-cancel">取消</button>\
							</div></div>';
                        _str += '</div></div>';
                        var index = layer.open({
                            type: 1,
                            closeBtn: 0,
                            shade: [0.7],
                            title: false,
                            area: [],
                            resize: false,
                            scrollbar: false,
                            shadeClose: false, //点击遮罩关闭
                            content: _str,
                            success: function () {
                                $('.z-layer-close').click(function () {
                                    layer.close(index);
                                });
                                $('.z-layer-sure').click(function () {
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    vm.deleteData = _data;
                                    del(_data);
                                });
                                $('.z-layer-cancel').click(function () {
                                    layer.close(index);
                                });
                            }
                        });
                    }

                    function del() {
                        var _taskId = '', //存要删除的ID
                            _taskIndex = [], //存要删除的索引
                            _this = vm;

                        if (_this.tabFlag) { //云端资源
                            var _types = ''; //存要删除的type
                        }

                        for (var i = 0, _len = _data.length; i < _len; i++) { //数据转换
                            if (i == _len - 1) {
                                _taskId += _data[i].taskId;
                                if (_this.tabFlag) {
                                    _types += _data[i].type;
                                }
                            } else {
                                _taskId += _data[i].taskId + ',';
                                if (_this.tabFlag) {
                                    _types += _data[i].type + ',';
                                }
                            }
                            _taskIndex.push(_data[i].index);
                        }

                        var _url = '', postdata = {};

                        if (vm.tabFlag) { //资源
                            postdata = {
                                cloudId: vm.ocloudId,
                                resourceIds: _taskId,
                                types: _types
                            };

                            switch (vm.opConfig.state) {
                                case 0:
                                    /*console.log('空间-默认操作');*/
                                    _url = 'cloudResources/cloudResource/deleteResourceFromCloud.do';
                                    break;
                                case 1:
                                    /*console.log('空间-添加操作');*/
                                    _url = 'cloudResources/cloudResource/addResourceToCloud.do';
                                    break;
                                case -1:
                                    /*console.log('空间-删除操作');*/
                                    _url = 'cloudResources/cloudResource/deleteResourceFromCloud.do';
                                    break;
                            }

                        } else {//人员
                            postdata = {
                                cloudId: vm.ocloudId,
                                userIds: _taskId
                            };


                            switch (vm.opConfig.state) {
                                case 0:
                                    /*console.log('资源-默认操作');*/
                                    _url = 'cloudResources/cloudUser/deleteUserFromCloud.do';
                                    break;
                                case 1:
                                    /*console.log('资源-添加操作');*/
                                    _url = 'cloudResources/cloudUser/addUserToCloud.do';
                                    break;
                                case -1:
                                    /*console.log('资源-删除操作');*/
                                    _url = 'cloudResources/cloudUser/deleteUserFromCloud.do';
                                    break;
                            }
                        }

                        $.post(
                            _url,
                            postdata,
                            function (data) {
                                if (data.result) {
                                    for (var i = 0, _len = _taskIndex.length; i < _len; i++) {
                                        _this.odataList.splice(_taskIndex[i] - i, 1); //删除页面数据
                                    }
                                    if (_this.odataList.length == 0) {//全选删除时取消选中
                                        _this.isSelectAll = 0;
                                    }
                                    _this.deleteData.length = 0; //清空删除数组索引
                                    _this.checkNum = 0; //清空删除数组数量
                                    _this.checkAllNum = _this.odataList.length;//改变数据数量
                                    if (vm.opConfig.state == 1) {
                                        layer.msg("<p style='text-align:center'>添加成功!</p>");
                                        if (!_this.odataList.length) {
                                            _this.getList();
                                        }
                                    } else {
                                        layer.msg("<p style='text-align:center'>删除成功!</p>");
                                    }

                                } else {

                                }
                            },
                            'json');
                    }

                },

                /*num:标记是点击的取消还是点击的批量删除*/
                checkBatchOperation: function (num, _type) {


                    if (vm.tabFlag) { //判断当前Tab点击位置
                        vm.opConfig.which = 0;
                    } else {
                        vm.opConfig.which = 1;
                    }


                    if (num != 3) {
                        vm.deleteData.length = 0; //如果不是删除操作清空删除的数据
                    }

                    if (num == "1") { //
                        vm.sIsShow = false;//隐藏批量操作按钮,展示确定取消按钮
                        if (_type) {
                            if (_type == 1) { //1添加 -1删除
                                vm.opConfig.state = 1;  //代表共享资源或者添加人员
                                vm.getList();
                            } else if (_type == -1) {
                                vm.opConfig.state = -1;   //代表删除共享资源或者删除人员

                                if (vm.opConfig.which == 1) { //代表空间成员批量删除
                                    if (vm.userCloudState == 2 || vm.userPermissions == 0) {
                                        vm.odataList.forEach(function (val, key) { //批量删除时隐藏创建者
                                            if (val.cloudSpaceStatus == 2) {
                                                vm.odataList.splice(key, 1);
                                                return;
                                            }
                                        });

                                    } else {
                                        //动态删除时不能用forEach因为会缓存lenght所以用for，上面因为创建者只有一个找到就return所以可以用
                                        for (var i = 0; i < vm.odataList.length; i++) {
                                            if (vm.odataList[i].cloudSpaceStatus != 0) {
                                                vm.odataList.splice(i, 1);
                                                i--;
                                            }
                                        }
                                    }
                                }
                            }

                        } else {
                            /*vm.opState = -1; //代表成员*/
                            vm.opConfig.state = 0;
                        }

                    } else if (num == "2") {
                        vm.sIsShow = true;//展示批量操作按钮,隐藏确定取消按钮
                        /**
                         * 点击取消跟全部选操作相同
                         */


                        vm.cleanData();

                        vm.getList();	//重新请求数据

                        for (var i = 0, _len = vm.odataList.length; i < _len; i++) {
                            vm.odataList[i].isSelected = 0; //自定义属性控制页面的单选的显示状态
                        }

                    } else if (num == "3") {//点击确认删除
                        if (!vm.deleteData.length) {
                            layer.msg("<p style='text-align:center'>请选择操作的数据!</p>");
                            return;
                        }
                        switch (vm.opConfig.state) {
                            case -1:
                                /*console.log('删除操作');*/
                                vm.delete_data(vm.deleteData);
                                break;
                            case 0:
                                /*console.log('资源-默认操作');*/
                                break;
                            case 1:
                                /*console.log('添加操作');*/
                                vm.delete_data(vm.deleteData);
                                break;
                            default:
                                /*console.log('啥子操作哟');*/
                                break;
                        }
                    }

                },

                /**全选**/
                fnClickAll: function () {
                    var _this = this;
                    if (_this.isSelectAll == 0) {//未勾选
                        _this.isSelectAll = 1; //改为全选
                        _this.deleteData.length = 0;//清空删除数组
                        _this.checkNum = _this.odataList.length; //选中的值

                        for (var i = 0, _len = _this.odataList.length; i < _len; i++) {
                            _this.odataList[i].isSelected = 1; //自定义属性控制页面的单选的显示状态
                            if (vm.tabFlag) {
                                switch (vm.opConfig.state) {
                                    case 0:
                                        _this.deleteData.push({
                                            "taskId": _this.odataList[i].sourceId,
                                            "index": i,
                                            "type": _this.odataList[i].type
                                        });//删除数组
                                        break;
                                    case 1:
                                        _this.deleteData.push({
                                            "taskId": _this.odataList[i].taskid,
                                            "index": i,
                                            "type": _this.odataList[i].type
                                        });//删除数组
                                        break;
                                    case -1:
                                        _this.deleteData.push({
                                            "taskId": _this.odataList[i].sourceId,
                                            "index": i,
                                            "type": _this.odataList[i].type
                                        });//删除数组
                                        break;
                                }

                            } else {
                                _this.deleteData.push({"taskId": _this.odataList[i].userId, "index": i});//删除数组
                            }

                        }


                    } else {//已勾选
                        _this.isSelectAll = 0; //改为未全选
                        _this.checkNum = 0; //把当前勾选的数量改为0
                        _this.deleteData.length = 0;//清空删除数组
                        for (var i = 0, _len = _this.odataList.length; i < _len; i++) {
                            _this.odataList[i].isSelected = 0; //自定义属性控制页面的单选的显示状态
                        }
                    }
                    ;
                },

                /**单个勾选**/
                fnClick: function ($index) {
                    var _this = this,
                        _bol = false,
                        _i = -1;

                    _this.odataList[$index].isSelected ? _this.odataList[$index].isSelected = 0 : _this.odataList[$index].isSelected = 1; //选中改变

                    if (_this.deleteData.length) { //如果长度存在，或者不存在
                        for (var i = 0, _len = _this.deleteData.length; i < _len; i++) {
                            if (_this.deleteData[i].index == $index) {//判断是否已存在
                                _bol = true;
                                _i = i;
                                break;
                            }
                        }

                        if (_bol) {
                            _this.deleteData.splice(_i, 1);  //已存在删除
                        } else {
                            if (vm.tabFlag) {

                                switch (vm.opConfig.state) { //注意接口返回的接口ID字段不一致
                                    case 0:
                                        _this.deleteData.push({
                                            "taskId": _this.odataList[$index].sourceId,
                                            "index": $index,
                                            "type": _this.odataList[$index].type
                                        });//删除数组
                                        break;
                                    case 1:
                                        _this.deleteData.push({
                                            "taskId": _this.odataList[$index].taskid,
                                            "index": $index,
                                            "type": _this.odataList[$index].type
                                        });//删除数组
                                        break;
                                    case -1:
                                        _this.deleteData.push({
                                            "taskId": _this.odataList[$index].sourceId,
                                            "index": $index,
                                            "type": _this.odataList[$index].type
                                        });//删除数组
                                        break;
                                }

                            } else {
                                _this.deleteData.push({"taskId": _this.odataList[$index].userId, "index": $index});//删除数组
                            }
                        }

                    } else {
                        /* _this.deleteData.push({"taskId":_this.odataList[$index].taskid,"index":$index});*/
                        if (vm.tabFlag) {
                            switch (vm.opConfig.state) {
                                case 0:
                                    _this.deleteData.push({
                                        "taskId": _this.odataList[$index].sourceId,
                                        "index": $index,
                                        "type": _this.odataList[$index].type
                                    });//删除数组
                                    break;
                                case 1:
                                    _this.deleteData.push({
                                        "taskId": _this.odataList[$index].taskid,
                                        "index": $index,
                                        "type": _this.odataList[$index].type
                                    });//删除数组
                                    break;
                                case -1:
                                    _this.deleteData.push({
                                        "taskId": _this.odataList[$index].sourceId,
                                        "index": $index,
                                        "type": _this.odataList[$index].type
                                    });//删除数组
                                    break;
                            }
                        } else {
                            _this.deleteData.push({"taskId": _this.odataList[$index].userId, "index": $index});//删除数组
                        }
                    }

                    _this.deleteData.sort(arrSort('index')); //数组进行排序
                    _this.checkNum = _this.deleteData.length; //记录勾选的数量

                    if (_this.checkNum == _this.odataList.length) { //判断是否全选
                        _this.isSelectAll = 1;
                    } else {
                        _this.isSelectAll = 0;
                    }
                },

                //清空默认数据
                cleanData: function () {
                    vm.sIsShow = true; //全选显示隐藏
                    vm.isSelectAll = 0; //改为未全选
                    vm.checkNum = 0; //把当前勾选的数量改为0
                    vm.deleteData.length = 0;//清空删除数组
                    vm.opConfig.state = 0; //取消时把当前的值改为默认取对应ID的数据
                    vm.scrollBol = true; //滚动条件
                    vm.searchWord = ''; //筛选条件
                    vm.pageNum = 1; //pageNum改过来
                    vm.bScrollNo = true;//可以再次请求
                },

                /*右侧页签切换函数 flag:true(空间资源)  false(空间成员)*/
                tabSwitch: function (flag) {

                    if (vm.tabFlag != flag && flag == true) { //防止重复点击
                        vm.cleanData();
                        vm.tabFlag = true;
                        vm.opConfig.which = 0;
                        this.getList();
                    } else if (flag == true && vm.opConfig.state != 0) {//点击批量共享操作时还原
                        vm.cleanData();
                        vm.tabFlag = true;
                        vm.opConfig.which = 0;
                        this.getList();
                    }

                    if (vm.tabFlag != flag && flag == false && vm.opConfig.state == 0) { //防止重复点击
                        vm.cleanData();
                        vm.tabFlag = false;
                        vm.opConfig.which = 1;
                        this.getList();
                    } else if (flag == false && vm.opConfig.state != 0) {  //点击批量共享操作时还原
                        vm.cleanData();
                        vm.tabFlag = false;
                        vm.opConfig.which = 1;
                        this.getList();
                    }

                },

                /*编辑左侧导航*/
                nav_edit: function () {

                    setTimeout(function () { //为了触发focus
                        $('#z_focus_input input').eq(vm.navClickIndex)[0].focus();
                    }, 10);

                    var _item = vm.nav_left[vm.navClickIndex];

                    _item.edit = 1;
                    vm.navEditTxt = _item.txt;

                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        url: 'cloudResources/cloudSpace/getCloudSpace.do',
                        data: {
                            cloudSpaceId: vm.ocloudId
                        },
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            if (data.result) {
                                vm.nav_left[vm.navClickIndex].version = data.data.version; //更新version
                            }
                        },
                        error: function () {
                        }
                    });

                },

                hide_nav_add: function () {
                    if (nLayerNum != -1)
                        layer.close(nLayerNum);
                    nLayerNum = -1;
                    vm.cloudName = '';
                },

                /*新增左侧导航*/
                nav_add: function (_oIndex) {
                    var _str = "<div class='z-comm-layer-wrap'>";
                    _str += '<div class="z-comm-layer-box z-delete">';
                    _str += "<div class='layer-top clearfix'><span class='layer-title'>添加云空间</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                    _str += '<div class="z-comm-layer-delete-box">\
						<div class="z-nav-add-box"><input class="z-nav-add-input" type="text" maxlength=40 placeholder="请输入云空间的名称" /></div>\
						<div class="btn-box">\
							<button class="z-layer-sure">确定</button>\
							<button class="z-layer-cancel">取消</button>\
						</div></div>';
                    _str += '</div></div>';
                    var index = layer.open({
                        type: 1,
                        closeBtn: 0,
                        shade: [0.7],
                        title: false,
                        area: [],
                        resize: false,
                        scrollbar: false,
                        shadeClose: false, //点击遮罩关闭
                        content: _str,
                        success: function () {
                            $('.z-layer-close').click(function () {
                                layer.close(index);
                            });
                            $('.z-layer-sure').click(function () {
                                vm.cloudName = $('.z-nav-add-input').val().trim();
                                if (vm.cloudName) {
                                    if (vm.cloudName.length > 50) {
                                        layer.msg('云空间名称不能大于50');
                                        return;
                                    } else {
                                        var reg = /^[\u4e00-\u9fa5a-zA-Z\w]+$/;
                                        if (reg.test(vm.cloudName)) {
                                            addNav();
                                        } else {
                                            layer.msg('云空间名称，只能为中英文，数字，下划线组成');
                                            return;
                                        }
                                    }

                                } else {
                                    layer.msg('请输入云空间的名称!');
                                }

                            });
                            $('.z-layer-cancel').click(function () {
                                layer.close(index);
                            });
                        }
                    });


                    function addNav() {
                        $.ajax({
                            type: 'POST',
                            dataType: 'JSON',
                            url: 'cloudResources/cloudSpace/addCloudSpace.do',
                            data: {
                                cloudSpaceName: vm.cloudName
                            },
                            success: function (data) {
                                if (!isLogonError(data)) {
                                    return;
                                }
                                if (data.result) {
                                    layer.msg("<p style='text-align:center'>添加成功!</p>");
                                    vm.navClickIndex = 0; //还原点击的第一次
                                    vm.getLeftNav();
                                    $('.z-nav-add-input').val('');
                                    layer.close(index);
                                } else {
                                    layer.msg("<p style='text-align:center'>" + data.msg + "!</p>");
                                }
                            },
                            error: function (data) {
                                layer.msg("<p style='text-align:center'>" + data.msg + "!</p>");
                            }
                        });
                    }

                },
                /*blur*/
                nav_blur: function (ind) {
                    var _item = vm.nav_left[vm.navClickIndex];
                    _item.edit = 0;
                    var reg = /^[\u4e00-\u9fa5a-zA-Z\w]+$/;
                    if (!reg.test(vm.navEditTxt)) {
                        layer.msg('云空间名称，只能为中英文，数字，下划线组成');
                        return;
                    }

                    if (vm.navEditTxt.length > 50) {
                        layer.msg('云空间名称不能大于50字符');
                        return;
                    }

                    if (vm.navEditTxt && vm.navEditTxt != _item.txt) {
                        $.ajax({
                            type: 'POST',
                            dataType: 'JSON',
                            url: 'cloudResources/cloudSpace/updateCloudSpace.do',
                            data: {
                                cloudSpaceId: _item.id,
                                cloudSpaceName: vm.navEditTxt,
                                version: _item.version

                            },
                            success: function (data) {
                                if (!isLogonError(data)) {
                                    return;
                                }
                                if (data.result) {
                                    layer.msg("<p style='text-align:center'>修改成功!</p>");
                                    _item.txt = vm.navEditTxt; //页面赋值
                                } else {
                                    layer.msg("<p style='text-align:center'>" + data.msg + "</p>");
                                }
                            },
                            error: function () {
                            }
                        });
                    }

                },
                /*点击*/
                nav_click: function (ind) {

                    /**
                     * 还原操作
                     *
                     * */

                    var bBol = vm.tabFlag; //记录当前是云端资源还是人员
                    vm.cleanData();
                    vm.tabFlag = bBol;
                    vm.opConfig.which = bBol ? 0 : 1;

                    if (vm.ocloudId == vm.nav_left[ind].id) { //判断当前位置，防止重复点击请求
                        /*alert('重复请求了');*/
                    } else {
                        vm.navClickIndex = ind; //存当前点击的索引，为了修改删除操作

                        this.nav_left.forEach(function (v, i) {
                            v.state = 0;
                        });
                        this.nav_left[ind].state = 1;
                        this.ocloudId = this.nav_left[ind].id;
                        /*云空间ID重新赋值-查询*/
                        this.getList();//请求页面数据
                    }
                },
                /*删除云空间列表*/
                nav_del: function () {
                    var _str = "<div class='z-comm-layer-wrap'>";
                    _str += '<div class="z-comm-layer-box z-delete">';
                    _str += "<div class='layer-top clearfix'><span class='layer-title'>温馨提醒</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                    _str += '<div class="z-comm-layer-delete-box">';
                    if (vm.odataList.length > 0) {
                        _str += '<p>云空间有资源或成员删除将无法恢复，您确定要删除吗？</p>';
                    } else {
                        _str += '<p>云空间删除将无法恢复，您确定要删除吗？</p>';
                    }

                    _str += '<div class="btn-box">\
							<button class="z-layer-sure">确定</button>\
							<button class="z-layer-cancel">取消</button>\
						</div></div>';
                    _str += '</div></div>';
                    var index = layer.open({
                        type: 1,
                        closeBtn: 0,
                        shade: [0.7],
                        title: false,
                        area: [],
                        resize: false,
                        scrollbar: false,
                        shadeClose: false, //点击遮罩关闭
                        content: _str,
                        success: function () {
                            $('.z-layer-close').click(function () {
                                layer.close(index);
                            });
                            $('.z-layer-sure').click(function () {
                                $.ajax({
                                    type: 'POST',
                                    dataType: 'JSON',
                                    url: 'cloudResources/cloudSpace/deleteCloudSpace.do',
                                    data: {
                                        cloudSpaceIds: vm.ocloudId
                                    },
                                    success: function (data) {
                                        if (data.result) {
                                            if (!isLogonError(data)) {
                                                return;
                                            }
                                            layer.msg("<p style='text-align:center'>删除成功!</p>");
                                            vm.navClickIndex = 0; //还原点击的第一次
                                            vm.getLeftNav();
                                            layer.close(index);
                                        } else {
                                            layer.msg("<p style='text-align:center'>" + data.msg + "!</p>");
                                        }
                                    }
                                });
                            });
                            $('.z-layer-cancel').click(function () {
                                layer.close(index);
                            });
                        }
                    });

                },

                /*--播放--*/
                list_look: function (taskid, $index, type, id) {

                    if (!vm.playBol) {
                        return;
                    }

                    var layIndex, _url = '', _sendData = {}; //打开层索引

                    //使用ID查询云端资源视频，避免出现ID冲突问题  chenting 20171014
                    _url = 'commons/playVideo.do';
                    _sendData.videoId = id;
                    _sendData.type = 3;

//				if(type==1){
//					_url='commons/playVideo.do';
//					_sendData.videoId = taskid;
//					_sendData.type = 3;
//				}else if(type==2){
//					_url = 'personalResources/thirdResource/getPlayVideo.do';
//					_sendData.resourceId = taskid;
//				}
                    /*var bl= false; //定时器
				var timer= null;
				var _data1 = {},_intervalNum=1;

				timer = setInterval(function(){
					if(_intervalNum>10){
						clearInterval(timer);
					}else{
						_intervalNum++;
						if(bl){
							clearInterval(timer);
							fullScreen(); //进入全屏
							videoPlay(_data1);
						}
					}
				},300);*/


                    $.ajax({
                        type: 'POST',
                        url: _url,
                        data: _sendData,
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            if (data.result) {
                                /*bl=true;
							_data1 = data.data; */
                                /*fullScreen(); //进入全屏*/
                                data.data.id = id;
                                videoPlay(data.data);
                            } else {
                                layer.msg(data.msg);
                            }
                            vm.playBol = true;
                        },
                        error: function (data) {
                            layer.msg(data.msg);
                            vm.playBol = true;
                        },
                        beforeSend: function () {
                            vm.playBol = false;
                        },
                        dataType: 'JSON'
                    });

                    function buquanping(_this, index) {
                        $('.z-layer-box').removeClass('wh100');
                        $(_this).removeClass('icon-buquanping').addClass('icon-quanping');
                        var fontSize = parseInt($('html').css('fontSize'));
                        layer.style(index, {
                            width: fontSize * 12.06 + 'px',
                            height: fontSize * 6.8 + 'px'
                        });
                        exitFullScreen(); //退出全屏
                    }

                    function quanping(_this, index) {
                        $('.z-layer-box').addClass('wh100');
                        $(_this).removeClass('icon-quanping').addClass('icon-buquanping');
                        fullScreen(); //进入全屏
                        setTimeout(function () {
                            layer.style(index, {
                                width: $('html').width() + 'px',
                                height: $('html').height() + 'px',
                                left: 0,
                                top: 0
                            });
                        }, 100);
                    }

                    function videoPlay(data) {
                        var _os = systemType(),
                            id = data.id;
                        taskid = data.videoId,
                            _resourceName = data.videoName,
                            _resourceUrl = data.rtmppath;

                        var str = "<div class='z-layer-box wh100'>";
                        str += "<div class='layer-top clearfix'><span class='layer-title'>视频播放</span><span class='vod-name' data-flvpath='" + addVideoPath(_resourceUrl) + "'>" + _resourceName + "</span><span class='layer-topright' id='z-full-screen'><i id='canclelayer' class='fl icon iconfont icon-guanbi'></i></span></div>";
                        str += "<div class='z-video-box'><input type='button' class='setimg' value='设为封面'><div class='layer-center layer-video' id='container'></div></div>";
                        str += "</div>";

                        var jpJson = {
                            jpObj: null, //存放jsplayer实例对象
                            flvPath: addVideoPath(data.rtmppath), //视频播放地址
                            previewImg: data.framepath,//预览图
                        };

                        window.onunload = function () {
                            videoStopPlay({type: 3, resName: _resourceName, resUrl: _resourceUrl, resId: taskid});
                        };

                        /**
                         * 刷新
                         */
                        function refreshVideo() {
                            //alert(thePlayer.getDuration());
                            jpJson.previewRefeshPositon = jpJson.jpObj.getPosition();
                            jpJson.jpObj = objJwplayer(_path); //重生生成jwplayer
                        }

                        layIndex = layer.open({
                            type: 1,
                            title: false,
                            area: ['100%', '100%'],
                            resize: false,
                            scrollbar: false,
                            shadeClose: false, //点击遮罩关闭
                            closeBtn: 0,//不显示关闭按钮
                            shade: [0.7],
                            content: str,
                            success: function () {

                                jpJson.jpObj = objJwplayer(jpJson.flvPath, jpJson.previewImg);  //返回jwplayer对象

                                $('#z-full-screen').on('click', '.icon-buquanping', function () {
                                    buquanping(this, layIndex); //退出全屏
                                });

                                $('#z-full-screen').on('click', '.icon-quanping', function () {
                                    quanping(this, layIndex); //退出全屏
                                });

                                if (jpJson.jpObj) {
                                    setTimeout(function () {
                                        videoStartPlay({
                                            type: 3,
                                            resName: _resourceName,
                                            resUrl: _resourceUrl,
                                            resId: taskid
                                        }); //开始播放
                                    }, 1000);
                                }

                            },
                            end: function () {
                                buquanping($('.icon-buquanping'), layIndex); //退出全屏
                                jpJson.jpObj.remove();
                                jpJson.jpObj.stop();
                                jpJson.jpObj.pause(true);
                                videoStopPlay({type: 3, resName: _resourceName, resUrl: _resourceUrl, resId: taskid}); //结束播放
                            }
                        });
                        //设为封面点击事件
                        $('.setimg').click(function () {
                            var playingTime = parseInt(jpJson.jpObj.getPosition()),
                                _this = $(this),
                                _num = '3';

                            if (type == 2) {
                                _num = '2';
                            }

                            if (!playingTime) {
                                layer.msg('暂无法设置');
                                return;
                            }

                            if (_this.data('set')) {
                                layer.msg('设置中，请稍后重试');
                                return;
                            }

                            _this.data('set', 1);

                            $.ajax({
                                url: "personalResources/videoScreenshot/screenshot.do?t=" + new Date().getTime(),
                                data: {'taskid': '' + id, 'time': '' + playingTime, 'number': '1'},
                                dataType: 'JSON',
                                type: 'post',
                                success: function (data) {
                                	if (!isLogonError(data)) {
                                        return;
                                    }
                                    if (data.result) {
                                        layer.msg('设置成功');
                                        vm.odataList[$index].iconpath = data.data.iconpath;
                                    } else {
                                        layer.msg('设置失败');
                                    }
                                    _this.data('set', '');
                                },
                                error: function (data) {
                                    layer.msg(data.msg);
                                    _this.data('set', '');
                                }
                            });
                        });
                        $("#canclelayer").click(function () {
                            layer.close(layIndex);
                        });


                        /**
                         * 返回Jwplayer对象函数
                         */
                        function objJwplayer(_path, _previewImg) {
                            return jwplayer('container').setup({
                                flashplayer: "resources/js/controls/jwplayer/jwplayer.flash.swf",
                                file: _path,
                                width: '100%',  //屏幕可视区
                                height: '100%',
                                image: _previewImg,//视频预览图片
                                dock: false,
                                autostart: true,
                                logo: {
                                    prefix: "resources/js/controls/jwplayer",
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

                    }

                },

                //滚动加载
                fnScroll: function (event) {

                    if (!vm.scrollBol) {
                        return;
                    }

                    var _this = event.target;
                    //滚动条距离顶部的高度
                    var scrollTop = $("#ascrail2000 .nicescroll-cursors").css('top');
                    //滚动条的高度
                    var scrollHeight = $("#ascrail2000 .nicescroll-cursors").height();
                    // tab的高度
                    var h = $(_this).height();

                    if (parseInt(scrollTop) >= ((h - scrollHeight) * 0.9)) {
                        vm.pageNum += 1;
                        vm.getList(vm.pageNum);
                    }

                },

                /*获取选中父节点*/
                getpants: function () {
                    var _index;
                    this.nav_left.forEach(function (v, i) {
                        if (v.state == 1) _index = i;
                    });
                    return _index;
                },
                /*推送*/
                fnGoPush: function (event, sId) {
                    resId = sId;// 记录资源id
                    $('#stoptype').val('');
                    var _this = event.target;
                    v2vUrl = $(_this).attr('data-v2vurl');
                    var sourceName = $(_this).attr('data-sourceName');//资源名称
                    var pathImage = $(_this).attr('data-pathImage'); //缩略图
                    var duration = formatSeconds($(_this).attr('data-duration'));//视频时长 00:00:00
                    second = $(_this).attr('data-duration');//视频时长 单位为s
                    var str = "<div class='z-comm-layer-wrap'>";
                    str += "<div class='layer-box'>";
                    str += "<div class='layer-top clearfix'><span class='layer-title fl'>推送</span><span class='vod-name fl'>" + sourceName + "</span><span class='layer-topright fl'><i class='fl icon iconfont icon-shuaxin1'></i><i id='canclelayer' class='fl icon iconfont icon-guanbi'></i></span></div>";
                    str += "<div class='layer-center'><img src='" + pathImage + "' onerror='this.src=\"resources/images/mo_bg.png\"'/></div>";
                    str += "<div class='layer-bottom'>";
                    str += "<div class='input-box'><label>推送号码</label><input type='text' class='num-txt'></div>";
                    str += "<div class='control-box clearfix' ><i id='vid-suspend-play' data-bl='' class='zanting-play ifont icon iconfont icon-ttpodicon fl' title='播放' ></i><i class='vid-stop ifont icon iconfont icon-zanting1 fl' ></i><span class='when-long lefttime fl'>00:00:00</span>";
                    str += '<div id="pro-bar-box" class="pro-bar-box fl">';
                    str += '<i id="video-time-position"></i><div id="pro-bar" class="pro-bar"></div><i id="pro-btn" class="pro-btn"><i class="pro-minbtn"></i></i>';
                    str += '</div>';
                    str += "<span class='when-long righttime fl'>" + duration + "</span>";
                    str += "</div>";
                    str += "</div>";
                    str += "</div></div>";
                    layer.open({
                        type: 1,
                        title: false,
                        area: [],
                        resize: false,
                        scrollbar: false,
                        shadeClose: false, //点击遮罩关闭
                        closeBtn: 0,//不显示关闭按钮
                        shade: [0.7],
                        content: str,
                        success: function () {
                            /*$('.layer-box .layer-center > div').css('background','url('+ pathImage +') no-repeat center center'); //给盒子背景*/
                        }
                    });
                    $("#canclelayer").click(function () {
                        var deviceNum = $(".num-txt").val();
                        $('#stoptype').val('close');
                        layer.closeAll();
                        //停止播放  （断开吗？）
                        clearInterval(st);
                        $('.lefttime').text('00:00:00');
                        ls = 0;
                        if (deviceNum) {
                            clearInterval(sh);
                            DeviceContect.demandStop(v2vUrl, deviceNum, 666);
                            DeviceContect.UnConnection(0, deviceNum);
                        }
                    });

                    //进度拖拽
                    var oProBarBox = document.getElementById('pro-bar-box');
                    var oProBar = document.getElementById('pro-bar');
                    var oProBtn = document.getElementById('pro-btn');
                    var scale = 0;// 进度比例

                    //鼠标移到进度条上显示相对应的时间
                    oProBarBox.onmouseover = oProBarBox.onmousemove = function (ev) {
                        $('#video-time-position').show();
                        var disX = ev.pageX - $('#pro-bar-box').offset().left;//鼠标在进度条上的位置
                        if (disX < 0) {
                            return;
                        }
                        var videos = disX / oProBarBox.offsetWidth * second;//视频进度秒数
                        var videoTime = getT(videos);
                        $('#video-time-position').text(videoTime);
                        $('#video-time-position').css('left', (disX - ($('#video-time-position').width() / 2)) + 'px');
                    };
                    //鼠标移出进度条上隐藏相对应的时间
                    $('#pro-bar-box').mouseout(function () {
                        $('#video-time-position').text('').hide();
                    });


                    oProBtn.onmousedown = function (ev) {
                        var deviceNum = $(".num-txt").val();
                        if (!deviceNum) {
                            layer.msg('请填写推送的设备号码');
                            return;
                        }
                        if ($('#vid-suspend-play').attr("data-bl") != "false" && $('#vid-suspend-play').attr("data-bl") != "true") {
                            layer.msg('视频未播放不可以拖拽进度条');
                            return;
                        }
                        /* sh = setInterval("DeviceContect.Keepalive(0,"+deviceNum+")", 5000);//25039
			         DeviceContect.Connection(0,deviceNum,1);*/
                        /*---拖拽进度条时，要先暂停播放，拖拽完成时，在继续播放---*/
                        if ($('#vid-suspend-play').attr('data-bl') == 'false') {
                            $('#vid-suspend-play').click();
                        }
                        /*---拖拽进度条时，要先暂停播放，拖拽完成时，在继续播放---*/
                        var disX = ev.pageX - oProBtn.offsetLeft;
                        document.onmousemove = function (ev) {
                            var l = ev.pageX - disX;
                            if (l < 0) {
                                l = 0;
                            } else if (l > oProBarBox.offsetWidth - oProBtn.offsetWidth) {
                                l = oProBarBox.offsetWidth - oProBtn.offsetWidth;
                            }
                            oProBtn.style.left = l + 'px';

                            scale = l / (oProBarBox.offsetWidth - oProBtn.offsetWidth);
                            oProBar.style.width = scale * 100 + '%';

                            //当前时间=比例*总时间
                            /*console.log(scale*duration);*/
                            //DeviceContect.demandFixedSpeed('v2vurl":"vod://25032/555',25039,120);
                        };
                        document.onmouseup = function () {
                            document.onmousemove = null;
                            document.onmouseup = null;
                            ls = second * scale;
                            var leftTime = getT(ls);
                            $('.lefttime').text(leftTime);//左侧时间记录
                            DeviceContect.demandFixedSpeed(v2vUrl, deviceNum, Math.floor(ls));
                            /*--------拖拽进度条bug修改---------*/
                            //点击继续播放
                            $('#vid-suspend-play').removeClass('icon-ttpodicon').addClass('icon-zanting');
                            //$this.attr('class','vid-suspend');
                            $('#vid-suspend-play').attr('data-bl', 'false');
                            $('#vid-suspend-play').attr('title', '暂停');
                            //先清除心跳定时器
                            clearInterval(sh);
                            //打开心跳定时器
                            sh = setInterval("DeviceContect.Keepalive(0," + deviceNum + ")", 5000);//25039
                            barMove();//开启进度条走动
                            /*-------拖拽进度条bug修改----------*/
                            //判断服务器是否有回应
                            clearTimeout(setTimeRequestIsAborted);
                            setTimeRequestIsAborted = setTimeout(function () {
                                layer.msg('请求无响应');
                                //$('.vid-top').click();
                                //恢复进度条默认状态
                                fnReturnInitial();
                            }, 3000);
                        };
                        return false;
                    };

                    //点击停止 vid-suspend
                    $('.vid-stop').click(function () {
                        /*//恢复进度条默认状态
					fnReturnInitial();*/
                        //停止播放  （断开吗？）
                        DeviceContect.demandStop(v2vUrl, $(".num-txt").val(), 666);
                        //DeviceContect.UnConnection(0,deviceNum);
                    });

                    //点击 开始播放 暂停 继续播放
                    $('#vid-suspend-play').click(function () {

                        if (!$(".num-txt").val()) {
                            layer.msg('请填写推送的设备号码');
                            return;
                        }
                        clearTimeout(setTimeRequestIsAborted);
                        setTimeRequestIsAborted = setTimeout(function () {
                            layer.msg('请求无响应');
                            //清除loading定时器和关闭load弹出层
                            clearTimeout(loadSetTime);
                            if (loadIndex != -1) {
                                layer.close(loadIndex);
                            }
                            //$('.vid-top').click();
                            //恢复进度条默认状态
                            fnReturnInitial();
                        }, 5000);
                        startPlay();

                    });

                    /*  //加音量 volumeSet
			    $('.voice-seduce').click(function(){
			    	DeviceContect.volumeSet('v2vUrl?','boxNum');
			    });
			    //减音量
			    $('.voice-add').click(function(){
			    	DeviceContect.volumeSet('v2vUrl?','boxNum');
			    });*/

                    //输入推送设备号码
                    $(".num-txt").keyup(function () {
                        var $this = $(this);
                        if ($this.val().length > 5) {
                            $this.val($this.val().substr(0, 5));
                        }
                        ;
                        $this.val($this.val().replace(/[^\d]/g, ''));
                    });

                    //点击弹出层关闭按钮
                    $(".canclelayer").click(function () {
                        var deviceNum = $(".num-txt").val();
                        $('#stoptype').val('close');
                        layer.closeAll();
                        //停止播放  （断开吗？）
                        clearInterval(st);
                        $('.lefttime').text('00:00:00');
                        ls = 0;
                        if (deviceNum) {
                            clearInterval(sh);
                            DeviceContect.demandStop(v2vUrl, deviceNum, 666);
                            DeviceContect.UnConnection(0, deviceNum);
                            if (!onePlay) {
                                videoStopPlay({type: 4, resName: $('.vod-name').text(), resUrl: v2vUrl, resId: resId}); //开始播放
                            }
                        }

                    });

                },
                fnVideoPlay: function () {
                    var str = "<div class='layer-box'>";
                    str += "<div class='layer-top clearfix'><span class='layer-title fl'>推送</span><span class='vod-name fl'>测试视频007</span><span class='layer-topright fl'><i class='fl icon iconfont icon-shuaxin'></i><i id='canclelayer' class='fl icon iconfont icon-guanbi'></i></span></div>";
                    str += "<div class='layer-center layer-video'></div>";
                    str += "</div>";
                    var layIndex = layer.open({
                        type: 1,
                        title: false,
                        area: ['13rem', '7.14rem'],
                        resize: false,
                        scrollbar: false,
                        shadeClose: false, //点击遮罩关闭
                        closeBtn: 0,//不显示关闭按钮
                        shade: [0.7],
                        content: str,
                    });
                    $("#canclelayer").click(function () {
                        layer.close(layIndex);
                    });

                },
                //推送新需求
                fnGoPushNew: function (item) {
                    var _this = this;
                    var _str = "<div class='z-comm-layer-wrap tuisong'>";
                    _str += '<div class="z-comm-layer-box z-delete">';
                    _str += "<div class='layer-top clearfix'><span class='layer-title'>推送</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                    _str += '<div class="z-comm-layer-delete-box">';
                    _str += '<p><div class="input-box"><label>推送号码:</label><input type="text" class="num-txt"></div></p>';

                    _str += '<div class="btn-box">\
									<button class="z-layer-sure">确定</button>\
									<button class="z-layer-cancel">取消</button>\
								</div></div>';
                    _str += '</div></div>';

                    var index = layer.open({
                        type: 1,
                        closeBtn: 0,
                        shade: [0.7],
                        title: false,
                        area: [],
                        resize: false,
                        scrollbar: false,
                        shadeClose: false, //点击遮罩关闭
                        content: _str,
                        success: function () {
                            $('.tuisong .z-layer-close,.tuisong .z-layer-cancel').off('click').on('click', function () {
                                layer.close(index);
                            });

                            $('.tuisong .z-layer-sure').off('click').on('click', function () {
                                var numTxt = $('.num-txt').val().trim();

                                if (numTxt == '') {
                                    layer.msg('请输入终端号');
                                    return;
                                } else if (numTxt == 0) {
                                    layer.msg('终端号不能为0');
                                    return;
                                } else if (!parseInt(numTxt)) {
                                    layer.msg('终端号只能为数字');
                                    return;
                                } else if (parseInt(numTxt) != parseFloat(numTxt)) {
                                    layer.msg('终端号只能为1-65535之间整数');
                                    return;
                                } else if (numTxt < 0 || numTxt > 65535) {
                                    layer.msg('终端号只能为1-65535之间整数');
                                    return;
                                }

                                var _load = layer.load();
                                $.ajax({
                                    url: 'commons/getRtmpProxyPath.do',
                                    data: {"v2vnum": numTxt, 'id': item.id},
                                    type: 'post',
                                    dataType: 'json',
                                    success: function (data) {
                                        if (!isLogonError(data)) {
                                            return;
                                        }
                                        if (data.result) {
                                            var videoUrl = data.msg;
                                            _this.fnPushPlay(item, numTxt, videoUrl);
                                            layer.close(_load);//关闭loding
                                        } else {
                                            layer.msg(data.msg);
                                            layer.close(_load);//关闭loding
                                        }
                                    },
                                });
                            });
                        }
                    });
                },
                /*
                  * 资源推送播放
                  * */
                fnPushPlay: function (item, terminalNum, videoUrl) {
                    //var __url = "rtmp://192.168.10.25:8190/vod/flv:flv:2017-10-16/录播测试20171016154818-4b78016e-9e9d-4394-bdf9-40cf96120502.flv";
                    var _this = this, _index = 0, _index2 = 0, _resourceName = item.sourceName || item.capturename;

                    var timer = null;
                    setTimeout(function () {
                        timer = setInterval(function () {
                            getStatus(terminalNum);
                        }, 2000);
                    }, 1000);

                    var str = "<div class='z-layer-box wh100'>";
                    str += "<div class='layer-top clearfix'><span class='layer-title'>视频点播终端号码：" + terminalNum + "</span><span class='vod-name' data-flvpath='" + videoUrl + "'>" + _resourceName + "</span><span class='layer-topright' id='z-full-screen'><i id='canclelayer' class='fl icon iconfont icon-guanbi'></i></span></div>";
                    str += "<div class='z-video-box'><div class='layer-center layer-video' id='container'></div></div>";
                    str += "</div>";

                    var jpJson = {
                        jpObj: null, //存放jsplayer实例对象
                        flvPath: videoUrl, //视频播放地址
                        previewImg: item.framepath,//预览图
                    };

                    window.onunload = function () {
                        stopRTMP(terminalNum);
                        clearInterval(timer); //清除定时请求
                    };

                    _index = layer.open({
                        type: 1,
                        title: false,
                        area: ['100%', '100%'],
                        resize: false,
                        scrollbar: false,
                        shadeClose: false, //点击遮罩关闭
                        closeBtn: 0,//不显示关闭按钮
                        shade: [0.7],
                        content: str,
                        success: function () {
                            jpJson.jpObj = objJwplayer(jpJson.flvPath, jpJson.previewImg);  //返回jwplayer对象
                        },
                        end: function () {
                            jpJson.jpObj.remove();
                            jpJson.jpObj.stop();
                            stopRTMP(terminalNum);
                            clearInterval(timer); //清除定时请求
                        }
                    });

                    $("#canclelayer").click(function () {
                        layer.close(_index);
                    });

                    /**
                     * 返回Jwplayer对象函数
                     */
                    function objJwplayer(_path, _previewImg) {
                        return jwplayer('container').setup({
                            flashplayer: "resources/js/controls/jwplayer/jwplayer.flash.swf",
                            file: _path,
                            width: '100%',  //屏幕可视区
                            height: '100%',
                            image: _previewImg,//视频预览图片
                            dock: false,
                            autostart: true,
                            logo: {
                                prefix: "resources/js/controls/jwplayer",
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

                    //获取点播服务器状态
                    function getStatus(terminalNum) {
                        $.ajax({
                            type: 'POST',
                            url: 'commons/QueryRTMPStatus.do',
                            timeout: 5000,//超时时间5秒
                            data: {
                                v2vnum: terminalNum
                            },
                            success: function (data) {
                                if (!isLogonError(data)) {
                                    return;
                                }
                                if (!data.result) {
                                    confrimClose(data.msg ? data.msg : '与点播服务器的心跳异常');
                                }
                                if (data.msg) {//输出点播服务器当前状态
                                    console.log("QueryRTMPStatus-----" + data.msg);
                                }
                            },
                            error: function (XMLHttpRequest, status) {
                                confrimClose('与点播服务器的心跳异常');
                            },
                            dataType: 'JSON'
                        })
                    }

                    function confrimClose(data) {
                        clearInterval(timer); //清除定时请求
                        layer.close(_index2);
                        var _str = "<div class='z-comm-layer-wrap status-confrim'>";
                        _str += '<div class="z-comm-layer-box z-delete">';
                        _str += "<div class='layer-top clearfix'><span class='layer-title'>温馨提醒</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                        _str += '<div class="z-comm-layer-delete-box">';
                        _str += '<p>错误：' + data + '，您要关闭播放吗？</p>';
                        _str += '<div class="btn-box">\
                                        <button class="z-layer-sure">确定</button>\
                                        <button class="z-layer-cancel">取消</button>\
                                    </div></div>';
                        _str += '</div></div>';
                        _index2 = layer.open({
                            type: 1,
                            title: false,
                            area: [],
                            resize: false,
                            scrollbar: false,
                            shadeClose: false, //点击遮罩关闭
                            closeBtn: 0,//不显示关闭按钮
                            shade: [0.7],
                            content: _str,
                            success: function () {
                                $('.status-confrim .z-layer-sure').off('click').on('click', function () {
                                    layer.close(_index2);
                                    layer.close(_index);
                                });
                                $('.status-confrim .z-layer-cancel,.status-confrim .z-layer-close').off('click').on('click', function () {
                                    layer.close(_index2);
                                });
                            },
                            end: function () {
                            }
                        });
                    }
                }
            }
    });
    /**空间成员状态过滤**/
    Vue.filter('state-filter', function (value) {
        var text;
        if (!value) {
            text = "";
        }
        switch (value) {
            case 0:
                text = "离线";
                break;
            case 1:
                text = "在线";
                break;
            case 2:
                text = "禁用";
                break;
        }
        ;
        return text;
    });
    Vue.filter('cloudState-filter', function (value) {
        var text;
        if (!value) {
            text = "";
        }
        switch (value) {
            case 0:
                text = "普通成员";
                break;
            case 1:
                text = "空间管理";
                break;
            case 2:
                text = "空间创建者";
                break;
        }
        ;
        return text;
    });
    //自定义滚动条
    setNiceScroll([$('.content-list-tbody'), $('.comm-nav-list')]);
});

/*
 * 恢复到播放默认状态
 * */
function fnReturnInitial() {
    //var oProBarBox = document.getElementById('pro-bar-box');
    var oProBar = document.getElementById('pro-bar');
    var oProBtn = document.getElementById('pro-btn');
    //设备号码input 把只读关掉
    $('.num-txt').css({'color': ''});
    $('.num-txt').removeAttr("readonly");
    var deviceNum = $(".num-txt").val();
    clearInterval(st);
    $('.lefttime').text('00:00:00');//左边世间设为初始值
    ls = 0;
    oProBtn.style.left = 0 + 'px';// 小球的位移
    oProBar.style.width = 0 + '%';//进度条的宽
    $('#vid-suspend-play').attr('data-bl', '');
    $('#vid-suspend-play').removeClass('icon-zanting').addClass('icon-ttpodicon');
}

/*
 * 点击播放暂停按钮逻辑处理
 * ls是进度条走的秒数
 * second是视频总秒数
 * */
function startPlay() {
    clearTimeout(loadSetTime);
    loadSetTime = setTimeout(function () {
        //一秒后没响应弹出load窗，在一秒之前有响应 了清除定时器也就不弹 出来了
        loadIndex = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
    }, 700);

    //设备号码input 设置为只读
    $('.num-txt').css({'color': '#cecece'});//cursor: not-allowed;
    $('.num-txt').attr('readonly', 'readonly');

    var deviceNum = $(".num-txt").val();
    var $this = $('#vid-suspend-play');//播放按钮 $(this);
    var bl = $this.attr('data-bl');

    if (bl == "false") {
        //点击暂停
        /*//清除定时器停止进度条
		clearInterval(st);*/
        $this.removeClass('icon-zanting').addClass('icon-ttpodicon');
        //$this.attr('class','vid-play');
        $this.attr('data-bl', 'true');
        $this.attr('title', '播放');
        /*点击暂停 suspend*/
        DeviceContect.demandParse(v2vUrl, deviceNum);
    } else if (bl == "true") {
        //点击继续播放
        $this.removeClass('icon-ttpodicon').addClass('icon-zanting');
        //$this.attr('class','vid-suspend');
        $this.attr('data-bl', 'false');
        $this.attr('title', '暂停');
        //先清除心跳定时器
        clearInterval(sh);
        //打开心跳定时器
        sh = setInterval("DeviceContect.Keepalive(0," + deviceNum + ")", 5000);//25039
        DeviceContect.demandContinue(v2vUrl, deviceNum);
        //播放成功后要在监听那做启动定时器
    } else {
        //第一次点击播放
        $this.removeClass('icon-ttpodicon').addClass('icon-zanting');
        //$this.attr('class','vid-suspend');
        $this.attr('data-bl', 'false');
        $this.attr('title', '暂停');
        //点击播放 链接服务
        DeviceContect.Connection(0, deviceNum, 1);
        //先清除心跳定时器
        clearInterval(sh);
        //打开心跳定时器
        sh = setInterval("DeviceContect.Keepalive(0," + deviceNum + ")", 5000);//25039
        //隔一秒发送播放命令
        var seplay = setTimeout(function () {
            clearTimeout(seplay);
            //发送播放命令
            DeviceContect.demandPlay(v2vUrl, deviceNum, 666);
        }, 1000);
    }

}

var onePlay = true;//记录首次播放
var resId = 0;//记录推送资源ID
function DoMessage(jsondata) {
    ///console.log(jsondata);
    //清除loading定时器和关闭load弹出层
    clearTimeout(loadSetTime);
    if (loadIndex != -1) {
        layer.close(loadIndex);
    }
    if (jsondata.Order == "ConnectionRsq") {
        switch (jsondata.ErrorCode) {
            case 0:
                clearInterval(sh);
                //$('.vid-top').click();
                //恢复进度条默认状态
                fnReturnInitial();
                layer.msg("终端拒绝使用pc控制！");

            case 1:
                console.log('播放成功--返回的');
                if (onePlay) {
                    onePlay = false;
                    videoStartPlay({type: 4, resName: $('.vod-name').text(), resUrl: v2vUrl, resId: resId}); //开始播放
                }
                break;
            default:
                clearInterval(sh);
                //$('.vid-top').click();
                //恢复进度条默认状态
                fnReturnInitial();
                layer.msg("终端连接超时");
                break;
        }
    }
    else if (jsondata.Order == "RsqPlayDemandOnVideo") {
        //播放成功
        if (jsondata.ErrorCode == 0) {
            ///console.log('播放成功-返回的');
            $('#vid-suspend-play').removeClass('icon-ttpodicon').addClass('icon-zanting');
            $('#vid-suspend-play').attr('data-bl', 'false');
            $('#vid-suspend-play').attr('title', '暂停');
            barMove();
        } else if (jsondata.ErrorCode == 5) {

        }
        else {
            //$('.vid-top').click();
            //恢复进度条默认状态
            fnReturnInitial();
            layer.msg(jsondata.Message);
        }
    }
    else if (jsondata.Order == "RsqStopDemandOnVideo") {//停止播放

        //成功
        if (jsondata.ErrorCode == 0) {
            //终端停止的时候才执行这 pc端点击关闭弹窗时，不用设置恢复进度条默认状态
            if ($('#stoptype').val() != "close") {
                //恢复进度条默认状态
                fnReturnInitial();
            }

            ///console.log('停止成功-返回的');
        } else if (jsondata.ErrorCode == 5) {

        } else {
            //$('.vid-top').click();
            //恢复进度条默认状态
            fnReturnInitial();
            layer.msg(jsondata.Message);
        }

        $('#stoptype').val('');
    }
    else if (jsondata.Order == "RsqPauseDemandOnVideo") {//暂停播放

        //成功
        if (jsondata.ErrorCode == 0) {
            //清除定时器停止进度条
            clearInterval(st);
            $('#vid-suspend-play').removeClass('icon-zanting').addClass('icon-ttpodicon');
            $('#vid-suspend-play').attr('data-bl', 'true');
            $('#vid-suspend-play').attr('title', '播放');
            ///console.log("暂停成功-返回的");
            // $('.vid-top').click();
        } else if (jsondata.ErrorCode == 5) {

        } else {
            //$('.vid-top').click();
            //恢复进度条默认状态
            fnReturnInitial();
            layer.msg(jsondata.Message);
        }


    }
    else if (jsondata.Order == "RsqContinuePlayDemandOnVideo") {//继续播放

        //播放成功
        if (jsondata.ErrorCode == 0) {
            console.log("继续播放成功-返回的");
            $('#vid-suspend-play').removeClass('icon-ttpodicon').addClass('icon-zanting');
            $('#vid-suspend-play').attr('data-bl', 'false');
            $('#vid-suspend-play').attr('title', '暂停');
            barMove();
            /*console.log("停止成功2-返回的");*/

        } else if (jsondata.ErrorCode == 5) {

        } else {
            //$('.vid-top').click();
            //恢复进度条默认状态
            fnReturnInitial();
            layer.msg(jsondata.Message);
        }
    }
    else if (jsondata.Order == "RsqGetSeekTimeDemandOnVideo") {

        //播放成功
        if (jsondata.ErrorCode == 0) {
            //jsondata.DataValue获取当前播放的时间
        } else if (jsondata.ErrorCode == 5) {

        } else {
            //$('.vid-top').click();
            //恢复进度条默认状态
            fnReturnInitial();
            layer.msg(jsondata.Message);
        }
    }
    else if (jsondata.Order == "RsqSeekFixedDemandOnVideo") {
        ///console.log('定点播放成功-返回的');
    }

}

/*
 * 开启定时器进度条开始移动
 * */
function barMove() {
    var oProBarBox = document.getElementById('pro-bar-box');
    var oProBar = document.getElementById('pro-bar');
    var oProBtn = document.getElementById('pro-btn');
    st = setInterval(function () {
        if ((second - ls) > 1) {//ls<second  提前一秒停止
            ls += 1;
            var leftTime = getT(ls);
            $('.lefttime').text(leftTime);
            oProBtn.style.left = (oProBarBox.offsetWidth - oProBtn.offsetWidth) / second * ls + 'px';// 小球的位移
            oProBar.style.width = ls / second * 100 + '%';//进度条的宽
        } else {
            clearInterval(st);
            //断开 从新播放
            $('.vid-top').click();

        }
    }, 1000);

}


function arrSort(property) {//数组通过某一属性排序
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    };
}

/**来源过滤器**/
Vue.filter('from-filter', function (value) {
    var text;
    if (!value) {
        text = "";
    }
    switch (value) {
        case 1:
            text = "录制文件";
            break;
        case 2:
            text = "导入文件";
            break;
        default:
            text = "未知来源";
            return;
    }
    ;
    return text;
});

//停止点播
function stopRTMP(terminalNum) {
    $.ajax({
        type: 'POST',
        url: 'commons/stopRTMPConnection.do',
        data: {
            v2vnum: terminalNum
        },
        success: function (data) {
            //layer.msg(data.msg);
            if (!isLogonError(data)) {
                return;
            }
            console.log("stopRTMP-----" + data.msg);
        },
        error: function () {
            console.log('stopRTMP-----停止点播服务出错');
        },
        dataType: 'JSON'
    })
}



