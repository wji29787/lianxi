/*媒体文件*/
;$(function () {
    $(".personal-page").addClass("active");//给头部导航增加选中状态

    var vm = new Vue({
        el: '#personalResources',
        mounted: function () {
            var _this = this;
            _this.getList();
            _this.refreshList();
        },
        data: {
            odataList: "",
            sIsShow: true, /*标记批量操作显隐*/
            searchWord: "",
            pageNum: 1,
            isSelectAll: 0,//全选标记
            deleteData: [],
            deleteArray: "",//删除用户ID数组
            pageSize: 10,
            checkNum: 0,
            checkAllNum: 0,
            upData: {
                name: '',
                speaker: '',
                joinNum: '',
                remark: ''
            },
            detailBol: true,
            scrollBol: true,
            bScrollNo: true, //禁止请求
            playBol: true,
            timeSort: true,
            refreshTimer: null,
            refreshTime: 60000 //刷新时间默认为1分钟
        },
        watch: {
            searchWord: function (value) {
                this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g, '');
                /*去前空格和敏感字符*/
            },
        },
        methods:
            {
                refreshList: function () { //刷新数据动态改变值
                    var _this = this;
                    if (_this.refreshTimer) {
                        clearInterval(_this.refreshTimer);
                    }

                    _this.refreshTimer = setInterval(function () {
                        _this.getList();
                    }, _this.refreshTime);
                },
                getList: function (pageNum, type) {
                    var _this = this;
                    _this.scrollBol = false;

                    if (type == 'timeSort') {
                        _this.timeSort = !_this.timeSort;
                    }

                    if (!pageNum) {//搜索或加载
                        _this.bScrollNo = true;
                    }

                    if (!_this.bScrollNo) {
                        return;
                    }

                    $.ajax({
                        url: "personalResources/thirdResource/getList.do",
                        type: "POST",
                        data: {
                            "searchWord": formatStringInSubmit(_this.searchWord),
                            "pageNum": pageNum ? pageNum : 1,
                            'createSort': _this.timeSort ? 'desc' : 'asc'
                        },
                        dataType: "json",
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            var result = data.result;
                            setTimeout(function () {
                                _this.scrollBol = true;
                            }, 350);
                            /*console.log(data.list.list);*/
                            if (result) {
                                /**查询成功**/
                                if (_this.odataList) {
                                    if (!pageNum) { //不存在时是因为搜索
                                        if (data.list.list) {//搜索时重新赋值
                                            _this.odataList = data.list.list;
                                            $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                        } else {
                                            _this.odataList = [];
                                        }
                                        fnSetInterval(_this.odataList); //动态更新定时器函数
                                    } else {
                                        _this.odataList = _this.odataList.concat(data.list.list); //存在时追加
                                    }

                                    _this.isSelectAll = 0;
                                } else {
                                    _this.odataList = data.list.list; //页面加载时数据赋值
                                    $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                    fnSetInterval(_this.odataList); //动态更新定时器函数
                                }

                                if (data.list.isLastPage) {
                                    _this.bScrollNo = false;
                                }
                                _this.checkAllNum = _this.odataList.length; //每次请求数据时改变最大值

                                //动态更新定时器函数
                                function fnSetInterval(_arr) { //传过来数组
                                    if (_arr.length) { //如果数组有值才做判断
                                        var _refreshBol = false; //判断是否存在转码中任务
                                        for (var i = 0, _len = _arr.length; i < _len; i++) {
                                            if (_arr[i].resourceState == 0 || _arr[i].resourceState == 1) {
                                                _refreshBol = true;
                                                break;
                                            }
                                        }

                                        if (_refreshBol) {
                                            _this.refreshTime = 10000;

                                        } else {
                                            _this.refreshTime = 60000;
                                        }
                                        _this.refreshList();
                                    }
                                }

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

                /*num:标记是点击的取消还是点击的批量删除*/
                checkBatchOperation: function (num) {
                    if (num == "1") {
                        vm.sIsShow = false;//隐藏批量操作按钮,展示确定取消按钮
                    } else if (num == "2") {
                        vm.sIsShow = true;//展示批量操作按钮,隐藏确定取消按钮
                        vm.pageNum = 1;
                        vm.getList();
                        /**
                         * 点击取消跟全部选操作相同
                         */
                        vm.isSelectAll = 0; //改为未全选
                        vm.checkNum = 0; //把当前勾选的数量改为0
                        vm.deleteData.length = 0;//清空删除数组
                        for (var i = 0, _len = vm.odataList.length; i < _len; i++) {
                            vm.odataList[i].isSelected = 0; //自定义属性控制页面的单选的显示状态
                        }
                    } else if (num == "3") {//点击确认删除
                        if (vm.deleteData.length) {//判断是否有数据
                            vm.delete_data(vm.deleteData);
                        } else {
                            layer.msg("<p style='text-align:center'>请选择要删除的数据!</p>");
                        }
                    }

                }, /*删除*/
                /**
                 * _data为要删除的数据,为[{}]格式
                 */
                delete_data: function (_data) {
                    var _str = "<div class='z-comm-layer-wrap'>";
                    _str += '<div class="z-comm-layer-box z-delete">';
                    _str += "<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                    _str += '<div class="z-comm-layer-delete-box">\
							<p>您确定要删除吗？</p>\
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
                            })
                            $('.z-layer-sure').click(function () {
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                                vm.deleteData = _data;
                                del(_data);
                            })
                            $('.z-layer-cancel').click(function () {
                                layer.close(index);
                            })
                        }
                    });

                    function del(_data) {
                        var _taskId = '', //存要删除的ID
                            _taskIndex = [],
                            _this = vm; //存要删除的索引

                        for (var i = 0, _len = _data.length; i < _len; i++) { //数据转换
                            if (i == _len - 1) {
                                _taskId += _data[i].resourceId;
                            } else {
                                _taskId += _data[i].resourceId + ',';
                            }
                            _taskIndex.push(_data[i].index);
                        }

                        $.post(
                            'personalResources/thirdResource/deleteThirdResource.do',
                            {resourceIds: _taskId},
                            function (data) {
                                if (!isLogonError(data)) {
                                    return;
                                }
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
                                    layer.msg("<p style='text-align:center'>删除成功!</p>");
                                } else {
                                    layer.msg("<p style='text-align:center'>"+data.msg+"</p>");
                                }
                            },
                            'json');
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
                            if (_this.odataList[i].resourceState != 1) {
                                _this.odataList[i].isSelected = 1; //自定义属性控制页面的单选的显示状态
                                _this.deleteData.push({"resourceId": _this.odataList[i].resourceId, "index": i});//删除数组
                            } else {
                                //转码中的不计算在选中中的
                                _this.checkNum -= 1;
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
                    var _this = this;
                    _this.deleteArray = "",
                        _bol = false,
                        _i = -1;

                    _this.odataList[$index].isSelected ? _this.odataList[$index].isSelected = 0 : _this.odataList[$index].isSelected = 1; //选中改变

                    if (_this.deleteData.length) {
                        for (var i = 0, _len = _this.deleteData.length; i < _len; i++) {
                            if (_this.deleteData[i].index == $index) {//判断是否已存在
                                _bol = true;
                                _i = i;
                                break;
                            }
                        }

                        if (_bol) {
                            _this.deleteData.splice(_i, 1);
                        } else {
                            _this.deleteData.push({"resourceId": _this.odataList[$index].resourceId, "index": $index});
                        }

                    } else {
                        _this.deleteData.push({"resourceId": _this.odataList[$index].resourceId, "index": $index});
                    }

                    _this.deleteData.sort(arrSort('index')); //数组进行排序
                    _this.checkNum = _this.deleteData.length; //记录勾选的数量

                    if (_this.checkNum == _this.odataList.length) { //判断是否全选
                        _this.isSelectAll = 1;
                    } else {
                        _this.isSelectAll = 0;
                    }
                },
                /*--视频播放--*/
                list_look: function (taskid, $index) {

                    if (!vm.playBol) {
                        return;
                    }

                    var layIndex; //打开层索引

                    $.ajax({
                        type: 'POST',
                        //url: 'personalResources/thirdResource/getThirdResource.do',
                        url: 'commons/playVideo.do',
                        data: {videoId: taskid, type: 4},
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            if (data.result) {
                                bl = true;
                                /*_data1 = data.data;*/
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


                    function videoPlay(data) {
                        var _os = systemType(),
                            taskid = data.videoId;//data.videoId,
                        _resourceName = data.videoName;//data.videoName,
                        _resourceUrl = addVideoPath(data.rtmppath);

                        var str = "<div class='z-layer-box wh100'>";
                        str += "<div class='layer-top clearfix'><span class='layer-title'>视频播放</span><span class='vod-name' data-flvpath='" + _resourceUrl + "'>" + _resourceName + "</span><span class='layer-topright' id='z-full-screen'><i id='canclelayer' class='fl icon iconfont icon-guanbi'></i></span></div>";
                        str += "<div class='z-video-box'><input type='button' class='setimg' value='设为封面'><div class='layer-center layer-video' id='container'></div></div>";
                        str += "</div>";

                        var jpJson = {
                            jpObj: null, //存放jsplayer实例对象
                            flvPath: _resourceUrl, //视频播放地址
                            previewImg: data.framepath,//data.framepath,//预览图
                        };

                        window.onunload = function () {
                            videoStopPlay({type: 2, resName: _resourceName, resUrl: _resourceUrl, resId: taskid});
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

                                if (jpJson.jpObj) {
                                    setTimeout(function () {
                                        videoStartPlay({
                                            type: 1,
                                            resName: _resourceName,
                                            resUrl: _resourceUrl,
                                            resId: taskid
                                        }); //开始播放
                                    }, 1000);
                                }

                            },
                            end: function () {
                                jpJson.jpObj.remove();
                                jpJson.jpObj.stop();
                                jpJson.jpObj.pause(true);
                                videoStopPlay({type: 2, resName: _resourceName, resUrl: _resourceUrl, resId: taskid}); //结束播放
                            }
                        });
                        //设为封面点击事件
                        $('.setimg').click(function () {
                            var playingTime = parseInt(jpJson.jpObj.getPosition()),
                                _this = $(this);

                            if (!playingTime) {
                                layer.msg('暂无法设置');
                                return;
                            }

                            if (_this.data('set')) {
                                layer.msg('设置中，请稍后重试');
                                return;
                            }

                            $.ajax({
                                url: "personalResources/videoScreenshot/screenshot.do?t=" + new Date().getTime(),
                                data: {'taskid': '' + taskid, 'time': '' + playingTime, 'number': '2'},
                                dataType: 'JSON',
                                type: 'post',
                                success: function (data) {
                                	if (!isLogonError(data)) {
                                        return;
                                    }
                                    if (data.result) {
                                        layer.msg('设置成功');
                                        vm.odataList[$index].iconPath = data.data.iconpath;
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
                /*---编辑详情---*/
                list_edit: function (_id, _index) {
                    if (!vm.detailBol) {
                        return;
                    }
                    $.ajax({
                        type: "POST",//通常会用到两种：GET,POST。默认是：GET
                        url: 'personalResources/thirdResource/getThirdResource.do',//"personalResources/recordingTask/getByIdList.do",//(默认: 当前页地址) 发送请求的地址
                        dataType: "JSON",//预期服务器返回的数据类型。
                        data: {
                            resourceId: _id
                        },
                        beforeSend: function () { //请求前
                            vm.detailBol = false;
                        },
                        success: function (data) {
                            if (!isLogonError(data)) {
                                return;
                            }
                            vm.detailBol = true;
                            if (data.result) {
                                openLayer(data.data ? data.data : {}, _id, _index);
                            }

                        }, //请求成功
                        error: function () {
                            vm.detailBol = true;
                        }
                    })

                    /*openLayer(vm.odataList[_index],_id,_index);*/

                    function openLayer(_data, _id, _index1) {

                        var _index = layer.open({
                            type: 1,
                            title: false,
                            scrollbar: false,
                            area: [],
                            resize: false,
                            closeBtn: 0,
                            shade: [0.7],
                            content: dom_list(_data),
                            btn: false,
                            success: function () {

                                $(".layer-right>.btn").click(function () {
                                    vm.saveData(_id, _index1);
                                });

                                /*绑定展开折叠事件*/
                                $("._child").click(function () {
                                    var that = $(this);
                                    if (that.attr('data-stae') == '1') {
                                        that.attr('data-stae', '0');
                                        that.find('dl').css({'display': 'none'})
                                    } else {
                                        that.attr('data-stae', '1');
                                        that.find('dl').css({'display': 'block'})
                                    }
                                    return false;
                                });

                                /*阻止事件传递*/
                                $("._child>ul>li").click(function () {
                                    return false;
                                })

                                $('.z-layer-close').click(function () {
                                    layer.close(_index);
                                })

                                $('#z-joinNum').bind('input propertychange', function () {
                                    var _this = $(this);
                                    _this.val(_this.val().replace(/\D/g, ''))
                                });

                            }
                        });
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
                uploadVideoLayer: function () {
                    var _str = '<div class="zlayer-wrap" style="display:block;">' +
                        '<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">上传视频</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
                        '<div class="upload-video">' +
                        '<div class="upload-item">\
                            <label for="file_name">文件名称</label>\
                            <input id="file_name" class="file-name" type="text" placeholder="请输入要上传的文件名称" maxlength=50>\
                        </div>\
                        <div class="upload-item">\
                            <label for="file_msg">文件描述</label>\
                            <textarea id="file_msg" class="file-msg" placeholder="请对要上传的转码资源进行详细描述"></textarea>\
                        </div>\
                        <div class="upload-item">\
                         <div class="upload-upload">\
                             <label>上传资源</label>\
                             <span id="upload_btn" class="upload-btn"><i class="iconfont icon-lookIcon"></i>浏览</span>\
                         </div>\
                         <p class="upload-txt">暂无选择文件</p>\
                         <p class="upload-mark">注：本地上传文件资源大小不得超过3G</p>\
                        </div>\
                        <div class="upload-op"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button></div>\
                        </div></div></div>';

                    var _index = layer.open({
                        type: 1,
                        closeBtn: 0,
                        shade: [0.7],
                        title: false,
                        area: [],
                        resize: false,
                        content: _str,
                        success: function () {
                            var obj = null;
                            var uploader = WebUploader.create({

                                // 文件接收服务端。
                                server: 'file/fileUpload/web.do',

                                // 选择文件的按钮。可选。
                                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                                pick: '#upload_btn',

                                //验证单个文件超过多少不进行队列
                                fileSingleSizeLimit: 3221225472,
                                // 只允许选择视频文件。
                                accept: {
                                    title: 'video',
                                    //extensions: 'mp4,avi,3gp,rmvb,wmv,mkv,rm,mov,flv,ts',
                                    extensions: 'mp4,avi,flv,ts',
                                    mimeTypes: '*'
                                },
                                formData: {
                                    resourceName: '',
                                    description: ''
                                },
                                method: 'POST'
                            });

                            $('.sham-btn-default,.zlayer-close').click(function () {
                                layer.close(_index);
                            })

                            //上传操作
                            $('.sham-btn-sure').click(function () {
                                var _name = $.trim($('#file_name').val()),
                                    _msg = $.trim($('#file_msg').val());

                                if (!_name) {
                                    layer.msg('请输入文件名称');
                                    return;
                                }

                                if (!obj) {
                                    layer.msg('请选择文件');
                                    return;
                                } else {

                                    if (getVideoType(obj.ext)) {

                                    } else {
                                        layer.msg('请选择正确的视频格式');
                                        return;
                                    }

                                    if (obj.size > 3221225472) {
                                        layer.msg('视频文件大小超出范围，最大支持3g');
                                        return;
                                    }
                                }
                                
                                $.ajax({
                                	type:'POST',
                                	url:'file/checkThirdVideoName.do',
                                	data:{
                                		resourceName:_name
                                	},
                                	success:function(data){
                                		if (!isLogonError(data)) {
                                            return;
                                        }
                                	
                                		if(data.result){
                                			fnUpload(uploader,_name,_msg);
                                		}else{
                                			layer.msg('资源名称已存在，请修改文件名称');
                                		}
                                	},
                                	error:function(data){
                                		layer.msg('请求出错');
                                	},
                                	dataType:'JSON'
                                }) 
                            });
                            
                            
                            function fnUpload(uploader,_name,_msg){
                        	 uploader.options.formData.resourceName = _name;
                             uploader.options.formData.description = _msg;

                             uploader.upload();
                             var _str2 = '<div class="upload-wrap">\
 							<div class="upload-box">\
 							<p class="upload-prompt">上传中，请耐心等待，请勿刷新或关闭页面</p>\
 							<div class="upload-progress"><span class="upload-progress-bg"><i class="upload-progress-jd"></i></span><span class="upload-progress-txt">10%</span></div>\
 							<button class="upload-cancel">取消上传</button>\
 							</div></div>';

                                 var _index2 = layer.open({
                                     type: 1,
                                     closeBtn: 0,
                                     shade: [0.7],
                                     title: false,
                                     area: [],
                                     resize: false,
                                     content: _str2,
                                     success: function () {
                                         $('.upload-cancel').click(function () {
                                             if (obj) {
                                                 uploader.cancelFile(obj); //取消上传
                                             }
                                             layer.closeAll();
                                             layer.msg('取消成功');
                                         })
                                     }
                                 })
                            }

                            //选择文件时进行验证选择的视频格式和大小，不符合不加入队列
                            uploader.on('beforeFileQueued', function (file) {

                                if (!getVideoType(file.ext)) {
                                    layer.msg('请选择正确的视频格式文件');
                                    return;
                                }

                                if (file.size > 3221225472) {
                                    layer.msg('视频文件大小超出范围，最大支持3g');
                                }
                            })

                            //当有文件在队列触发
                            uploader.on('fileQueued', function (file) {

                                //如果视频格式不符合移除当前队列
                                if (!getVideoType(file.ext)) {
                                    uploader.removeFile(file);
                                    return;
                                }

                                $('.upload-txt').css('display', 'block').html(file.name);
                                obj = file;
                            });

                            //上传中触发
                            uploader.on('uploadProgress', function (file, percentage) {
                                var _jd = $('.upload-progress-jd'),
                                    _txt = $('.upload-progress-txt');
                                var _val = parseInt(percentage * 100);
                                _jd.css('width', _val + '%');
                                _txt.html(_val + '%');
                            });

                            //上传成功触发
                            uploader.on('uploadSuccess', function (file) {
                                layer.closeAll();
                                layer.msg('上传完成', {time: 5000});
                                setTimeout(function () {
                                    window.location.href = window.location.href; //刷新页面
                                }, 1000)
                            });

                            //上传失败触发
                            uploader.on('uploadError', function (file) {
                                layer.closeAll();
                                layer.msg('上传失败，请重试', {time: 3000});
                            });

//						//无论上传成功失败只要这个任务完成就会触发
//						uploader.on( 'uploadComplete', function( file ) {
//							layer.closeAll();
//						});

                        }
                    })

                }
            }
    });

    /*自定义滚动条*/
    setNiceScroll($('.content-list-tbody'));

    function hms_filter(val) { //过滤时间
        var txt = '';
        if (!val) {
            return "00:00:00";
        }

        function addZero(_v) {
            return _v > 9 ? _v : '0' + _v;
        }

        var _h = addZero(parseInt(val / 3600)),
            _m = addZero(parseInt(val % 3600 / 60)),
            _s = addZero(val % 60);

        txt = _h + ':' + _m + ':' + _s;
        return txt;
    }


    /*--编辑dom结构--*/

    /*readonly:1只读，0编辑
     *
     * */
    function dom_list(_data, _vm) {
        var dem = "<div class='z-comm-layer-wrap'>";
        dem += '<div class="z-comm-layer-box z-edit">';
        dem += "<div class='layer-top clearfix'><span class='layer-title'>查看详情</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
        dem += '<div class="layer-warp">\
		<div class="layer-left">\
			<div class="layer-left-top">\
				 <img src="' + _data.iconPath + '"alt="图片丢失" onerror="this.src=\'resources/images/img-lose.png\'"/>\
			</div>\
			<div class="layer-left-bottom">\
				<ul>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">视频名称</div><span <span title="' + returnEmpty(_data.resourceName) + '">' + returnEmpty(_data.resourceName) + '</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">上传时间</div><span title="' + timeYmdHms(_data.createTime) + '">' + timeYmdHms(_data.createTime) + '</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">上传人</div><span title="' + returnEmpty(_data.userAccount) + '">' + returnEmpty(_data.userAccount) + '</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">时长</div><span title="' + timeHms(_data.duration) + '">' + timeHms(_data.duration) + '</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">文件大小</div><span>' + videoFileSize(_data.FileSize) + '</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">视频封装格式</div><span title="' + returnEmpty(_data.container) + '">' + returnEmpty(_data.container) + '</span>\
					</li>\
					<li class="_child">\
						<div style="overflow:hidden"><i class="iconfont icon-78"></i><div class="label">视频编码格式</div><span title="' + returnEmpty(_data.vcodec) + '">' + returnEmpty(_data.vcodec) + '</span></div>\
						<dl style="display:none;">\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">码率</div><span>' + rateNum(_data.vbit) + '</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">帧率</div><span>' + returnEmpty(_data.frameRate) + '</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">宽高比</div><span>' + returnEmpty(_data.width) + ':' + returnEmpty(_data.height) + '</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">分辨率</div><span>' + returnEmpty(_data.width) + '*' + returnEmpty(_data.height) + '</span>\
							</dd>\
						</dl>\
					</li>\
					<li class="_child">\
						<div style="overflow:hidden"><i class="iconfont icon-78"></i><div class="label">音频编码格式</div><span title="' + returnEmpty(_data.acodec) + '">' + returnEmpty(_data.acodec) + '</span></div>\
						<dl style="display:none;">\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">采样声道</div><span>' + returnEmpty(_data.achannels) + '</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">音频码率</div><span>' + rateNum(_data.abit) + '</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">音频采样率</div><span>' + samplingRate(_data.asampleRate) + '</span>\
							</dd>\
						</dl>\
					</li>\
				</ul>\
			</div>\
		</div>\
		<div class="layer-right">\
			<dl>\
				<dd>\
					<label class="lable">视频名称</label><input id="z-name" readonly class="input z-disabled" type="text" onblur="filterChara(this)" value="' + returnEmpty(_data.resourceName) + '" />\
				</dd>\
				<dd>\
					<label class="lable">上传时间</label><input readonly class="input z-disabled" type="text" value="' + timeYmdHms(_data.createTime) + '" />\
				</dd>\
				<dd>\
					<label class="lable">上传用户</label><input readonly class="input z-disabled" type="text" value="' + returnEmpty(_data.userAccount) + '" />\
				</dd>\
				<dd>\
					<label class="lable">备注信息</label><textarea readonly id="z-remark"  class="texer z-disabled" value="' + 1 + '">' + returnEmpty(_data.description) + '</textarea>\
				</dd>\
			</dl>\
		</div>\
	</div>';
        dem += "</div></div>";
        return dem;
    }
});

/** 转码状态过滤 **/
Vue.filter('trans-state', function (value) {
    var text;
    if (!value) {
        text = "";
    }
    switch (value) {
        case 0:
            text = "未转码";
            break;
        case 1:
            text = "转码中";
            break;
        case 2:
            text = "转码完毕";
            break;
        case -1:
            text = "转码失败";
            break;
        default:
            text = "转码完毕";
            break;
    }
    ;
    return text;
});

//函数判断视频格式是否符合
function getVideoType(_type) {
    var _type = _type.toLowerCase();
    //mp4,avi,3gp,rmvb,wmv,mkv,rm,mov,flv,ts
    switch (_type) {
        case 'mp4':
            return true;
            break;
        case 'avi':
            return true;
            break;
//		case '3gp':
        //		return true;
        //		break;
        //		case 'rmvb':
        //			return true;
        //		break;
        //		case 'wmv':
        //			return true;
        //		break;
        //		case 'mkv':
        //			return true;
        //		break;
        //	case 'rm':
        //			return true;
        //		break;
        //		case 'mov':
        //		return true;
        //		break;
        case 'flv':
            return true;
            break;
        case 'ts':
            return true;
            break;
        default:
            return false;
            break;
    }
}