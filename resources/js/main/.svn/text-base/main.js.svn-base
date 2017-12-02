/*首页js*/
window.onresize=function(){
	window.location.reload();
};
var recordCountOne=0,playCountOne=0;//记录第一次业务统计至今的 播放数和录制数
var blIsOne=true;//标记第一次业务统计至今第一次加载数据保存recordCountOne,playCountOne值，定时器里第二次加载时改为fasle
var tk='';//空间占比 透明度定时器
var t='';//节目内容分布图定时器标记
var t2='';//业务统计 空间占比 服务状态	定时器标记

var barBoxChart='';//月周日的echarts实例
var zhijinPlaychart = null;//至今的内容播放次数echarts实例
var zhijinRecordchart2 =null;//至今的实时录制数echarts实例
;$(function(){
	$(".main-page").addClass("active");//给头部导航增加选中状态
	
	var programChart=echarts.init(document.getElementById('program'));	//内容分布折线
	//var barBoxChart=echarts.init(document.getElementById('bar-box'));
	 zhijinPlaychart = echarts.init(document.getElementById('zhijin-play'));
     zhijinRecordchart2 = echarts.init(document.getElementById('zhijin-record'));  
    
	//业务选中 默认至今
	 soFar();
	//MonthBar();
	//节目内容分布图
	
	clearInterval(t);
	t=setInterval(function(){
		programChart.dispose();
		programChart=echarts.init(document.getElementById('program'));	
		programContent(programChart);
	},10000);
	programContent(programChart);
	//空间占比 创建刻度
	getServiceData();

	//开启定时器 一分钟刷新业务统计 空间占比 服务状态	
	clearInterval(t2);	
	t2=setInterval(function(){	
		blIsOne=false;
		if(zhijinPlaychart){
			zhijinPlaychart.dispose();
			zhijinRecordchart2.dispose();
		}
		
		if(barBoxChart){
			barBoxChart.dispose();
			//barBoxChart=echarts.init(document.getElementById('bar-box'));
		}
//		zhijinPlaychart = echarts.init(document.getElementById('zhijin-play'));
//	    zhijinRecordchart2 = echarts.init(document.getElementById('zhijin-record'));  
	   
		$('.select-ul li.active').click();
		getServiceData();
//		$.ajax({
//			url:$(".basePath").attr("href")+'main/systemInfo.do',
//			type:'get',
//			dataType:'json',
//			success:function(json){
//				if(json.result){
//				   
//	               var filesystemSize=json.data.filesystemSize;//空间总大小
//	               var used=json.data.used;//已使用大小
//	               var proportion=used/filesystemSize*100;//占用百分比
//	               var playingCount=json.data.playingCount;//正在播放的视频数
//	               var recordingCount=json.data.recordingCount;//正在录制的视频数
//	               var freeCount=100-playingCount-recordingCount;//空闲
//	               //空间占比
//	               spaceProportion(proportion,filesystemSize);
//	             //服务状态
//	           	serviceState(playingCount,recordingCount,freeCount);
//				}
//				
//			}
//		});

		
	},60000);
	
	
});

/*   
 *  获取占比和服务状态的数据
 * 
 * */
function getServiceData(){
	
	//空间占比 创建刻度
	$.ajax({
		url:$(".basePath").attr("href")+'main/systemInfo.do',
		type:'get',
		dataType:'json',
		success:function(json){
			if(!isLogonError(json)){
				return ;
			}
			
			if(json.result){
			  // console.log(json.data);
			   if(!json.data){
				   json.data = {}; 
			   }
			   
               var filesystemSize=json.data.filesystemSize;//空间总大小
               var used=json.data.used;//已使用大小
               
               if(!filesystemSize){
            	   filesystemSize = 0;
               }
               if(!used){
            	   used = 0;
               }
               
               var proportion = 0;
               
               if(filesystemSize!=0){
            	   proportion =used/filesystemSize*100;//占用百分比
               }
              
               var playingCount=json.data.vodingCount;//正在播放的视频数
               var recordingCount=json.data.recordingCount;//正在录制的视频数
               var otherCount = json.data.otherCount;
               var freeCount=json.data.totalNumCount-playingCount-recordingCount-otherCount;//空闲
               //空间占比
               spaceProportion(proportion,filesystemSize);
             //服务状态
           	serviceState(playingCount,recordingCount,freeCount,json.data.totalNumCount,otherCount);
			}
			
		}
	});
}

/*
 * 服务状态
 * playingCount 播放数
 * recordingCount 录制数
 * freeCount 空闲数
 * count 为总数
 * */
function serviceState(playingCount,recordingCount,freeCount,count,otherCount){
	 $('#circular_right-i').html("服务状态（"+count+"）");
    $('#circular_right-box').html(count);
	clearInterval(tk);
	var i=0.1;
	tk=setInterval(function(){
		i+=0.1;
		$('.space-left').css('opacity',i);
		if(i>=1){
			clearInterval(tk);
		}
	},300);
	var rem=parseInt($('html').css('font-size'));
	$('.space-right li .bg-span').html(playingCount);
	$('.space-right li .bg-span2').html(recordingCount);
	$('.space-right li .bg-span3').html(freeCount);
	$('.space-right li .bg-span4').html(otherCount);
	var j=2; //间隙
	var eD1=270;
	var sD1=270+((360-j*3)*playingCount/count);	
	var eD2=sD1+j;
	var sD2=eD2+((360-j*3)*recordingCount/count);
	var eD3=sD2+j;
	var sD3=eD3+((360-j*3)*freeCount/count);
	var eD4=sD3+j;
	var sD4=eD4+((360-j*3)*otherCount/count);
	//设定canvas 标签的宽高
	var cW=Math.round(3.02*rem);
	var cH=Math.round(3.02*rem);
	$('.space-left').append('<canvas id="c1" class="c1" width="'+cW+'px" height="'+cH+'px"></canvas>');
	var oC = document.getElementById('c1');
    var gd = oC.getContext('2d');
//	var cW=oC.offsetWidth;
//	var cH=oC.offsetHeight;
	gd.clearRect(0,0,cW,cH);
	//圆心坐标
	 var x=cW/2;
	 var y=cH/2;
	//求内弧、外弧的半径
	 var r1=Math.round(0.26*cW);
	 var r2=Math.round(0.34*cW);

	 //播放
	 
	 setTimeout(function(){
//		 deaw(gd,x,y,80,105,sD1,eD1,'#6ea7fe');
		 deaw(gd,x,y,r1,r2,sD1,eD1,'#6ea7fe');
	 },300);
	 setTimeout(function(){
		 //录制
		 deaw(gd,x,y,r1,r2,sD2,eD2,'#e88184');
	 },600);
	 setTimeout(function(){
		//空闲
		 deaw(gd,x,y,r1,r2,sD3,eD3,'#ebeb91');
	 },1000);
	 setTimeout(function(){
			//空闲
		 deaw(gd,x,y,r1,r2,sD4,eD4,'#5bed92');
	 },1300);
	 
}

/*
 * 空间占比
 * per为百分比的数字
 * filesystemSize 空间总大小
 * */
function spaceProportion(per,filesystemSize){
	$('#block-box').html('');
	var oBlock=document.getElementById('block-box');
	var N = 24;//总共24个小格子
	var p=Math.ceil(N*per/100);//占用多少个小格子
	var baifen=0;
	for(var i=0;i<N;i++){
		var oS = document.createElement('span');
		oS.style.WebkitTransform = 'rotate('+i*15+'deg)';
		oS.style.MozTransform = 'rotate('+i*15+'deg)';
		oS.style.msTransform = 'rotate('+i*15+'deg)';
		oS.style.OTransform = 'rotate('+i*15+'deg)';
		oS.style.transform = 'rotate('+i*15+'deg)';
		if(i<=p){
			(function(oS,i){
				var ti='';
				ti=setTimeout(function(){	
					oS.className = 'red';
					oBlock.appendChild(oS);
					clearTimeout(ti);
                    baifen+=100/N;
                    baifen= Math.round(baifen);
                    if(baifen>=per){
                    	baifen=per;
                    }
                    $('.circular-box').html(Math.round(baifen)+'%');
				},i*3000/p);
				
			})(oS,i);			
		}
		
		oBlock.appendChild(oS);
	}

    if(filesystemSize<1024){
    	$(".filesystemSize-i").html('空间占比（'+Math.ceil(filesystemSize)+'G）');
    }else if(filesystemSize>=1024){
    	filesystemSize=Math.ceil(filesystemSize/1024);
        $(".filesystemSize-i").html('空间占比（'+filesystemSize+'T）');
    }
	//$(".filesystemSize-i").html('空间占比（'++'）');
//    $('.circular-box').html(per+'%');
}

/*
 * 获取 业务分布控制 2 云端资源 3 个人资源 数据
 * */
function programContent(programChart){
	var yData=[];
	var xData=[];
	var url='';//记录接口路径
	$.ajax({
		url:$(".basePath").attr("href")+'operationManagement/systemConfiguration/getSystemConfig.do',
		type:'get',
		data:'',
		dataType:'json',
		success:function(data){
			//console.log(data);
			var valType=1;//1 节目分布控制 2 云端资源 3 个人资源"
			for(var i=0; i<data.list.length; i++){
				if(data.list[i].func=='resourcedistribution'){
					valType=data.list[i].val;
					break;
				}
			}
			switch(valType){
				case "1" :
					for(var i=0; i<5; i++){
						yData.push(getRandom(20,80));
						xData= ['北京','河北','新疆','山东','浙江'];
					}
				    $('#distribution-i').html('节目内容分布');
				    drawLine(programChart,xData,yData);
				break;
				case "2":
				   url="cloudResources/cloudResource/getResourceFromCloudCount.do";
				   $('#distribution-i').html('云端资源分布');
				break;
				case '3':
				   url="personalResources/videoResource/getPersonalResourcesCount.do";
				   $('#distribution-i').html('个人资源分布');
				break;
			}
			if(valType=="2"||valType=="3"){
				$.ajax({
			    	url:$(".basePath").attr("href")+url,
			    	data:'',
			    	type:'post',
			    	dataType:'json',
			    	success:function(dataTwo){
			    		if(dataTwo.result){
			    			for(var j=0; j<dataTwo.data.length; j++){
			    				xData.push(dataTwo.data[j].name);
			    				yData.push(dataTwo.data[j].value);
			    			}
			    			
			    			drawLine(programChart,xData,yData);
			    		}
			    	}
			    });
			}
			 
			
		}
	});
}


/*
 * 画折线图
 * */
function drawLine(myChart,xData,yData){
//	var myChart=echarts.init(document.getElementById('program'));	
	var options = {
			tooltip : {
		        trigger: 'axis'
		    },
		    grid: {
		    	x: '15%',
		        y: '15%',
		       // x2:'15%',
		        y2:'18%'
		    },
		    xAxis : [
		 	        {
		 	            type : 'category',
		 	            boundaryGap:true,
		 	            axisTick:{//刻度线是否显示
			                show:false
			            },
		 	            data :xData,// ['北京','河北','新疆','山东','浙江'],
		 	            //x轴轴线的样式
		 	            axisLine:{
		                     lineStyle:{
		                         color: '#6d869c',                              
		                     }
		                 },
		               //x轴字体样式
		 	            axisLabel: {
		 		            textStyle:{
		 		            	fontSize:16,
		 		            	color:'#cee2ff'
		 		            },
		 		             //x轴刻度间距
		 		            interval: 0,
		 	       		},
//		 	       		axisTick: {length:5},
		 	        },
		 	        
		 	    ],
		 	   yAxis : [
 	             	        {    
 	             	        	name : '单位(个)',
 	             	        	nameTextStyle:{fontSize:22},//坐标轴名称字体的样式
 	             	        	//max:100,
 	             	        	//刻度是否显示
 	             	        	axisTick:{
 	             	                show:true,//false
 	             	            },
 	             	        	splitLine: {
 	                             	show: false
 	                         	},
 	             	            type : 'value',
 	             	            //y轴轴线的样式
 	             	            axisLine:{
 	                                 lineStyle:{
 	                                     color: '#6d869c',                              
 	                                 }
 	                             },
 	                             //y轴字体样式
 	             		        axisLabel: {
 	             		        	show:true,//false,//y轴数值是否显示
 	             		            textStyle:{
 	             		            	fontSize:16,
 	             		            	color:'#cee2ff'
 	             		            }
 	             		   		},
 	             		   		
 	             	        }
		 	             ],  
		 	            series :[
		 	                    {
		 	                       name: '本月',
		 	                       type: 'line',
		 	                       data:yData,//[ 60, 60, 60, 60, 60],
		 	                       /*itemStyle: {
		 	                           color:'pink'
		 	                       }*/
		 	                      areaStyle: {
		 	                         normal: {
		 	                             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		 	                                 offset: 0,
		 	                                 color: '#2e4b7c'
		 	                             }, {
		 	                                 offset:1,
		 	                                 color: 'rgba(24,43,80,0.3)'
		 	                             }])
		 	                         }
		 	                     },
		 	                       itemStyle: {
		 	                           normal: {
//		 	                               color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//		 	                                   offset: 0,
//		 	                                   color: '#6ea7fe'
//		 	                               },
//		 	                               {
//		 	                                   offset: 1,
//		 	                                   color: '#5de5ff'
//		 	                               },
//		 	                               ])

		 	                        	   color:'#6ea7fe'
		 	                           }
		 	                       }
		 	                   }
		 	               ],
	};
	myChart.clear();
	myChart.setOption(options,true);
	
}
/*
 * 通过度数求弧度
 * */
function d2a(n){
    return n*Math.PI/180;
}
/*
* 求坐标
* x1,y1为圆心坐标
* r为半径
* n为度数
* */
function d2xy(x1,y1,r,n){
 var y2=(Math.sin(d2a(n)))*r;
 var x2=(Math.cos(d2a(n)))*r;
 var data={'x':x1+x2,'y':y1+y2};
 return data;
}
/*
 * 画弧
 * gd为canvase对象
 * x，y为圆心坐标
 * r1为内弧半径，r2为外弧半径
 * n1为起始度数n2为结尾度数
 * color为阴影和线条颜色
 * */
function deaw(gd,x,y,r1,r2,n1,n2,color){
	//开始画 防止连线闭合
	gd.beginPath();
	gd.arc(x,y,r1,d2a(n1),d2a(n2),true);//画内弧
	gd.strokeStyle=color;//描边颜色
	gd.shadowColor =color;//阴影颜色
	gd.shadowOffsetX = 0;//偏移位置
	gd.shadowOffsetY = 0;//偏移位置
	gd.shadowBlur=30;//模糊度
	gd.lineWidth=2;
	gd.stroke();
	gd.beginPath();//开始画 防止连线闭合
	//gd.strokeStyle = color;
	//gd.strokeStyle=color;
	//gd.shadowColor = color;
	//gd.shadowOffsetX = 0;
	//gd.shadowOffsetY = -1;
	//gd.shadowBlur=20;
	gd.arc(x,y,r2,d2a(n1),d2a(n2),true);//画外弧
	gd.stroke();
	gd.beginPath();//开始画 防止连线闭合
	var data1=d2xy(x,y,r1,n2);
	gd.moveTo(data1.x,data1.y);
	//两个弧的起点与起点连接，末尾与末尾连接
	//设置移动的点
	var data2=d2xy(x,y,r2,n2);
	gd.lineTo(data2.x,data2.y);
	gd.strokeStyle =color;
	gd.lineWidth=1;
	gd.stroke();
	gd.beginPath();
	var data3=d2xy(x,y,r1,n1);
	gd.moveTo(data3.x,data3.y);
	//设置移动的点
	var data4=d2xy(x,y,r2,n1);
	gd.lineTo(data4.x,data4.y);
	gd.strokeStyle = color;
	gd.stroke();
}

/*
 * 业务统计
 * 
 * */
function businessBar(myChart,xData,yData1,yData2,n){
//	var myChart=echarts.init(document.getElementById('bar-box'));
//	xData=['北京','河北','新疆','山东'];
//	yData1=[ 60, 60, 60, 60];
//	yData2=[ 20, 40, 60, 70];
	var options = {
			tooltip : {
		        trigger: 'axis'
		    },
		    grid: {
		    	x: '10%',
		        y: '15%',
		       // x2:'15%',
		        y2:'15%'
		    },
		    dataZoom : {
                show : true,
                realtime : true,
                //dataBackgroundColor:'#7aafff',
                borderColor:'#7aafff',//边框颜色
                fillerColor:'#192b44',//选中区域的颜色
                handleColor:'#7aafff',
                start : n,
                end : 100
            },
		    xAxis : [
		 	        {
		 	            type : 'category',
		 	            boundaryGap:true,
		 	            data :xData,//['北京','河北','新疆','山东'],
		 	            //x轴轴线的样式
		 	            axisLine:{
		                     lineStyle:{
		                         color: '#6d869c',                              
		                     }
		                 },
		               //x轴字体样式
		 	            axisLabel: {
		 		            textStyle:{
		 		            	fontSize:16,
		 		            	color:'#cee2ff'
		 		            },
		 		             //x轴刻度间距
		 		            interval: 0,
		 	       		},
//		 	       		axisTick: {length:5},
		 	        },
		 	        
		 	    ],
		 	   yAxis : [
 	             	        {    
 	             	        	name : '单位(次)',
 	             	        	nameTextStyle:{fontSize:22},//坐标轴名称字体的样式
 	             	        	
 	             	        	//max:100,
 	             	        	//刻度是否显示
 	             	        	axisTick:{
 	             	                show:true,//false
 	             	            },
 	             	        	splitLine: {
 	                             	show: false
 	                         	},
 	             	            type : 'value',
 	             	            //y轴轴线的样式
 	             	            axisLine:{
 	                                 lineStyle:{
 	                                     color: '#6d869c',                              
 	                                 }
 	                             },
 	                             //y轴字体样式
 	             		        axisLabel: {
 	             		        	show:true,//false,//y轴数值是否显示
 	             		            textStyle:{
 	             		            	fontSize:16,
 	             		            	color:'#cee2ff'
 	             		            }
 	             		   		},
 	             		   		
 	             	        }
		 	             ],  
		 	            series :[
		 	                    {
		 	                       name: '内容播放',
		 	                       type: 'bar',
		 	                       data:yData1,//[ 60, 60, 60, 60],
		 	                       /*itemStyle: {
		 	                           color:'pink'
		 	                       }*/
       
		 	                      itemStyle: {
					                     normal: {
					                         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                             offset: 0,
					                             color: 'rgba(122,175,255,1)'
					                         },
					                         {
					                             offset: 1,
					                             color: 'rgba(19,39,66,0.1)'
					                         },
					                         ])
					                     }
					                 }
		 	                   },
		 	                  {
		 	                       name: '实时录制',
		 	                       type: 'bar',
		 	                       data:yData2,//[ 20, 40, 60, 70],
		 	                       /*itemStyle: {
		 	                           color:'pink'
		 	                       }*/
       
		 	                      itemStyle: {
		 	                    	    //图像颜色渐变
					                     normal: {
					                         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					                             offset: 0,
					                             color: 'rgba(255,122,122,1)'
					                         },
					                         {
					                             offset: 1,
					                             color: 'rgba(40,48,69,0.1)'
					                         },
					                         ])
					                     }
					                 }
		 	                   }
		 	               ],
	};
	myChart.clear();
	myChart.setOption(options,true);
	
  
}

/*
 * 任务统计月
 * */
function MonthBar(obj){
	$('.month-box').show();
	$('.zhijin-box').hide();
	$(obj).addClass('active').siblings().removeClass('active');
	if(barBoxChart){
		barBoxChart.dispose();
	}
		barBoxChart=echarts.init(document.getElementById('bar-box'));
	var date= new Date();
	var startTime=date.getFullYear()+'-01';
	var endTime=date.getFullYear()+'-'+toDou((date.getMonth()+1));
	var data={'type':'month','startTime':startTime,'endTime':endTime};
	$.ajax({
		url:$(".basePath").attr("href")+'main/resourcePlayHistory/getBussinessStatistics.do',
		type:'post',
		data:data,
		dataType:'json',
		success:function(json){
			if(!isLogonError(json)){
				return ;
			}
			if(json.result){
			    var playCount=json.data.playCount;
			    var recordCount=json.data.recordCount;
			    var xData=[];
			    var yData1=[];
			    var yData2=[];
			    var n=100-(100/recordCount.length*4);
			    for(var i=0; i<playCount.length; i++){
			    	var _time = playCount[i].name.replace(/-*/g,'');
			    	xData.push(_time);
			    	yData1.push(playCount[i].value);
			    	yData2.push(recordCount[i].value);
			    }
			    businessBar(barBoxChart,xData,yData1,yData2,n);
			}
			
		}
	});
//	var xData=['4月','5月','6月','7月'];
//	var yData1=[60,60,60,60];
//	var yData2=[70,70,70,80];
//	businessBar(xData,yData1,yData2);
}
/*
 * 任务统计周
 * */
function WeekBar(obj){
	$('.month-box').show();
	$('.zhijin-box').hide();
	$(obj).addClass('active').siblings().removeClass('active');
	if(barBoxChart){
		barBoxChart.dispose();
	}
		barBoxChart=echarts.init(document.getElementById('bar-box'));
	var date= new Date();
	//var startTime=date.getFullYear()+'-01'+'-01';
	var endTime=date.getFullYear()+'-'+toDou((date.getMonth()+1))+'-'+toDou(date.getDate());
	var data={'type':'week','endTime':endTime};
	$.ajax({
		url:$(".basePath").attr("href")+'main/resourcePlayHistory/getBussinessStatistics.do',
		type:'post',
		data:data,
		dataType:'json',
		success:function(json){
			if(!isLogonError(json)){
				return ;
			}
			if(json.result){
			    var playCount=json.data.playCount;
			    var recordCount=json.data.recordCount;
			    var xData=[];
			    var yData1=[];
			    var yData2=[];
			    var n=100-(100/recordCount.length*4);
			    for(var i=0; i<playCount.length; i++){
			    	var _time = playCount[i].name.replace(/-*/g,'');
			    	xData.push(_time);
			    	yData1.push(playCount[i].value);
			    	yData2.push(recordCount[i].value);
			    }
			    businessBar(barBoxChart,xData,yData1,yData2,n);
			}
			
		}
	});
	
	
//	var yData1=[40,40,40,40];
//	var yData2=[60,60,60,60];
//	businessBar(xData,yData1,yData2);
}
/*
 * 业务统计日
 * */
function DayBar(obj){
	$('.month-box').show();
	$('.zhijin-box').hide();
	$(obj).addClass('active').siblings().removeClass('active');
	if(barBoxChart){
		barBoxChart.dispose();
	}
	barBoxChart=echarts.init(document.getElementById('bar-box'));
	var date= new Date();
	//var startTime=date.getFullYear()+'-01'+'-01';
	var endTime=date.getFullYear()+'-'+toDou((date.getMonth()+1))+'-'+toDou(date.getDate());
	var data={'type':'day','endTime':endTime};
	$.ajax({
		url:$(".basePath").attr("href")+'main/resourcePlayHistory/getBussinessStatistics.do',
		type:'post',
		data:data,
		dataType:'json',
		success:function(json){
			if(!isLogonError(json)){
				return ;
			}
			if(json.result){
			    var playCount=json.data.playCount;
			    var recordCount=json.data.recordCount;
			    var xData=[];
			    var yData1=[];
			    var yData2=[];
			    var n=100-(100/recordCount.length*4);
			    for(var i=0; i<playCount.length; i++){
			    	var _time = playCount[i].name.replace(/-*/g,'');
			    	xData.push(_time);
			    	yData1.push(playCount[i].value);
			    	yData2.push(recordCount[i].value);
			    }
			    businessBar(barBoxChart,xData,yData1,yData2,n);
			}
			
		}
	});
//	var xData=['4日','5日','6日','7日'];
//	var yData1=[20,20,20,20];
//	var yData2=[40,40,40,40];
//	businessBar(xData,yData1,yData2);
}
/*
 * 返回一个m到n的随机数
 * */
function getRandom(m,n){
	
	return parseInt(Math.random()*(m-n)+n);
}
/*
 * 业务统计至今 点击事件
 * */
function soFar(obj){
	$('.month-box').hide();
	$('.zhijin-box').show();
	$(obj).addClass('active').siblings().removeClass('active');
	if(zhijinPlaychart){
		//如何实例存在，先释放实例，在创建实例
		zhijinPlaychart.dispose();
		zhijinPlaychart = echarts.init(document.getElementById('zhijin-play'));
	    zhijinRecordchart2 = echarts.init(document.getElementById('zhijin-record'));  
	}
	 $.ajax({
	    	url:$(".basePath").attr("href")+'main/resourcePlayHistory/getBussinessStatistics.do',
	    	type:'post',
	    	data:{'type':'tillnow'},
	    	dataType:'json',
	    	success:function(json){
	    		if(!isLogonError(json)){
					return ;
				}
	    		if(json.result){
	    			
	    			var recordCount=json.data.recordCount[0].value;
	    			var playCount=json.data.playCount[0].value;
	    			if(blIsOne){
	    				recordCountOne=recordCount;
	    				playCountOne=playCount;
	    			}
	    			soFarOption(zhijinPlaychart,zhijinRecordchart2,recordCount,playCount);
	    		}
	    	},
	    	
	    });
}

/*
 * 业务统计 至今
 * */
function soFarOption(chart,chart2,recordCount,playCount){
	var count=recordCount+playCount;
	var data1=[], data2=[];
	
	if(count!=0){//如果总数为0那么直接走else给默认值
		data1.push((playCount/count)>=1? 0.85 : (playCount/count));
		data1.push((playCount/count)>=1? (0.85-0.02) : ((playCount/count)-0.02));
		data2.push((recordCount/count)>=1 ? 0.85 : (recordCount/count));
		data2.push((recordCount/count)>=1 ? (0.85-0.02) : ((recordCount/count)-0.02));
	}else{
		data1 = [0,0];
		data2 = [0,0];
	}
	
	var num1=playCount-playCountOne;//显示增加的播放次数
	var num2=recordCount-recordCountOne;//显示增加的录制次数
	
	
//	var chart = echarts.init(document.getElementById('zhijin-play'));
//    var chart2 = echarts.init(document.getElementById('zhijin-record'));  
    var option = {
            series: [{
                color: ['#CCC'],
                type: 'liquidFill',
                amplitude:10,
                data: data1,//[0.6],
                radius: '163%',
                outline: {
                    show: false
                },
                silent:true,//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                backgroundStyle: {
                    borderColor: '#0d1d34',
                    color:'rgba(19,41,72,0.6)',
                    borderWidth: 2,
                    //shadowColor: 'rgba(255, 0, 0, 0.6)',
                    //shadowBlur: 20
                },
                shape: 'path://M0,19.589C0,19.59,12.542,0.133,86.237,0.092c73.639-0.039,86.236,19.497,86.236,19.497v224.215H0V19.589L0,19.589z',
                //shape:'rect',
                label: {
                    normal: {
                        position: ['50%', '30%'],
                        formatter: num1==0?'':'+'+num1,
                        textStyle: {
                            fontSize: 40,
                            color: '#9bc3ff',
                            insideColor: '#9bc3ff',
                        }
                    }
                },
                itemStyle: {
                    //图像颜色渐变
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(138,178,236,1)'
                        },
                            {
                                offset: 1,
                                color: 'rgba(40,48,69,0.1)'
                            },
                        ])
                    }
                }
            }]


    };
    var option2 = {
            series: [{
                color: ['#C5DA51', '#D8E69B', '#dae89b', '#dae89b'],
                type: 'liquidFill',
                data: data2,
                amplitude:10,
                radius: '163%',
                outline: {
                    show: false
                },
                silent:true,//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                backgroundStyle: {
                    borderColor: '#0d1d34',
                    color:'rgba(19,41,72,0.6)',
                    borderWidth: 2,
                    //shadowColor: 'rgba(255, 0, 0, 0.6)',
                    //shadowBlur: 20
                },
                shape: 'path://M0,19.589C0,19.59,12.542,0.133,86.237,0.092c73.639-0.039,86.236,19.497,86.236,19.497v224.215H0V19.589L0,19.589z',
                //shape:'rect',
                label: {
                    normal: {
                        position: ['50%', '30%'],//显示的文字位置
                        formatter:num2==0?'':'+'+num2,
                        textStyle: {
                            fontSize: 40,
                            color: '#ff7a7a',
                            insideColor: '#ff7a7a',
                        }
                    }
                },
                itemStyle: {
                    //图像颜色渐变
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(208,104,109,1)'
                        },
                            {
                                offset: 1,
                                color: 'rgba(40,48,69,0.1)'
                            },
                        ])
                    }
                }
            }]


    };
    chart2.clear();
    chart.clear();
    chart.setOption(option);
    chart2.setOption(option2);
   
    //给水柱上方添加数字
    $('#zhijin-play').append('<span>'+playCount+'</span>');
    $('#zhijin-record').append('<sapn id="recordCount-spans">'+recordCount+'</span>');
}
