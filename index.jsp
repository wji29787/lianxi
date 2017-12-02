<%@page import="com.visionvera.cms.interceptor.LoginIntercepter"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
if(!LoginIntercepter.allowAccess(request)){
	response.sendRedirect(request.getContextPath()+"/userManagement/login.do");
}else{
	response.sendRedirect(request.getContextPath()+"/main/main.do"); 
}
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
</head>
<body>
</body>
</html>