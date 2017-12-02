/*内容编辑*/

$(function(){
	$(".contentEditing-page").addClass("active");//给头部导航增加选中状态
	 contentEditing=new Vue({
		el:'#deviceManagement',
		data:{
			nav_left:[
				{id:'10',txt:'模板案例',state:1,Child:[
				  {id:'10.1',txt:'模板案例1',state:1,edit:0},
				  {id:'10.2',txt:'模板案例2',state:0,edit:0},
				  {id:'10.3',txt:'模板案例3',state:0,edit:0},
//				  {id:'10.4',txt:'模板案例1',state:0,edit:0},
//				  {id:'10.5',txt:'模板案例2',state:0,edit:0},
//				  {id:'10.6',txt:'模板案例3',state:0,edit:0},
//				  {id:'10.7',txt:'模板案例4',state:0,edit:0},
//				  {id:'10.8',txt:'模板案例1',state:0,edit:0},
//				  {id:'10.9',txt:'模板案例2',state:0,edit:0},
//				  {id:'10.11',txt:'模板案例3',state:0,edit:0},
//				  {id:'10.23',txt:'模板案例4',state:0,edit:0},
//				  {id:'10.12',txt:'模板案例1',state:0,edit:0},
//				  {id:'10.14',txt:'模板案例2',state:0,edit:0},
//				  {id:'10.13',txt:'模板案例3',state:0,edit:0},
//				  {id:'10.14s',txt:'模板案例4',state:0,edit:0},
				  {id:'10.4',txt:'模板案例4',state:0,edit:0}
				]}
			],
			lable_left:[
			   {id:'001',txt:'标签1',state:0,edit:0},
			   {id:'002',txt:'标签2',state:1,edit:0},
			   {id:'003',txt:'标签3',state:0,edit:0},
			   {id:'004',txt:'标签4',state:0,edit:0},
			],
			content_right:[
			   {id:'001',txt:'视频会议录像资源01',url:''},
			   {id:'002',txt:'视频会议录像资源02',url:''},
			   {id:'003',txt:'视频会议录像资源03',url:''},
			   {id:'004',txt:'视频会议录像资源04',url:''},
			   {id:'005',txt:'视频会议录像资源05',url:''},
			   {id:'006',txt:'视频会议录像资源06',url:''},
			   {id:'007',txt:'视频会议录像资源07',url:''},
			   {id:'008',txt:'视频会议录像资源08',url:''},
			   {id:'009',txt:'视频会议录像资源09',url:''},
			   {id:'010',txt:'视频会议录像资源10',url:''}
			]
			
		},
		methods:{
			/*编辑左侧导航*/
			nav_edit:function(){
				console.log('编辑')
				var _index=this.getpants(),chlids_index;
				this.nav_left[_index].Child.forEach(function(v,i){
					if(v.state==1) v.edit=1;
				});
				setTimeout(function(){
					$('.nav-parents').eq(_index).find('.active').find('.inpt').focus();
				},200)	
			},
			/*新增左侧导航*/
			nav_add:function(){
				
			},
			/*blur*/
			nav_blur:function(ind){
				console.log('离开事件')
				var _index=this.getpants(),that=this;
				setTimeout(function(){
					if(_index!==undefined){
					if(that.nav_left[_index].Child[ind].txt){
						that.nav_left[_index].Child[ind].edit=0;
					}else{
					  layer.msg('不可以为空哦！！')	
					}				
				}
				},200)
				
			},
			/*点击*/
			nav_click:function(ind){
				console.log("点击"+ind)
				var _index=this.getpants();
				this.nav_left[_index].Child.forEach(function(v,i){
					v.state=0;
				});
				this.nav_left[_index].Child[ind].state=1;
			},
			/*删除*/
			nav_del:function(){
				console.log('del');
				 var _index=this.getpants(),that=this;
				 var layer_id= layer.open({
					    title:'温馨提示',
					    content: '模板一旦删除将无法恢复，您确定要删除吗？',
					    maxWidth: 460,
						btn: ['确定', '取消'],
						btn1: function(index, layero){
							that.nav_left[_index].Child.forEach(function(v,i){
								if(v.state==1){
									that.nav_left[_index].Child.splice(i,1);
									that.nav_left[_index].Child[0]?that.nav_left[_index].Child[0].state=1:''
								}
							});
						   layer.close(layer_id);
						},
						btn2: function(index, layero){
						 
						},
						success:function(){
							
						}
				    });
			},
			/*获取选中父节点*/
			getpants:function(){
				var _index;
				this.nav_left.forEach(function(v,i){
					if(v.state==1) _index=i;
				});
				return _index;
			},
			/*标签新增*/
			lable_add:function(){
				console.log('标签新增add');
			},
			/*标签修改*/
			lable_edit:function(){
				console.log('标签编辑edit');
				this.lable_left.forEach(function(v,i){
					if(v.state==1) v.edit=1;
				});
				setTimeout(function(){
					$('.content-left .active .lis').focus();
				},200)	
			},
			/*标签删除*/
			lable_del:function(){
				console.log('标签删除del');
				var that=this;
				var layer_id= layer.open({
					    title:'温馨提示',
					    content: '标签一旦删除将无法恢复，您确定要删除吗？',
					    maxWidth: 460,
						btn: ['确定', '取消'],
						btn1: function(index, layero){
							that.lable_left.forEach(function(v,i){
								if(v.state==1){
									alert('确定要删除了吗'+i)
									that.lable_left.splice(i,1);
									that.lable_left[0]?that.lable_left[0].state=1:''
								}
							});
						   layer.close(layer_id);
						},
						btn2: function(index, layero){
						 
						},
						success:function(){
							
						}
				    });
			},
			/*标签离开事件*/
			lable_blur:function(ind){
				this.lable_left[ind].txt?this.lable_left[ind].edit=0:alert('不可以为空！！');
			},
			/*标签点击事件*/
			lable_click:function(ind){
				this.lable_left.forEach(function(v,i){
					v.state=0;
				});
				this.lable_left[ind].state=1;
			},
			/**
			 * 内容项删除
			 * */
			content_item_del:function(ind,id){
				var that=this;
				var layer_id= layer.open({
					    title:'温馨提示',
					    content: '内容一旦删除将无法恢复，您确定要删除吗？',
					    maxWidth: 460,
						btn: ['确定', '取消'],
						btn1: function(index, layero){
							that.content_right.splice(ind,1);
						    layer.close(layer_id);
						},
						btn2: function(index, layero){
						 
						},
						success:function(){
							
						}
				    });
				
			},
			/**
			 * 内容项新增
			 * */
			content_item_add:function(){
				
			}
			
		}
	})
	
	
	
	
	
	
	/*自定义滚动条*/
	$('.content-right').niceScroll({
	    cursorcolor: "#ccc",//#CC0071 光标颜色
	    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
	    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
	    cursorwidth: "0.1rem", //像素光标的宽度
	    cursorborder: "0", // 游标边框css定义
	    cursorborderradius: "0.1rem",//以像素为光标边界半径
	    autohidemode: false //是否隐藏滚动条
	});
	 $('.Child-node').niceScroll({
		    cursorcolor: "#ccc",//#CC0071 光标颜色
		    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
		    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
		    cursorwidth: "0.06rem", //像素光标的宽度
		    cursorborder: "0", // 游标边框css定义
		    cursorborderradius: "0.06rem",//以像素为光标边界半径
		    autohidemode: false //是否隐藏滚动条
		});
})


