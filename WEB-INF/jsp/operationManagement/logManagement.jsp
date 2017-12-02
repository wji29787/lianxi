<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>日志管理</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/operationManagement/logManagement.css?v=201705051655" />

  </head>
  
  <body>
    <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
	    <div id="deviceManagement" class="bottom-box">
		    <div class="nav-box">
		    	<nav-operation message="2"></nav-operation>
		    </div>
		     <div class="content-box"> 
			     	<div class="content-features clearfix" >
						<div class="input-search fr clearfix">
							<input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
							<i class="iconfont icon-sousuo" @click="getList()"></i>
						</div>
						<ul class="features-tab">
						   <li @click="tabChange(1)" v-bind:class="{ 'active':num==1 }">系统日志</li>
						   <li @click="tabChange(2)" v-bind:class="{ 'active':num==2 }">内容管理</li>
						   <li @click="tabChange(3)" v-bind:class="{ 'active':num==3 }">内容编辑</li>
						</ul>
				    </div> 
				    <div class="content-list content-list-thead">
						<dl>
							<dd class="list-first">操作用户</dd>
							<dd class="list-second"@click="getList('','timeSort')">操作时间<em class="iconfont" :class="{'icon-xiajiantou':timeSort,'icon-shangjiantou':!timeSort}"></em></dd>
							<dd class="list-third">操作类型</dd>
							<dd class="list-four">系统权限</dd>
							<dd class="list-fifth">日志详情</dd>
						</dl>
				    </div>
				    <div @scroll="fnScroll($event)" class="content-list content-list-tbody">
						<dl class="clearfix" v-for="list in odataList" v-cloak>
							<dd class="list-first" v-bind:title="list.operateUserName">{{list.operateUserName}}</dd>
							<dd class="list-second">{{list.operateTime|time}}</dd>
							<dd class="list-third" v-bind:title="list.operateTypeName">{{list.operateTypeName}}</dd>
							<dd class="list-four">{{list.userPermissions|permissions-filter}}</dd>
							<dd  class="list-fifth" v-bind:title="list.operateDesc">{{list.operateDesc}}</dd>
						</dl>
						<!--  <dl class="clearfix">
							<dd class="list-first">管理员012</dd>
							<dd class="list-second">2017-05-05</dd>
							<dd class="list-third">创建普通用户</dd>
							<dd class="list-four">超级管理员</dd>
							<dd  class="list-fifth">admin登录</dd>
						</dl>-->
					</div> 
		     </div> 
	     </div>
    <script src="<%=request.getContextPath()%>/resources/js/operationManagement/logManagement.js?v=201705101655"></script>
  </body>
</html>
