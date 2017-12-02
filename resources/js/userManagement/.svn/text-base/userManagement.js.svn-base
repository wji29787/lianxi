/*用户管理*/
$(function(){
	//全选点击事件
	/*$('.all-sel').click(function(){
		var selNum=$('.sel-item').length;
		if($(this).children('i').hasClass("icon-xuanzhong")){
			//取消全选
			clickSel=0;
			$(this).children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
			$('.sel-item').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
		}else{
			//全选
			clickSel=$('.sel-item').length;
			$(this).children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
			$('.sel-item').children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
		}
		$('.all-int').html('全选('+clickSel+'/'+selNum+')');
	});*/
	//选中子级点击事件	
/*	$('.sel-item').click(function(){
		var selNum=$('.sel-item').length;
		if($(this).children('i').hasClass("icon-xuanzhong")){
			clickSel-=1;
			$(this).children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
		}else{
			clickSel+=1;
			$(this).children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
		}
		if(clickSel==selNum){
			$('.all-sel').children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
		}else{
			$('.all-sel').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
		}
		
		$('.all-int').html('全选('+clickSel+'/'+selNum+')');
			
	});*/
	/*
	 * 用户列表数据的自定义滚动条
	 * */
	setNiceScroll({obj:$('.tab-body'),right:-15});
	/*批量恢复点击事件*/
  /* $('.batch-recovery').click(function(){
	   $('.batch-box').hide();
	   $('.dete-cancel').show();
	   $('.all-sel-box').show();
	   $('.no-sel-box').hide();	   
	   vm.selIsShow=true;   
	   var selNum=$('.sel-item').length;
	   $('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
   });*/
   /*批量禁用点击事件*/
 /*  $('.batch-disable').click(function(){
	   $('.batch-box').hide();//隐藏创建用户、批量禁用恢复
	   $('.dete-cancel').show();//显示确定取消
	   $('.all-sel-box').show();//显示有全选的表头
	   $('.no-sel-box').hide();//隐藏没有全选的表头
	   vm.selIsShow=true;  //显示列表的所有选中框
	   var selNum=$('.sel-item').length;
	   $('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
   });*/
   /*确定点击事件*/
 /*  $('.determine').click(function(){
	   $('.batch-box').show();
	   $('.dete-cancel').hide();
	   $('.all-sel-box').hide();
	   $('.no-sel-box').show();
	   vm.selIsShow=false;  
   });*/
   /*取消点击事件*/
  /* $('.cancel').click(function(){
	   $('.batch-box').show();
	   $('.dete-cancel').hide();
	   $('.all-sel-box').hide();
	   $('.no-sel-box').show();
	   vm.selIsShow=false;  
   });*/
	vm.fnGetUserList();
	/**空间成员状态过滤**/
	Vue.filter('state-filter', function (value) {
		var text;
		if(!value){
		  text = "";	
		}
		switch(value)
		{
		    case 0:
			  text = "离线";
			  break;
			case 1:
			  text = "在线";
			  break;
			case 2:
			  text = "禁用";
			  break;
		};
		return text;
	});
});
//写在new Vue之前
Vue.component('user-item', {
	  // todo-item 组件现在接受一个
	  // "prop"，类似于一个自定义属性
	  // 这个属性名为 todo。
	  props: ['todo','aa'],
	  template: '<dl class="displayflex"><dd class="sel-item"><i  class="icon iconfont icon-weixuanzhong"></i></dd><dd class="username">{{todo.userName}}</dd><dd class="time" >{{todo.time}}</dd><dd class="state">{{todo.state}}</dd><dd class="power">{{todo.power}}</dd><dd class="operation displayflex"><ul><li><i class="icon iconfont icon-bianji"></i></li><li><i class="icon iconfont icon-ban"></i></li><li></li><li></li></ul></dd></dl>'
	  
	});
var vm=new Vue({
	el:'.content',
	data:{
		loginUserPermissions:$('#uPermissions').val(),
		loginId:$('#userId').val()-0,
		userSwitch:$('#userSwitch').val()-0, //判断同步开关
		basePath:$(".basePath").attr("href"),
		searchWord:'',//搜索框的输入值
		selIsShow:false,//控制批量框，选择框是否显示
		clickSel:0,//计数器，记录选中了多少个
		dataIndex:-1,//用了记录编辑单条的数据的下标
		pageNum:1,
		recoveryOrDisable:'',//用来标记是执行批量禁用方法还是执行批量恢复方法'disable'为禁用，'recovery'为恢复
		pageSize:15,
		userList:[],
		user:{'userName':'','userCreatTime':'','userContanct':'','passWord':'','passWord2':'','userJob':'','userAddress':'','remark':'','version':''},
		isGetUserList:true,//是否继续获取用户数据，当最后一页时就停止滚动获取
		//userList:[{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'},{'userName':'wowo','time':'12:12:00','state':'在线','power':'所有'}],
		playBol:true,
		timeSort:true,
		opeiateType:0,// 1 为禁用 2为恢复 3为删除 0为默认
		scrollBol:true
	},
	watch:{
		  searchWord:function(value){
			  this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g,'');/*去前空格和敏感字符*/
		  },  
  },
	methods:
	{
		synUser:function(){
			var _str = '<div class="zlayer-wrap" style="display:block;">' +
			'<div class="zlayer-box"><div class="zlayer-top"><span class="zlayer-txt">温馨提示</span> <h3 class="zlayer-title"></h3> <i class="zlayer-close iconfont icon-guanbi"></i></div>' +
			'<div class="add-delete">' +
			'<div class="add-delete-txt">您确定要将本服务所有用户信息同步到统一登陆服务吗？</div>' +
			'<div class="add-delete-op z-synuser"><button class="sham-btn sham-btn-sure">确定</button> <button class="sham-btn sham-btn-default">取消</button> </div>' +
			'</div></div></div>';
			
			var _index = layer.open({
				type: 1,
				closeBtn: 0,
				shade: [0.7],
				title: false,
				area: [],
				resize: false,
				content: _str,
				success: function() {
					$('.zlayer-close,.z-synuser .sham-btn-default').click(function() {
						layer.close(_index);
					});

					$('.z-synuser .sham-btn-sure').click(function() {
						layer.close(_index);
						var _lodingIndex = layer.open({
							type: 1,
							closeBtn: 0,
							shade: [0.7],
							title: false,
							area: [],
							resize: false,
							content:'<div style="width:600px; height:80px; line-height:80px; color:#fff; text-align:center; font-size:18px">同步中，请稍后...</div>'
						});
						
						$.ajax({
							type: 'POST',
							url: 'UserSystem/user/logon.do',
							success: function(data) {
								layer.close(_lodingIndex);
								if(data.result){
									layer.msg('同步完成！');
									console.log(data.msg);
								}else{
									layer.msg(data.msg);
								}
							},
							error: function(data) {
								layer.close(_lodingIndex);
								layer.msg('通讯失败，请稍后重试');
							},
							dataType: 'JSON'
						})
					})
				}
			});
		},
		//全选
		fnCheckAll:function(event){
			var selNum=$('.sel-i').length;//获取所有数据数
			var _this = event.target;
			/*console.log(_this);*/
			//_this.children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
			if($(_this).hasClass("icon-xuanzhong")){
				//取消全选
				vm.clickSel=0;
				$(_this).removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
				$('.sel-item').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
			}else{
				//全选
				vm.clickSel=$('.sel-i').length;
				$(_this).removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
				$('.sel-item').children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
			}
			$('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
		},
	    //单选
	    fnCheck:function(event){
	    	var selNum=$('.sel-i').length;
			var _this = event.target;
			if($(_this).hasClass("icon-xuanzhong")){
				vm.clickSel-=1;
				$(_this).removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
			}else{
				vm.clickSel+=1;
				$(_this).removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
			}
			if(vm.clickSel==selNum){
				$('.all-sel').children('i').removeClass("icon-weixuanzhong").addClass("icon-xuanzhong");
			}else{
				$('.all-sel').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
			}
			
			$('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
	    },
		//批量删除按钮点击事件
		fnDelete:function(){
	    	var _this  = this;
            _this.opeiateType = 3;
            vm.selIsShow=true;
            _this.recoveryOrDisable = "delete";
            var t='';
            t=setTimeout(function(){
                var selNum=$('.sel-i').length;
                $('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
                clearTimeout(t);
            },100);
		},
	    //批量恢复按钮点击事件
	    fnBatchRecovery:function(){	   
	    	
	      vm.recoveryOrDisable='recovery';
	      vm.selIsShow=true;  
	 	  vm.opeiateType=1;//禁用的可以显示 恢复的不显示	 	  
	 	  var t='';	 	  
	 	  t=setTimeout(function(){
	 		 var selNum=$('.sel-i').length;
		 	  $('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
		 	  clearTimeout(t);
	 	  },100);
	 	 
          
	    },
	    //批量禁用按钮点击事件
	    fnBatchDisable:function(){
	    	vm.recoveryOrDisable='disable';
	    	vm.selIsShow=true;  
	    	 vm.opeiateType=2;//恢复的可以显示 禁用的不显示
	    	 var t='';	 	  
		 	  t=setTimeout(function(){
		 		 var selNum=$('.sel-i').length;
			 	  $('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
			 	  clearTimeout(t);
		 	  },100);
		 
	    },
	    //单个用户禁用
	    fnUserDisable:function(event,i){
	    	
	    	var _this=event.target;
	    	var  userId=$(_this).attr("data-id");
	    	var _str = "<div class='z-comm-layer-wrap'>";
	    	_str += '<div class="z-comm-layer-box z-delete">';
			_str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
			_str+='<div class="z-comm-layer-delete-box">\
					<p>您确定要禁用该用户吗?</p>\
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
			    scrollbar: false,
			    shadeClose: false, //点击遮罩关闭
			    content:_str,
			    success:function(){
			    	$('.z-layer-close').click(function(){
						layer.close(index);
					});
					$('.z-layer-sure').click(function(){
						layer.close(index);
						 $.ajax({
				    			url:vm.basePath+'userManagement/updateUserState.do',
				    			type:'post',
				    			data:{'uid':userId},
				    			dataType:'json',
				    			success:function(data){
				    				if(!isLogonError(data)){
					  					return ;
					  				}
				    				if(data.result){
				    				//禁用成功的话改变对应下标的状态值
				    					vm.userList[i].userState=2;
				    				}
				    				layer.msg(data.msg);
				    			}
				    		});
					});
					$('.z-layer-cancel').click(function(){
						layer.close(index);
					});
			    }
			}); 
	    		
	    	/*var _this=event.target;
	    	var  userId=$(_this).attr("data-id");
	    	var index = layer.open({
				title:'温馨提示',
			    area: ['6rem'],
			    scrollbar: false,
			    shadeClose: false, //点击遮罩关闭
			    btn: ['确定','取消'],
			    content:"<p style='text-align:center;font-size:0.18rem'>您确定要禁用该用户吗?</p>",	
			    yes: function(index, layero){
			        //do something
			        layer.close(index); //如果设定了yes回调，需进行手工关闭
			        $.ajax({
		    			url:vm.basePath+'userManagement/updateUserState.do',
		    			type:'post',
		    			data:{'uid':userId},
		    			dataType:'json',
		    			success:function(data){
		    				if(data.result){
		    				//禁用成功的话改变对应下标的状态值
		    					vm.userList[i].userState=2;
		    				}
		    				layer.msg(data.msg);
		    			}
		    		});
			        
			    },
			    cancel:function(index, layero){
			    },
			}); */
	  	
	    },
	  //批量用户禁用执行方法
	    fnUserListDisable:function(strId,userIndex){
	    	$.ajax({
    			url:vm.basePath+'userManagement/updateUserState.do',
    			type:'post',
    			data:{'uid':strId},
    			dataType:'json',
    			success:function(data){
    				if(!isLogonError(data)){
	  					return ;
	  				}
    				if(data.result){
    				//禁用成功的话改变对应下标的状态值
    					for(var i=0; i<userIndex.length; i++){
    						vm.userList[userIndex[i]].userState=2;
    					}

    				}
    				layer.msg(data.msg);
    			}
    		});
	    },
	    //单个用户恢复
	    fnUserRecovery:function(event,i){
	    	
	    	var _this=event.target;
	    	var  userId=$(_this).attr("data-id");
	    	
	    	var _str = "<div class='z-comm-layer-wrap'>";
	    	_str += '<div class="z-comm-layer-box z-delete">';
			_str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
			_str+='<div class="z-comm-layer-delete-box">\
					<p>您确定要恢复该用户吗?</p>\
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
			    scrollbar: false,
			    shadeClose: false, //点击遮罩关闭
			    content:_str,
			    success:function(){
			    	$('.z-layer-close').click(function(){
						layer.close(index);
					});
					$('.z-layer-sure').click(function(){
						layer.close(index);
						$.ajax({
			    			url:vm.basePath+'userManagement/modifyUserState.do',
			    			type:'post',
			    			data:{'uid':userId},
			    			dataType:'json',
			    			success:function(data){
			    				if(!isLogonError(data)){
				  					return ;
				  				}
			    				if(data.result){
			    				//禁用成功的话改变对应下标的状态值
			    					vm.userList[i].userState=0;
			    				}
			    				layer.msg(data.msg);
			    			}
			    		});
					});
					$('.z-layer-cancel').click(function(){
						layer.close(index);
					});
			    }
			}); 
	    	
	    	
	    	/*var _this=event.target;
	    	var  userId=$(_this).attr("data-id");
	    	var index = layer.open({
				title:'温馨提示',
			    area: ['6rem'],
			    scrollbar: false,
			    shadeClose: false, //点击遮罩关闭
			    btn: ['确定','取消'],
			    content:"<p style='text-align:center;font-size:0.18rem'>您确定要恢复该用户吗?</p>",	
			    yes: function(index, layero){
			        //do something
			        layer.close(index); //如果设定了yes回调，需进行手工关闭
			        $.ajax({
		    			url:vm.basePath+'userManagement/modifyUserState.do',
		    			type:'post',
		    			data:{'uid':userId},
		    			dataType:'json',
		    			success:function(data){
		    				if(data.result){
		    				//禁用成功的话改变对应下标的状态值
		    					vm.userList[i].userState=0;
		    				}
		    				layer.msg(data.msg);
		    			}
		    		});
			        
			    },
			    cancel:function(index, layero){
			    },
			}); */
	    	
	    	
	    },
	    //批量恢复用户执行方法
	    fnUserListRecovery:function(strId,userIndex){
	    	$.ajax({
    			url:vm.basePath+'userManagement/modifyUserState.do',
    			type:'post',
    			data:{'uid':strId},
    			dataType:'json',
    			success:function(data){
    				if(!isLogonError(data)){
	  					return ;
	  				}
    				if(data.result){
    				//禁用成功的话改变对应下标的状态值
    					for(var i=0; i<userIndex.length; i++){
    						vm.userList[userIndex[i]].userState=0;
    					}   					
    				}
    				layer.msg(data.msg);
    			}
    		});
	    },
	    //确定
	    fnDetermine:function(){
	    	vm.clickSel=0;
	    	var UserIdList=[];//记录多个用户id
	    	var userIndex=[];//记录多个下标
	    	$('.sel-item i.icon-xuanzhong').each(function(){
	    		userIndex.push($('.sel-item ').index($(this).parent()));
	    		UserIdList.push($(this).attr('data-id'));
	    	});
	    	/*console.log(UserIdList);
	    	console.log(userIndex);*/
	    	if(UserIdList.length<1){
	    		layer.msg("<p style='text-align:center'>请选择要操作的数据!</p>");
	    		return;
	    	}
	    	var strId=UserIdList.join(',');//多个用户id用逗号连接
	    	//用一个变量坐标来判断是禁用还是恢复？
	    	if(vm.recoveryOrDisable=="recovery"){
	    		
	    		var _str = "<div class='z-comm-layer-wrap'>";
	    		_str += '<div class="z-comm-layer-box z-delete">';
				_str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
				_str+='<div class="z-comm-layer-delete-box">\
						<p>您确定要恢复这些用户吗?</p>\
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
				    scrollbar: false,
				    shadeClose: false, //点击遮罩关闭
				    content:_str,
				    success:function(){
				    	$('.z-layer-close').click(function(){
							layer.close(index);
						});
						$('.z-layer-sure').click(function(){
							layer.close(index);
							vm.fnUserListRecovery(strId,userIndex);//批量恢复
						});
						$('.z-layer-cancel').click(function(){
							layer.close(index);
						});
				    }
				}); 
	    		
	    		/*var index = layer.open({
					title:'温馨提示',
				    area: ['6rem'],
				    scrollbar: false,
				    shadeClose: false, //点击遮罩关闭
				    btn: ['确定','取消'],
				    content:"<p style='text-align:center;font-size:0.18rem'>您确定要恢复这些用户吗?</p>",	
				    yes: function(index, layero){
				        //do something
				        layer.close(index); //如果设定了yes回调，需进行手工关闭
				      //批量恢复
				    	vm.fnUserListRecovery(strId,userIndex);
				        
				    },
				    cancel:function(index, layero){
				    },
				}); */
	    		
	    	}else if(vm.recoveryOrDisable=="disable"){
	    		var _str = "<div class='z-comm-layer-wrap'>";
	    		 _str += '<div class="z-comm-layer-box z-delete">';
				_str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
				_str+='<div class="z-comm-layer-delete-box">\
						<p>您确定要禁用这些用户吗?</p>\
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
				    scrollbar: false,
				    shadeClose: false, //点击遮罩关闭
				    content:_str,
				    success:function(){
				    	$('.z-layer-close').click(function(){
							layer.close(index);
						});
						$('.z-layer-sure').click(function(){
							layer.close(index);
							vm.fnUserListDisable(strId,userIndex); //批量禁用
						});
						$('.z-layer-cancel').click(function(){
							layer.close(index);
						});
				    }
				}); 
	    		
	    		/*var index = layer.open({
					title:'温馨提示',
				    area: ['6rem'],
				    scrollbar: false,
				    shadeClose: false, //点击遮罩关闭
				    btn: ['确定','取消'],
				    content:"<p style='text-align:center;font-size:0.18rem'>您确定要禁用这些用户吗?</p>",	
				    yes: function(index, layero){
				        //do something
				        layer.close(index); //如果设定了yes回调，需进行手工关闭
				      //批量禁用
				    	vm.fnUserListDisable(strId,userIndex);
				    },
				    cancel:function(index, layero){
				    },
				}); */
	    		
	    	}else if(vm.recoveryOrDisable=="delete"){
            
                var _str = "<div class='z-comm-layer-wrap'>";
                _str += '<div class="z-comm-layer-box z-delete h344">';
                _str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
                _str+='<div class="z-comm-layer-delete-box h252">\
    						<p class="z-delete-fangshi">请选择删除方式</p>\
                			<div class="user-radio-box">\
                				<div class="user-radio"><i class="iconfont icon-radio-active" data-type="0"></i>删除用户并将用户下全部资源和空间转移到admin</div>\
                				<div class="user-radio"><i class="iconfont icon-radio" data-type="1"></i>删除用户并同时删除用户下的全部资源和空间</div>\
                			</div>\
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
                    scrollbar: false,
                    shadeClose: false, //点击遮罩关闭
                    content:_str,
                    success:function(){
                        $('.z-layer-close,.z-layer-cancel').click(function(){
                            layer.close(index);
                        });
                        
                        var _deleteType = 0;

                        $('.user-radio i.iconfont').click(function(){
                        	if($(this).hasClass('icon-radio-active')){
    							return;
    						}else{
                        		_deleteType = $(this).data('type');
                        		$(this).removeClass('icon-radio').addClass('icon-radio-active');
                                $(this).parent().siblings().find('i.iconfont').removeClass('icon-radio-active').addClass('icon-radio');
    						}
    					})
                        
                        $('.z-layer-sure').click(function(){
                            layer.close(index);
                            vm.fnUserListDelete(strId,userIndex,_deleteType); //批量删除
                        });
                    }
                });
            }
	    	$('.all-sel , .sel-item').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
	    	vm.selIsShow=false;
	    	vm.opeiateType=0;
	    	
	    },
	    //取消
	    fnCancel:function(){
	    	vm.clickSel=0;
	    	$('.all-sel , .sel-item').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
	    	vm.selIsShow=false;
	    	 vm.opeiateType=0;
	    },
	    //按关键字搜索
	    fnSearch:function(){
	    	var _this = this;
	    	//alert(vm.searchWord);
	    	 if(!_this.scrollBol){ //解决双击数据为空问题
	    		 return;
	    	 }
	    	_this.pageNum=1;
	    	_this.userList=[];
	    	_this.isGetUserList=true;
	    	_this.fnGetUserList();
	    },
	    //获取用户数据
	    fnGetUserList:function(type){
	    	var _this = this;
	    	 if(type=='timeSort'){
				   _this.timeSort = !_this.timeSort;
				   _this.isGetUserList=true;
			   }
	    	 
	    	 if(!_this.isGetUserList){ //加载到底不再请求
	    		 return;
	    	 }
	    	 
	    	 if(!_this.scrollBol){ //禁止重复加载
	    		 return;
	    	 }
	    	
	    	$.ajax({
	    		type:'POST',
	    		url:'userManagement/userList.do',
	    		data:{"pageNum":_this.pageNum,"pageSize":_this.pageSize,"searchWord":formatStringInSubmit(_this.searchWord),'userCreatTimeSort':_this.timeSort?'desc':'asc'},
	    		beforeSend:function(){
	    			_this.scrollBol = false;
	    		},
	    		success:function(data){
	    			if(!isLogonError(data)){
	  					return ;
	  				}
	    			
	    			if(data.result){
		    			setTimeout(function(){
		    				_this.scrollBol = true;
		  				},350);
		    			if(vm.pageNum>=data.list.pages){
		    				_this.isGetUserList=false;//已到达最后一页，停止请求下一页数据
		    			}
		    			_this.userList=_this.userList.concat(data.list.list);
		    			if(type=='timeSort'){ //排序时重新赋值给页面
		    				_this.userList = data.list.list;
		    				_this.pageNum = 1;
		    				 $(".tab-body").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
		    			}
		    		}
	    			
		    		$('.all-sel').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
		    		var selNum=$('.sel-i').length;
					$('.all-int').html('全选('+_this.clickSel+'/'+selNum+')');
	    			
	    		},
	    		error:function(data){
	    			setTimeout(function(){
	  					_this.scrollBol = true;
	  				},350);
	    			layer.msg(data.msg);
	    		},
	    		dataType:'JSON'
	    	})
	    /*	$.post(
	    			vm.basePath+"/userManagement/userList.do",
	    			{"pageNum":vm.pageNum,"pageSize":vm.pageSize,"searchWord":formatStringInSubmit(vm.searchWord),'userCreatTimeSort':_this.timeSort?'desc':'asc'},
	    			function(json){
	    				
	    				if(!isLogonError(json)){
		  					return ;
		  				}
	    				
	    		var data=eval('('+json+')');
	    		console.log(data);
	    		if(data.result){
	    			setTimeout(function(){
	  					vm.scrollBol = true;
	  				},350);
	    			if(vm.pageNum>=data.list.pages){
	    				vm.isGetUserList=false;//已到达最后一页，停止请求下一页数据
	    			}
	    			vm.userList=vm.userList.concat(data.list.list);
	    			if(type=='timeSort'){ //排序时重新赋值给页面
	    				vm.userList = data.list.list;
	    				vm.pageNum = 1;
	    				 $(".tab-body").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
	    			}
	    		}
	    		$('.all-sel').children('i').removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
	    		var selNum=$('.sel-i').length;
				$('.all-int').html('全选('+vm.clickSel+'/'+selNum+')');
	    	});*/
	    	
	    },


        //批量删除用户执行方法
        fnUserListDelete:function(strId,userIndex,type){
            $.ajax({
                url:vm.basePath+'userManagement/deleteUser.do',
                type:'post',
                data:{'userIds':strId,'isAllDelete':type},
                dataType:'json',
                success:function(data){
                    if(!isLogonError(data)){
                        return ;
                    }
                    if(data.result){
                        //删除成功的话改变对应下标的状态值
                        for(var i=0; i<userIndex.length; i++){
                            vm.userList.splice(userIndex[i]-i,1);
                        }
                    }
                    layer.msg(data.msg);
                }
            });
        },

		//弹窗信息方法暂时单个删除所用到，可以通过配置进行拓展
        fnLayerMsg:function(strId,userIndex){
            var _str = "<div class='z-comm-layer-wrap'>";
            _str += '<div class="z-comm-layer-box z-delete h344">';
            _str+="<div class='layer-top clearfix'><span class='layer-title'>温馨提示</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
            _str+='<div class="z-comm-layer-delete-box h252">\
						<p class="z-delete-fangshi">请选择删除方式</p>\
            			<div class="user-radio-box">\
            				<div class="user-radio"><i class="iconfont icon-radio-active" data-type="0"></i>删除用户并将用户下全部资源和空间转移到admin</div>\
            				<div class="user-radio"><i class="iconfont icon-radio" data-type="1"></i>删除用户并同时删除用户下的全部资源和空间</div>\
            			</div>\
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
                scrollbar: false,
                shadeClose: false, //点击遮罩关闭
                content:_str,
                success:function(){
                    $('.z-layer-close,.z-layer-cancel').click(function(){
                        layer.close(index);
                    });

                    var _deleteType = 0;

                    $('.user-radio i.iconfont').click(function(){
                    	if($(this).hasClass('icon-radio-active')){
							return;
						}else{
                    		_deleteType = $(this).data('type');
                    		$(this).removeClass('icon-radio').addClass('icon-radio-active');
                            $(this).parent().siblings().find('i.iconfont').removeClass('icon-radio-active').addClass('icon-radio');
						}
					})
                    
                    $('.z-layer-sure').click(function(){
                        layer.close(index);
                        vm.fnUserListDelete(strId,userIndex,_deleteType); //批量删除直接删除所有资源
                    });
                }
            });
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
			if(parseInt(scrollTop)>=((h-scrollHeight)-10)){			
				vm.pageNum+=1;
//				if(vm.isGetUserList){
					vm.fnGetUserList();
					
					//console.log("加载");
					//console.log('scrollTop:'+parseInt(scrollTop)+'----H:'+(h-scrollHeight));
//				}				
			}
			
	    },
	    //创建用户信息
	    createUser:function(){	    	
	    	//vm.user={'userName':'','userCreatTime':'','userContanct':'','passWord':'','passWord2':'','userJob':'','userAddress':'','remark':'','version':''};	    	
	    	var str = "<div class='z-comm-layer-wrap'>";
	    	str+='<div class="z-comm-layer-box z-edit">';
	    	str+="<div class='layer-top clearfix'><span class='layer-title'>创建用户</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
	    	str+='<div class="layer-warp">';
	    	str+='<div class="list-information-box">';
	    		str+='<ul>';
	    			str+='<li class="clearfix short-item short-item-margin">';
	    				str+='<div><label>系统用户</label><input  maxlength="15"  class="" type="text" id="eidt_useraccount" onblur="checkUserAccount(this)" placeholder="请输入登陆账户"  value="" /></div>';
	    				str+='<p class="p-prompt" id="p_useraccount"></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item">';
	    				str+='<div><label>真实姓名</label><input  maxlength="10"  type="text" id="eidt_username" onblur="VerificationUserName(this)" placeholder="请输入真实姓名" value="" /></div>';
	    				str+='<p class="p-prompt" id="p_username"></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item short-item-margin">';
	    				str+='<div><label>联系电话</label><input  maxlength="13"  class="txt-prompt" type="text" id="eidt_usercontanct" onblur="Verificationusercontanct(this)" placeholder="请输入联系电话" value=""  /></div>';
	    			    str+='<p class="p-prompt" id="p_usercontanct"></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item">';
	    				str+='<div>';
	    					str+='<label>系统权限</label>';
	    						str+='<select id="setuserPermissions">';
//	    							str+='<option value="0">超级管理员</option>';
	    							if(vm.loginUserPermissions==0){
	    								str+='<option value="1">管理员</option>';
		    							str+='<option value="2">普通用户</option>';
	    							}else{
	    								str+='<option value="2">普通用户</option>';
	    							}	
	    						str+='</select>';
	    				str+=' </div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item short-item-margin">';
	    				str+='<div><label>登录密码</label><input  maxlength="16"  class="txt-prompt" type="password" id="eidt_password" onblur="VerificationPassword(this)" placeholder="请输入密码" /></div>';
	    				str+='<p class="p-prompt" id="p_password"></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item">';
	    				str+='<div><label>确认密码</label><input  maxlength="16"  class="txt-prompt" type="password" id="eidt_password2" onblur="VerificationPasswordTwo(this)" placeholder="请再次输入密码"  /></div>';
	    			    str+='<p class="p-prompt" id="p_password2"></p> ';
	    	    	str+='</li>';
	        		str+='<li class="clearfix mb30">';
	        			str+='<div><label>职位信息</label><input maxlength="50"  type="text" id="eidt_userjob" value="" /></div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix mb30">';
	    				str+='<div><label>联系地址</label><input maxlength="100"  type="text" id="eidt_useraddress" value="" /></div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix mb30">';
	    				str+='<div>';
	    					str+='<label>备注信息</label><textarea maxlength="1000"   id="eidt_remark" style="resize: none;"></textarea>';
	    				str+='</div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<div class="list-btn clearfix">';
	    				str+='<a href="javascript:;" id="save-user">保存</a>';
	    			str+='</div>';
	    		str+='</ul>';
	    	str+='</div></div></div></div>';
	    	var o = layer.open({
	    		title:false,
	    		type:1,
	    		closeBtn:0,
	    		shade:[0.7],
	    	    area: [],
	    	    scrollbar: false,
	    	    shadeClose: false, //点击遮罩关闭
	    	    content:str,
	    	    success:function(){
	    	    	$('.z-layer-close').click(function(){
	    	    		layer.close(o);
	    	    	});
	    	    	
	    	    	var _reg = /[^\u4e00-\u9fa5\w_]+/g;
	    	    	
	    	    	$('#eidt_userjob').blur(function(){
	    	    		var _this = $(this);
	    	    		if(_reg.test(_this.val())){
	    	    			_this.val(_this.val().replace(_reg,''));
	    	    			layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
	    	    		}
	    	    	})
	    	    	
	    	    	$('#eidt_useraddress').blur(function(){
	    	    		var _this = $(this);
	    	    		if(_reg.test(_this.val())){
	    	    			_this.val(_this.val().replace(_reg,''));
	    	    			layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
	    	    		}
	    	    	})
	    	    		
	    	    }
	        });
	    	    	
	    	//selectTrue($("#setuserPermissions"),vm.user.userPermissions);	    		    	
	    	//点击保存
	    	$('#save-user').click(function(){
	    		/*var oUserName=$.trim($('#eidt_useraccount'));
	    		if(!oUserName){
	    			$('#eidt_useraccount').blur();
	    		}
	    		$(".txt-prompt").blur();
	    		var i=$('.p-prompt').length;   //记录提示框的个数 		
	    		$('.p-prompt').each(function(){
	    		    //遍历每个提示框，提示框为空时减一，都为空时=0；有一个不为空时，!=0，就不能提交;
	    			if(!$.trim($(this).text())){
	    				i--;
	    			}    			
	    		});
	    		if(i!=0){		    		
	    			return;
	    		}*/
	    		//获取每个input值传过去
	    		var userData={};
	    		//userData["userId"]=uID;
	    		userData["userName"]=$("#eidt_username").val();//真实姓名
	    		userData["userAccount"]=$("#eidt_useraccount").val();//系统用户
	    		userData["userContanct"]=$("#eidt_usercontanct").val();//联系方式
	    		userData["passWord"]=$("#eidt_password").val();//密码
	    		userData["userJob"]=$("#eidt_userjob").val();//用户职位
	    		userData["userAddress"]=$("#eidt_useraddress").val();//地址
	    		userData["remark"]=$("#eidt_remark").val();//标注
	    		userData["userPermissions"]=parseInt($('#setuserPermissions').val());//权限
	    		userData['version']=$("#eidt_username").attr("data-version");
	    		
	    		/***创建用户***/
	    		if(!userData["userAccount"]){
	    			$('#eidt_useraccount').blur();
	    			return;
	    		}
	    		
	    		if($('#p_useraccount').html()=='用户名已存在'){
	    			return;
	    		}
	    		
	    		if(!VerificationUserName($("#eidt_username")[0])) { //真实姓名 
	    			return;
	    		}
	    		
	    		if(!Verificationusercontanct($("#eidt_usercontanct")[0])){ //手机
	    			return;
	    		}
	    		
	    		if(!VerificationPassword($('#eidt_password')[0])){
	    			return;
	    		}
	    		
	    		if(!VerificationPasswordTwo($("#eidt_password2")[0])){ //密码
	    			return;
	    		}
	    		/*if(!userData["userName"]){
	    			$('#eidt_username').blur();
	    			return;
	    		}*/
	    		
	    		/*if(!userData["userContanct"]){
	    			$('#p_usercontanct').html("手机号码不能为空");	
	    			return;
	    		}*/
	    		
	    		var _reg = /[^\u4e00-\u9fa5\w_]+/g;
	    		if(_reg.test(userData["userJob"])){
	    			var _this = $("#eidt_userjob");
	    			_this.val(_this.val().replace(_reg,''));
	    			userData["userJob"] = _this.val();
	    			layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
	    		}
	    		
	    		if(_reg.test(userData["userAddress"])){
	    			var _this = $("#eidt_useraddress");
	    			_this.val(_this.val().replace(_reg,''));
	    			userData["userAddress"] = _this.val();
	    			layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
	    		}
	    			    		
	    		//差个系统权限和密码验证及手机号验证
	    		$.ajax({
	    			url:vm.basePath+'userManagement/createUserinfo.do',
	    			type:'post',
	    			data:userData,
	    			dataType:'json',
	    			success:function(data){
	    				if(!isLogonError(data)){
		  					return ;
		  				}
	    				if(data.result){
//	    					vm.userList[vm.dataIndex].userName=userData.userName;
//	    					vm.userList[vm.dataIndex].userPermissions=parseInt(userData.userPermissions);
	    				vm.pageNum=1;
	    				vm.userList=[];
	    				vm.isGetUserList=true; //可以再次加载
	    				vm.fnGetUserList();
	    				layer.close(o);
	    				}
	    				layer.msg(data.msg);
	    			}
	    		});
	    	});
	    },
	  //更新用户信息
	    upUser:function(uID,type){
//	    	var title=uID!=-1?'编辑用户':'创建用户';
//	    	if(uID==-1){
//	    		vm.user={'userName':'','userCreatTime':'','userContanct':'','passWord':'','passWord2':'','userJob':'','userAddress':'','remark':'','version':''};
//	    	}
	    	var _title ='';
	    	if(type){
	    		_title = "查看信息";
	    	}else{
	    		_title = "编辑信息";
	    	}
	    	
	    	var str = "<div class='z-comm-layer-wrap'>";
	    	str+='<div class="z-comm-layer-box z-edit">';
	    	str+="<div class='layer-top clearfix'><span class='layer-title'>"+_title+"</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
	    	str+='<div class="layer-warp">';
	    	str+='<div class="list-information-box">';
	    	var _disabled='';
	    	var	_cDisabled='';
	    	//用来标记编辑时禁用系统权限改变
	    	var _seDisabled='disabled';
	    	var	_seCDisabled='z-disabled';
	    	if(vm.loginUserPermissions==0 ){
	    		_seDisabled='';
		    	_seCDisabled='';
	    	}
	    	if(type){
	    		_disabled = "disabled";
	    		_cDisabled = "z-disabled";	  
	    		_seDisabled='disabled';
		    	_seCDisabled='z-disabled';
	    	}
	    	
	    	//loginId ==uID
	    		str+='<ul>';
	    			str+='<li class="clearfix short-item short-item-margin">';
	    				str+='<div><label>真实姓名</label><input  maxlength="10"  '+_disabled+' data-version="'+vm.user.version+'" class="txt-prompt '+ _cDisabled +'" type="text" id="eidt_username" onblur="VerificationUserName(this)"  value="'+vm.user.userName+'" /></div>';
	    				str+='<p class="p-prompt" id="p_username"></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item">';
	    				str+='<div><label>创建时间</label><input  class="z-disabled" readonly type="text" id="eidt_usercreatime" value="'+vm.user.userCreatTime+'" /></div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix short-item short-item-margin">';
	    				str+='<div><label>联系电话</label><input  '+_disabled+' maxlength="13"  class="txt-prompt '+ _cDisabled +'" type="text" id="eidt_usercontanct" onblur="Verificationusercontanct(this)" value="'+vm.user.userContanct+'"  /></div>';
	    			    str+='<p class="p-prompt" id="p_usercontanct"></p>';
	    			str+='</li>';
	    			
	    			
	    			str+='<li class="clearfix short-item">';
	    				str+='<div>';
	    					str+='<label>系统权限</label>';
//	    						str+='<select class="'+ _cDisabled +'" '+_disabled+'   id="setuserPermissions">';
////	    							str+='<option value="0">超级管理员</option>';
//	    						if(vm.loginUserPermissions!=0 && type!=1){
//	    							str+='<option value="2">普通用户</option>';
//	    						}else if(vm.loginUserPermissions!=0 && type==1){
//	    							str+='<option value="1">管理员</option>';
//	    							str+='<option value="2">普通用户</option>';
//	    						}else{
//	    							str+='<option value="1">管理员</option>';
//	    							str+='<option value="2">普通用户</option>';
//	    						}	
//	    						str+='</select>';
	    					    str+='<select class="'+ _seCDisabled +'" '+_seDisabled+'   id="setuserPermissions">';						
									str+='<option value="1">管理员</option>';
									str+='<option value="2">普通用户</option>';									
								str+='</select>';
	    				str+=' </div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			
	    			
	    			if(!type){
	    				str+='<li class="clearfix short-item short-item-margin">';
		    				str+='<div><label>登录密码</label><input oninput="filterChara(this)" maxlength="16"  class="txt-prompt" type="password" id="eidt_password" onblur="VerificationPassword(this,1)" placeholder="请输入密码" /></div>';
		    				str+='<p class="p-prompt" id="p_password"></p>';
	    				str+='</li>';
		    			str+='<li class="clearfix short-item">';
		    				str+='<div><label>确认密码</label><input oninput="filterChara(this)" maxlength="16"  class="txt-prompt" type="password" id="eidt_password2" onblur="VerificationPasswordTwo(this,1)" placeholder="请再次输入密码"  /></div>';
		    			    str+='<p class="p-prompt" id="p_password2"></p> ';
		    	    	str+='</li>';
	    			}
	    			
	        		str+='<li class="clearfix mb30">';
	        			str+='<div><label>职位信息</label><input onblur="filterChara(this)" maxlength="50"  class="'+ _cDisabled +'" '+_disabled+' type="text" id="eidt_userjob" value="'+vm.user.userJob+'" /></div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix mb30">';
	    				str+='<div><label>联系地址</label><input onblur="filterChara(this)" maxlength="100"  class="'+ _cDisabled +'" '+_disabled+' type="text" id="eidt_useraddress" value="'+vm.user.userAddress+'" /></div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			str+='<li class="clearfix mb30">';
	    				str+='<div>';
	    					str+='<label>备注信息</label><textarea maxlength="1000"  class="'+ _cDisabled +'" '+_disabled+' id="eidt_remark" style="resize: none;">'+vm.user.remark+'</textarea>';
	    				str+='</div>';
	    				//str+='<p></p>';
	    			str+='</li>';
	    			
	    			if(!type){
	    				str+='<div class="list-btn clearfix">';
	    					str+='<a href="javascript:;" id="save-user">保存</a>';
	    				str+='</div>';
	    			}
	    			
	    		str+='</ul>';
	    	str+='</div></div></div></div>';
	    	var o = layer.open({
	    		title:false,//'创建用户',
	    		closeBtn:0,
	    		shade:[0.7],
	    		type:1,
	    	    area: [],
	    	    scrollbar: false,
	    	    shadeClose: false, //点击遮罩关闭
	    	    content:str,
	    	    success:function(){
	    	    	$('.z-layer-close').click(function(){
	    	    		layer.close(o);
	    	    	});
	    	    }
	        });
   	
	    	selectTrue($("#setuserPermissions"),vm.user.userPermissions);	 
	    	//点击保存
	    	$('#save-user').click(function(){	    		
	    		/*$(".txt-prompt").blur();
	    		var i=$('.p-prompt').length;   //记录提示框的个数 		
	    		$('.p-prompt').each(function(){
	    		    //遍历每个提示框，提示框为空时减一，都为空时=0；有一个不为空时，!=0，就不能提交;
	    			if(!$.trim($(this).text())){
	    				i--;
	    			}    			
	    		});
	    		if(i!=0){
		    		//alert(i);
	    			return;
	    		}*/
	    		//获取每个input值传过去
	    		var userData={};
	    		userData["userId"]=uID;
	    		userData["userName"]=$("#eidt_username").val();//真实姓名
	    		userData["userContanct"]=$("#eidt_usercontanct").val();//联系方式
	    		userData["passWord"]=$("#eidt_password").val();//密码
	    		userData["userJob"]=$("#eidt_userjob").val();//用户职位
	    		userData["userAddress"]=$("#eidt_useraddress").val();//地址
	    		userData["remark"]=$("#eidt_remark").val();//标注
	    		userData["userPermissions"]=parseInt($('#setuserPermissions').val());//权限
	    		userData['version']=$("#eidt_username").attr("data-version");
	    		//console.log(userData);
	    		/*if(!userData["userAccount"]){
	    			$('#eidt_useraccount').blur();
	    			return;
	    		}*/
	    		/***编辑用户***/
	    		
	    		if(!VerificationUserName($("#eidt_username")[0])) { //真实姓名 
	    			return;
	    		}
	    		
	    		if(!Verificationusercontanct($("#eidt_usercontanct")[0])){ //手机
	    			return;
	    		}
	    		
	    		
	    		if(!VerificationPassword($('#eidt_password')[0],1)){
	    			return;
	    		}
	    		
	    		if(!VerificationPasswordTwo($("#eidt_password2")[0],1)){ //密码
	    			return;
	    		}
	    		
	    		/*if(!userData["userName"]){
	    			$('#eidt_username').blur();
	    			return;
	    		}*/
	    		
	    		/*if(!userData["userContanct"]){
	    			$('#p_usercontanct').html("手机号码不能为空");	
	    			return;
	    		}*/
	    		
	    		var _reg = /[^\u4e00-\u9fa5\w_]+/g;
	    		if(_reg.test(userData["userJob"])){
	    			var _this = $("#eidt_userjob");
	    			_this.val(_this.val().replace(_reg,''));
	    			userData["userJob"] = _this.val();
	    			layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
	    		}
	    		
	    		if(_reg.test(userData["userAddress"])){
	    			var _this = $("#eidt_useraddress");
	    			_this.val(_this.val().replace(_reg,''));
	    			userData["userAddress"] = _this.val();
	    			layer.msg('您输入的内容包含特殊字符，已帮您自动过滤！');
	    		}
	    		
	    		
	    		//差个系统权限和密码验证及手机号验证
	    		$.ajax({
	    			url:vm.basePath+'userManagement/updateUserInfo.do',
	    			type:'post',
	    			data:userData,
	    			dataType:'json',
	    			success:function(data){
	    				if(!isLogonError(data)){
		  					return ;
		  				}
	    				if(data.result){
	    					//vm.userList[vm.dataIndex].userName=userData.userName;
	    					vm.userList[vm.dataIndex].userPermissions=parseInt(userData.userPermissions);
	    				    
	    				}
	    				layer.close(o);
	    				layer.msg(data.msg);
	    			}
	    		});
	    	});
	    },
	    //编辑用户
	    fnEidtUser:function(index,type){
	    	/*var _this=event.target;
	    	var dataIndex=$('.i-edituser').index($(_this));//获取当前数据在列表中的下标位置
	    	vm.dataIndex=dataIndex;
	    	var userID=$(_this).attr('data-id');*/
	    	vm.dataIndex = index;
	    	var userID = vm.userList[index].userId;
	    	
           $.ajax({
        	   url:vm.basePath+'userManagement/getListById.do',
        	   type:'post',
        	   data:{'uid':userID},
        	   dataType:'json',
        	   success:function(data){
        		   if(!isLogonError(data)){
	  					return ;
	  				}
        		   
        		   for(var item in data.userInfo){
        			   if(data.userInfo[item]==null){
        				   data.userInfo[item]='';
        			   }
        		   }
        		   vm.user=data.userInfo;
        		   vm.user.userCreatTime=format(vm.user.userCreatTime);
        		   //处理相应的数据后展现弹窗，然后保存
        		   vm.upUser(userID,type);
        	   }
           });
	    	
	    },	    
	}		
});


/*用户管理*/
;$(function(){
	$(".userManagement-page").addClass("active");//给头部导航增加选中状态
});
/*
 * 验证用户名
 * */
function VerificationUserName(obj){
	var ref=/[\s""“”''‘’。\?？\*\$%<>《》]/g;
	var oVal=$.trim($(obj).val());
	if(!oVal){
		/*$('#p_username').html("请填写用户名");*/
		$('#p_username').html("");
		return true;
	}else{
		if(ref.test(oVal)){
			$('#p_username').html("用户名不能包含特殊字符");	
			return false;
		}else{
			$('#p_username').html("");
			return true;
		}
		
	}
}

/*
 * 验证用户联系方式
 * */
function Verificationusercontanct(obj){
    var usercontanct=$.trim($(obj).val());
    var ref=/^1[3|4|5|7|8][0-9]{9}$/; //  /13[0123456789]{1}\d{8}|15[1235689]\d{8}|188\d{8}/
    if(!usercontanct){
    	$('#p_usercontanct').html("");
    	return true;
    }
	if(usercontanct&&!ref.test(usercontanct)){
		$('#p_usercontanct').html("手机号码不正确");
		return false;
	}else{
		$('#p_usercontanct').html("");
		return true;
	}
	return true;
}

/*
 * 验证密码
 * 只能输入6-16个字母、数字、下划线
 * */
function VerificationPassword(obj,type){
    var password=$.trim($(obj).val());
    var password2=$.trim($("#eidt_password2").val());
    
    if(type==1){
    	if(!password && password==password2){
    		return true;
    	}
    }else{
    	if(!password){
        	$('#p_password').html("请填写密码");
        	return false;
        }
    }
    
    var ref=/^(\w){6,16}$/;
	if(password&&!ref.test(password)){
		$('#p_password').html("只能输入6-16个字母、数字、下划线");	
		return false;
	}else{
		$('#p_password').html("");
		return true;
	}
    
}

/*
 * 再次验证密码
 * 只能输入6-16个字母、数字、下划线
 * */
function VerificationPasswordTwo(obj,type){
	var password=$.trim($("#eidt_password").val());
    var password2=$.trim($(obj).val());
    
	 if(type==1){//编辑时
    	if(!password2 && password==password2){
    		return true;
    	}
    }
    
    //两个密码都为空时
    if(!password&&!password2){   	
		$('#p_password').html("");	
    	$('#p_password2').html("");	    	
    	return;
    }
  //两个密码不一致时
    if(password!=password2){
    	$('#p_password2').html("两次密码输入不一致");	
    	return;
    }else{    	
    	$('#p_password2').html("");	
    }
  //两个密码一致但格式不对时
    var ref=/^(\w){6,16}$/;
	if(password&&!ref.test(password)){
		$('#p_password').html("只能输入6-16个字母、数字、下划线");
		return;
	}else{
		$('#p_password').html("");
		return true;
	}
}

/*
 * 创建用户时验证密码
 * 只能输入6-16个字母、数字、下划线
 * 
function createVerificationPassword(obj,type){
    var password=$.trim($(obj).val());
    var ref=/^(\w){6,20}$/;
    if(type==1){
    	if(!password){
        	return true;	
        }
    }else{
    	if(!password){
        	$('#p_password').html("请填写密码");
        	return false;
        }
    }
    
    if (password&&!ref.test(password)){
    	$('#p_password').html("只能输入6-16个字母、数字、下划线");	
    	return false;
    }else if(password&&ref.test(password)){
    	$('#p_password').html('');
    	return true;
    }
   
}

 * 创建用户时再次验证密码
 * 只能输入6-16个字母、数字、下划线
 * 
function createVerificationPasswordTwo(obj,type){
	var password=$.trim($("#eidt_password").val());
    var password2=$.trim($(obj).val());
    
    if(type==1){//编辑时
    	if(!password && !password2){
    		return true;
    	}
    }
    
    //两个密码都为空时
    if(!password&&!password2){   	
		$('#p_password').html("请填写密码");	
    	//$('#p_password2').html("");	    	
    	return;
    }else if(!password2){
    	$('#p_password2').html("请再次输入密码");
    	return ;
    }
  //两个密码不一致时
    if(password!=password2){
    	$('#p_password2').html("两次密码输入不一致");	
    	return;
    }else if (password==password2){    	
    	$('#p_password2').html("");	
    }
  //两个密码一致但格式不对时
    var ref=/^(\w){6,16}$/;
	if(password&&!ref.test(password)){
		$('#p_password').html("只能输入6-16个字母、数字、下划线");		
	}else if(password&&ref.test(password)){
		$('#p_password').html("");	
	}
}*/

/*
 * 指定某个option 为选中值
 * obj 为select对象
 * val 为option的值
 * */
function selectTrue(obj,val){
	obj.find("option[value='"+val+"']").attr("selected",true);
}


/***
 * 验证系统用户
 */
function checkUserAccount(obj){
	var val=$.trim($(obj).val());
	var ref=/^[A-Za-z0-9_\-\u4e00-\u9fa5\u2014\u2014]+$/;
	if(val&&ref.test(val)){
		$('#p_useraccount').html('');
	}else if(!val|| !ref.test(val)){
		$('#p_useraccount').html('应包含中文、英文、数字、下划线、中划线');
		return ;
	}
	//验证用户名是否存在
	fnCheckUserName(obj);
}

/*
 * 验证用户名是否存在
 * */
function fnCheckUserName(obj){
	var val=$.trim($(obj).val());
	
	$.ajax({
		url:'userManagement/checkUserName.do',
		type:'post',
		data:{'name':val},
		dataType:'json',
		success:function(data){
			if(!isLogonError(data)){
					return ;
				}
			if(data.result){
				if(data.isUser){
					$('#p_useraccount').html('用户名已存在');
				}
			}
		}
	});
	
}