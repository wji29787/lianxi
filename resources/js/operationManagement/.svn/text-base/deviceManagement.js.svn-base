/*设备管理 lifuxu by 0504*/
;$(function(){
	$(".operationM-page").addClass("active");//给头部导航增加选中状态
	var vm = new Vue({
		  el:'#deviceManagement',
		  data:{
			  searchWord:"",
			  pageNum:1,
			  odataList:{},
			  serverList:[],
			  scrollBol:true,
			  bScrollNo:true, //禁止请求
		  },
		  mounted:function(){
			  var _this = this;
			  //一分钟刷新一次页面
			  setInterval(function(){
				  _this.getList();
			  },60000);
			  _this.getList();
			  _this.getServer();
		  },
		  watch:{
			  searchWord:function(value){
				  this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g,'');/*去前空格和敏感字符*/
			  },  
		  },
		  methods:
		  {
			//获取所有服务器类别
			getServer:function(){
				var _this = this;
				$.post('operationManagement/serverType/list.do',function(data){
					if(!isLogonError(data)){
	  					return ;
	  				}
					_this.serverList = data.list.list; //服务器列表
				},function(data){
					
				},"JSON");
			},
		  	getList:function(_pageNum){
		  		var _this = this;
		  		
		  		if(!_pageNum){
					_this.pageNum =1;
					_this.bScrollNo = true;
				}
		  		
		  		if(!_this.scrollBol){
					return;
				}
				
				_this.scrollBol=false;
		  		
		  		$.ajax({
		  			url : "operationManagement/deviceManagement/getList.do",
		  			type : "POST",
		  			data : {
		  				"searchWord":formatStringInSubmit(_this.searchWord),
		  				pageNum:_this.pageNum?_this.pageNum:1
		  			},
		  			dataType : "json",
		  			success : function(data) {
		  				if(!isLogonError(data)){
		  					return ;
		  				}
		  				var result = data.result;
		  				if(result){
		  				     /**查询成功**/
		  					_this.odataList = data.list.list;
		  					$(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
		  				}else{
		  					/**查询失败**/
		  					layer.msg("<p style='text-align:center'>查询失败!</p>");
		  				}
		  				
		  				setTimeout(function(){
		  					vm.scrollBol = true;
		  				},350);
		  			},
		  			error : function(XMLHttpRequest, textStatus, errorThrown) {
		  				setTimeout(function(){
		  					vm.scrollBol = true;
		  				},350);
		  			}
		  		});
		  	},
		  	lookDevice:function(_index){
		  	 	var url,
		  	 	_this=this,
		  	 	_ip = _this.odataList[_index].ip,
		  	 	_type = _this.odataList[_index].servertype,
		  	 	_stationId = _this.odataList[_index].stationid,
		  	 	_data={}, //传递的数据
		  	 	_getData={},//得到的数据
		  	 	_bScrollNo= true, //判断时候为最后一页，不然不加载
		  	 	_bScrollOut = true, //防止下拉多次加载
		  	 	isShow = false;//如果type!=1时显示分页结构
		  	 	//滚动元素的dom
		  	 	_this.pageNum=1;

		  	 	if(_type==1){ //
		  	 		//showView.do  stationId 1  list.ip,list.servertype
		  	 	 isShow = false;	
		  		  url = "operationManagement/deviceManagement/showView.do"; //1
		  		  _data = {stationId:_stationId};
		  		}else if(_type==2){
		  			isShow = true;
		  			url = "operationManagement/deviceManagement/v2vIdList.do"; //2
		  			_data = {
		  					ip:_ip,
		  					pageNum:_this.pageNum
		  			};
		  		}else{
		  			isShow = true;
		  			url = "operationManagement/deviceManagement/serverList.do"; //other
		  			_data = {
		  					ip:_ip,
		  					serverType:_type,
		  					pageNum:_this.pageNum
		  			};
		  		};
		  		
				function getIpList(){
					var oScroll = $('#z-scroll'); //滚动父级
					_data.pageNum = _this.pageNum;
					
					if(!_bScrollNo){
						return;
					}
					
					if(!_bScrollOut){
						return;
					}
					
					$.ajax({
						url : url,
						data : _data,
						type:'POST',
						dataType:'JSON',
						success:function(data){
							if(!isLogonError(data)){
			  					return ;
			  				}
							if(data.result){
								if(_getData.ipList){
									var _data = data.list.list;
									if(!_data.length){return;};
									var _str = ''; //页面DOM
									for(var i=0,_len=_data.length;i<_len;i++){
										
			    	        			if(_type==2){//网管
			    	        				
			    	        				_str+='<dl class="clearfix">';
			    	        				_str+='<dd style="width:33.333%;">'+_data[i].mac+'</dd>';
			    	        				_str+='<dd style="width:33.333%;">'+_data[i].v2vid+'</dd>';
			    	        				_str+='<dd style="width:33.333%;">'+filterState(_data[i].v2vState)+'</dd>';
			    	        				_str+='</dl>';	
			    	        			}else{
			    	        				
			    	        				if(!_data[i].vodip || !_data[i].vodport){
				    	        				continue;
				    	        			}
			    	        				_str+='<dl class="clearfix">';
			    	        				_str+='<dd>'+_data[i].vodip+'</dd>';
			    	        				_str+='<dd>'+_data[i].vodport+'</dd>';
			    	        				_str+='<dd>'+returnZero(_data[i].totalnum)+'</dd>';
			    	        				_str+='<dd>'+returnZero(_data[i].usenum)+'</dd>';
			    	        				_str+='</dl>';
			    	        			}
			    	        			
				    	    		}

									oScroll.html(oScroll.html()+_str); //渲染页面
								}else{
									_getData.ipList = data.list.list;
									var o = layer.open({
				  			    		title:false,
				  			    		closeBtn:0,
				  			    		shade:[0.7],
				  			    		type:1,
				  			    	    area: [],
				  			    	    resize:false,
				  			    	    scrollbar: false,
				  			    	    shadeClose: false, //点击遮罩关闭
				  			    	    content:returnStr(_getData),
				  			    	    success:function(){
				  			    	    	$('.z-layer-close').click(function(){
												layer.close(o);
											});
				  			    	    	fnScroll();
				  			    	    },
				  			        });
								}
								
								if(data.list.isLastPage){
	  			    	    		_bScrollNo = false;
	  			    	    	}
								
								setTimeout(function(){
									_bScrollOut = true;
								},500);
								
							}else{
								setTimeout(function(){
									_bScrollOut = true;
								},500);
							}
						},
						error:function(data){
							if(_getData.info.name){
								_getData.ipList=[];
								var o = layer.open({
			  			    		title:false,
			  			    		closeBtn:0,
			  			    		shade:[0.7],
			  			    		type:1,
			  			    	    area: [],
			  			    	    resize:false,
			  			    	    scrollbar: false,
			  			    	    shadeClose: false, //点击遮罩关闭
			  			    	    content:returnStr(_getData)
			  			        });
							}
							
							setTimeout(function(){
								_bScrollOut = true;
							},500);
						}
					});
					
				}
					
				function fnScroll(){//滚动事件
					var oScroll = $('#z-scroll');
					//自定义滚动条
					setNiceScroll(oScroll);
					setTimeout(function(){
						var _h = oScroll.height();
			    	  	oScroll.scroll(function(){
				    		 var _st = oScroll.scrollTop();
				    		 if(_st >= (oScroll[0].scrollHeight-_h) *0.8 ){
				    			 vm.pageNum++; //分页增加
				    			 getIpList(vm.pageNum);
				    			 _bScrollOut=false;
				    		 } 
			    	  	});
					},1500);
				}
		  		
		  		$.ajax({
		  			url : "operationManagement/deviceManagement/showView.do",
		  			type : "POST",
		  			data :{stationId:_stationId},
		  			dataType : "json",
		  			success : function(data) {
		  				if(!isLogonError(data)){
		  					return ;
		  				}
		  				var result = data.result;
		  				_getData.info = data.data;
		  				if(result){	
		  					if(_type!=1){
		  						getIpList();
			  				}else{
			  					 /**查询成功**/
			  					var o = layer.open({
			  			    		title:false,
			  			    		closeBtn:0,
			  			    		shade:[0.7],
			  			    		type:1,
			  			    	    area: [],
			  			    	    resize:false,
			  			    	    scrollbar: false,
			  			    	    shadeClose: false, //点击遮罩关闭
			  			    	    content:returnStr(_getData),
			  			    	    success:function(){
			  			    	    	$('.z-layer-close').click(function(){
											layer.close(o);
										});
			  			    	    },
			  			        });
			  				}
		  				    
		  					
		  				}else{
		  					/**查询失败**/
		  					layer.msg("<p style='text-align:center'>查询失败!</p>");
		  				}
		  			},
		  			error : function(XMLHttpRequest, textStatus, errorThrown) {
		  			}
		  		});
		  		
		  		//弹层结构
		  		function returnStr (_data){
		  			//console.log(_data)
		  			var str = "<div class='z-comm-layer-wrap'>";
		  			str+='<div class="z-comm-layer-box z-edit">';
		  			str+="<div class='layer-top clearfix'><span class='layer-title'>查看设备</span><span class='vod-name'></span><span class='layer-topright' id='z-full-screen'><i class='fl z-layer-close icon iconfont icon-guanbi'></i></span></div>";
		  			str+='<div class="layer-warp">';
		  			str+='<div class="list-information-box">';
		    		str+='<ul>';
		        		str+='<li class="clearfix">';
		        			str+='<div><label>设备名称</label><input class="z-disabled" onblur="filterChara(this)" type="text"  readonly="readonly" value="'+_data.info.name+'"/></div>';
		    				str+='<p></p>';
		    			str+='</li>';
		    			str+='<li class="clearfix short-item short-item-margin">';
		    				str+='<div><label>设备类型</label><input onblur="filterChara(this)" class="z-disabled" type="text" readonly="readonly" value="'+returnServer(_data.info.servertype)+'"/></div>';
		    				str+='<p></p>';
		    			str+='</li>';
		    			str+='<li class="clearfix short-item">';
		    				str+='<div><label>IP 地  址</label><input onblur="filterChara(this)" class="z-disabled" type="text"  readonly="readonly" value="'+_data.info.ip+'"/></div>';
		    				str+='<p></p>';
		    			str+='</li>';
		    			if(!isShow){
			    			str+='<li class="clearfix short-item short-item-margin">';
			    				str+='<div><label>注册时间</label><input onblur="filterChara(this)" class="z-disabled" type="text" readonly="readonly" value="'+timeYmdHms(_data.info.regtime)+'"/></div>';
			    			    str+='<p></p>';
			    			str+='</li>';
			    			str+='<li class="clearfix short-item">';
			    				str+='<div><label>CPU数目</label><input onblur="filterChara(this)" class="z-disabled" type="text" readonly="readonly" value="'+_data.info.cpucount+'" /></div>';
			    				str+='<p></p>';
		    			    str+='</li>';
			    			str+='<li class="clearfix short-item short-item-margin">';
			    				str+='<div><label>硬盘容量</label><input onblur="filterChara(this)" class="z-disabled" type="text" readonly="readonly" value="'+diskSize(_data.info.diskvoltotal)+'" /></div>';
			    				str+='<p></p>';
			    			str+='</li>';
			    			str+='<li class="clearfix short-item">';
			    				str+='<div><label>MAC地址</label><input onblur="filterChara(this)" class="z-disabled" type="text" readonly="readonly" value="'+_data.info.mac+'"/></div>';
			    			    str+='<p></p> ';
			    	    	str+='</li>';
		    			}
		    	    	if(isShow){
		    	    		str+='<li class="clearfix">';
		    	    	    str+='<div class="server-list">';
				    	    	    str+='<div class="list-thead">';
				    	    	    	str+='<dl class="clearfix">';
				    	    	    	if(_type==2){
				    	    	    		str+='<dd style="width:33.333%;">MAC地址</dd><dd style="width:33.333%;">号码</dd><dd style="width:33.333%;">当前状态</dd>';
				    	    	    	}else{
				    	    	    		str+='<dd>IP地址</dd><dd>端口号</dd><dd>总进程数</dd><dd>已用进程数</dd>';
				    	    	    	}
				    	    	    		
				    	    	        str+='</dl>';
		    	    	        	str+='</div>';
			    	        		str+='<div id="z-scroll" class="list-tbody">';
			    	        		for(var i=0,_len=_data.ipList.length;i<_len;i++){
			    	        			
			    	        			if(_type==2){//网管
			    	        				str+='<dl class="clearfix">';
			    	        				str+='<dd style="width:33.333%;">'+_data.ipList[i].mac+'</dd>';
			    	        				str+='<dd style="width:33.333%;">'+_data.ipList[i].v2vid+'</dd>';
			    	        				if(_data.ipList[i].v2vState!=2){
			    	        					str+='<dd style="width:33.333%;">'+filterState(_data.ipList[i].v2vState)+'</dd>';
			    	        				}else{
			    	        					str+='<dd class="state-error" style="width:33.333%;">'+filterState(_data.ipList[i].v2vState)+'</dd>';
			    	        				}	
		    	        				str+='</dl>';
			    	        			}else{
			    	        				if(!_data.ipList[i].vodip || !_data.ipList[i].vodport){
				    	        				continue;
				    	        			}
				    	        			 str+='<dl class="clearfix">';
				    	        				str+='<dd>'+_data.ipList[i].vodip+'</dd>';
				    	        				str+='<dd>'+_data.ipList[i].vodport+'</dd>';
				    	        				str+='<dd>'+returnZero(_data.ipList[i].totalnum)+'</dd>';
				    	        				str+='<dd>'+returnZero(_data.ipList[i].usenum)+'</dd>';
				    	        			str+='</dl>';
			    	        			}
			    	        			
				    	    		}
			    	        		str+='</div>';
		    	    	    str+='</div>';
		    	    	str+='</li>';
		    	    	};
		    		str+='</ul>';
		    	str+='</div></div></div></div>';
		    	
		    	return str;
	  		}
		  		
	  		function returnServer(_type){//返回服务器的类型1234
	  			var _str ='';
	  			for(var i=0,_len=_this.serverList.length;i<_len;i++){
	  				if(_type == _this.serverList[i].serverType){
	  					_str = _this.serverList[i].serverTypeNameCN;
	  					break;
	  				}
	  			}
	  			return _str;
	  		}	
		  	}
		  }
	});
	
	/**
	 * 查看设备详情网关状态
	 */
	function filterState(val){
		switch (val){
			case 0:
				return '空闲 ';
			break;
			case 1:
				return '预约';
				break;
			case 2:
				return '占用';
				break;
			default:
				return '未知状态';
			break;
		}
	}
	
	/**设备类型过滤**/
	Vue.filter('type-filter', function (value) {
		var text;
		if(!value){
		  text = "";	
		}
		switch(value)
		{
			case 1:
			  text = "收录服务器";
			  break;
			case 2:
			  text = "存储网关";
			  break;
			case 3:
			  text = "点播服务器";
			  break;
			case 4:
			  text = "媒体处理服务器";
			  break;
			case 5:
			  text = "文件服务器";
			  break;
		};
		
		return text;
	});
	
	/**设备状态过滤**/
	Vue.filter('state-filter', function (value) {
		var text;
		if(!value){
		  text = "";	
		}
		switch(value)
		{
		    case 0:
			  text = "正常";
			  break;
			case 1:
			  text = "退服";
			  break;
			case 2:
			  text = "未注册";
			  break;
			case 3:
			  text = "已注册";
			  break;
			case 4:
			  text = "断线";
			  break;
		};
		return text;
	});
	
	/*自定义滚动条*/
	setNiceScroll($('.content-list-tbody'));
	
});