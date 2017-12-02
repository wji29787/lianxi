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
   
    <title>文件资源</title>
    
  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="cache-control" content="no-cache">
  <meta http-equiv="expires" content="0">    
  <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
  <meta http-equiv="description" content="This is my page">
  <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/resources/css/cloudResources/fileResourse.css?v=201705121655""/>
  </head>
  
  <body>
    <jsp:include page="../common/foreg_hearder.jsp"></jsp:include>
    <div id="fileResourse" class="bottom-box">
        
        <!-- 公用的左侧模板结构 -->
      
        <div class="nav-box">
                   <nav-cloudspase message="2"></nav-cloudspase>
        </div>
        <!-- 内容 -->
        <div class="content-box"> 

          
               <div class="content-features clearfix" >

                   <!-- 右侧查询上传功能 -->


                     <!-- 右侧上传文件 -->
                      <div v-if="tabFlag===0" v-cloak>
                          <div class="features-btn-box fr clearfix" v-if="sIsShow" v-cloak>
                            <a href="javascript:;" class="features-btn fl" @click.stop="uploadVideoLayer()"><i></i>上传文件</a>
                            <a href="javascript:;" v-if="odataList.length>0" class="features-btn fl"
                   @click="checkBatchOperation(1)">批量删除</a>
                            <a href="javascript:;" v-else class="features-btn fl z-disabled">批量删除</a>
                          </div>
                          <div class="features-btn-box fr clearfix" v-else v-cloak>
                              <a href="javascript:;" class="features-btn color-sure fl" @click="checkBatchOperation(3)">确定</a>
                              <a href="javascript:;" class="features-btn fl" @click="checkBatchOperation(2)">取消</a>
                          </div>
                          <div class="input-search fr clearfix" v-cloak>
                              <input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
                              <i class="iconfont icon-sousuo" @click="getList()"></i>
                          </div>

                      </div>
                      <!-- 右侧类型管理 --> 
                      <div v-else-if="tabFlag===1" v-cloak>
                          <div class="features-btn-box fr clearfix" v-if="sIsShow" v-cloak>
                            <a href="javascript:;" class="features-btn fl" @click.stop="uploadVideoLayer()"><i></i>上传视频</a>
                            <a href="javascript:;" v-if="odataList.length>0" class="features-btn fl"
                   @click="checkBatchOperation(1)">批量删除</a>
                            <a href="javascript:;" v-else class="features-btn fl z-disabled">批量删除</a>
                          </div>
                          <div class="features-btn-box fr clearfix" v-else v-cloak>
                              <a href="javascript:;" class="features-btn color-sure fl" @click="checkBatchOperation(3)">确定</a>
                              <a href="javascript:;" class="features-btn fl" @click="checkBatchOperation(2)">取消</a>
                          </div>
                          <div class="input-search fr clearfix" v-cloak>
                              <input type="text" id="" value="" class="fl" placeholder="请输入查询关键字" v-model="searchWord"/>
                              <i class="iconfont icon-sousuo" @click="getList()"></i>
                          </div>

                      </div>
                    <!-- tab切换控制 -->
                    <ul class="features-tab">
                      <li v-bind:class="{ 'active': tabFlag===0 }" @click.stop="tabSwitch(0)">文件资源</li>
                      <li v-bind:class="{ 'active': tabFlag===1 }" @click.stop="tabSwitch(1)">类型管理</li>
                    </ul>
              </div> 
              <!-- ************************tab 切换控制 box start *********************** -->
              <div class="content-list content-list-thead" v-bind:class="{'has-img-list':tabFlag }">
                    <!-- 文件资源-nav -->

                    <dl class="z-addfrom" v-if="tabFlag===0" v-cloak>
                        <dd class="file-seven">文件名称</dd>
                        <dd class="file-first">创建时间</dd>
                        <dd class="file-second">创建用户<em class="iconfont"></em></dd>
                        <dd class="file-third">文件大小</dd>
                        <dd class="file-four">文件类型</dd>
                        <dd class="file-fifth">文件状态</dd>
                        <dd class="file-sixth">功能操作</dd>
                     </dl>

                    <!-- 类型管理-nav -->
                    <dl v-else if="tabFlag===1" v-cloak>
                         <dd class="list-seven">序号</dd>
                         <dd class="list-first">文件名称<em class="iconfont"></em></dd>
                         <dd class="list-second">创建时间</dd>
                         <dd class="list-third">创建用户</dd>
                         <dd class="list-four">当前状态</dd>
                         <dd class="list-fifth">备注</dd>
                         <dd class="list-sixth">功能操作</dd>

                    </dl>
              </div>
            


                <!-- 文件资源&类型BOX     start-->

                   <!-- 文件资源列表 -->
                   <div class="content-list content-list-tbody" v-if="tabFlag===0" v-cloak>
                        <dl class="clearfix"  v-for="(list,$index) in odataList" v-cloak>
                          <!-- <div class="z-icon-box z-h140">
                              <i v-if="list.resourceState==1" v-show="!sIsShow"> &nbsp; </i>
                              <i v-if="list.resourceState==2 || list.resourceState==-1 ||list.resourceState==0" class="iconfont"
                                 @click.stop="fnClick($index)"
                                 v-bind:class="{'icon-weixuanzhong':!isSelectAll && !list.isSelected,'icon-xuanzhong':isSelectAll || list.isSelected}"
                                 v-show="!sIsShow"></i>
                         </div> -->
                              <dd class="file-seven">{{list.fileName}}</dd>
                              <dd class="file-first">{{list.createTime}}</dd>
                              <dd class="file-second">{{list.createUserName}}<em class="iconfont"></em></dd>
                              <dd class="file-third">{{list.fileSize}}</dd>
                              <dd class="file-four">{{list.fileType}}</dd>
                              <dd class="file-fifth">无效</dd>
                              <dd class="file-sixth">功能操作</dd>
                        </dl>

                   </div>
                   <!-- 类型管理列表 -->
                   <div class="content-list content-list-tbody z-file" v-else if="tabFlag===1" v-cloak>
                        <dl class="clearfix"  v-cloak>
                              <dd class="list-seven">1</dd>
                              <dd class="list-first">上传文件名称待定</dd>
                              <dd class="list-second">2012-04-12 10:00:00<em class="iconfont"></em></dd>
                              <dd class="list-third">pamir</dd>
                              <dd class="list-four">无效</dd>
                              <dd class="list-fifth">--</dd>
                              <dd class="list-sixth">功能操作</dd>

                        </dl>
                   </div>
                   
                  

               <!-- 文件资源&类型BOX       end-->
             <!-- ************************tab 切换控制 box end *********************** -->


        </div>
  </div>
    <select>
    <option>启明1</option>
    <option>启明2</option>
    <option>启明3</option>
    </select>
     <input type="hidden" id="stoptype" value="">
     <input type="hidden" id="user_name" value="${sessionScope.userInfo.userAccount}">
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/controls/jwplayer/jwplayer.js?v=201705151655"></script>
    <script src="<%=request.getContextPath()%>/resources/js/cloudResources/fileResourse.js?v=201705151655"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/wsconect.js?v=2017051516544"></script>
    <script type="text/javascript"
    src="<%=request.getContextPath()%>/resources/js/controls/webuploader/webuploader.min.js?v=201705111655"></script>
  </body>
</html>
