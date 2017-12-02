<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base class="basePath" href="<%=basePath%>">
    <title>首页</title> 
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/main/main.css?v=201705151655" />
  </head>
  
  <body>
   <div class="box-body">
	   <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
	   
	   <div class="content clearfix">
	       <div class="left-content fl">
	          <div class="left-box">
	              <h4 class="title-h"><i></i><i>业务统计</i></h4>
	              <div class="select-box">
	                  <ul class="select-ul fr">
	                      <li class="active fl" onclick="soFar(this)">至今</li>
	                      <li class=" fl" onclick="MonthBar(this)">月</li>
	                      <li class="fl" onclick="WeekBar(this)">周</li>
	                      <li class="fl" onclick="DayBar(this)">日</li>
	                  </ul>
	              </div>
	              <div class="month-box">
	                  <div class="bar-box" id="bar-box"></div>
		              <ul class="bottom-ul">
		                 <li class="fl"><span class='one fl'></span><i class="fl">内容播放次数（次）</i></li>
		                 <li class="fl"><span class='two fl'></span><i class='fl'>实时录制数（次）</i></li>
		              </ul>
	              </div>
	              <div class="zhijin-box">
	                  <ul class="zhijin-ul">
	                      <li class="zhijin-li zhijin-play" id="zhijin-play"><span></span></li>
	                      <li class="zhijin-li zhijin-record" id="zhijin-record"><span></span></li>
	                  </ul>
	                  <ul class="txt-ul">
	                      <li class="txt-play">内容播放数（次）</li>
	                      <li class="txt-record">实时录制数（次）</li>
	                  </ul>
	              </div>
	          </div>
	       </div>
	       <div class="right-content fl">
	          <div class="right-box">
	               <div class="right-top">
	                  <h4 class="title-h"><i></i><i id='distribution-i'>节目内容分布</i></h4>
	                  <div class="program-box" id="program"></div>
	               </div>
	               <div class="right-bottom">
	                    <div class="left-bottom fl">
	                       <h4 class="title-h"><i></i><i class="filesystemSize-i">空间占比 ()</i></h4>
	                       <div class="space-box">
	                           <div class='bg-box'>
	                                <div class="block-box" id="block-box"></div>
	                                <div class="circular-box"></div>
	                           </div>
	                       </div>
	                    </div>
	                    <div class="right-bottom fl">
	                       <h4 class="title-h"><i></i><i id='circular_right-i'>服务状态 ()</i></h4>
	                       <div class="space-box">
	                          <div class="space-left fl">
	                             <div class="circular_right-box" id="circular_right-box"></div>
	                            <!-- <canvas id="c1" class="c1" width="214px" height="214px"></canvas> -->
	                          </div>
	                           <ul class="space-right fl">
	                           	   <li><span class="bg-span4"></span><i>其他(个)</i></li>
	                               <li><span class="bg-span"></span><i>播放(个)</i></li>
	                               <li><span class="bg-span2"></span><i>录制(个)</i></li>
	                               <li><span class="bg-span3"></span><i>空闲(个)</i></li>
	                           </ul>
	                       </div>
	                    </div>
	               </div>
	          </div>
	       </div>
	   </div>
   </div>
   <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/main/main.js?v=201705041655"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/echarts.min.js?v=201705021655"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/echarts-liquidfill.js?v=201705021655"></script>
  </body>
</html>
