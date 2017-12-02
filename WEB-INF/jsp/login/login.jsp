<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>用户登录</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/iconfont/iconfont.css?v=201705051655" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/resources/css/login/login.css"/>
	<script>
		;(function(win,doc){
			 var rem = 100 * doc.documentElement.clientWidth / 1920;
		     doc.documentElement.style.fontSize = rem + 'px';
		     win.onresize = function () {
		         rem = 100 * doc.documentElement.clientWidth / 1920;
		         doc.documentElement.style.fontSize = rem + 'px';
		     };
		})(window,document);
	</script>
  </head>
  
  <body>
		<div class="login-box">
			<div class="login-box-title">
				<h1>
					<img src="<%=request.getContextPath()%>/resources/images/login_logo.png" />
					<span>内容管理平台</span>
				</h1>
			</div>
			<div class="login-box-content">
				<div class="login-box-content-input"><label class="iconfont icon-yonghuming"></label><input id="user_name" type="text" placeholder="请输入账号"/></div>
				<div class="login-box-content-input"><label class="iconfont icon-mima"></label><input id="pass_word" type="password" placeholder="请输入密码"/></div>
				<div class="login-box-content-button">
					<button id="login_btn">登陆</button>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/jquery/jquery-1.11.2.min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/layer/layer.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/login/login.js"></script>
  </body>
</html>
