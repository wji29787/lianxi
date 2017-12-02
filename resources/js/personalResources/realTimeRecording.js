/*实时录制*/
;$(function(){
	$(".personal-page").addClass("active");//给头部导航增加选中状态
	var vm = new Vue({
		  el:'#personalResources',
		  mounted:function(){
			  var _this = this;
			  this.getList();
			  //定时器刷新请求
			  setInterval(function(){
				  _this.getList();
			  }, 60000);
		  },
		  data:{
			  odataList:"",
			  sIsShow:true,/*标记批量操作显隐*/
			  searchWord:"",
			  pageNum:1,
			  isSelectAll:0,//全选标记
			  deleteData :[],
			  deleteArray:"",//删除用户ID数组
			  pageSize:15,
			  checkNum:0,
			  checkAllNum:0,
			  detailBol:true,
			  scrollBol:true,
			  bScrollNo:true, //禁止请求
			  playBol:true, //防止重复点击播放
			  timeSort:true
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
			     
			   $.ajax({
		  			url : "personalResources/recordingTask/getList.do",
		  			type : "POST",
		  			data : {
		  				"searchWord":formatStringInSubmit(_this.searchWord),
		  				"pageSize":15,
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
		   },
		      
		  /*num:标记是点击的取消还是点击的批量删除*/
			checkBatchOperation:function(num){
				if(num == "1"){
				  vm.sIsShow = false;//隐藏批量操作按钮,展示确定取消按钮  
				  for(var i=0;i<vm.odataList.length;i++){
					 if(vm.odataList[i].taskstate==3){
						 vm.odataList.splice(i,1);
						 i--;
					 } 
				  }
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
						vm.delete_data(vm.deleteData);
					}else{
						layer.msg("<p style='text-align:center'>请选择要删除的数据!</p>");
				  }
				}
				
			},
			/*---查看详情---*/
			list_edit:function(_id,$index){
				
				$.ajax({
					 type:"POST",//通常会用到两种：GET,POST。默认是：GET
				      url:"personalResources/recordingTask/getByIdList.do",//(默认: 当前页地址) 发送请求的地址
				      dataType:"JSON",//预期服务器返回的数据类型。
				      data:{
				    	  taskid: _id
				      },
				      beforeSend:function(){ //请求前
		      		},
				      success:function(data){
				    	  if(!isLogonError(data)){
			  					return ;
			  				}
				    	  if(data.result){
				    		  var _data = data.data?data.data:{};
				    		  openLayer(data.data?data.data:{});
				    	  }
				    	  
				      }, //请求成功
				      error:function(){
				    	  vm.detailBol = true;
				      }
				})
				
				/*openLayer(vm.odataList[$index]);*/
				
				function openLayer(_data){
					var _index=layer.open({
						type: 1,
					 	title:false,
					    closeBtn:0,
					    shade:[0.7],
					    area: [],
					    resize:false,
					    shadeClose: false, //点击遮罩关闭
					    content:dom_list(_data),
					    btn:false,
					    success:function(){
					    	/*绑定展开折叠事件*/
					    	$("._child").click(function(){
					    		var that=$(this);
					    		if(that.attr('data-stae')=='1'){
					    			that.attr('data-stae','0');
					    		    that.find('ul').css({'overflow':'hidden'})
					    		}else{
					    			that.attr('data-stae','1');
					    		    that.find('ul').css({'overflow':'initial'})
					    		}
					    		return false;
					    	});
					    	/*阻止事件传递*/
					    	$("._child>ul>li").click(function(){
					    		return false;
					    	})
					    }
					});
					
					$('.z-layer-close').click(function(){
						layer.close(_index);
					})
				}

			},
			
			/*--预览播放--*/
			list_look:function(taskid,$index){
				if(!vm.playBol){
					return;
				}
				
				var layIndex; //打开层索引
				/*var bl= false; //定时器
				var timer= null;
				var _data1 = {},_intervalNum=1;
				
				timer = setInterval(function(){
					if(_intervalNum>10){
						clearInterval(timer);
					}else{
						_intervalNum++;
						if(bl){
							clearInterval(timer);
							fullScreen(); //进入全屏
							videoPlay(_data1);
						}
					}
				},300);*/
							
				$.ajax({
					type:'POST',
					url:'commons/playVideo.do',
					data:{videoId:taskid,type:1},
					success:function(data){
						if(data.result){
						/*fullScreen(); //进入全屏*/
						 /*bl=true;
						_data1 = data.data; */
						videoPlay(data.data);
						}else{
							layer.msg(data.msg);
						}
						vm.playBol = true;
					},
					error:function(data){
						layer.msg(data.msg);
						vm.playBol = true;
					},
					beforeSend:function(){
						vm.playBol = false;
					},
					dataType:'JSON'	
				})
				
				 function buquanping(_this,index){
					$('.z-layer-box').removeClass('wh100');
					$(_this).removeClass('icon-buquanping').addClass('icon-quanping');
					var fontSize = parseInt( $('html').css('fontSize') );
		    		layer.style(index,{
		    			width:fontSize*12.06+'px',
		    			height:fontSize*6.8+'px'
		    		})
		    		exitFullScreen(); //退出全屏
		    	}
				
				function quanping(_this,index){
					$('.z-layer-box').addClass('wh100');
					$(_this).removeClass('icon-quanping').addClass('icon-buquanping');
					fullScreen(); //进入全屏
					setTimeout(function(){
						layer.style(index,{
			    			width:$('html').width()+'px',
			    			height:$('html').height()+'px',
			    			left:0,
			    			top:0
			    		})
					},100)
				}
				
				function videoPlay(data){
					var _os = systemType(),
			     	taskid = data.videoId,
			     	_resourceName = data.videoName,
			     	_resourceUrl = data.rtmppath;
					
					
					var str="<div class='z-layer-box wh100'>";
				       str+="<div class='layer-top clearfix'><span class='layer-title'>视频播放</span><span class='vod-name' data-flvpath='"+addVideoPath(_resourceUrl)+"'>"+_resourceName+"</span><span class='layer-topright' id='z-full-screen'><i id='canclelayer' class='fl icon iconfont icon-guanbi'></i></span></div>";
				       str+="<div class='z-video-box'><input type='button' class='setimg' value='设为封面'><div class='layer-center layer-video' id='container'></div></div>";
				     str+="</div>";
				      
				     var jpJson = {
				    		 jpObj:null, //存放jsplayer实例对象
				    		 videoState:data.state, //记录当前的视频状态3正在录制4已完成
				    		 flvPath:addVideoPath(data.rtmppath), //视频播放地址
				    		 previewImg:data.framepath,//预览图
				    		 position:0,//播放进度
				    		 lastPosition:0, //上次播放的进度
				    		 lastDuration:0, //上次的视频长度
				    		 resetVideoTime:0,
				    		 previewRefeshPositon:0,
				    		 videoInteval:null, //定时器
				    		 intervalTime:500,
				    		 flag:true,
				    		 replayCount:0//判断重复播放次数，视频卡顿超过60次关闭这次播放
				     };
				     
				    				     
				     /**
				      * 刷新
				      */
				     function refreshVideo(){
				     	//alert(thePlayer.getDuration());
				     	jpJson.previewRefeshPositon = jpJson.jpObj.getPosition();
				     	jpJson.jpObj = objJwplayer(_path); //重生生成jwplayer
				     }
				     
				     layIndex= layer.open({
							type: 1,
							title: false,
							//area: ['13rem' , '7.14rem'],
							area: ['100%','100%'],
							resize:false,
							scrollbar : false,
							shadeClose: false, //点击遮罩关闭
							closeBtn: 0,//不显示关闭按钮
							shade:[0.7],
							content: str,
							stretching:"fill",
							success:function(){
								
								$('#z-full-screen').on('click','.icon-buquanping',function(){
									buquanping(this,layIndex); //退出全屏
								});
								
								$('#z-full-screen').on('click','.icon-quanping',function(){
									quanping(this,layIndex); //退出全屏
								});
								
								jpJson.jpObj = objJwplayer(jpJson.flvPath,jpJson.previewImg);  //返回jwplayer对象
								
								if(jpJson.jpObj){
									setTimeout(function(){
										videoStartPlay({type:1,resName:_resourceName,resUrl:_resourceUrl,resId:taskid}); //开始播放
									},1000);
								}
							},
					        end: function () {
					        	buquanping($('.icon-buquanping'),layIndex); //退出全屏
					        	jpJson.jpObj.remove();
					        	jpJson.jpObj.stop();
					        	jpJson.jpObj.pause(true);
					        	clearInterval(jpJson.videoInteval);//先清除定时，下面再重新启动一个定时
					        	videoStopPlay({type:1,resName:_resourceName,resUrl:_resourceUrl,resId:taskid}); //结束播放
					        }
						});
				     //设为封面点击事件
					$('.setimg').click(function(){	
						
						var playingTime=parseInt(jpJson.jpObj.getPosition()),
							_this = $(this);
						
						if(!playingTime){
							layer.msg('暂无法设置');
							return;
						}
						
						if(_this.data('set')){
							layer.msg('设置中，请稍后重试');
							return;
						}
						
						_this.data('set',1);
						
						$.ajax({
							url:"personalResources/videoScreenshot/screenshot.do?t="+new Date().getTime(),
							data:{'taskid':''+taskid,'time':''+playingTime,'number':'3'},
							dataType:'JSON',
							type:'post',
							success:function(data){
								if (!isLogonError(data)) {
	                                return;
	                            }
								if(data.result){
									layer.msg('设置成功');
									vm.odataList[$index].iconpath=data.data.iconpath;
								}else{
									layer.msg('设置失败');
								}
								_this.data('set','');
							},
							error:function(data){
								layer.msg(data.msg);
								_this.data('set','');
							}
						});
					});
					
					$("#canclelayer").click(function(){
						layer.close(layIndex);
					});
					
			        window.onunload=function(){
			        	videoStopPlay({type:1,resName:_resourceName,resUrl:_resourceUrl,resId:taskid});
			        }
					
					var _priorPosition = 0;
					var _samePositionCount = 0;
					
					//当视频状态为3正在录制时，请求并重新赋值给jwplayer时长
					function setVideoDuration(seekPosition){
						/*console.log(seekPosition);*/
						$.ajax({
							url : "commons/checkTaskState.do?t="+new Date().getTime(),
							type : "POST",
							data : {"taskid":taskid},
							dataType : "JSON",
							success : function(data) {
								if(!isLogonError(data)){
									return ;
								}
								var duration = data['duration']; //长度
								var taskstate = data['taskstate']; //视频状态
								if(parseInt(duration) <= 0) {
									duration = 0;//默认8秒时长
								}
								
								//console.log("--------------------------------------------taskstate = " + taskstate);
								if(jpJson.videoState == 4){
									if(jpJson.videoInteval){
										clearInterval(jpJson.videoInteval);//先清除定时，下面再重新启动一个定时
									}
									jpJson.videoState = 4;
									jpJson.jpObj.setDuration(duration); //设置时长
								}else if(duration > 0 && jpJson.jpObj) { //状态为3实时录制状态并且jw对象存在
									
									if(jpJson.jpObj.getPosition() > duration) { //当前播放时长大于返回的时长
										jpJson.jpObj.setDuration(jpJson.jpObj.getPosition()+1);//避免出现时间轴超出的现象
											//return;
									}else if(duration > jpJson.jpObj.getDuration()){
										jpJson.jpObj.setDuration(duration);//设置视频时长
									}
									
									
									//console.log("setVideoDuration--------------------------------------------duration = " + duration);
									if(seekPosition && seekPosition > 0 && seekPosition < duration) {//延时100毫秒后再seek,定位到多少
										setTimeout(function(){
											//console.log("================================================"+seekPosition);
											jpJson.jpObj.seek(seekPosition);
											seekPosition = 0;
										},100);
									}
									if(jpJson.videoInteval){
										clearInterval(jpJson.videoInteval);//先清除定时，下面再重新启动一个定时
									}
									
									jpJson.videoInteval = setInterval(function(){//定时更新视频的duration
										//console.log("thePlayer.getDuration() - thePlayer.getPosition() = " + thePlayer.getDuration() 
										//		+ " - " + thePlayer.getPosition() + " = " + (thePlayer.getDuration() - thePlayer.getPosition()));
										
										/*当播放位置停留在一个地方超过60次时，将自动关闭定时任务 start*/
										if(jpJson.jpObj.getPosition() == _priorPosition) {
											_samePositionCount++;
										}else {
											_samePositionCount = 0; //重置次数
											_priorPosition = jpJson.jpObj.getPosition();
										}
										//console.log("-------------thePlayer.getDuration() - thePlayer.getPosition() <= 8------_samePositionCount----------"+_samePositionCount);
										
										if(_samePositionCount >= 60){
											_priorPosition = 0;
											_samePositionCount = 0;
											if(jpJson.videoInteval) {
												clearInterval(jpJson.videoInteval);//先清除定时，下面再重新启动一个定时
											}
										}
										/*当播放位置停留在一个地方超过60次时，将自动关闭定时任务 end*/
										else if(jpJson.jpObj.getDuration() - jpJson.jpObj.getPosition() <= 8 ){
											//console.log("----------------------------thePlayer.getDuration() - thePlayer.getPosition() <= 10----------------清除定时");
											if(jpJson.videoInteval) {
												clearInterval(jpJson.videoInteval);//先清除定时，下面再重新启动一个定时
											}
											setVideoDuration(jpJson.jpObj.getPosition());//回调
										}
									}, jpJson.intervalTime);
								}
							}
						});
					}
					
					/**
					 * 返回Jwplayer对象函数
					 */
					function objJwplayer(_path,_previewImg){
						return jwplayer('container').setup({
	                        flashplayer: "resources/js/controls/jwplayer/jwplayer.flash.swf",
	                        file:_path,
	                        width:'100%',  //屏幕可视区
	                        height:'100%',
	                        image:_previewImg,//视频预览图片
	                        dock: false,
	                        autostart: true,
	                        logo:{
	                            prefix:"resources/js/controls/jwplayer",
	                            file:'/logo.png',
	                            link: 'http://www.visionvera.com/',
	                            hide: false,
	                            timeout: 10
	                        },
							rtmp: {
	                            bufferlength: 0.5
	                        },
	                        events: {
	                        	
	                        	onComplete: function () { //结束事件
	                            	//////console.log("播放完毕!!!");
	                            	jpJson.lastPosition = jpJson.jpObj.getDuration(); //记录上次的播放位置
	                            	if(jpJson.jpObj.getPosition() > 0) {
	                            		jpJson.lastPosition = jpJson.jpObj.getPosition();
	                            	}
	                            	jpJson.previewRefeshPositon = 0;
	                            	//console.log("onComplete----------------------------thePlayer.getDuration()-----------"+thePlayer.getDuration() + "-----清除定时");
	                            	//console.log("onComplete----------------------------thePlayer.getPosition()-----------"+thePlayer.getPosition() + "-----清除定时");
	                            	clearInterval(jpJson.videoInteval);//先清除定时，下面再重新启动一个定时
	                            },
	                        	
	                            onPlay:function () {
	                            	/*console.log(jpJson.videoState);*/
	                            	//////console.log("开始播放!!!");
	                            	if(jpJson.videoState == 3){
	                            		//console.log("onPlay----------------------------parseInt($('#taskstate').val()) == 3----------------");
	                            		var tempSeek = 0;
	                            		if(jpJson.previewRefeshPositon > 0 ) {
	                            			tempSeek = jpJson.previewRefeshPositon;
	                            			previewRefeshPositon = 0;
	                            		}else if(jpJson.lastPosition > 0 ) {
	                            			tempSeek = jpJson.lastPosition;
	                            			jpJson.lastPosition = 0;
	                            		}
	                            		//重新设置视频时长
	                            		setVideoDuration(tempSeek);
	                            		//控制视频时长与播放位置保持同步
	                            		if(jpJson.jpObj.getPosition() > jpJson.jpObj.getDuration()){ //超过时长
	                            			jpJson.jpObj.setDuration(jpJson.jpObj.getPosition());
	                            		}
	                            	}else if(jpJson.videoState == 4 ) {
	                            		//thePlayer.setDuration(100000);
	                            		//console.log("-----------previewRefeshPositon------"+previewRefeshPositon);
	                            		//console.log("-----------thePlayer.getDuration()------"+thePlayer.getDuration());
	                            		//重刷新的位置开始继续播放
	                            		if(jpJson.previewRefeshPositon > 0 && jpJson.jpObj.getDuration() - jpJson.previewRefeshPositon > 2) {
	                            			jpJson.jpObj.seek(previewRefeshPositon);
	                            			jpJson.previewRefeshPositon = 0;
	                            		}
	                            	}
	                            	
	                            },
	                            onPause: function () {
	                            	if(jpJson.videoInteval){
	                            		clearInterval(videoInteval);	
	                            	}
	                            }
							}
	                    });
					}
				}
				
			},
			
			/*删除*/
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
					_taskIndex = [],
					_this = vm; //存要删除的索引
								
					for(var i=0,_len=_data.length;i<_len;i++){ //数据转换
						if(i==_len-1){
							_taskId+=_data[i].taskId;
						}else{
							_taskId+=_data[i].taskId+',';
						}
						_taskIndex.push(_data[i].index);
					}
						
					$.post(
							'personalResources/recordingTask/deleteRecordingTask.do',
							{taskids:_taskId},
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
				    	_this.deleteData.push({"taskId":_this.odataList[i].taskid,"index":i});//删除数组
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
						 _this.deleteData.push({"taskId":_this.odataList[$index].taskid,"index":$index}); 
					 }
					 
				 }else{
					 _this.deleteData.push({"taskId":_this.odataList[$index].taskid,"index":$index});
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
	
	/**实时录制状态过滤**/
	Vue.filter('taskstate-filter', function (value) {
		var text;
		if(!value){
		  text = "";	
		}
		switch(value)
		{
		    case 0:
			  text = "未开始 ";
			  break;
			case 1:
			  text = "准备录制";
			  break;
			case 2:
			  text = "准备录制 ";
			  break;
			case 3:
			  text = "正在录制";
			  break;
			case 4:
			  text = "录制完成";
			  break;
			default:
			  text = "录制错误";
			  break;
			  	
		};
		return text;
	});
	
	
	/*自定义滚动条*/
	setNiceScroll($('.content-list-tbody'));
	
	/*--编辑dom结构(点击查询出现接口)--*/
	function dom_list(_data){
		var dem = "<div class='z-comm-layer-wrap'>";
		dem+='<div class="z-comm-layer-box z-edit">';
		dem+="<div class='layer-top clearfix'><span class='layer-title'>查看详情</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
		dem+='<div class="layer-warp">\
			<div class="layer-left">\
			<div class="layer-left-top">\
				 <img src="'+_data.picpath+'" alt="图片丢失" onerror="this.src=\'resources/images/img-lose.png\'"/>\
			</div>\
			<div class="layer-left-bottom">\
				<ul>\
						<li>\
							<i class="iconfont icon-78"></i><div class="label">会议名称</div><span title="'+returnEmpty(_data.meetname)+'">'+returnEmpty(_data.meetname)+'</span>\
						</li>\
						<li>\
							<i class="iconfont icon-78"></i><div class="label">录制时间</div><span title="'+timeYmdHms(_data.starttime)+'">'+timeYmdHms(_data.starttime)+'</span>\
						</li>\
						<li>\
							<i class="iconfont icon-78"></i><div class="label">录制人</div><span title="'+returnEmpty(_data.userAccount)+'">'+returnEmpty(_data.userAccount)+'</span>\
						</li>\
						<li>\
							<i class="iconfont icon-78"></i><div class="label">时长</div><span title="'+returnEmpty(_data.duration)+'">'+timeHms(_data.duration)+'</span>\
						</li>\
						<li>\
							<i class="iconfont icon-78"></i><div class="label">文件大小</div><span>'+videoFileSize(_data.fileSize)+'</span>\
						</li>\
						<li>\
							<i class="iconfont icon-78"></i><div class="label">录播服务器</div><span>'+returnEmpty(_data.captureip)+'</span>\
						</li>\
						<li class="_child">\
						<i class="iconfont icon-78"></i><div class="label">存储网关</div><span>'+returnEmpty(_data.sgip)+'</span>\
						<ul>\
							<li>\
								<i class="i iconfont icon-78"></i><div class="label _label">终端号</div><span>'+returnEmpty(_data.v2vid)+'</span>\
							</li>\
						</ul>\
					</li>\
				</ul>\
			</div>\
		</div>\
		<div class="layer-right">\
			<dl>\
				<dd>\
					<label class="lable">录制名称</label><input readonly class="input z-disabled" type="text"  value="'+returnEmpty(_data.capturename)+'"/>\
				</dd>\
				<dd>\
					<label class="lable">会议名称</label><input readonly  class="input z-disabled" type="text" value="'+returnEmpty(_data.meetname)+'" />\
				</dd>\
				<dd>\
					<label class="lable">创建时间</label><input readonly class="input z-disabled" type="text" value="'+timeYmdHms(_data.starttime)+'" />\
				</dd>\
				<dd>\
					<label class="lable">创建用户</label><input readonly class="input z-disabled" type="text" value="'+returnEmpty(_data.userAccount)+'" />\
				</dd>\
				<dd>\
					<label class="lable">录制人员</label><input readonly class="input z-disabled" type="text" value="'+returnEmpty(_data.recordUserName)+'" />\
				</dd>\
				<dd>\
					<label class="lable">主讲人员</label><input readonly class="input z-disabled" type="text" value="'+returnEmpty(_data.speaker)+'"/>\
				</dd>\
				<dd>\
					<label class="lable">参与人数</label><input readonly class="input z-disabled" type="text" value="'+returnZero(_data.numparticipants)+'" />\
				</dd>\
				<dd>\
					<label class="lable">备注信息</label><textarea readonly class="texer z-disabled" value="">'+returnEmpty(_data.remark)+'</textarea>\
				</dd>\
			</dl>\
		</div>\
	</div>';
	dem+="</div></div>";
	return dem;
	}
	
	
});




