/*日志管理*/
;$(function(){
	$(".operationM-page").addClass("active");//给头部导航增加选中状态
	var vm = new Vue({
		  el:'#deviceManagement',
		  data:{
		  	num:1,/*num :1:系统日志 2:内容管理 3:内容编辑*/
		  	searchWord:"",
		  	odataList:{},
		  	pageNum:1,
		  	scrollBol:true,
		  	bScrollNo:true, //禁止请求
		  	playBol:true,
			timeSort:true
		  },
		  mounted:function(){
			  this.getList();
		  },
		  watch:{
			  searchWord:function(value){
				  this.searchWord = value.replace(/^[\s""“”''‘’\.\?？\*\$%<>《》]|[""“”''‘’\.\?？\*\$%<>《》]|[\s]$/g,'');/*去前空格和敏感字符*/
			  },  
		  },
		  methods:
		  {
			getList:function(_pageNum,type){
				
				var _this = this,url,logType,_data={};
				
				if(type=='timeSort'){
				   _this.timeSort = !_this.timeSort;
			   }
				
				if(!_pageNum){
					_this.pageNum =1;
					_this.bScrollNo = true;
				}
				
				if(!_this.scrollBol){
					return;
				}
				
				_this.scrollBol=false;
				
				_data.searchWord = formatStringInSubmit(_this.searchWord);
				_data.pageNum = _this.pageNum?_this.pageNum:1;
				_data.operateTimeSort = _this.timeSort?'desc':'asc';
				
				switch(_this.num)
				{
					case 1:
					  url = "operationManagement/logManagement/getLogList.do";
					  _data.logType = 0;
					  break;
					case 2:
					  url = "operationManagement/logManagement/getLogList.do";
					  _data.logType = 1;
					  break;
					case 3:
				      url = "editContent/logManagement/getEditonLogList.do";
					  break;
				};
				$.ajax({
		  			url :url,
		  			type : "POST",
		  			data :_data,
		  			dataType : "json",
		  			success : function(data) {
		  				if(!isLogonError(data)){
		  					return ;
		  				}
		  				setTimeout(function(){
		  					vm.scrollBol = true;
		  				},350);
		  				
		  				var result = data.result;
		  				if(result){
		  					 /**查询成功**/
		  					
		  					if(data.list.isLastPage){ //最后一页
		  						vm.bScrollNo = false;
		  					}
		  					
		  					if(_pageNum){
		  						if(data.list.list.length){
		  							_this.odataList = _this.odataList.concat(data.list.list);
		  						}
		  					}else{
		  						_this.odataList = data.list.list;
		  						$(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
		  					}
		  					
		  					if(type=='timeSort'){ //排序时重新赋值给页面
			    				vm.userList = data.list.list;
			    				vm.pageNum = 1;
			    				 $(".content-list-tbody").getNiceScroll(0).doScrollTop('y', 0); //滚动条到顶部
			    			}
		  					
		  					/*console.log(_this.odataList);*/
		  				}else{
		  					/**查询失败**/
		  					layer.msg("<p style='text-align:center'>查询失败!</p>");
		  				}
		  			},
		  			error : function(XMLHttpRequest, textStatus, errorThrown) {
		  				setTimeout(function(){
		  					vm.scrollBol = true;
		  				},350);
		  			}
		  		});
		  	},
		  	/*页签切换*/
			tabChange:function(num){
				vm.num = parseInt(num);	
				vm.bScrollNo = true;
				vm.searchWord = '';
				vm.getList();
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
});