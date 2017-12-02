<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>"> 
    <title>内容编辑</title>
	  <meta http-equiv="pragma" content="no-cache">
	  <meta http-equiv="cache-control" content="no-cache">
	  <meta http-equiv="expires" content="0">    
	  <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	  <meta http-equiv="description" content="This is my page">
	  <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/contentEditing/newContentEditing.css?v=201705121655" />
  </head>
  <body>
	<jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
	<div id="newContentEditing" class="bottom-box">
		<!-- 公用的左侧模板结构 -->
		<div class="comm-nav-box" :class="{'has-list-op':userPermissions!=2}">
			<div class="comm-nav-top">
				<i class="fl iconfont icon-user-defined"></i>
				<span class="fl">模板案例</span>
			</div>
	
			<ul class="comm-nav-list" v-cloak>
				<li v-for="(item,index) in templateCase.list" @click="navClick(index,0)" :class="{'active':templateCase.index==index}" :data-id="item.id" :title="item.name">
					<span v-if="!item.edit">{{item.name}}</span>
					<input v-if="item.edit" @blur="nav_blur($event,0)" class="list-input" type="text" :value="item.name" maxlength=40 />
					<i v-if="item.state==1" class="nav-list-yingyong iconfont icon-star"></i>
				</li>
			</ul>
			
			<div v-if="userPermissions!=2" class="comm-nav-op" v-cloak>
				<i @click="navAdd(0)" class="iconfont icon-tianjia" title="添加模板"></i>
				<i v-if="templateCase.list.length" @click="navRevise(0)" class="iconfont icon-bianji1" title="编辑模板"></i>
				<i v-else class="iconfont icon-bianji1 z-disabled" title="不可编辑"></i>
				<i v-if="templateCase.list.length" @click="navDelete(0)" class="iconfont icon-shanchu" title="删除模板"></i>
				<i v-else  class="iconfont icon-shanchu z-disabled" title="不可删除"></i>
			</div>
		</div>
		
		<!-- 内容编辑右侧内容部分 -->
		<div class="content-box">
			<div class="edit-content-top">
				<div class="edit-content-top-input fl"><label for="">视联网域名</label><input type="text" v-model = "tabContent.realmName" maxlength=100 /></div>
				<div class="edit-content-top-input fl"><label for="">域名终端号1</label><input type="text" v-model = "tabContent.terminalNumber1" maxlength=5 /></div>
				<div class="edit-content-top-input fl"><label for="">域名终端号2</label><input type="text" v-model = "tabContent.terminalNumber2" maxlength=5 /></div>
				<div v-cloak>
					<div class="edit-content-top-btn fr" v-if="templateCase.list.length && tabs.list.length"><button @click="applicationThemeLayer()" class="sham-btn sham-btn-default">应用</button></div>
					<div class="edit-content-top-btn fr" v-else><button class="sham-btn sham-btn-default z-disabled">应用</button></div>
				</div>
			</div>

			<div class="edit-content-bottom">

				<!-- 标签结构 -->
				<div class="edit-content-bottom-tabs">
					<div class="bottom-tabs-list-box">
						<ul class="bottom-tabs-list" v-cloak>
							<li  v-for="(item,index) in tabs.list" @click="navClick(index,1)" :class="{'active':tabs.index==index}" :data-id="item.id" :title="item.name">
								<span v-if="!item.edit">{{item.name}}</span>
								<input v-if="item.edit" @blur="nav_blur($event,1)" type="text" :value="item.name" maxlength=50/>
							</li>
						</ul>
					</div>
	
					<div class="bottom-tabs-op" v-cloak>
						<i v-if="templateCase.id!=-1" @click="navAdd(1)" class="iconfont icon-tianjia" title="添加标签"></i>
						<i v-else class="iconfont icon-tianjia z-disabled" title="不可添加"></i>
						<i v-if="tabs.list.length && userPermissions!=2" @click="navRevise(1)" class="iconfont icon-bianji1" title="编辑标签"></i>
						<i v-else class="iconfont icon-bianji1 z-disabled" title="不可编辑"></i>
						<i v-if="tabs.list.length && userPermissions!=2" @click="navDelete(1)" class="iconfont icon-shanchu" title="删除标签"></i>
						<i v-else  class="iconfont icon-shanchu z-disabled" title="不可删除"></i>
					</div>
	
				</div>

				<div class="edit-content-botom-content">
					<div class="botom-content-list">
					
						<div v-for="(item,index) in tabContent.list" class="botom-content-list-item" :data-id="item.taskid" v-cloak>
							<div class="botom-content-list-info"> 
								<img class="" :src="item.iconpath"  :alt="item.capturename" onerror="this.src='resources/images/img-lose.png'" />
								<h3 class="">{{item.capturename}}</h3>
							</div>
							<em  v-if="userPermissions!=2" class="botom-content-list-delete" @click="deleteTabContent(index)"></em>
						</div>
						
						<!-- 新增按钮 -->
						<div v-if="tabs.id!=-1" class="botom-content-list-add" @click="resourceLayer()"></div>
						
					</div>

					<!-- <div class="botom-content-save">
						<button class="sham-btn sham-btn-default">保存</button>
					</div>  -->
					
				</div>
				
			</div>
		</div>
	
	
	<!-- 添加资源弹层 -->
	<div class="zlayer-wrap" id="add_resources" >
		<div class="zlayer-box">
			<div class="zlayer-top">
				<span class="zlayer-txt">添加资源</span>
				<h3 class="zlayer-title"></h3>
				<i class="zlayer-close iconfont icon-guanbi"></i>
			</div>
				
			<div class="resource-layer-bottom">
				<div class="layer-bottom-top">
					<ul class="layer-bottom-tab">
						<li :class="{'active':layerContent.opConfig.which==0}" @click="tabChange(0)">个人资源</li>
						<li :class="{'active':layerContent.opConfig.which==1}" @click="tabChange(1)">云端资源</li>
					</ul>
					<div class="layer-bottom-search">
						<input v-model="layerContent.searchWord" class="layer-bottom-search-input" type="text"  maxlength="25" placeholder="请输入查询关键字" />
						<i @click="layerSearch()" class="iconfont icon-sousuo layer-bottom-search-btn"></i>
					</div>
				</div>
				
				<div class="layer-bottom-content">
					<div  class="layer-bottom-full">
						<i @click="selectClick(0)" class="iconfont icon-weixuanzhong" :class="{'icon-xuanzhong':layerContent.isAll}"></i>
						<span>全选({{layerContent.selectData.length}}/{{layerContent.list.length}})</span>
					</div>
					
					<div class="layer-bottom-head">
						<span class="layer-bottom-cell-name">录像名称</span>
						
						<span v-if="layerContent.list.length" class="layer-bottom-cell-stime" @click="layerTimeSort()">共享时间<em class="iconfont" :class="{'icon-xiajiantou':layerContent.timeSort,'icon-shangjiantou':!layerContent.timeSort}"></em></span>
						<span v-else class="layer-bottom-cell-stime" @click="layerTimeSort()">共享时间</span>
						
						<span class="layer-bottom-cell-suser">共享用户</span>
					    <span class="layer-bottom-cell-time">录像时长</span>
					</div>
					
					<div class="layer-bottom-body" @scroll="fnScroll($event,1)">
						<div class="body-list" v-for="(item,index) in layerContent.list" :data-id="item.taskid || item.sourceId">
							<div class="layer-bottom-cell-radio" @click="selectClick(1,index)">
								<i class="iconfont icon-weixuanzhong" :class="{'icon-xuanzhong':item.isSelected}"></i>
							</div>
							<div class="layer-bottom-cell-name body-list-img">
								<img :src="item.iconpath" :alt="item.capturename"  onerror="this.src='resources/images/img-lose.png'"/>
								<span class="text-overflow1">{{item.capturename || item.sourceName}}</span>
							</div>
							<span class="layer-bottom-cell-stime text-overflow1">{{item.starttime || item.shareTime | time}}</span>
							<span class="layer-bottom-cell-suser text-overflow1">{{item.userAccount || item.shareUserAccount}}</span>
							<span class="layer-bottom-cell-time text-overflow1">{{item.duration | stime}}</span>
						</div>
					</div>	
					
					<!-- 添加按钮 -->
					<div class="layer-bottom-add" >
						<button v-if="layerContent.list.length" class="_save">确定</button>
						<button v-else class="z-disabled">确定</button>
					</div>				
				</div>
				
			</div>
		</div>
	</div>
	
	<!-- 皮肤选择弹层 -->
	<div class="zlayer-wrap" id="theme_layer">
		<div class="zlayer-box">
			<div class="zlayer-top">
				<span class="zlayer-txt">皮肤选择</span>
				<h3 class="zlayer-title"></h3>
				<i class="zlayer-close iconfont icon-guanbi"></i>
			</div>
			
			<div class="theme-box">
				<ul class="theme-ul">
					<li @click="themeChange(1)" :class="{'active':tabContent.themeNumber==1}">
						<img src="<%=request.getContextPath()%>/resources/images/theme01.jpg" alt="" />
					</li>
					<li @click="themeChange(2)" :class="{'active':tabContent.themeNumber==2}">
						<img src="<%=request.getContextPath()%>/resources/images/theme02.jpg" alt="" />
					</li>
				</ul>
				<div class="theme-op">
					<button class="sham-btn sham-btn-sure">确定</button>	
					<button class="sham-btn sham-btn-default">取消</button>	
				</div>
			</div>
		</div>
	</div>		
</div>
	
	<script src="<%=request.getContextPath()%>/resources/js/contentEditing/newContentEditing.js" type="text/javascript"></script>
</body>
</html>
