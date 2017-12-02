/*回收站*/
;$(function(){
	$(".personal-page").addClass("active");//给头部导航增加选中状态
	var vm = new Vue({
		  el:'#personalResources',
		  mounted:function(){
			  this.getList();
		  },
		  data:{
			  odataList:"",
			  sIsShow:true,/*标记批量操作显隐*/
			  searchWord:"",
			  pageNum:1,
			  isSelectAll:0,//全选标记
			  deleteData :[],
			  deleteArray:"",//删除用户ID数组
			  pageSize:10,
			  checkNum:0,
			  checkAllNum:0,
			  scrollBol:true,
			  bScrollNo:true, //禁止请求
			  playBol:true,
			  timeSort:true,
			  binDay:-1,
			  opConfig:{
				  swith:0,//0为批量删除 1为批量恢复
			  }
		  },
		  watch:{
			  searchWord:function(value){
				  this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g,'');/*去前空格和敏感字符*/
			  },  
		  },
		  methods:
		  {
			  getList:function(pageNum,type){
				   var _this = this;
				   _this.scrollBol=false;
				   
				   if(type=='timeSort'){
					   _this.timeSort = !_this.timeSort;
				   }
				   
				   if(!pageNum){//搜索或加载
					   _this.bScrollNo = true;  
				   }
				   
				   if(!_this.bScrollNo){
					   return;
				   }
				   
				   $.post(
					  "operationManagement/systemConfiguration/getBinTime.do",
					  function(data){
						  if(!isLogonError(data)){
			  					return ;
			  				}
						  if(data.result){
							  _this.binDay=data.saveDate; 
							  getList();
						  }else{
							  layer.msg(data.msg);
							  getList();
						  }
					  },
					  function(data){
						  layer.msg(data.msg);
						  getList();
					  },'JSON'
				   )
				   
				   function getList(){
					   $.ajax({
						    url : "personalResources/recoveryResources/getList.do",
				  			type : "POST",
				  			data : {
				  				"searchWord":formatStringInSubmit(_this.searchWord),
				  				"pageNum":pageNum?pageNum:1,
		  						'startTimeSort':_this.timeSort?'desc':'asc'
				  			},
				  			dataType : "json",
				  			success : function(data) {
				  				if(!isLogonError(data)){
				  					return ;
				  				}
				  				var result = data.result;
				  				setTimeout(function(){
				  					_this.scrollBol = true;
				  				},350);
				  				/*console.log(data.list.list);*/
				  				if(result){
				  				     /**查询成功**/
				  					if(_this.odataList){
				  						if(!pageNum){ //不存在时是因为搜索
				  							if(data.list.list){//搜索时重新赋值
				  								_this.odataList = data.list.list;
				  								 $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
				  							}else{
				  								_this.odataList = [];
				  							}
					  					}else{
					  						_this.odataList = _this.odataList.concat(data.list.list); //存在时追加
					  					}
				  						
				  						_this.isSelectAll = 0;
				  					}else{
					  					_this.odataList = data.list.list; //页面加载时数据赋值
					  					 $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
				  					}

				  					if(data.list.isLastPage){
				  						_this.bScrollNo = false;
				  					}
				  					_this.checkAllNum = _this.odataList.length; //每次请求数据时改变最大值
				  					
				  					var _nowTime = new Date().getTime();
				  					_this.odataList.forEach(function(i,v){
				  						_this.odataList[v].remaTime = _this.odataList[v].recycletime+_this.binDay*86400000 - _nowTime ;
				  					})
				  				}else{
				  					/**查询失败**/
				  					layer.msg("<p style='text-align:center'>查询失败!</p>");
				  				}
				  			},
				  			error : function(XMLHttpRequest, textStatus, errorThrown) {
				  				setTimeout(function(){
				  					_this.scrollBol = true;
				  				},350);
				  			}
				  		});  
				   }
				   
				   
			   },
			   
			   //恢复数据
			   replyTask:function(_data){
				   
				   var _this = this;
				   var _str = "<div class='z-comm-layer-wrap'>";
				    _str += '<div class="z-comm-layer-box z-delete">';
					_str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
					_str+='<div class="z-comm-layer-delete-box">\
							<p>您确定要恢复吗？</p>\
							<div class="btn-box">\
								<button class="z-layer-sure">确定</button>\
								<button class="z-layer-cancel">取消</button>\
							</div></div>';
					_str+='</div></div>';
					var index = layer.open({
						type:1,
						closeBtn:0,
						shade:[0.7],
						title:false,
					    area: [],
					    resize:false,
					    scrollbar: false,
					    shadeClose: false, //点击遮罩关闭
					    content:_str,
					    success:function(){
					    	$('.z-layer-close').click(function(){
								layer.close(index);
							})
							$('.z-layer-sure').click(function(){
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								replay();
							})
							$('.z-layer-cancel').click(function(){
								layer.close(index);
							})
					    }
					}); 
					
					function replay(){
						   var _taskId = '', //存要删除的ID
						   	   _types='',//每个id对应的type值
							   _taskIndex = [],
							   _this = vm; //存要删除的索引
									
							for(var i=0,_len=_data.length;i<_len;i++){ //数据转换
								if(i==_len-1){
									_taskId+=_data[i].taskId;
									_types+=_data[i].type;
								}else{
									_taskId+=_data[i].taskId+',';
									_types+=_data[i].type+',';
								}
								_taskIndex.push(_data[i].index);
							}
								
							$.post(
								"personalResources/recoveryResources/recoveryFile.do",
								{taskids:_taskId,types:_types},
								function(data){
									if(!isLogonError(data)){
					  					return ;
					  				}
									if(data.result){
										for(var i=0,_len=_taskIndex.length;i<_len;i++){
											_this.odataList.splice(_taskIndex[i]-i,1); //删除页面数据
										}
										if(_this.odataList.length==0){//全选删除时取消选中
											_this.isSelectAll=0;
										}
										_this.deleteData.length = 0; //清空删除数组索引
										_this.checkNum = 0; //清空删除数组数量
										_this.checkAllNum = _this.odataList.length;//改变数据数量
										layer.msg(data.msg);
									}else{
										layer.msg(data.msg);
									}
								},
								'json');
					}
			   },
		
			   /*num:标记是点击的取消还是点击的批量删除*/
				checkBatchOperation:function(num,type){
					if(num == "1"){
					  if(type){
						  this.opConfig.swith=1; //如果点击批量恢复把变量
					  }else{
						  this.opConfig.swith=0;
					  } 
					  vm.sIsShow = false;//隐藏批量操作按钮,展示确定取消按钮  
					  vm.deleteData.length=0;//清空删除数组
					}else if(num =="2"){
					  vm.sIsShow = true;//展示批量操作按钮,隐藏确定取消按钮
					  vm.pageNum = 1;
					  vm.getList();
					  /**
					   * 点击取消跟全部选操作相同
					   */
					    vm.isSelectAll = 0; //改为未全选
					    vm.checkNum = 0; //把当前勾选的数量改为0
					    vm.deleteData.length=0;//清空删除数组
				    	for(var i=0,_len=vm.odataList.length;i<_len;i++){
				    		vm.odataList[i].isSelected = 0; //自定义属性控制页面的单选的显示状态
					    }
					}else if(num =="3") {//点击确认删除
						if(vm.deleteData.length){//判断是否有数据
							if(vm.opConfig.swith){
								vm.replyTask(vm.deleteData);
							}else{
								vm.delete_data(vm.deleteData);
							}
						}else{
							if(vm.opConfig.swith){
								layer.msg("<p style='text-align:center'>请选择要恢复的数据!</p>");
							}else{
								layer.msg("<p style='text-align:center'>请选择要删除的数据!</p>");
							}
							
					  }
					}
					
				},/*删除*/
				/**
				 * _data为要删除的数据,为[{}]格式
				 */
				delete_data:function(_data){
					var _str = "<div class='z-comm-layer-wrap'>";
					 _str += '<div class="z-comm-layer-box z-delete">';
					_str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
					_str+='<div class="z-comm-layer-delete-box">\
							<p>任务一旦删除将无法恢复，您确定要删除吗？</p>\
							<div class="btn-box">\
								<button class="z-layer-sure">确定</button>\
								<button class="z-layer-cancel">取消</button>\
							</div></div>';
					_str+='</div></div>';
					var index = layer.open({
						type:1,
						closeBtn:0,
						shade:[0.7],
						title:false,
					    area: [],
					    resize:false,
					    scrollbar: false,
					    shadeClose: false, //点击遮罩关闭
					    content:_str,
					    success:function(){
					    	$('.z-layer-close').click(function(){
								layer.close(index);
							})
							$('.z-layer-sure').click(function(){
								layer.close(index); //如果设定了yes回调，需进行手工关闭
						        vm.deleteData = _data;
						        del(_data);
							})
							$('.z-layer-cancel').click(function(){
								layer.close(index);
							})
					    }
					}); 
					
				function del(_data){
					
					var _taskId = '', //存要删除的ID
						_types='',//每个id对应的type值
						_taskIndex = [],
						_this = vm; //存要删除的索引
					for(var i=0,_len=_data.length;i<_len;i++){ //数据转换
						if(i==_len-1){
							_taskId+=_data[i].taskId;
							_types+=_data[i].type;
						}else{
							_taskId+=_data[i].taskId+',';
							_types+=_data[i].type+',';
						}
						_taskIndex.push(_data[i].index);
					}
						
					$.post(
							'personalResources/recoveryResources/deleteMediaFile.do',
							{taskids:_taskId,types:_types},
							function(data){
								if(!isLogonError(data)){
				  					return ;
				  				}
								if(data.result){
									for(var i=0,_len=_taskIndex.length;i<_len;i++){
										_this.odataList.splice(_taskIndex[i]-i,1); //删除页面数据
									}
									if(_this.odataList.length==0){//全选删除时取消选中
										_this.isSelectAll=0;
									}
									_this.deleteData.length = 0; //清空删除数组索引
									_this.checkNum = 0; //清空删除数组数量
									_this.checkAllNum = _this.odataList.length;//改变数据数量
									layer.msg("<p style='text-align:center'>删除成功!</p>");
								}else{
									layer.msg("<p style='text-align:center'>删除失败，请重试!</p>");
								}
							},
							'json');
					}
				},
				/**全选**/
				fnClickAll:function(){
					var _this = this;
					
				    if(_this.isSelectAll==0){//未勾选
				    	_this.isSelectAll = 1; //改为全选
				    	_this.deleteData.length=0;//清空删除数组				    
					    _this.checkNum = _this.odataList.length; //选中的值
					    
					    for(var i=0,_len=_this.odataList.length;i<_len;i++){
					    	_this.odataList[i].isSelected=1; //自定义属性控制页面的单选的显示状态
					    	_this.deleteData.push({"taskId":_this.odataList[i].taskid,"index":i,type:_this.odataList[i].type});//删除数组
					    }
					    
				    }else{//已勾选
				    	_this.isSelectAll = 0; //改为未全选
				    	_this.checkNum = 0; //把当前勾选的数量改为0
				    	_this.deleteData.length=0;//清空删除数组
				    	for(var i=0,_len=_this.odataList.length;i<_len;i++){
					    	_this.odataList[i].isSelected = 0; //自定义属性控制页面的单选的显示状态
					    }
				    };
				},
				
				/**单个勾选**/
				fnClick:function($index){
					 var _this = this;
					 _this.deleteArray = "",
					 _bol=false,
					 _i = -1;
					 
					 _this.odataList[$index].isSelected?_this.odataList[$index].isSelected=0:_this.odataList[$index].isSelected=1; //选中改变 
					 
					 if(_this.deleteData.length){
						 for(var i=0,_len=_this.deleteData.length; i<_len;i++){
							 if(_this.deleteData[i].index == $index){//判断是否已存在
								 _bol = true;
								 _i = i;
								 break;
							 }
						 }
						 
						 if(_bol){
							 _this.deleteData.splice(_i,1);  
						 }else{
							 _this.deleteData.push({"taskId":_this.odataList[$index].taskid,"index":$index,type:_this.odataList[$index].type}); 
						 }
						 
					 }else{
						 _this.deleteData.push({"taskId":_this.odataList[$index].taskid,"index":$index,type:_this.odataList[$index].type});
					 }

					 _this.deleteData.sort(arrSort('index')); //数组进行排序
					 _this.checkNum =  _this.deleteData.length; //记录勾选的数量
					 
					 if(_this.checkNum ==_this.odataList.length){ //判断是否全选
						 _this.isSelectAll = 1;  
					 }else{
						 _this.isSelectAll = 0;  
					 }
				},
				//滚动加载
			    fnScroll:function(event){
			    	if(!vm.scrollBol){
			    		return;
			    	}
			    	var _this=event.target;
			    	//滚动条距离顶部的高度
			    	var scrollTop = $("#ascrail2000 .nicescroll-cursors").css('top');
			    	//滚动条的高度
			    	var scrollHeight=$("#ascrail2000 .nicescroll-cursors").height();
					// tab的高度
					var h=$(_this).height();
					if(parseInt(scrollTop)>=((h-scrollHeight)*0.9)){
						vm.pageNum+=1;
						vm.getList(vm.pageNum);
					}
						
			    }
				
				
		  }
	});
	/**回收站剩余时间过滤**/
	Vue.filter('recycletime', function (value) {
		return getLastTime(value); 
	});
	
	/*自定义滚动条*/
	setNiceScroll($('.content-list-tbody'));
});

/***
 * 获取剩余时间
 */
function getLastTime(time){
	if(time / 86400000 >= 1){
		return parseInt(time / 86400000);
	}else{
		return '<1';
	}
	 
}