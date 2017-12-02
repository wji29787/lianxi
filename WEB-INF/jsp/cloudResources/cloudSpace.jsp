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
   
    <title>云端资源</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/resources/css/cloudResources/cloudSpace.css?v=201705121655""/>
  </head>
  
  <body>
    <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
    <div id="cloudResources" class="bottom-box">
    		
			<!-- 公用的左侧模板结构 -->
			<div class="comm-nav-box" :class="{'has-list-op':userPermissions!=2}">
				<div class="comm-nav-top">
					<i class="fl iconfont icon-yunduo"></i>
					<span class="fl">云空间</span>
				</div>
		
				<ul id="z_focus_input" class="comm-nav-list">
					<li @click.stop="nav_click(index)" v-bind:class="{'active':itn.state,'edit':itn.edit>0}" v-for="(itn,index) in nav_left" v-cloak>
						<span v-bind:title="itn.txt">{{itn.txt}}</span>
						<input type="text"  @blur="nav_blur(index)" v-model="navEditTxt" maxlength=40/>
					</li>
				</ul>
				
				<div class="comm-nav-op" v-if="userPermissions!=2" v-cloak>
					<i @click.stop="nav_add(0)" class="iconfont icon-tianjia" title="添加云空间"></i>
					
					<i v-if="userCloudState==2 || userPermissions==0" @click.stop="nav_edit()" class="iconfont icon-bianji1" title="编辑云空间"></i>
					<i v-else class="iconfont icon-bianji1 z-disabled" title="不可编辑"></i>
					
					<i v-if="userCloudState==2 || userPermissions==0" @click.stop="nav_del()" class="iconfont icon-shanchu" title="删除云空间"></i>
					<i v-else class="iconfont icon-shanchu z-disabled" title="不可删除"></i>
				</div>
			</div>
			
			
			<!-- 内容 -->
		    <div class="content-box"> 
		     	 <div class="content-features clearfix" >
			     	    <div class="features-btn-box fr clearfix" v-if="sIsShow" v-cloak>
			     	    
			     	    	<!-- 普通用户时不让他添加用户 -->
			     	        <a href="javascript:;" v-if="userCloudState!=0 || userPermissions==0" class="features-btn fl" @click.stop="checkBatchOperation(1,1)" v-show="!tabFlag">添加成员</a>
			     	        <a href="javascript:;" v-else class="features-btn fl z-disabled"  v-show="!tabFlag">添加成员</a>
			     	        
			     	        <a href="javascript:;" v-if="nav_left.length" class="features-btn fl" @click.stop="checkBatchOperation(1,1)" v-show="tabFlag">共享资源</a>
			     	        <a href="javascript:;" v-else class="features-btn fl z-disabled" v-show="tabFlag">共享资源</a>
			     	        
			     	        <!-- 普通用户时不让他删除操作 -->
						    <a href="javascript:;" v-if="(userCloudState!=0 || userPermissions==0) && odataList.length>0" class="features-btn fl" @click.stop="checkBatchOperation(1,-1)">批量移除</a>
						    <a href="javascript:;" v-else class="features-btn fl z-disabled">批量移除</a>
						</div>
						<div class="features-btn-box fr clearfix" v-else v-cloak>
						    <a href="javascript:;" class="features-btn color-sure fl" @click.stop="checkBatchOperation(3)">确定</a>
						    <a href="javascript:;" class="features-btn fl"  @click.stop="checkBatchOperation(2)">取消</a>
						</div>
						<div class="input-search fr clearfix" v-cloak>
							<input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
							<i class="iconfont icon-sousuo" @click.stop="getList()"></i>
						</div>
						<ul class="features-tab">
						   <li v-bind:class="{ 'active': tabFlag }" @click.stop="tabSwitch(true)">空间资源</li>
						   <li v-bind:class="{ 'active': !tabFlag }" @click.stop="tabSwitch(false)">空间成员</li>
						</ul>
				    </div> 
				    <div class="content-list content-list-thead" v-bind:class="{'has-img-list':tabFlag }" v-if="sIsShow">
						<dl class="z-addfrom" v-if="tabFlag" v-cloak>
							<dd class="list-first">录像名称</dd>
							<dd class="list-second"@click="getList('','timeSort')">共享时间<em class="iconfont" :class="{'icon-xiajiantou':timeSort,'icon-shangjiantou':!timeSort}"></em></dd>
							<dd class="list-third">共享用户</dd>
							<dd class="list-four">录像时长</dd>
							<dd class="list-from">资源来源</dd>
							<dd class="list-fifth">功能操作</dd>
						</dl>
						<dl v-else if="!tabFlag" v-cloak>
							<dd class="list-first">成员名称</dd>
							<dd class="list-second"@click="getList('','timeSort')">添加时间<em class="iconfont" :class="{'icon-xiajiantou':timeSort,'icon-shangjiantou':!timeSort}"></em></dd>
							<dd class="list-third">当前状态</dd>
							<dd class="list-four">空间权限</dd>
							<dd class="list-fifth">功能操作</dd>
						</dl>
				    </div>
				    
				    <div class="content-list-thead-tab" v-else>
						<div class="z-icon-box" @click.stop="fnClickAll()" v-cloak>
							<i class="iconfont" v-bind:class="{'icon-weixuanzhong':!isSelectAll,'icon-xuanzhong':isSelectAll}"></i>
						</div>
					    <div class="list-first content-list-thead-all" v-cloak>全选（<span>{{checkNum}}/{{checkAllNum}}</span>）</div>
					</div>
				    
				    <div class="content-list content-list-tbody" v-bind:class="{'has-img-list':tabFlag,'z-flag':!sIsShow}" @scroll="fnScroll($event)">
				        <dl class="clearfix z-addfrom" :data-taskid="list.taskid" :class="{'pl60':sIsShow}" v-if="tabFlag" v-for="(list,$index) in odataList" :data-sourceid="list.sourceId" v-cloak>
							    
							    <div class="z-icon-box z-h140">
						      	 <i class="iconfont" @click.stop="fnClick($index)" v-bind:class="{'icon-weixuanzhong':!isSelectAll && !list.isSelected,'icon-xuanzhong':isSelectAll || list.isSelected}" v-show="!sIsShow"></i>
						       </div>
								<dd class="list-first list-img-box" v-bind:title="list.sourceName">
								    <div class="list-oimg">
								        <img v-bind:src="list.iconpath" onerror="this.src='resources/images/img-lose.png'"/>
								    </div>
								    {{list.sourceName || list.capturename}}
								</dd>
								
								<dd class="list-second">{{list.shareTime || list.starttime | time}}</dd>
								<dd class="list-third" v-bind:title="list.shareUserAccount" >{{list.shareUserAccount || list.userAccount}}</dd>
								<dd class="list-four">{{list.duration|stime}}</dd>
								<dd class="list-from">{{list.type | from-filter}}</dd>
								<dd  class="list-fifth"  v-if="opConfig.state==0">
								     <a href="javascript:;" @click.stop="list_look(list.sourceId,$index,list.type,list.id)" class="iconfont icon-ttpodicon play-a" title="播放"></a>
								     <a href="javascript:;" @click.stop="fnGoPushNew(list)" :data-pathImage="list.framepath" v-bind:data-duration="list.duration" v-bind:data-sourceName="list.sourceName"  v-bind:data-v2vurl="list.v2vurl" title="推送" class="iconfont icon-tuisong push-a"></a>
								     
								     <a href="javascript:;" v-if="userCloudState!=0 || userPermissions==0" class="iconfont icon-shanchu delete-a" @click.stop="delete_data([{'taskId':list.sourceId,'index':$index,'type':list.type}])" title="删除"></a>
								     <a href="javascript:;" v-else-if="userCloudState==0 || userPermissions!=0" class="iconfont icon-shanchu delete-a state-default" title="权限不足"></a> 
								</dd>
						</dl>
					
					
					
						<dl class="clearfix" :class="{'pl60':sIsShow}" v-if="!tabFlag" v-for="(list,$index) in odataList" v-cloak>
						    <div class="z-icon-box z-h80">
					      	 <i class="iconfont" @click.stop="fnClick($index)" v-bind:class="{'icon-weixuanzhong':!isSelectAll && !list.isSelected,'icon-xuanzhong':isSelectAll || list.isSelected}" v-show="!sIsShow"></i>
					       </div>
							<dd class="list-first" v-bind:title="list.userAccount" >{{list.userAccount}}</dd>
							<dd class="list-second" >{{list.createTime || list.userCreatTime |time}}</dd>
							<dd class="list-third">{{list.userState|state-filter}}</dd>
							
							<dd class="list-four" >{{ list.cloudSpaceStatus | cloudState-filter}}</dd>
							
							<dd  class="list-fifth" v-if="opConfig.state==0">
								
								
								 <!-- 为空间创建者不可操作 -->	
							     <a href="javascript:;" class="state-default"  v-if="list.cloudSpaceStatus==2" title="空间创建者不可操作"> — </a>
								 <!-- 当为空间创建者或者超管并且状态可以授权 -->	
							     <a href="javascript:;" class="iconfont icon-dunpai authorization-a" @click.stop="warrant($index,1)" v-else-if="(userPermissions==0 || userCloudState==2) && list.cloudSpaceStatus==0" title="授权"></a>
							     <!-- 当为空间创建者或者超管并且状态已授权可以取消授权 -->
							     <a href="javascript:;" class="iconfont icon-quxiaoshouquan authorization-a" @click.stop="warrant($index,-1)" v-else-if="(userPermissions==0 || userCloudState==2) && list.cloudSpaceStatus==1" title="取消授权"></a>
							     <!-- 普通用户 或者空间管理不可授权操作-->
							     <a href="javascript:;" class="iconfont authorization-a state-default" :class="{'icon-dunpai':list.cloudSpaceStatus==0,'icon-quxiaoshouquan':list.cloudSpaceStatus==1}"  v-else title="权限不足"></a>
							     
							     
							     <!-- 为空间创建者不可操作 -->	
							     <a href="javascript:;" class="state-default"  v-if="list.cloudSpaceStatus==2" title="空间创建者不可操作"> — </a>
							     <!-- 当为管理员或者超管且当前用户不为空间创建者可以删除空间管理或者普通成员 -->	
							     <a href="javascript:;" class="iconfont icon-yichuyonghu removeuser-a" @click.stop="delete_data([{'taskId':list.userId,'index':$index}])" v-else-if="userPermissions==0 || userCloudState==2" title="删除当前用户"></a>
							     <!-- 当为空间管理者不能删除同级的管理者-->	
							     <a href="javascript:;" class="iconfont icon-yichuyonghu removeuser-a state-default"  v-else-if="userCloudState==1 && list.cloudSpaceStatus==1" title="权限不足"></a>
							     <!-- 当为空间管理者删除普通成员 -->
							     <a href="javascript:;" class="iconfont icon-yichuyonghu removeuser-a" @click.stop="delete_data([{'taskId':list.userId,'index':$index}])" v-else-if="userCloudState==1 && list.cloudSpaceStatus==0" title="删除当前用户"></a>
							     <!-- 普通用户 -->
							     <a href="javascript:;" class="iconfont icon-yichuyonghu removeuser-a state-default"  v-else title="权限不足"></a>
							     
							</dd>
						</dl>
					
				    </div>  
		    </div> 
		    
		    <!-- ztw添加云空间弹层 -->
		   <!--    <div id="t_add" class="t-add">
		     	<div class="t-add-title">
		     		添加云空间 <i @click.stop = "hide_nav_add()">X</i>
		     	</div>
		     	<div>
		     		<input class="t-add-input" type="text" placeholder="请输入云空间的名称" v-model="cloudName"/>
		     	</div>
		     	<div>
		     		<button class="t-add-btn" @click.stop="nav_add(1)">添加</button>
		     		<button class="t-cancel-btn" @click.stop="hide_nav_add()">取消</button>
		     	</div>	
		     </div>	
		     -->
     </div>
    
     <input type="hidden" id="stoptype" value="">
     <input type="hidden" id="user_name" value="${sessionScope.userInfo.userAccount}">
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/jwplayer/jwplayer.js?v=201705151655"></script>
    <script src="<%=request.getContextPath()%>/resources/js/cloudResources/cloudSpace.js?v=201705151655"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/wsconect.js?v=2017051516544"></script> 
  </body>
</html>
