<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!--<script type="text/javascript">var home_path= "<%=basePath%>";</script>-->
<!DOCTYPE HTML>
<script type="text/javascript">var home_path = "<%=basePath%>";</script>
<html>
<head>
    <base href="<%=basePath%>">

    <title>系统配置</title>

    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" type="text/css"
          href="<%=request.getContextPath()%>/resources/css/operationManagement/cascadeManagement.css"/>
</head>

<body>
<jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
<div id="cascadeManagement" class="bottom-box">
    <div class="nav-box">
        <nav-operation message="4"></nav-operation>
    </div>
    <div class="cascade-content-box">

        <!--内容头部刷新按钮-->
        <div class="cascade-reload">
            <span class="fr" @click.stop="reloadData()">刷新页面</span>
        </div>

        <!--内容主区域分左右两部分-->
        <div class="cascade-content" v-cloak>

            <!--左侧滚动列表-->
            <div class="edit-content-bottom-tabs">
                <div class="bottom-tabs-list-box">
                    <div class="tabs-search">
                        <input v-model="searchWord" class="tabs-search-input" type="text" placeholder="请输入关键字">
                        <i class="iconfont icon-sousuo tabs-search-btn" @click.stop="fnSearch()"></i>
                    </div>
                    <ul class="bottom-tabs-list" @scroll="fnScroll($event)">
                        <li v-for="(item,index) in serverList" @click.stop="serverClick(index)"
                            :class="{'active':index==serverIndex}">
                            <span :title="'终端号：'+item.serverNumber+' 录播名称：'+item.serverName">{{item.serverNumber}} : {{item.serverName}}</span>
                        </li>
                    </ul>
                </div>
                <div class="bottom-tabs-op">
                    <i @click.stop="addServer()" class="iconfont icon-tianjia" title="添加标签"></i>
                    <i v-if="serverList.length" @click.stop="delServer()" class="iconfont icon-shanchu" title="删除标签"></i>
                </div>
            </div>

            <!-- 级联内容右侧业务统计，个人资源分布，空间占比，服务状态，模块-->
            <div v-if="serverList.length" class="cascade-main-box">
                <div class="cascade-main">
                    <div class="cascade-main-business cascade-main-item" @click.stop="fncontentShow(1)"
                         :class="{'active':contentShow==1}">
                        <h3 class="cascade-main-item-title">
                            <i class="_lt"></i>
                            <i class="_rt"></i>
                            <i class="_lb"></i>
                            <i class="_rb"></i>
                            业务统计
                        </h3>
                        <div class="business-item">
                            <span class="business-item-title">内容播放</span>
                            <span class="business-item-txt"><b>{{business.playNum}}<i>次</i></b></span>
                        </div>
                        <div class="business-item">
                            <span class="business-item-title">实时录制</span>
                            <span class="business-item-txt"><b>{{business.recordNum}}<i>次</i></b></span>
                        </div>
                    </div>
                    <div class="cascade-main-personal cascade-main-item" @click.stop="fncontentShow(2)"
                         :class="{'active':contentShow==2}">
                        <h3 class="cascade-main-item-title">
                            <i class="_lt"></i>
                            <i class="_rt"></i>
                            <i class="_lb"></i>
                            <i class="_rb"></i>
                            {{selectData.title}}
                        </h3>
                        <div class="personal-item">
                            <h5 class="personal-item-title">本月最高资源占用</h5>
                            <p class="personal-item-con">
                                <span :title="selectData.max.name">{{selectData.max.name | fourStr}}</span>
                                <span>{{selectData.max.value}}</span>
                            </p>
                        </div>
                        <div class="personal-item">
                            <h5 class="personal-item-title">本月最低资源占用</h5>
                            <p class="personal-item-con">
                                <span :title="selectData.min.name">{{selectData.min.name | fourStr}}</span>
                                <span>{{selectData.min.value}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="cascade-main-space cascade-main-item" @click.stop="fncontentShow(3)"
                         :class="{'active':contentShow==3}">
                        <h3 class="cascade-main-item-title">
                            <i class="_lt"></i>
                            <i class="_rt"></i>
                            <i class="_lb"></i>
                            <i class="_rb"></i>
                            空间占比
                        </h3>
                        <div class="space-min">
                            <div id="space_main" class="space-box">
                            </div>
                            <div id="space_txt" class="space-txt"></div>
                        </div>
                    </div>
                    <div class="cascade-main-serve cascade-main-item" @click.stop="fncontentShow(4)"
                         :class="{'active':contentShow==4}">
                        <h3 class="cascade-main-item-title">
                            <i class="_lt"></i>
                            <i class="_rt"></i>
                            <i class="_lb"></i>
                            <i class="_rb"></i>
                            服务状态
                        </h3>
                        <div class="serve-item">
                            <div class="serve-item-box">
                                <div class="serve-item-num">
                                    <span>{{serverData.other}}</span>
                                    <i>个</i>
                                </div>
                                <h5 class="serve-item-title">其他</h5>
                            </div>
                        </div>
                        <div class="serve-item">
                            <div class="serve-item-box">
                                <div class="serve-item-num">
                                    <span>{{serverData.play}}</span>
                                    <i>个</i>
                                </div>
                                <h5 class="serve-item-title">播放</h5>
                            </div>
                        </div>
                        <div class="serve-item">
                            <div class="serve-item-box">
                                <div class="serve-item-num">
                                    <span>{{serverData.record}}</span>
                                    <i>个</i>
                                </div>
                                <h5 class="serve-item-title">录制</h5>
                            </div>
                        </div>
                        <div class="serve-item serve-free">
                            <div class="serve-item-box">
                                <div class="serve-item-num">
                                    <span>{{serverData.free}}</span>
                                    <i>个</i>
                                </div>
                                <h5 class="serve-item-title">空闲</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cascade-maincontent">
                    <div class="business-content cascade-maincontent-item aa" :class="{'active':contentShow==1}">
                        <div class="business-canvas" id="business_canvas"></div>
                        <ul class="business-op">
                            <li @click.stop="businessActive(1)" :class="{'active':business.show==1}">
                                <i></i><span>月</span></li>
                            <li @click.stop="businessActive(2)" :class="{'active':business.show==2}">
                                <i></i><span>周</span></li>
                            <li @click.stop="businessActive(3)" :class="{'active':business.show==3}">
                                <i></i><span>日</span></li>
                        </ul>
                        <ul class="business-txt">
                            <li><i></i><span>内容播放 <em>(次)</em></span></li>
                            <li><i></i><span>实时录制 <em>(次)</em></span></li>
                        </ul>
                    </div>
                    <div class="personal-content cascade-maincontent-item" :class="{'active':contentShow==2}">
                        <div class="personal-canvas" id="personal_canvas"></div>
                    </div>
                    <div class="space-content cascade-maincontent-item aa" :class="{'active':contentShow==3}">
                        暂无其他详细信息浏览~
                    </div>
                    <div class="serve-content cascade-maincontent-item aa" :class="{'active':contentShow==4}">
                        暂无其他详细信息浏览~
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="loading-box">
    <img src="<%=request.getContextPath()%>/resources/images/loding1.gif" alt="">
</div>

<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/echarts.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/echarts-liquidfill.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/operationManagement/cascadeManagement.js"></script>
</body>
</html>
