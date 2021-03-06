<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>实时录制</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/personalResources/realTimeRecording.css?v=201705081655" />
  </head>
  
  <body>
   <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
   <div id="personalResources" class="bottom-box">
	    <div class="nav-box">
	       <nav-personal message="1"></nav-personal>
	     </div>
	     <div class="content-box"> 
		    <div class="content-features clearfix" >
					<div class="features-btn-box fr clearfix" v-if="sIsShow" v-cloak>
					    <a href="javascript:;" v-if="odataList.length>0" class="features-btn fl" @click="checkBatchOperation(1)">批量删除</a>
					    <a href="javascript:;" v-else class="features-btn fl z-disabled">批量删除</a>
					</div>
					<div class="features-btn-box fr clearfix" v-else v-cloak>
					    <a href="javascript:;" class="features-btn color-sure fl" @click="checkBatchOperation(3)">确定</a>
					    <a href="javascript:;" class="features-btn fl"  @click="checkBatchOperation(2)">取消</a>
					</div>
					<div class="input-search fr clearfix" v-cloak>
						<input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
						<i class="iconfont icon-sousuo" @click="getList()"></i>
					</div>
			</div>
			<div class="content-list content-list-thead">
				<dl v-if="sIsShow" class="pl60">
					<dd class="list-first">录像名称</dd>
					<dd class="list-second" @click="getList('','timeSort')">创建时间<em class="iconfont" :class="{'icon-xiajiantou':timeSort,'icon-shangjiantou':!timeSort}"></em></dd>
					<dd class="list-third">创建用户</dd>
					<dd class="list-third mLr30">录制时间</dd>
					<dd class="list-four">当前状态</dd>
					<dd class="list-fifth">功能操作</dd>
				</dl>
				<div class="content-list-thead-tab" v-else>
					<div class="z-icon-box" @click.stop="fnClickAll()" v-cloak>
						<i class="iconfont" v-bind:class="{'icon-weixuanzhong':!isSelectAll,'icon-xuanzhong':isSelectAll}"></i>
					</div>
				    <div class="list-first content-list-thead-all" v-cloak>全选（<span>{{checkNum}}/{{checkAllNum}}</span>）</div>
				</div>
			</div>
			 <div  @scroll="fnScroll($event)" class="content-list content-list-tbody">
				<dl class="clearfix" :class="{'pl60':sIsShow}" v-for="(list,$index) in odataList" :data-taskid="list.taskid" v-cloak>
				       <div class="z-icon-box z-h140">
				      	 <i class="iconfont" @click.stop="fnClick($index)" v-bind:class="{'icon-weixuanzhong':!isSelectAll && !list.isSelected,'icon-xuanzhong':isSelectAll || list.isSelected}" v-show="!sIsShow"></i>
				       </div>	
						<dd class="list-first list-img-box" v-bind:title="list.capturename">
						    <div class="list-oimg">
						        <img v-bind:src="list.iconpath" onerror="this.src='resources/images/img-lose.png'"/>
						    </div>
				           {{list.capturename}}
						</dd>
						<dd class="list-second">{{list.starttime|time}}</dd>
						<dd class="list-third">{{list.userAccount}}</dd>
						<dd class="list-third mLr30">{{list.duration|stime}}</dd>
						<dd class="list-four" :class="{'state-starting':list.taskstate==3,'state-error':list.taskstate<0,'state-default':list.taskstate>=0 && list.taskstate!=3}">{{list.taskstate|taskstate-filter}}</dd>
						<dd  class="list-fifth">
						
							 <a href="javascript:;" v-if="list.taskstate<0 || list.resourceState==2" class="iconfont icon-lookIcon look-a state-btn-disabled" title="暂不可预览"></a>
						     <a href="javascript:;" v-else @click.stop="list_look(list.taskid,$index)" class="iconfont icon-lookIcon look-a" title="预览"></a>
						     
						     <a href="javascript:;" v-if="list.taskstate<0 || list.resourceState==2 || list.taskstate==3" class="iconfont icon-bianji edit-a state-btn-disabled" title="暂不可查看"></a>
						     <a href="javascript:;" v-else @click.stop="list_edit(list.taskid,$index)" class="iconfont icon-bianji edit-a" title="查看详情"></a>
						     
						     <a href="javascript:;" v-if="list.taskstate==3" class="iconfont icon-shanchu delete-a state-btn-disabled" title="暂不可删除"></a>
						     <a href="javascript:;" v-else class="iconfont icon-shanchu delete-a" @click.stop="delete_data([{'taskId':list.taskid,'index':$index}])"  title="删除" ></a>
						</dd>
					</dl>
			 </div>
		 </div> 
	</div>
	
	<script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/jwplayer/jwplayer.js?v=201705151655"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/personalResources/realTimeRecording.js?v=201705151655"></script>
  </body>
</html>
