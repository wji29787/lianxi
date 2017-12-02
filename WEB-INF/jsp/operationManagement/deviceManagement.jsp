<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>设备管理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/operationManagement/deviceManagement.css?v=201705151655" />
  </head>
  
  <body>
      <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
       <div id="deviceManagement" class="bottom-box">
	      <div class="nav-box">
	          <nav-operation message="1"></nav-operation>
	      </div>
	      <div class="content-box">
	          	<div class="content-features clearfix" >
					<div class="input-search fr clearfix">
						<input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
						<i class="iconfont icon-sousuo" @click="getList()"></i>
					</div>
				</div>
				<div class="content-list content-list-thead">
					<dl>
						<dd class="list-four">设备号码</dd>
						<dd class="list-first">设备名称</dd>
						<dd class="list-second">设备类型</dd>
						<dd class="list-third">MAC地址</dd>
						<dd class="list-fifth">设备状态</dd>
						<dd class="list-six">功能操作</dd>
					</dl>
				</div>
				<div class="content-list content-list-tbody">
					<dl class="clearfix" v-for="(list,index) in odataList" v-cloak>
						<dd class="list-four">{{list.stationid}}</dd>
						<dd class="list-first">{{list.name}}</dd>
						<dd class="list-second">{{list.servertype|type-filter}}</dd>
						<dd class="list-third">{{list.mac}}</dd>
						<dd  class="list-fifth">{{list.serverstate|state-filter}}</dd>
						<dd  class="list-six">
							<a href="javascript:;" class="look-a iconfont icon-chakan" @click="lookDevice(index)" :title="'查看详情'"></a>
						</dd>
					</dl>
					
					<!--  <dl class="clearfix">
						<dd class="list-first">
							VVT248
						</dd>
						<dd class="list-second">收录服务器</dd>
						<dd class="list-third">a4:b1:c5:d3</dd>
						<dd class="list-four">12345</dd>
						<dd  class="list-fifth">正常</dd>
						<dd  class="list-six">
							<a href="javcscipt:;" class="look-a iconfont icon-chakan"></a>
						</dd>
					</dl>-->
				</div> 
	      </div>
	    </div>
        <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/operationManagement/deviceManagement.js?v=201705151655"></script>
  </body>
</html>
