/*系统配置*/
$(".operationM-page").addClass("active");
$(function () {
    /*自定义滚动条*/
    setNiceScroll($('.content-box'));
})
var vm = new Vue({
    el: '#deviceManagement',
    mounted: function () {
        this.getList();
    },
    data: {
        userPermissions: $('#userPermissions').val() - 0,
        ishow: 0, /*视频播放时自动配置IP*/
        limit_login: "", /*登录人数限制*/
        olimit_login: "", /*预留的登录人数值*/
        operational_control: '', //业务分布控制
        redis_control: '', //redis时长设置
        db_server: "", /*点播服务器配置*/
        download_maxrate: "", /*最大下载速率M/s*/
        download_maxcount: "", /*最大下载任务数*/
        recycle_savedate: "", /*回收站保存时间配置*/
        oRecyclenum: "", /*预留的回收站保存时间配置*/
        v2v_dns1: "", /*视联网DNS1配置*/
        v2v_dns2: "", /*视联网DNS2配置*/
        v2v_dns3: ""/*视联网DNS3配置*/
    },
    watch: {
        /*登录人数   正则匹配*/
        'limit_login': function (value) {
            var ovalue = value.replace(/^0*|[^\d]/g, '');
            if (!ovalue) {
                this.limit_login = '';
            } else {
                this.limit_login = ovalue;
            }
            ;
        },
        /*回收站保存时间   正则匹配*/
        'recycle_savedate': function (value) {
            var ovalue = value.replace(/^0*|[^\d]/g, '');
            if (!ovalue) {
                this.recycle_savedate = '';
            } else {
                this.recycle_savedate = ovalue;
            }
            ;
        },
        /*微信去除多余空格*/
        'db_server': function (value) {
            this.db_server = value.replace(/\s/ig, '');
            /*去掉空格*/
        },
        'v2v_dns1': function (value) {
            this.v2v_dns1 = value.replace(/^[0\D]|\D/, '');
            /*去掉空格*/
        },
        'v2v_dns2': function (value) {
            this.v2v_dns2 = value.replace(/^[0\D]|\D/, '');
            /*去掉空格*/
        },
        'v2v_dns3': function (value) {
            this.v2v_dns3 = value.replace(/^[0\D]|\D/, '');
            /*去掉空格*/
        },
    },
    methods:
        {
            getList: function () {
                var _this = this;
                $.ajax({
                    url: "operationManagement/systemConfiguration/getSystemConfig.do",
                    type: "POST",
                    data: {},
                    dataType: "json",
                    success: function (data) {
                        if (!isLogonError(data)) {
                            return;
                        }
                        var result = data.result;
                        if (result) {
                            /**查询成功**/
                            var list = data.list;
                            _this.limit_login = list[0].val;
                            _this.olimit_login = list[0].val;
                            _this.ishow = parseInt(list[1].val);
                            
                            //去除点播服务器配置赋值
                            /**_this.db_server = list[2].val;**/

                            //为了在IE下刷新不显示数据问题
                            setTimeout(function () {
                                _this.download_maxrate = list[3].val;
                                _this.download_maxcount = list[4].val;
                                _this.operational_control = list[9].val;
                                _this.redis_control = list[10].val;
                            }, 1);

                            _this.recycle_savedate = list[5].val;
                            _this.oRecyclenum = list[5].val;
                            _this.v2v_dns1 = list[6].val;
                            _this.v2v_dns2 = list[7].val;
                            _this.v2v_dns3 = list[8].val;
                        } else {
                            /**查询失败**/
                            layer.msg("<p style='text-align:center'>查询失败!</p>");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            },
            saveSystemConfig: function () {
                var _this = this;

                //登陆人数限制
                if (_this.limit_login == "") {
                    layer.msg('登陆人数限制不能为空，请输入1-1000内整数');
                    return;
                } else if (_this.limit_login < 1 || _this.limit_login > 1000) {
                    layer.msg('登陆人数限制请输入1-1000内整数');
                    return;
                }

                //回收站时间判断
                if (_this.recycle_savedate == "") {
                    layer.msg('回收站时间不能为空，请输入1-30内整数');
                    return;
                } else if (_this.recycle_savedate < 1 || _this.recycle_savedate > 30) {
                    layer.msg('回收站时间请输入1-30内整数');
                    return;
                }

                //点播服务器配置隐藏了所以暂时把验证去掉
                /****var db_reg = /^(((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])):\d+$/;
                if (_this.db_server.trim() != '' && !db_reg.test(_this.db_server)) {
                    layer.msg('点播服务器配置格式不正确：ip : port');
                    return;
                } else if (_this.db_server.substring(_this.db_server.indexOf(':') + 1) > 65535) {
                    layer.msg('点播服务器配置端口不能大于65535');
                    return;
                }****/

                if (parseInt(_this.v2v_dns1) > 65535 || parseInt(_this.v2v_dns2) > 65535 || parseInt(_this.v2v_dns3) > 65535) {
                    layer.msg('视联网DNS配置最大为65535');
                    return;
                }

                if (_this.v2v_dns1 == _this.v2v_dns2 && _this.v2v_dns1 || _this.v2v_dns1 == _this.v2v_dns3 && _this.v2v_dns1 || _this.v2v_dns2 == _this.v2v_dns3 && _this.v2v_dns2) {
                    layer.msg('视联网DNS配置不能相同');
                    return;
                }

                $.ajax({
                    url: "operationManagement/systemConfiguration/setSystemConfig.do",
                    type: "POST",
                    data: {
                        'limit_login': _this.limit_login,
                        'automatchip': _this.ishow,
                        //'wx_server': _this.db_server, //后端是微信配置，其实是点播服务配置
                        'download_maxrate': _this.download_maxrate,
                        'download_maxcount': _this.download_maxcount,
                        'recycle_savedate': _this.recycle_savedate,
                        'v2v_dns1': _this.v2v_dns1,
                        'v2v_dns2': _this.v2v_dns2,
                        'v2v_dns3': _this.v2v_dns3,
                        'resourcedistribution': _this.operational_control,
                        'redis_Effective': _this.redis_control
                    },
                    dataType: "json",
                    success: function (data) {
                        if (!isLogonError(data)) {
                            return;
                        }
                        var result = data.result;
                        if (result) {
                            /**保存成功**/
                            _this.getList();
                            layer.msg("<p style='text-align:center'>保存成功!</p>", {
                                time: 1000 //1秒关闭（如果不配置，默认是3秒）
                            });
                        } else {
                            /**保存失败**/
                            layer.msg("<p style='text-align:center'>查询失败!</p>", {
                                time: 1000 //1秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            },
        }
});
