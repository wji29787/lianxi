<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML>
<html>
<head>
    <base href="<%=basePath%>">
    <title>实时转码</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <link rel="stylesheet"
          href="<%=request.getContextPath()%>/resources/css/personalResources/transcoding.css?v=201705081655"/>

</head>

<body>
<jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
<div id="personalResources" class="bottom-box">
    <div class="nav-box">
        <nav-personal message="4"></nav-personal>
    </div>
    <div class="content-box">
        <div class="content-features clearfix">
            <div class="features-btn-box fr clearfix" v-if="sIsShow" v-cloak>
                <a href="javascript:;" class="features-btn fl" @click.stop="uploadVideoLayer()"><i></i>上传视频</a>
                <a href="javascript:;" v-if="odataList.length>0" class="features-btn fl"
                   @click="checkBatchOperation(1)">批量删除</a>
                <a href="javascript:;" v-else class="features-btn fl z-disabled">批量删除</a>
            </div>
            <div class="features-btn-box fr clearfix" v-else v-cloak>
                <a href="javascript:;" class="features-btn color-sure fl" @click="checkBatchOperation(3)">确定</a>
                <a href="javascript:;" class="features-btn fl" @click="checkBatchOperation(2)">取消</a>
            </div>
            <div class="input-search fr clearfix" v-cloak>
                <input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
                <i class="iconfont icon-sousuo" @click="getList()"></i>
            </div>
        </div>
        <div class="content-list content-list-thead">
            <dl v-if="sIsShow" class="pl60 ti0">
                <dd class="list-first">录像名称</dd>
                <dd class="list-second" @click="getList('','timeSort')">创建时间<em class="iconfont"
                                                                                :class="{'icon-xiajiantou':timeSort,'icon-shangjiantou':!timeSort}"></em>
                </dd>
                <dd class="list-third">创建用户</dd>
                <dd class="list-four">录像时长</dd>
                <dd class="list-progress">转码进度</dd>
                <dd class="list-state">当前状态</dd>
                <dd class="list-fifth">功能操作</dd>
            </dl>
            <div class="content-list-thead-tab" v-else>
                <div class="z-icon-box" @click.stop="fnClickAll()" v-cloak>
                    <i class="iconfont"
                       v-bind:class="{'icon-weixuanzhong':!isSelectAll,'icon-xuanzhong':isSelectAll}"></i>
                </div>
                <div class="list-first content-list-thead-all" v-cloak>全选（<span>{{checkNum}}/{{checkAllNum}}</span>）
                </div>
            </div>
        </div>
        <div @scroll="fnScroll($event)" class="content-list content-list-tbody">
            <dl class="clearfix" :class="{'pl60':sIsShow}" v-for="(list,$index) in odataList"
                :data-taskid="list.resourceId" v-cloak>
                <div class="z-icon-box z-h140">
                    <i v-if="list.resourceState==1" v-show="!sIsShow"> &nbsp; </i>
                    <i v-if="list.resourceState==2 || list.resourceState==-1 ||list.resourceState==0" class="iconfont"
                       @click.stop="fnClick($index)"
                       v-bind:class="{'icon-weixuanzhong':!isSelectAll && !list.isSelected,'icon-xuanzhong':isSelectAll || list.isSelected}"
                       v-show="!sIsShow"></i>
                </div>
                <dd class="list-first list-img-box" v-bind:title="list.resourceName">
                    <div class="list-oimg">
                        <img v-bind:src="list.iconPath" onerror="this.src='resources/images/img-lose.png'"/>
                    </div>
                    {{list.resourceName}}
                </dd>
                <dd class="list-second">{{list.createTime|time}}</dd>
                <dd class="list-third">{{list.userAccount}}</dd>
                <dd class="list-four">{{list.duration|stime}}</dd>
                <dd class="list-progress">
                    <div class="zprogress"
                         :class="{'error': list.resourceState==-1,'success':list.resourceState!=0 && list.resourceState!=1,'doing':list.resourceState==1}">
                        <span class="zprogress-bg"><i class="zprogress-finish"
                                                      :style="{width:list.percent+'%'}"></i></span>
                        <p class="zprogress-txt">转码中{{list.percent}}%</p>
                    </div>

                </dd>
                <dd class="list-state"
                    :class="{'error':list.resourceState==-1,'success':list.resourceState!=0 || list.resourceState!=1,'doing':list.resourceState==1}">
                    {{list.resourceState|trans-state}}
                </dd>
                <dd class="list-fifth">
                    <a v-if="list.resourceState==2 || list.resourceState==3" href="javascript:;"
                       @click.stop="list_look(list.resourceId,$index)" class="iconfont icon-lookIcon look-a"
                       title="播放"></a>
                    <a v-else class="iconfont icon-lookIcon look-a state-btn-disabled" title="暂不可播放"></a>

                    <a v-if="list.resourceState==2 || list.resourceState==3" href="javascript:;"
                       @click.stop="list_edit(list.resourceId,$index)" class="iconfont icon-bianji edit-a"
                       title="查看"></a>
                    <a v-else class="iconfont icon-bianji edit-a state-btn-disabled" title="暂不可查看"></a>

                    <a v-if="list.resourceState!=1" href="javascript:;" class="iconfont icon-shanchu delete-a"
                       @click.stop="delete_data([{'resourceId':list.resourceId,'index':$index}])" title="删除"></a>
                    <a v-else class="iconfont icon-shanchu delete-a state-btn-disabled" title="暂不可删除"></a>
                </dd>
            </dl>
        </div>
    </div>
</div>

<script type="text/javascript"
        src="<%=request.getContextPath()%>/resources/js/controls/jwplayer/jwplayer.js?v=201705151655"></script>
<script type="text/javascript"
        src="<%=request.getContextPath()%>/resources/js/personalResources/transcoding.js?v=201705111655"></script>
<script type="text/javascript"
        src="<%=request.getContextPath()%>/resources/js/controls/webuploader/webuploader.min.js?v=201705111655"></script>
</body>
</html>
