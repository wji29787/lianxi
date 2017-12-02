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


    var vm= new Vue({
         el: '#fileResourse',
         data: {
            nav_left: [],
            userId: $('#userId').val() - 0,
            userPermissions: $('#userPermissions').val() - 0, //用户状态
            userCloudState: 0, //当前用户在此空间的身份信息
            odataList: [],//存放请求数据的对象数组
            tabFlag: 0, /*切换文件资源和类型管理,默认文件资源*/
            sIsShow: true, /*标记批量操作显隐*/
            searchWord: "",//默认查询字符
            // cloudName: '',
            // ocloudId: "", /*云空间ID*/
            // navClickIndex: 0,//记录点击的云空间数据索引
            // navEditTxt: '',//记录要修改的文本
             pageNum: 1,//默认请求一页的数据
             pageSize: 15,//默认请求数据的条数
            // isSelectAll: 0,//全选标记
            // deleteData: [], //要删除的数据

            // checkNum: 0, //选中的数量
            checkAllNum: 0, //选中最大的数量（数据列表的最大数量）
            scrollBol: true, //防止滚动重复加载
            // opState: 0, //判断当前点击的是删除还是共享资源/添加成员
            // aPreData: [],//记录上一次的数据
            // opConfig: { //记录当前点击的位置等
            //     which: 0, //0：云端资源  1：空间成员
            //     state: 0, //0：默认加载对应云空间下的资源或者成员 1共享资源或者添加用户 -1删除资源或者删除用户

            // },
            bScrollNo: true,//搜索或加载
            // playBol: true, //防止重复点击播放
            timeSort: true,//默认排序方式
        },
         created: function () {
            //this.getLeftNav();
             if(this.tabFlag===0){
                 console.log('加载1');
                this.getList();//
             }else if(this.tabFlag===1){
                 console.log('加载2');
             }

        },
        methods:{
            tabSwitch:function(flag){

                if(this.tabFlag === flag) {
                    return;
                }
                this.tabFlag=flag;

                if(flag === 0){
                    // 请求 0 对应的数据
                   // this.getFileResourcesList();
                }else {
                    // 请求 1 对应的数据
                }

                  
                  // if (this.tabFlag != flag && flag == true) { //防止重复点击
                  //       // vm.cleanData();
                  //       this.tabFlag = true;
                  //       // vm.opConfig.which = 0;
                  //       // this.getList();
                  //      }
                    // } else if (flag == true && vm.opConfig.state != 0) {//点击批量共享操作时还原
                    //     // vm.cleanData();
                    //     vm.tabFlag = true;
                    //     // vm.opConfig.which = 0;
                    //     // this.getList();
                    // }

                    // if (vm.tabFlag != flag && flag == false && vm.opConfig.state == 0) { //防止重复点击
                    //     // vm.cleanData();
                    //     vm.tabFlag = false;
                    //     vm.opConfig.which = 1;
                    //     this.getList();
                    // } else if (flag == false && vm.opConfig.state != 0) {  //点击批量共享操作时还原
                    //     // vm.cleanData();
                    //     vm.tabFlag = false;
                    //     // vm.opConfig.which = 1;
                    //     // this.getList();
                    // }
            },
            //上传文件
            uploadVideoLayer: function () {
                var _str = '<div class="zlayer-wrap" style="display:block;">' +
                    '<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">上传文件</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
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
                    <label for="file_name">文件类型</label>\
                    <select class="file-select">\
                     <option value="0">启明1</option>\
                     <option value="1">启明2</option>\
                     <option value="2">启明3</option>\
                    </select>\
                    </div>\
                    <div class="upload-item">\
                     <div class="upload-upload">\
                         <label>上传文件</label>\
                         <span id="upload_btn" class="upload-btn"><i class="iconfont icon-lookIcon"></i>浏览</span>\
                     </div>\
                      <!-- <p class="upload-txt">暂无选择文件</p>\
                      // <p class="upload-mark">注：本地上传文件资源大小不得超过3G</p>\-->\
                    </div>\
                    <div class="upload-item">\
                         <label>文件状态</label>\
                         <span>有效</span><span>无效</span>\
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
                            // swf文件路径
                            swf: '<%=request.getContextPath()%>/resources/js/controls/webuploader/Uploader.swf',
                            // 文件接收服务端。
                            server: 'cloudResources/thirdMaterialUpload/uploadFile.do',

                            // 选择文件的按钮。可选。
                            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                            pick: '#upload_btn',
                            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                            resize: false,
                            //验证单个文件超过多少不进行队列
                           // fileSingleSizeLimit: 3221225472,
                            // 只允许选择视频文件。
                            // accept: {
                            //     title: 'video',
                            //     //extensions: 'mp4,avi,3gp,rmvb,wmv,mkv,rm,mov,flv,ts',
                            //     extensions: 'mp4,avi,flv,ts',
                            //     mimeTypes: '*'
                            // },
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
                                url:'cloudResources/thirdMaterialUpload/uploadFile.do',
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
            //获取数据，封装函数
            getList: function (pageNum, type) {
                var _this = this;
                _this.scrollBol = false;//防止滚动重复加载

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
                    url: "cloudResources/thirdMaterialUpload/getList.do",
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
                            _this.scrollBol = true; //防止滚动重复加载
                        }, 350);
                        /*console.log(data.list.list);*/
                        if (result) {
                            /**查询成功**/
                            if (_this.odataList) {
                                if (!pageNum) { //不存在时是因为搜索
                                    if (data.list.list) {//搜索时重新赋值
                                        _this.odataList = data.list.list;
                                        console.log(data.list.list);
                                        $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                    } else {
                                        _this.odataList = [];
                                    }
                                    //fnSetInterval(_this.odataList); //动态更新定时器函数
                                } else {
                                    _this.odataList = _this.odataList.concat(data.list.list); //存在时追加
                                }

                                _this.isSelectAll = 0;
                            } else {
                                _this.odataList = data.list.list; //页面加载时数据赋值
                                $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                //fnSetInterval(_this.odataList); //动态更新定时器函数
                            };

                            if (data.list.isLastPage) {
                                _this.bScrollNo = false;//搜索或加载
                            }
                            _this.checkAllNum = _this.odataList.length; //每次请求数据时改变最大值

                            //动态更新定时器函数
                            // function fnSetInterval(_arr) { //传过来数组
                            //     if (_arr.length) { //如果数组有值才做判断
                            //         var _refreshBol = false; //判断是否存在转码中任务
                            //         for (var i = 0, _len = _arr.length; i < _len; i++) {
                            //             if (_arr[i].resourceState == 0 || _arr[i].resourceState == 1) {
                            //                 _refreshBol = true;
                            //                 break;
                            //             }
                            //         }
                            //
                            //         if (_refreshBol) {
                            //             _this.refreshTime = 10000;
                            //
                            //         } else {
                            //             _this.refreshTime = 60000;
                            //         }
                            //         _this.refreshList();
                            //     }
                            // }

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
        },
    });

    /*自定义滚动条*/
    setNiceScroll($('.content-list-tbody'));



});














