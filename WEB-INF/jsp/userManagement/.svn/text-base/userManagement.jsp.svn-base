<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE >
<html>
  <head>
    <base class="basePath" href="<%=basePath%>">
    
    <title>用户管理</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/userManagement/userManagement.css?v=201705151655" />
  </head>
  
  <body>
  <div class='user-box'>
      <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
      <div class='content'>
           <div class='content-top clearfix'>
              <div v-show="selIsShow" class="fr dete-cancel"><span v-on:click="fnDetermine" class="determine fl">确定</span><span v-on:click="fnCancel" class="cancel fl" v-cloak>取消</span></div>
              <div v-show="!selIsShow" class='fr batch-box' v-cloak>
               	  <a v-on:click="fnDelete()" class='fr batch-recovery' v-if="loginUserPermissions!=2">批量删除</a>
	              <a v-on:click="fnBatchRecovery()" class='fr batch-recovery' v-if="loginUserPermissions!=2">批量恢复</a>
	              <a v-on:click="fnBatchDisable()" class='fr batch-disable' v-if="loginUserPermissions!=2">批量禁用</a>
	              <a class='fr create-user' v-show="loginUserPermissions==0||loginUserPermissions==1" v-on:click="createUser()">创建用户</a>
	             <a class='fr create-user' v-show="loginUserPermissions==0 && userSwitch==1" v-on:click="synUser()">用户同步</a>
              </div>
              <span class='fr span-search' v-cloak><input type="text" class="fl txt-search" v-model="searchWord" placeholder="请输入查询关键字" /><i v-on:click="fnSearch" class="fl iconfont icon-sousuo"></i></span>
           </div>
           <div class='content-tab'>
              <!-- 有全选按钮的表头 -->
              <div v-show="selIsShow" class='tab-tit all-sel-box' v-cloak>
                 <dl class='displayflex'>
                   <dd class='all-sel' v-cloak><i v-on:click="fnCheckAll($event)" class="icon iconfont icon-weixuanzhong"></i></dd>
                   <dd class='username all-int'></dd>
                   <dd class='time' ></dd>
                   <dd class='state'></dd>
                   <dd class='power'></dd>
                   <dd class='operation'></dd>
                 </dl>                
              </div>
              <!-- 没有全选按钮的表头 -->
              <div v-show="!selIsShow" class='tab-tit no-sel-box' v-cloak>
                 <dl class='displayflex'>
                   <dd class='all-sel'></dd>
                   <dd class='username'>用户名称</dd>
                   <dd class='time' @click="fnGetUserList('timeSort')">创建时间<em class="iconfont" :class="{'icon-xiajiantou':timeSort,'icon-shangjiantou':!timeSort}"></em></dd>
                   <dd class='state'>当前状态</dd>
                   <dd class='power'>系统权限</dd>
                   <dd class='operation'>功能操作</dd>
                 </dl>                
              </div>
              <div @scroll="fnScroll($event)" class='tab-body' v-cloak>
                  <dl  v-for="(item,index) in userList" class='displayflex'>
                 <!--  <dd class='sel-item'  ><i v-bind:data-id="item.userId"  v-show="selIsShow" v-on:click="fnCheck($event)"  class=" sel-i icon iconfont icon-weixuanzhong"></i></dd> -->
                   
                   <dd class='sel-item'>
                  		<!-- opeiateType为了判断当前操作以及后续的权限-->
                        <i v-bind:data-id="item.userId" name='1' v-if="opeiateType==1&&(item.userState==2&&((loginUserPermissions==1&&item.userPermissions==2)||loginUserPermissions==0))"  v-on:click="fnCheck($event)"  class=" sel-i icon iconfont icon-weixuanzhong"></i>
                        <i v-bind:data-id="item.userId" name='2' v-if="opeiateType==2&&(item.userState!=2&&((loginUserPermissions==1&&item.userPermissions==2)||loginUserPermissions==0))"  v-on:click="fnCheck($event)"  class=" sel-i icon iconfont icon-weixuanzhong"></i>
                        <i v-bind:data-id="item.userId" name='3' v-if="opeiateType==3&&((loginUserPermissions==0 || (loginUserPermissions==1&&item.userPermissions==2))&&item.userState!=1)&&item.userId!=100"  v-on:click="fnCheck($event)"  class=" sel-i icon iconfont icon-weixuanzhong"></i>
                   </dd> 
                   <dd class='username'>{{item.userAccount}}</dd>
                   <dd class='time' >{{item.userCreatTime|time}}</dd>
                   <dd class='state'>{{item.userState|state-filter}}</dd>
                   <dd class='power'>{{item.userPermissions|permissions-filter}}</dd>
                   <dd class='operation displayflex'>
                       <ul>
                          <li>   
                              <i @click="fnEidtUser(index,1)"  class="i-edituser icon iconfont icon-yulan" v-bind:data-id="item.userId" title="预览" ></i>
                          </li>
                          
                           <li>
	                         <i @click="fnEidtUser(index)" v-if="(loginUserPermissions==1&&item.userPermissions==2)||loginUserPermissions==0 || loginId==item.userId" v-bind:data-id="item.userId" title="编辑" class="i-edituser icon iconfont icon-bianji"></i>
	                         <i v-else v-bind:data-id="item.userId" title="暂不可编辑" class="i-edituser icon iconfont icon-bianji state-btn-disabled"></i>
                          </li>
                          
                          <li> 
                          	  <!-- 当为禁用状态并且管理员和普通或者超管可以操作 -->
	                          <i v-if="item.userState!=2&&((loginUserPermissions==1&&item.userPermissions==2)||loginUserPermissions==0)" @click="fnUserDisable($event,index)" v-bind:data-id="item.userId" title="禁用" class="icon iconfont icon-ban"></i>
	                          <i v-else-if="item.userState!=2&&(loginUserPermissions==1&&item.userPermissions!=2) || (loginUserPermissions==2)" title="暂不可禁用" class="icon iconfont icon-ban state-btn-disabled"></i>
	                          <i v-else-if="item.userState==2&&((loginUserPermissions==1&&item.userPermissions==2)||loginUserPermissions==0)" @click="fnUserRecovery($event,index)" v-bind:data-id="item.userId" title="解禁" class="icon iconfont icon-huifu"></i>
	                          <i v-else title="暂不可解禁" class="icon iconfont icon-huifu state-btn-disabled"></i>
                          </li>

                       		<li>
                       			<i v-if="item.userId==100"></i>
                            	<i @click="fnLayerMsg(item.userId,[index])" v-else-if="item.userPermissions==2 && item.userState==0 || ((loginUserPermissions==0&&item.userPermissions==1&&item.userState==0) || loginUserPermissions==0&&item.userState==0)" v-bind:data-id="item.userId" title="删除" class="icon iconfont icon-shanchu"></i>
                            	<i v-else title="暂不可删除" class="icon iconfont icon-shanchu state-btn-disabled"></i>
                        	</li>
                       </ul>
                   </dd>
                 </dl>
              </div>
                 
           </div>
     
      </div>
  </div>   
   <input type="hidden" id="uPermissions" value="${sessionScope.userInfo.userPermissions }"  />
   <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/userManagement/userManagement.js?v=201705151655"></script>
  </body>
</html>
