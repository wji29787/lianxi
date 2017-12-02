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
	  <link rel="stylesheet" href="<%=request.getContextPath()%>/resources/css/contentEditing/contentEditing.css?v=201705121655" />
  </head>
  <body>
	<jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
<div id="deviceManagement" class="bottom-box">
	<div class="nav-box1">
		<nav class="nav-box-top">
			<ul class="nav-parents">
				<li class="nav-pats-list" v-bind:class="{'active':item.state}" v-for="item in nav_left">
					<a href="javascript:;" v-bind:_id="item.id"><i class="fl i iconfont icon-user-defined"></i><span class="fl">{{item.txt}}</span>
					</a>
					<ul class="Child-node" v-if="item.Child.length>0">
						<li class="Child-no-list" @click.stop="nav_click(index)" v-bind:class="{'active':itn.state}" v-for="(itn,index) in item.Child">
							<a v-bind:class="{enedit:itn.edit>0}" href="javascript:;">{{itn.txt}}</a>
							<input autofocus="autofocus" v-bind:class="{edit:itn.edit>0}" class="inpt" v-on:blur="nav_blur(index)" v-model="itn.txt" value="itn.txt" />	
						</li>
					</ul>
				</li>
			</ul>
		</nav>
		<div class="nav-features clearfix">
		  <a class="fr" @click="nav_del"><i class="iconfont icon-shanchu"></i></a>
			<a class="fr" @click="nav_edit"><i class="iconfont icon-bianji1"></i></a>
			<a class="fr" @click="nav_add"><i class="iconfont icon-tianjia"></i></a>
		</div>
	</div>
	<div class="content-box">
       <div class="content-b-top clearfix">
       	 <label>视联网域名</label><input class="topinput" type="text" placeholder="" />
       	 <label>域名终端号1</label><input class="topinput" type="text" placeholder="" />
       	 <label>域名终端号2</label><input class="topinput" type="text" placeholder="" />
       	 <a href="javascript:;" class="fr topbtn">应用</a>
       </div>
       <div class="content-warp">
       	 <ul class="content-left">
       	 	  
       	    <li class="li" @click.stop="lable_click(index)" v-bind:class="{'active':item.state}" v-for="(item,index) in lable_left">
       	      <a href="javascript:;" v-bind:class="{edits: item.edit>0}" class="a lis">{{item.txt}}</a>
       	    	<input type="text" autofocus="autofocus" v-on:blur="lable_blur(index)" class="lis" v-model:value="item.txt"/>
       	    </li>
       	    <li class="liamu clearfix">
       	          <a class="fr" @click="lable_del"><i class="iconfont icon-shanchu"></i></a>
				  <a class="fr" @click="lable_edit"><i class="iconfont icon-bianji1"></i></a>
				  <a class="fr" @click="lable_add"><i class="iconfont icon-tianjia"></i></a>
       	    </li>
         </ul>
         <div class="content-right">
       	     <div class="con-right-list" v-for="(item,index) in content_right">
       	          <div class="close" @click.stop="content_item_del(index,item.id)"><i class="closes"></i></div>
       	      	  <img src="<%=request.getContextPath()%>/resources/images/imgs.png" />
       	     	    <p class="" v-bind:title="item.txt">{{item.txt}}</p>
       	     	  
       	     </div>
       	    
       	     <div class="con-right-listadd" @click.stop="content_item_add">
       	        
       	     </div>
         </div>
         
       </div>
       <input type="button" class="wrap-bton" value="保存" />
	</div>
</div>
 <script src="<%=request.getContextPath()%>/resources/js/contentEditing/contentEditing.js?v=201705121655" " type="text/javascript "></script>
  </body>
</html>
