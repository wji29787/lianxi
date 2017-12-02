<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>500</title>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/common.css" />
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/500.css" />
</head>
<body>
	<div class="container">
		<div class="container-bg">
			<a href="javascript:location.reload(true)" class="block refresh-box clearfix">
				<span class="refresh-img block fl"></span>
				<span class="block fl">刷新</span>
			</a>
			<a href="javascript:history.go(-1)" class="block back-box clearfix">
				<span class="back-img block fl"></span>
				<span class="block fl">返回</span>
			</a>
		</div>
	</div>
</body>
</html>
