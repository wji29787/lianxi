/*媒体文件*/
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
			  upData:{
				  name:'',
				  speaker:'',
				  joinNum:'',
				  remark:''
			  },
			  detailBol:true,
			  scrollBol:true,
			  bScrollNo:true, //禁止请求
			  playBol:true,
			  timeSort:true
		  },
		  watch:{
			  searchWord:function(value){
				  this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g,'');/*去前空格和敏感字符*/
			  },  
		  },
		  methods:
		  {
			  
			  //data-path='+list[i].downpath+' onclick="downloadFile(this)" 
			  video_download:function(_url){
				  
					$.ajax({
						url : "downloadFile/dodownload.do",
						type : "POST",
						data:"",
						dataType : "json",
						success : function(data) {
							//data = eval("(" + data + ")");
							/*if(!isLogonError(data)){
								return ;
							}*/
							if(!isLogonError(data)){
			  					return ;
			  				}
							if(data.result){
								downAa();
							}else{
								layer.open({content: data.msg});
								$(".loadingBar").hide();
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							layer.open({content:"下载失败！"});
							$(".loadingBar").hide();
						}
					});
						
					function downAa(){
						if(_url == null || _url == ""){
							layer.open({content:"文件路径错误，无法下载！"});
							return;
						}
						var tspath = encodeURI(_url);
						var keyword = $("#queryParams").val();
						$.StandardPost("downloadFile/download.do?t="+new Date().getTime(),{'path':tspath,'keyword':keyword, 'browertype':getBrowserType()});
					}
			  },
			  
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
			  			url : "personalResources/videoResource/getList.do",
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
							vm.delete_data(vm.deleteData);
						}else{
							layer.msg("<p style='text-align:center'>请选择要删除的数据!</p>");
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
							<p>您确定要删除吗？</p>\
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
						_this = vm,
						_url = '',
						_sendData={}; //存要删除的索引
								
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
							'personalResources/videoResource/removeMediaFile.do',
							{taskIds:_taskId,types:_types},
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
				/*--视频播放--*/
				list_look:function(taskid,$index,type){
					
					if(!vm.playBol){
						return;
					}
					
					var layIndex,_url='',_sendData={}; //打开层索引
					_url='commons/playVideo.do';
					_sendData.videoId = taskid;
					if(type==1){
//						_url='commons/playVideo.do';
//						_sendData.videoId = taskid;
						_sendData.type = 2;//录制资源
					}else if(type==2){
//						_url = 'personalResources/thirdResource/getPlayVideo.do';
//						_sendData.resourceId = taskid;
						_sendData.type = 4;//转码资源
					}
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
						url:_url,
						data:_sendData,
						success:function(data){
							if(!isLogonError(data)){
			  					return ;
			  				}
							if(data.result){
								 bl=true;
								/*_data1 = data.data;*/ 
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
					    		 flvPath:addVideoPath(data.rtmppath), //视频播放地址
					    		 previewImg:data.framepath,//预览图
					     };
					     
					    window.onunload=function(){
				        	videoStopPlay({type:2,resName:_resourceName,resUrl:_resourceUrl,resId:taskid});
				        }
						    
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
							area: ['100%','100%'],
							resize:false,
							scrollbar : false,
							shadeClose: false, //点击遮罩关闭
							closeBtn: 0,//不显示关闭按钮
							shade:[0.7],
							content: str,
							success:function(){
								
								jpJson.jpObj = objJwplayer(jpJson.flvPath,jpJson.previewImg);  //返回jwplayer对象
								
								$('#z-full-screen').on('click','.icon-buquanping',function(){
									buquanping(this,layIndex); //退出全屏
								});
								
								$('#z-full-screen').on('click','.icon-quanping',function(){
									quanping(this,layIndex); //退出全屏
								});
								
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
					            videoStopPlay({type:2,resName:_resourceName,resUrl:_resourceUrl,resId:taskid}); //结束播放
					        }
						});
					
				  //设为封面点击事件
					$('.setimg').click(function(){
						var playingTime=parseInt(jpJson.jpObj.getPosition()),
						_this = $(this),
						_num = '3';
						
						if(type==2){
							_num = '2';
						}
						
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
							data:{'taskid':''+taskid,'time':''+playingTime,'number':_num },
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
	                        }
	                    });
					}

				}
						
			},
				/*---编辑详情---*/
				list_edit:function(_id,_index,_type){
				if(!vm.detailBol){
						return;
				}
				
				var _url='',_sendData={};
				
				if(_type==1){
					_url = 'personalResources/recordingTask/getByIdList.do'; //录制文件详细信息
					_sendData.taskid=_id;
				}else if(_type==2){
					_url = 'personalResources/thirdResource/getThirdResource.do'; //导入文件详细信息
					_sendData.resourceId=_id;
				}
				
					$.ajax({
						 type:"POST",//通常会用到两种：GET,POST。默认是：GET
					      url:_url,//(默认: 当前页地址) 发送请求的地址
					      dataType:"JSON",//预期服务器返回的数据类型。
					      data:_sendData,
					      beforeSend:function(){ //请求前
					    	  vm.detailBol = false;
					      },
					      success:function(data){
					    	  if(!isLogonError(data)){
				  					return ;
				  				}
					    	  vm.detailBol = true;
					    	  if(data.result){ 
					    		  openLayer(data.data?data.data:{},_id,_index);
					    	  }
					    	  
					      }, //请求成功
					      error:function(){
					    	  vm.detailBol = true;
					      }
					})
					
					/*openLayer(vm.odataList[_index],_id,_index);*/
					
					function openLayer(_data,_id,_index1){
						
						var _index=layer.open({
							type:1,
						 	title:false,
						    scrollbar:false,
						    area: [],
						    resize:false,
						    closeBtn:0,
						    shade:[0.7],
						    content:dom_list(_data,_type),
						    btn:false,
						    success:function(){
						    	
						    	$(".layer-right>.btn").click(function(){
						    	    vm.saveData(_id,_index1,_type);
						    	});
						    	
						    	/*绑定展开折叠事件*/
						    	$("._child").click(function(){
						    		var that=$(this);
						    		if(that.attr('data-stae')=='1'){
						    			that.attr('data-stae','0');
						    		    that.find('dl').css({'display':'none'})
						    		}else{
						    			that.attr('data-stae','1');
						    		    that.find('dl').css({'display':'block'})
						    		}
						    		return false;
						    	});
						    	/*阻止事件传递*/
						    	$("._child>ul>li").click(function(){
						    		return false;
						    	})
						    	
						    	$('.z-layer-close').click(function(){
									layer.close(_index);
								})
						    	
						    	$('#z-joinNum').bind('input propertychange', function() { 
									var _this = $(this);
									_this.val(_this.val().replace(/\D/g,''))
								});
								
						    }
						});
					}

				},
				saveData:function(_id,_index,_type){
					
					var _name = $('#z-name').val(),
					_remark = $('#z-remark').val(),
					_url = '',
					_sendData={};
					
					if(_type==1){
						var _joinNum = $('#z-joinNum').val(),
						_speaker = $('#z-speaker').val(),
						_url = "personalResources/recordingTask/updateRecordingTask.do"; //录制文件修改
						_sendData.taskid = _id;
						_sendData.capturename=_name;
						_sendData.speaker=_speaker;
						_sendData.numparticipants=_joinNum?_joinNum:0;
						_sendData.keywords='';
						_sendData. remark=_remark;
					}else{
						_url = 'personalResources/thirdResource/updateThirdResource.do'; //导入文件修改
						_sendData.resourceId = _id;
						_sendData.resourceName = _name; //视频名称
						_sendData.description = _remark; //备注
					}
					
					/*upData:{
						  name:'',
						  speaker:'',
						  joinNum:'',
						  remark:''
					  },*/
					if(_name==''){
						layer.msg("请输入录制名称");
						return;
					}else if(_name.length>40){
						layer.msg("录制名称不能大于40字符");
						return;
					}
					
					if(_remark.length>300){
						layer.msg("备注信息不能大于300字符");
						return;
					}
					
					if(_type==1){
						if(_joinNum>100000000){
							layer.msg("参与人数不能大于1000万人");
							return;
						}
					}
					
					$.ajax({
						 type:"POST",//通常会用到两种：GET,POST。默认是：GET
					      url:_url,//(默认: 当前页地址) 发送请求的地址
					      dataType:"JSON",//预期服务器返回的数据类型。
					      data:_sendData,
					      beforeSend:function(){ //请求前 
					      },
					      success:function(data){
					    	  if(!isLogonError(data)){
				  					return ;
				  				}
					    	  if(data.result){ 
					    		  layer.msg("<p style='text-align:center'>修改成功</p>");
					    		  vm.odataList[_index].capturename = _name;
					    		  layer.closeAll();
					    	  }else{
					    		  layer.msg(data.msg);
					    	  }
					    	  
					      }, //请求成功
					      error:function(){
					      }
					})
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
	
	/*自定义滚动条*/
	setNiceScroll($('.content-list-tbody'));
	
	function hms_filter(val){ //过滤时间
		var txt = '';
		if(!val){
			return "00:00:00";
		}
		
		function addZero(_v){
			return _v>9?_v:'0'+_v;
		}
			
		var _h = addZero(parseInt(val/3600)),
		_m = addZero(parseInt(val%3600/60)),
		_s = addZero(val%60);
			
		txt = _h+':'+_m+':'+_s;
		return txt;
	}
	

	/*--编辑dom结构--*/
	/*readonly:1只读，0编辑
	 *
	 * */
	function dom_list(_data,_type){
		var _tltName = "会议名称";
		if(_type==2){
			_tltName = "视频名称";
			_data.picpath = _data.picPath; //缩略图
			_data.starttime = _data.createTime; //上传时间
			_data.capturename = _data.userAccount; //上传用户
			_data.remark = _data.description; //备注
			_data.meetname = _data.capturename = _data.resourceName; //资源名称
			_data.vCodec = _data.vcodec; //视频编码格式
			_data.vBit = _data.vbit;  //视频码率
			_data.darw = _data.width;     //视频宽
			_data.darh = _data.height; //视频高
			_data.aCodec = _data.acodec;//音频编码格式
			_data.aChannels = _data.achannels; //	音频采样声道
			_data.aBit = _data.abit;//音频码率
			_data.aSampleRate= _data.asampleRate;//		音频采样率
		}
		var dem = "<div class='z-comm-layer-wrap'>";
		dem+='<div class="z-comm-layer-box z-edit">';
		dem+="<div class='layer-top clearfix'><span class='layer-title'>编辑详情</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
		dem+='<div class="layer-warp">\
		<div class="layer-left">\
			<div class="layer-left-top">\
				 <img src="'+_data.picpath+'"alt="图片丢失" onerror="this.src=\'resources/images/img-lose.png\'"/>\
			</div>\
			<div class="layer-left-bottom">\
				<ul>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">'+_tltName+'</div><span <span title="'+returnEmpty(_data.meetname)+'">'+returnEmpty(_data.meetname)+'</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">录制时间</div><span title="'+timeYmdHms(_data.starttime)+'">'+timeYmdHms(_data.starttime)+'</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">创建用户</div><span title="'+returnEmpty(_data.userAccount)+'">'+returnEmpty(_data.userAccount)+'</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">时长</div><span title="'+timeHms(_data.duration)+'">'+timeHms(_data.duration)+'</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">文件大小</div><span>'+videoFileSize(_data.fileSize)+'</span>\
					</li>\
					<li>\
						<i class="iconfont icon-78"></i><div class="label">视频封装格式</div><span title="'+returnEmpty(_data.container)+'">'+returnEmpty(_data.container)+'</span>\
					</li>\
					<li class="_child">\
						<div style="overflow:hidden"><i class="iconfont icon-78"></i><div class="label">视频编码格式</div><span title="'+returnEmpty(_data.vCodec)+'">'+returnEmpty(_data.vCodec)+'</span></div>\
						<dl style="display:none;">\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">码率</div><span>'+rateNum(_data.vBit)+'</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">帧率</div><span>'+returnEmpty(_data.frameRate)+'</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">宽高比</div><span>'+returnEmpty(_data.darw)+':'+returnEmpty(_data.darh)+'</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">分辨率</div><span>'+returnEmpty(_data.darw)+'*'+returnEmpty(_data.darh)+'</span>\
							</dd>\
						</dl>\
					</li>\
					<li class="_child">\
						<div style="overflow:hidden"><i class="iconfont icon-78"></i><div class="label">音频编码格式</div><span title="'+returnEmpty(_data.aCodec)+'">'+returnEmpty(_data.aCodec)+'</span></div>\
						<dl style="display:none;">\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">采样声道</div><span>'+returnEmpty(_data.aChannels)+'</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">音频码率</div><span>'+rateNum(_data.aBit)+'</span>\
							</dd>\
							<dd style="margin:5px 0;">\
								<i class="i iconfont icon-78"></i><div class="label _label">音频采样率</div><span>'+samplingRate(_data.aSampleRate)+'</span>\
							</dd>\
						</dl>\
					</li>\
				</ul>\
			</div>\
		</div>\
		<div class="layer-right">';
		if(_type==1){
			dem+='<dl>\
			<dd>\
						<label class="lable">录制名称</label><input id="z-name" class="input" type="text" onblur="filterChara(this)" value="'+returnEmpty(_data.capturename)+'" maxlength=40 />\
					</dd>\
					<dd>\
						<label class="lable">会议名称</label><input readonly class="input z-disabled" type="text" value="'+returnEmpty(_data.meetname)+'" />\
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
						<label class="lable">主讲人员</label><input id="z-speaker" class="input" type="text" maxlength="10" value="'+returnEmpty(_data.speaker)+'"/>\
					</dd>\
					<dd>\
						<label class="lable">参与人数</label><input id="z-joinNum" class="input" type="text" value="'+returnZero(_data.numparticipants)+'" />\
					</dd>\
					<dd>\
						<label class="lable">备注信息</label><textarea id="z-remark"  class="texer" value="'+1+'" maxlength=300>'+returnEmpty(_data.remark)+'</textarea>\
					</dd>\
				</dl>\
				<input  type="button" class="btn" value="保存" />\
			</div>\
		</div>';
		}else{
			dem+='<dl>\
				<dd>\
						<label class="lable">视频名称</label><input id="z-name" class="input" type="text" onblur="filterChara(this)" value="'+returnEmpty(_data.capturename)+'" maxlength=40 />\
						</dd>\
						<dd>\
							<label class="lable">上传时间</label><input readonly class="input z-disabled" type="text" value="'+timeYmdHms(_data.starttime)+'" />\
						</dd>\
						<dd>\
							<label class="lable">上传用户</label><input readonly class="input z-disabled" type="text" value="'+returnEmpty(_data.userAccount)+'" />\
						</dd>\
						<dd>\
							<label class="lable">备注信息</label><textarea id="z-remark"  class="texer" value="'+1+'" maxlength=300>'+returnEmpty(_data.remark)+'</textarea>\
						</dd>\
					</dl>\
					<input  type="button" class="btn" value="保存" />\
				</div>\
			</div>';
		}
			
	dem+="</div></div>";
	return dem;
	}
});


/**来源过滤器**/
Vue.filter('from-filter', function (value) {
	var text;
	if(!value){
	  text = "";	
	}
	switch(value)
	{
	    case 1:
		  text = "录制文件";
		  break;
		case 2:
		  text = "导入文件";
		  break;
		default:
		 text = "未知来源";
		return;
	};
	return text;
});