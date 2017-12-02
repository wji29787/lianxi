<%@page import="com.visionvera.util.SiteConfig"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/common/base.css?v=201705051655" />
<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/iconfont/iconfont.css?v=201705051655" />
<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/common/common.css?v=201705111655" />
<script type="text/javascript">var home_path= "<%=basePath%>";</script>
<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/jquery/jquery-1.11.2.min.js?v=201705021655"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/layer/layer.js?v=201705021655"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/vue/vue.js?v=201705021655"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/common/common.js?v=201705091655"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/jquery/jquery.nicescroll.min.js?v=201705021655"></script>

    <div class="header-box">
		<h1 class="header-logo">
			<a href="main/main.do">
				<img src="<%=request.getContextPath()%>/resources/images/logo.png" alt="" />
				<strong>内容管理平台&nbsp;V<%=SiteConfig.getV2vVersion() %></strong>
			</a>
		</h1>
		<nav class="header-nav">
			<ul>
				<li class="main-page">
					<a href="main/main.do">首页</a>
				</li>
				<li class="personal-page">
					<a href="personalResources/recordingTask/realTimeRecording.do">个人资源</a>
				</li>
				<li class="cloud-page">
					<a href="cloudResources/cloudSpace/cloudSpace.do">云端资源</a>
				</li>
				<!-- <li class="contentEditing-page">
					<a href="resource/contentEditing.do">内容编辑</a>
				</li> -->
				<li class="contentEditing-page">
					<a href="editContent/publishWeburl/newContentEditing.do">内容编辑</a>
				</li> 
				<li class="userManagement-page">
					<a href="userManagement/userManagement.do">用户管理</a>
				</li>
				<li class="operationM-page">
					<a href="operationManagement/deviceManagement/deviceManagement.do">运维管理</a>
				</li>
			</ul>
		</nav>
		
		<div class="heder-userinfo">
			<div class="heder-userinfo-login">
				<i class="iconfont icon-yonghuming"></i>
				<a class="heder-userinfo-op" href="javascript:;">${userInfo.userAccount}</a>
			</div>
			<div class="heder-userinfo-cancel" onclick="userExit()">
				<i class="iconfont icon-zhuxiao"></i>
				<a class="heder-userinfo-op" href="javascript:;">注销</a>
			</div>
		</div>
    </div>
	<input type="hidden" value="${userInfo.userId}" id="userId"/>
	<input type="hidden" value="${userInfo.userAccount}" id="userAccount"/>
	<input type="hidden" value="${userInfo.userPermissions}" id="userPermissions"/>
	<input type="hidden" value="${SystemSwitch}" id="userSwitch" />