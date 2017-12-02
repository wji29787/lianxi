/*系统配置*/
$(".operationM-page").addClass("active");
$(function () {
    var vm = new Vue({
        el: '#cascadeManagement',
        data: {
            contentShow: 1,
            serverList: [],
            serverId: -1,
            serverIndex: -1,
            serverNumber: -1,
            searchWord: '',
            isScroll: false,
            noScroll: false,
            pageNum: 1,
            business: { //业务统计
                show: 1,
                playNum: 0,
                recordNum: 0,
                monthData: {
                    xAxis: [],
                    yAxisVideo: [],
                    yAxisRecord: [],
                    playNum: 0,
                    recordNum: 0
                },
                weekData: {
                    xAxis: [],
                    yAxisVideo: [],
                    yAxisRecord: [],
                    playNum: 0,
                    recordNum: 0
                },
                dayData: {
                    xAxis: [],
                    yAxisVideo: [],
                    yAxisRecord: [],
                    playNum: 0,
                    recordNum: 0
                }
            },
            selectData: {//节目内容分布，云端资源分布，个人资源分布
                title: '节目内容分布',
                max: 0,
                min: 0,
                xAxis: [],
                yAxis: []
            },
            spaceData: {
                percent: 0,
                aTimer:[]
            },
            serverData: {
                play: 0,
                record: 0,
                free: 0,
                other: 0
            }
        },
        watch: {},
        mounted: function () {
            var _this = this;
            _this.getServeList();
            /*自定义滚动条*/
            setNiceScroll({obj: $('.bottom-tabs-list'), right: -10});
        },
        methods: {
            //刷新数据
            reloadData: function () {
                var _this = this;
                /*_this.pageNum = 1;
                _this.searchWord = '';
                _this.getServeList();*/
                _this.getInitData(); //获取数据
            },
            //控制内容的显示隐藏
            fncontentShow: function (num) {
                var _this = this;
                if (num == _this.contentShow) {
                    return;
                }
                _this.contentShow = num;
                if (num == 2) {
                    setTimeout(function () {
                        selectBar(_this.selectData.xAxis, _this.selectData.yAxis); //画图
                    }, 10);
                }
            },
            //获取地区服务列表
            getServeList: function (type) {
                var _this = this;
                
                if (type == 'scroll') {
                    if (_this.noScroll) {
                        return;
                    }
                    _this.pageNum++;
                }
                
                _this.loading();
                var _searchWord = _this.searchWord.replace(/[^A-Za-z_\u4e00-\u9fa50-9]/g,'');
                $.ajax({
                    type: 'POST',
                    url: 'operationManagement/cascade/getList.do',
                    data: {
                        pageNum: _this.pageNum,
                        pageSize: 15,
                        searchWord: _searchWord
                    },
                    dataType: 'JSON',
                    success: function (data) {
                    	if(!isLogonError(data)){
		  					return ;
		  				}
                    	
                        if (data.result) {
                            var _data = data.list.list;

                            if (_data.isLastPage) {
                                _this.noScroll = true; //最后一页
                            } else {
                                _this.noScroll = false; //不是最后一页
                            }

                            if (type == 'scroll') {
                            	if(_data.length){
                            		_this.serverList = _this.serverList.concat(_data);
                            	}else{
                            		_this.pageNum--;
                            	} 
                            } else {
                                _this.serverList = _data;
                                if (_data.length) {
                                    _this.serverId = _data[0].id;
                                    _this.serverIndex = 0;
                                    _this.serverNumber = _data[0].serverNumber;
                                    _this.getInitData(); //获取数据
                                    $(".bottom-tabs-list").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
                                }
                            } 
                            _this.loading('close'); //不滚动加载时为空数据去除loding
                        } else { //失败时没有后续请求所以关闭loding
                            _this.loading('close');
                            _this.pageNum--;
                        }
                    }, error: function () {
                        _this.pageNum--;
                        layer.msg('请求出错');
                        _this.loading('close');
                    }
                })
            },
            getInitData: function () {
                var _this = this,
                    _date = new Date();
                

                if(_this.serverId==-1){
                	return;
                }
                
                _time = _date.getFullYear() + '-' + toDou((_date.getMonth() + 1)) + '-' + toDou(_date.getDate());
                _this.loading();
                $.ajax({
                    type: 'POST',
                    url: 'operationManagement/cascade/getCascadeList.do',
                    data: {
                        endTime: _time,
                        terminalNumber: _this.serverNumber
                    },
                    success: function (data) {
                    	if(!isLogonError(data)){
		  					return ;
		  				}
                    	
                        var _data2 = null;
                        _this.loading('close');
                        if (data.result) {
                            /* _data2 = {
                                "resultVideoype": 2,
                                "resultVideoCount": "{\"result\":true,\"data\":[{\"name\":\"pamir\",\"value\":30}],\"msg\":\"查询成功\"}",
                                "resultSystemInfo": "{\"result\":true,\"data\":{\"filesystemSize\":50.0,\"used\":27.0,\"unUsed\":24.0,\"vodingCount\":1,\"recordingCount\":0,\"totalNumCount\":13},\"msg\":\"查询成功\"}",
                                "resultBusiness": {
                                    "weekList": "{\"result\":true,\"data\":{\"recordCount\":[{\"name\":\"2017-10-05\",\"value\":0},{\"name\":\"2017-10-12\",\"value\":6},{\"name\":\"2017-10-19\",\"value\":4},{\"name\":\"2017-10-26\",\"value\":0}],\"playCount\":[{\"name\":\"2017-10-05\",\"value\":0},{\"name\":\"2017-10-12\",\"value\":320},{\"name\":\"2017-10-19\",\"value\":198},{\"name\":\"2017-10-26\",\"value\":178}]},\"msg\":\"查询成功\"}",
                                    "monthList": "{\"result\":true,\"data\":{\"recordCount\":[{\"name\":\"2017-05\",\"value\":0},{\"name\":\"2017-06\",\"value\":0},{\"name\":\"2017-07\",\"value\":0},{\"name\":\"2017-08\",\"value\":0},{\"name\":\"2017-09\",\"value\":9},{\"name\":\"2017-10\",\"value\":10}],\"playCount\":[{\"name\":\"2017-05\",\"value\":0},{\"name\":\"2017-06\",\"value\":0},{\"name\":\"2017-07\",\"value\":0},{\"name\":\"2017-08\",\"value\":0},{\"name\":\"2017-09\",\"value\":259},{\"name\":\"2017-10\",\"value\":696}]},\"msg\":\"查询成功\"}",
                                    "dayList": "{\"result\":true,\"data\":{\"recordCount\":[{\"name\":\"2017-10-20\",\"value\":0},{\"name\":\"2017-10-21\",\"value\":0},{\"name\":\"2017-10-22\",\"value\":0},{\"name\":\"2017-10-23\",\"value\":0},{\"name\":\"2017-10-24\",\"value\":0},{\"name\":\"2017-10-25\",\"value\":0},{\"name\":\"2017-10-26\",\"value\":0}],\"playCount\":[{\"name\":\"2017-10-20\",\"value\":50},{\"name\":\"2017-10-21\",\"value\":0},{\"name\":\"2017-10-22\",\"value\":0},{\"name\":\"2017-10-23\",\"value\":85},{\"name\":\"2017-10-24\",\"value\":71},{\"name\":\"2017-10-25\",\"value\":22},{\"name\":\"2017-10-26\",\"value\":0}]},\"msg\":\"查询成功\"}"
                                }
                            };*/
                            _data2 = data.data;
                            
                            /********业务统计******/
                            //循环得到月周日的数据
                            for (var i = 0; i < 3; i++) {
                                if (i == 0) {
                                	if(_data2.resultBusiness.monthList){
                                		getBusinessData(_this.business.monthData, JSON.parse(_data2.resultBusiness.monthList).data, 'month');
                                	}else{
                                		getBusinessData(_this.business.monthData,{"recordCount":[]});
                                	}
                                } else if (i == 1) {
                                	if(_data2.resultBusiness.weekList){
                                		 getBusinessData(_this.business.weekData, JSON.parse(_data2.resultBusiness.weekList).data);
                                	}else{
                                		getBusinessData(_this.business.weekData,{"recordCount":[]});
                                	}
                                } else {
                                	if(_data2.resultBusiness.dayList){
                                		 getBusinessData(_this.business.dayData, JSON.parse(_data2.resultBusiness.dayList).data);
                                	}else{
                                		getBusinessData(_this.business.dayData,{"recordCount":[]});
                                	}
                                }
                            }
                            
                            businessBar(_this.business.monthData.xAxis, _this.business.monthData.yAxisVideo, _this.business.monthData.yAxisRecord); //先画月的柱状图
                            _this.business.playNum = _this.business.monthData.playNum; //首先显示月的播放数
                            _this.business.recordNum = _this.business.monthData.recordNum; //首先显示月的录制数

                            /*********节目，个人，云端资源分布**********/
                            /**
                             * 获取当前是节目还是云端个人
                             */
                            switch (_data2.resultVideoType) {
                                case 1: //节目
                                    _this.selectData.title = '节目内容分布';
                                    _this.selectData.max = {"name": "浙江", "value": 321};
                                    _this.selectData.min = {"name": "山东", "value": 9};
                                    _this.selectData.yAxis = [37, 56, 276, 9, 321];
                                    _this.selectData.xAxis = ['北京', '河北', '新疆', '山东', '浙江'];
                                    break;
                                case 2: //云端
                                    _this.selectData.title = '云端资源分布';
                                    if(_data2.resultVideoCount){
                                    	getSelectData(_this.selectData, JSON.parse(_data2.resultVideoCount).data);
                                    }else{
                                    	_this.selectData.max = 0;
                                    	_this.selectData.min = 0;
                                    	_this.selectData.xAxis = [];
                                    	_this.selectData.yAxis = [];
                                    }
                                    break;
                                case 3: //
                                    _this.selectData.title = '个人资源分布';
                                    if(_data2.resultVideoCount){
                                    	 getSelectData(_this.selectData, JSON.parse(_data2.resultVideoCount).data);
                                    }else{
                                    	_this.selectData.max = 0;
                                    	_this.selectData.min = 0;
                                    	_this.selectData.xAxis = [];
                                    	_this.selectData.yAxis = [];
                                    }
                                    break;
                            }
                            
                            /**************空间占比状态和服务状态数据*************/
                            if(_data2.resultSystemInfo){
                            	var _spaceServe = JSON.parse(_data2.resultSystemInfo).data;
                                _this.spaceData.percent = parseInt(_spaceServe.used / _spaceServe.filesystemSize * 100); //百分比
                                spaceProportion(_this.spaceData.percent,_this.spaceData.aTimer); //画圆
                                _this.serverData.play = _spaceServe.vodingCount;
                                _this.serverData.record = _spaceServe.recordingCount;
                                _this.serverData.free = _spaceServe.totalNumCount - _spaceServe.recordingCount - _spaceServe.vodingCount - _spaceServe.otherCount;
                                _this.serverData.other = _spaceServe.otherCount;
                            }else{
                            	_this.spaceData.percent = 0;
                            	spaceProportion(_this.spaceData.percent,_this.spaceData.aTimer); //空间占比清零
                            	
                            	_this.serverData.play = 0;
                            	_this.serverData.record = 0;
                            	_this.serverData.free = 0;
                            	_this.serverData.other = 0;
                            }
                        } else {
                        	_this.initData();//请求失败清空数据
                            businessBar(_this.business.monthData.xAxis, _this.business.monthData.yAxisVideo, _this.business.monthData.yAxisRecord); //默认画空柱状图
                            if(data.msg && data.msg != "" && data.msg != "null"){
                            	layer.msg(data.msg);
                            }else{
                            	layer.msg('请求数据失败');
                            }
                        }
                       
                    },
                    error: function () {
                        layer.msg('请求数据出错');
                        _this.loading('close');
                    },
                    dataType: 'JSON'
                })
            },
            //切换月周日数据画图
            businessActive: function (num) {
                var _this = this;
                _this.business.show = num;

                switch (num) {
                    case 1:
                        businessBar(_this.business.monthData.xAxis, _this.business.monthData.yAxisVideo, _this.business.monthData.yAxisRecord); //月的柱状图
                        _this.business.playNum = _this.business.monthData.playNum;//播放总数为月的总数
                        _this.business.recordNum = _this.business.monthData.recordNum;//录制总数为月的总数
                        break;
                    case 2:
                        businessBar(_this.business.weekData.xAxis, _this.business.weekData.yAxisVideo, _this.business.weekData.yAxisRecord);//周的柱状图
                        _this.business.playNum = _this.business.weekData.playNum;//播放总数为周的总数
                        _this.business.recordNum = _this.business.weekData.recordNum;//录制总数为周的总数
                        break;
                    case 3:
                        businessBar(_this.business.dayData.xAxis, _this.business.dayData.yAxisVideo, _this.business.dayData.yAxisRecord);//日的柱状图
                        _this.business.playNum = _this.business.dayData.playNum;//播放总数为日的总数
                        _this.business.recordNum = _this.business.dayData.recordNum;//录制总数为日的总数
                        break;
                }

            },
            initData:function(){
            	var _this = this;
            	
            	/****业务统计数据****/
            	_this.business.show = 1;
            	_this.business.playNum = 0;
            	_this.business.recordNum = 0;
            	_this.business.monthData.xAxis = [];
            	_this.business.monthData.yAxisVideo = [];
            	_this.business.monthData.yAxisRecord = [];
            	_this.business.monthData.playNum = 0;
            	_this.business.monthData.recordNum = 0;
            	businessBar(_this.business.monthData.xAxis, _this.business.monthData.yAxisVideo, _this.business.monthData.yAxisRecord); //先画月的柱状图
                _this.business.playNum = _this.business.monthData.playNum; //首先显示月的播放数
                _this.business.recordNum = _this.business.monthData.recordNum; //首先显示月的录制数
            	
            	_this.business.weekData.xAxis = [];
            	_this.business.weekData.yAxisVideo = [];
            	_this.business.weekData.yAxisRecord = [];
            	_this.business.weekData.playNum = 0;
            	_this.business.weekData.recordNum = 0;
            	
            	_this.business.dayData.xAxis = [];
            	_this.business.dayData.yAxisVideo = [];
            	_this.business.dayData.yAxisRecord = [];
            	_this.business.dayData.playNum = 0;
            	_this.business.dayData.recordNum = 0;
            	
            	/****个人，节目，云端资源分布数据****/
            	_this.selectData.max = 0;
            	_this.selectData.min = 0;
            	_this.selectData.xAxis = [];
            	_this.selectData.yAxis = [];
            	
            	/****空间占比数据****/
            	_this.spaceData.percent = 0;
            	spaceProportion(_this.spaceData.percent,_this.spaceData.aTimer); //空间占比清零
            	
            	/****服务状态数据****/
            	_this.serverData.play = 0;
            	_this.serverData.record = 0;
            	_this.serverData.free = 0;
            	_this.serverData.other = 0;
            },
            //获取地区服务列表点击事件
            serverClick: function (index) {
                var _this = this;
                if (index == _this.serverIndex) {
                    return;
                }
                _this.serverId = _this.serverList[index].id;
                _this.serverIndex = index;
                _this.serverNumber = _this.serverList[index].serverNumber;
                _this.contentShow = 1; //切换成第一个
                _this.business.show = 1; //切换成月
                _this.getInitData();
            },
            //添加地区服务事件
            addServer: function () {
                var _this = this;
                var _str = '<div class="zlayer-wrap cascade-add" style="display:block;">' +
                    '<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">温馨提示</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
                    '<div class="cascade-add-item">' +
                    '<label>录播名称</label>' +
                    '<input id="add_user" type="text" placeholder="请输入录播名称" maxlength="50" />' +
                    '</div>' +
                    '<div class="cascade-add-item">' +
                    '<label>终端号码</label>' +
                    '<input id="add_number" type="text" placeholder="请输入视联终端号" maxlength="5" />' +
                    '</div>' +
                    '<div class="add-delete-op"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button> </div>' +
                    '</div></div></div>';
                var _index = layer.open({
                    type: 1,
                    closeBtn: 0,
                    shade: [0.7],
                    title: false,
                    area: [],
                    resize: false,
                    content: _str,
                    success: function () {
                        $('.cascade-add .sham-btn-sure').off('click').on('click', function () {
                            var _user = $('#add_user').val().trim(),
                                _numer = $('#add_number').val().trim();
                            if (_user == '') {
                                layer.msg('请输入用户名');
                                return;
                            } else if (!/^[A-Za-z_\u4e00-\u9fa50-9]+$/.test(_user)) {
                                layer.msg('请输入正确的用户名，中英文数字下划线');
                                return;
                            }
                            if (_numer == '') {
                                layer.msg('请输入终端号');
                                return;
                            } else if (_numer == 0) {
                                layer.msg('终端号不能为0');
                                return;
                            } else if (!parseInt(_numer)) {
                                layer.msg('终端号只能为数字');
                                return;
                            } else if (parseInt(_numer) != parseFloat(_numer)) {
                                layer.msg('终端号只能为1-65535之间整数');
                                return;
                            } else if (_numer < 0 || _numer > 65535) {
                                layer.msg('终端号只能为1-65535之间整数');
                                return;
                            }
                            $.ajax({
                                type: 'POST',
                                url: 'operationManagement/cascade/addArea.do',
                                data: {
                                    serverName: _user,
                                    serverNumber: _numer
                                },
                                success: function (data) {
                                	if(!isLogonError(data)){
            		  					return ;
            		  				}
                                    if (data.result) {
                                        layer.close(_index);
                                        /*_this.pageNum = 1;
                                        _this.getServeList();*/
                                        _this.serverList.push(data.data);
                                        var _len = _this.serverList.length;
                                        _this.serverId = _this.serverList[_len - 1].id;
                                        _this.serverIndex = _len - 1;
                                        _this.serverNumber = _this.serverList[_len - 1].serverNumber;
                                        _this.contentShow = 1; //切换成第一个
                                        _this.business.show = 1; //切换成月
                                        _this.getInitData();    
                                    }
                                    layer.msg(data.msg);
                                },
                                error: function () {
                                    layer.msg('请求出错');
                                },
                                dataType: 'JSON'

                            })
                        });
                        $('.cascade-add .zlayer-close,.cascade-add .sham-btn-default').off('click').on('click', function () {
                            layer.close(_index);
                        });
                    }
                });

            },
            //删除地区服务事件
            delServer: function () {
                var _this = this;
                var _str = '<div class="zlayer-wrap cascade-del" style="display:block;">' +
                    '<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">温馨提示</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
                    '<div class="add-delete">' +
                    '<div class="add-delete-txt">您确定要删除此录播服务吗？</div>' +
                    '<div class="add-delete-op"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button> </div>' +
                    '</div></div></div>';
                var _index = layer.open({
                    type: 1,
                    closeBtn: 0,
                    shade: [0.7],
                    title: false,
                    area: [],
                    resize: false,
                    content: _str,
                    success: function () {
                        $('.cascade-del .sham-btn-sure').off('click').on('click', function () {
                            $.ajax({
                                type: 'POST',
                                url: 'operationManagement/cascade/deleteArea.do',
                                data: {Ids: _this.serverId},
                                success: function (data) {
                                	if(!isLogonError(data)){
            		  					return ;
            		  				}
                                	
                                    layer.msg(data.msg);
                                    layer.close(_index);
                                    _this.pageNum = 1;
                                    _this.getServeList();
                                },
                                error: function () {
                                    layer.msg('请求出错');
                                    layer.close(_index);
                                },
                                dataType: 'JSON'
                            })
                        });
                        $('.cascade-del .zlayer-close,.cascade-del .sham-btn-default').off('click').on('click', function () {
                            layer.close(_index);
                        });
                    }
                });
            },
            //加载loding层
            loading: function (type) {
                if (type) {
                    $('.loading-box').hide();
                } else {
                    layer.closeAll();
                    $('.loading-box').show();
                }
            },
            //搜索事件
            fnSearch: function () {
                var _this = this;
                _this.pageNum = 1;
                _this.getServeList();
            },
            //滚动加载事件
            fnScroll: function (event) {
                var _this = vm;
                var sum_sh = event.target.scrollHeight;  //滚动条高度
                var sum_ch = event.target.clientHeight; //div可视区域高度
                var sum_st = event.target.scrollTop; //滚动上
                if (sum_sh - sum_ch == sum_st) {
                    _this.getServeList('scroll');
                }
            }
        },
        filters: {
            //截取4个字符
            fourStr: function (val) {
                if (!val) {
                    return '';
                }
                if (val.length <= 4) {
                    return val + ':';
                } else {
                    return val.substring(0, 4) + ':';
                }
            }
        }
    });
});

/*
* 空间占比
* per为百分比的数字
* filesystemSize 空间总大小
* */
function spaceProportion(per,obj) {
    var oTxt = $('#space_txt'), //显示百分比的盒子
        oBlock = document.getElementById('space_main'),
        N = 24,//总共24个小格子
        p = Math.ceil(N * per / 100),//占用多少个小格子
        baifen = 0; //百分比

    oTxt.html('');
    oBlock.innerHTML = '';
    
    if(obj.length){
    	for(var i=0;i<obj.length;i++){
    		clearTimeout(obj[i]);
    	}
    	obj.length = 0; //定时器数组
    	obj = [];
    }
    
    for (var i = 0; i < N; i++) {
        var oS = document.createElement('i');
        oS.style.WebkitTransform = 'rotate(' + i * 15 + 'deg)';
        oS.style.MozTransform = 'rotate(' + i * 15 + 'deg)';
        oS.style.MsTransform = 'rotate(' + i * 15 + 'deg)';
        oS.style.transform = 'rotate(' + i * 15 + 'deg)';
        if (i <= p && p != 0) {
            (function (oS, i) {
                var ti = setTimeout(function () {
                    oS.className = 'active';
                    /*oBlock.appendChild(oS);*/
                    baifen += 100 / N;
                    baifen = Math.round(baifen);
                    if (baifen >= per) {
                        baifen = per;
                    }
                    oTxt.html(Math.round(baifen) + '%');
                }, i * 2000 / p);
                obj.push(ti);
            })(oS, i);
        }
        oBlock.appendChild(oS);
    }
}

//请求数据完处理月周日的数据结构
/**
 *
 * @param _mData 月数据对象
 * @param _data  请求的元数据
 * @param _month 是否是月，是月的话截取字符串
 */
function getBusinessData(_mData, _data, _month) {

    //先清数据避免重复添加
    _mData.xAxis = [];
    _mData.yAxisRecord = [];
    _mData.yAxisVideo = [];
    _mData.playNum = 0;
    _mData.recordNum = 0;
    
    if (_data.recordCount.length) {
        for
        (
            var i = 0;
            i < _data.recordCount.length;
            i++
        ) {
            if (_month == 'month') { //如果是月截取下字符串，2017-10这种默认是带日期的
                if (i == _data.recordCount.length - 1) {
                    _mData.xAxis.push(_data.recordCount[i].name.substr(0, 7));
                } else {
                    _mData.xAxis.push(_data.recordCount[i].name);
                }
            } else {
                _mData.xAxis.push(_data.recordCount[i].name);
            }
            _mData.yAxisRecord.push(_data.recordCount[i].value);
            _mData.recordNum += _data.recordCount[i].value;
            _mData.yAxisVideo.push(_data.playCount[i].value);
            _mData.playNum += _data.playCount[i].value;
        }
    }
}

/**
 *
 * @param _sData  节目，云端，个人数据对象
 * @param _data   请求的元数据
 */
function getSelectData(_sData, _data) {
    _sData.max = {};
    _sData.min = {};
    _sData.xAxis = [];
    _sData.yAxis = [];

    if (_data.length) {
        _sData.max = _data[0];
        _sData.min = _data[_data.length - 1];
        for (var i = 0; i < _data.length; i++) {
            _sData.xAxis.push(_data[i].name);
            _sData.yAxis.push(_data[i].value);
        }

    }
}

/****画月周日的柱状图****/
function businessBar(xData, yData1, yData2) {
    var myChart = echarts.init(document.getElementById('business_canvas'));
    var options = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            x: '10%',
            y: '20%',
            y2: '15%'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: xData,
                //x轴轴线的样式
                axisLine: {
                    lineStyle: {
                        color: '#6d869c',
                    }
                },
                //x轴字体样式
                axisLabel: {
                    textStyle: {
                        fontSize: 16,
                        color: '#cee2ff'
                    },
                    //x轴刻度间距
                    interval: 0,
                },
//		 	       		axisTick: {length:5},
            }

        ],
        yAxis: [
            {
                nameTextStyle: {fontSize: 22},//坐标轴名称字体的样式

                //max:100,
                //刻度是否显示
                axisTick: {
                    show: true,//false
                },
                splitLine: {
                    show: false
                },
                type: 'value',
                //y轴轴线的样式
                axisLine: {
                    lineStyle: {
                        color: '#6d869c',
                    }
                },
                //y轴字体样式
                axisLabel: {
                    show: true,//false,//y轴数值是否显示
                    textStyle: {
                        fontSize: 16,
                        color: '#cee2ff'
                    }
                },

            }
        ],
        series: [
            {
                name: '内容播放',
                type: 'bar',
                data: yData1,//[ 60, 60, 60, 60],
                /*itemStyle: {
                    color:'pink'
                }*/

                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(122,175,255,1)'
                        },
                            {
                                offset: 1,
                                color: 'rgba(19,39,66,0.1)'
                            },
                        ])
                    }
                }
            },
            {
                name: '实时录制',
                type: 'bar',
                data: yData2,//[ 20, 40, 60, 70],
                /*itemStyle: {
                    color:'pink'
                }*/

                itemStyle: {
                    //图像颜色渐变
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,122,122,1)'
                        },
                            {
                                offset: 1,
                                color: 'rgba(40,48,69,0.1)'
                            },
                        ])
                    }
                }
            }
        ],
    };
    myChart.setOption(options);
}

/****画云端，个人，节目资源柱状图****/
function selectBar(xData, yData1) {
    var myChart = echarts.init(document.getElementById('personal_canvas'));
    var options = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            x: '10%',
            y: '20%',
            y2: '15%'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: xData,
                //x轴轴线的样式
                axisLine: {
                    lineStyle: {
                        color: '#6d869c',
                    }
                },
                //x轴字体样式
                axisLabel: {
                    textStyle: {
                        fontSize: 16,
                        color: '#cee2ff'
                    },
                    //x轴刻度间距
                    interval: 0,
                },
//		 	       		axisTick: {length:5},
            },

        ],
        yAxis: [
            {
                nameTextStyle: {fontSize: 22},//坐标轴名称字体的样式

                //max:100,
                //刻度是否显示
                axisTick: {
                    show: true,//false
                },
                splitLine: {
                    show: false
                },
                type: 'value',
                //y轴轴线的样式
                axisLine: {
                    lineStyle: {
                        color: '#6d869c',
                    }
                },
                //y轴字体样式
                axisLabel: {
                    show: true,//false,//y轴数值是否显示
                    textStyle: {
                        fontSize: 16,
                        color: '#cee2ff'
                    }
                },

            }
        ],
        series: [
            {
                name: '内容播放',
                type: 'bar',
                data: yData1,

                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(122,175,255,1)'
                        },
                            {
                                offset: 1,
                                color: 'rgba(19,39,66,0.1)'
                            },
                        ])
                    }
                }
            }
        ]
    };
    myChart.setOption(options);
}