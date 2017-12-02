<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!--<script type="text/javascript">var home_path= "<%=basePath%>";</script>-->
<!DOCTYPE HTML>
 <script type="text/javascript">var home_path= "<%=basePath%>";</script>
<html>
  <head>
    <base href="<%=basePath%>">
   
    <title>系统配置</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/resources/css/operationManagement/systemConfiguration.css?v=201705111655"/>
  </head>
  
  <body>
  	
    <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
    <div id="deviceManagement" class="bottom-box">
		    <div class="nav-box">
		    	<nav-operation message="3"></nav-operation>
		    </div>
		     <div class="content-box"> 
		     	   <dl class="clearfix">
		     	   	  <dt>
		     	   	  	基本设置
		     	   	  	<em class="der-line"></em>
		     	   	  </dt>
		     	   	  <dd>
		     	   	  	  <i>登录人数限制</i>
		     	   	  	  <span>
		     	   	  	  	  <input oninput="inputNumber(this)" type="text" v-model="limit_login" :disabled="userPermissions==2" :class="{'z-disabled':userPermissions==2}" maxlength=4/>
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd >
		     	   	  	  <i>视频播放IP自动匹配</i>
		     	   	  	  <span onmousedown="return false">
		     	   	  	  	<strong v-cloak>
			     	   	  	  	 <em class="fi  iconfont icon-kai" v-if='ishow==1' @click="ishow=0"></em>
			     	   	  	  	 <em class="fi showFont" v-if='ishow==1'>开</em>
	     	   	  	  	    </strong>
	     	   	  	  	    <strong v-cloak>
			     	   	  	  	 <em class="fi  iconfont icon-guan" v-if='ishow!=1' @click="ishow=1"></em>
			     	   	  	  	 <em class="fi showFont" v-if='ishow!=1'>关</em>
		     	   	  	  	 </strong>
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd>
		     	   	  	  <i>业务分布控制</i>
		     	   	  	  <span>
		     	   	  	      <select v-model="operational_control" v-cloak>
		     	   	  	        <option value="1">节目内容分布</option>
		     	   	  	        <option value="2">云端资源分布</option>
		     	   	  	        <option value="3">个人资源分布</option> 
		     	   	  	      </select>
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd>
		     	   	  	  <i>用户在线时长</i>
		     	   	  	  <span>
		     	   	  	      <select v-model="redis_control" v-cloak>
		     	   	  	        <option value="15">15分钟</option>
		     	   	  	        <option value="60">1小时</option>
		     	   	  	        <option value="1440">1天</option>
		     	   	  	        <option value="10080">7天</option>  
		     	   	  	      </select>
		     	   	  	  </span>
		     	   	  </dd>
		     	   </dl>
		     	   
		     	   <dl class="clearfix">
		     	   	  <dt>
		     	   	  	下载配置
		     	   	  	<em class="der-line"></em>
		     	   	  </dt>
		     	   	  <dd>
		     	   	  	  <i>视频文件下载限速配置</i>
		     	   	  	  <span>
		     	   	  	      <select v-model="download_maxrate" v-cloak>
		     	   	  	        <option value="1">1M/s</option>
		     	   	  	        <option value="2">2M/s</option>
		     	   	  	        <option value="3">3M/s</option>
		     	   	  	        <option value="5">5M/s</option>
		     	   	  	        <option value="10">10M/s</option>
		     	   	  	        <option value="20">20M/s</option>
		     	   	  	      </select><em v-cloak>(互联网)</em>
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd>
		     	   	  	  <i>同时下载最大任务数</i>
		     	   	  	  <span>
		     	   	  	      <select v-model="download_maxcount" v-cloak>
		     	   	  	        <option value="1">1个</option>
		     	   	  	        <option value="2">2个</option>
		     	   	  	        <option value="3">3个</option>
		     	   	  	        <option value="4">4个</option>
		     	   	  	      </select><em v-cloak>(互联网)</em>
		                  </span>
		     	   	  </dd>
		     	   	  <dd v-if="0">
		     	   	  	  <i>点播服务器配置</i>
		     	   	  	  <span>
		     	   	  	  	   <input onblur="filterChara(this)" type="text" v-model="db_server"/>
		     	   	  	  </span>
		     	   	  </dd>
		     	   </dl>
		     	   <dl class="clearfix">
		     	   	  <dt>
		     	   	  	其他设置
		     	   	  	<em class="der-line"></em>
		     	   	  </dt>
		     	   	  <dd>
		     	   	  	  <i>回收站保存时间</i>
		     	   	  	  <span>
		     	   	  	  	  <input oninput="inputNumber(this)" type="text" :disabled="userPermissions==2" :class="{'z-disabled':userPermissions==2}" v-model="recycle_savedate" maxlength=2/>天
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd>
		     	   	  	  <i>视联网DNS1</i>
		     	   	  	  <span>
		     	   	  	  	  <input onblur="filterChara(this)" type="text" :disabled="userPermissions==2" :class="{'z-disabled':userPermissions==2}" v-model="v2v_dns1" maxlength=5/>
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd>
		     	   	  	  <i>视联网DNS2 </i>
		     	   	  	  <span>
		     	   	  	  	  <input onblur="filterChara(this)" type="text" :disabled="userPermissions==2" :class="{'z-disabled':userPermissions==2}" v-model="v2v_dns2" maxlength=5/>
		     	   	  	  </span>
		     	   	  </dd>
		     	   	  <dd>
		     	   	  	  <i>视联网DNS3 </i>
		     	   	  	  <span>
		     	   	  	  	  <input onblur="filterChara(this)" type="text" :disabled="userPermissions==2" :class="{'z-disabled':userPermissions==2}" v-model="v2v_dns3" maxlength=5/>
		     	   	  	  </span>
		     	   	  </dd>
		     	   </dl>
		     	   <div class="submit_div">
		     	   	  <button @click="saveSystemConfig()">保存</button>
		     	   </div>
		    </div> 
     </div>
    <script src="<%=request.getContextPath()%>/resources/js/operationManagement/systemConfiguration.js?v=201705111655"></script>
  </body>
</html>
