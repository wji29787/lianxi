<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>

	<head>
		<title>发送参数</title>
		<style type="text/css">
			
			li{
				list-style: none;
			}
			.singleAdd{
				height:50px;
				clear: both;
				font-size:0;
			}
			
			.singleAdd label{
				font-size:16px;
			}
			
			.singleAdd input{
				font-size:16px;
			}
			
			.addBtn{
				text-decoration:none;
				display:block;
				width:80px;
				height:30px;
				line-height:30px;
				color:#fff;
				background-color: #666;
				text-align: center;
				float: left;
				margin-right: 10px;
				margin-bottom:20px;
			}
			.backDataList{
				position: fixed;
				top:0;
				right: 0;
				height:100%;
				overflow:auto;
				overflow-x:hidden;
				width:300px;
				background-color: #dddddd;
			}
			.backDataList ul{
				box-sizing:border-box;
				width:100%;
				padding:10px 15px;
			}
			#allSubtitleContent{
			 	border: 1px solid #999;
    			padding: 20px;
    			margin:20px 0;
			}
			
			.config-item{
				
			}
			
			.config-item label{
				display:inline-block;
				width:150px;
			}
		</style>
	</head>

	<body>
		<h2>HTTP测试工具</h2>
		<h4>服务配置</h4>
		<p class="config-item"><label>服务器Ip地址：</label><input name="server_ip" id="server_ip" />
		</p>
		<p class="config-item"><label>服务器端口：</label><input name="server_port" id="server_port" />
		</p>
		<p class="config-item"><label>终端号：</label><input name="server_date" id="server_number" />
		</p>
		<label>字幕设置</label>
		<select id="subtitle_settings">
			<option value="0">设置字幕</option>
			<option value="1">清除字幕</option>
		</select>
		<label>字幕显示方式</label>
		<select id="display_method">
			<option value="1">列表显示</option>
			<option value="2">滚动显示</option>
		</select>
		
		
		<div id="allSubtitleContent">
			<a href="javascript:;" class="addBtn" onclick="addDom()">添加</a>
			<div class="singleAdd">
				<label>推送字幕</label><input type="text" id="subtitle_name" class="subtitleName" maxlength="100">
				<!-- <label>字幕内容</label> -->
				<!-- <input type="text" id="subtitle_content" class="subtitleContent"> -->
				<label>字幕时长</label><input type="text" id="subtitle_time" class="subtitleTime" maxlength="5">
			</div>
		
		</div>
		<a href="javascript:set()" class="addBtn">发送</a>
		
		
		<div class="backDataList">
		</div>
		
		
		<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
		<script type="text/javascript">
		
		var allNum;
		var singleNum = 0; //自增值
		var judag = false;
			function set() {
			if(judag == true){
				return
			}
			judag = true;
				var jsonDataList = []; //paramDate MeetPerson中的字幕数据
				var serverIp = $("#server_ip").val(); //ip
				var serverPort = $("#server_port").val(); //端口
				var serverNumber = $("#server_number").val(); //终端号
				var subtitleSettings = $("#subtitle_settings").val(); //字幕设置
				var displayMethod = $("#display_method").val(); //显示方式\
				var subtitleTime = $("#subtitle_time").val(); //显示方式
				var refuserNum=/^[0-9]+$/; //判断字幕时长为数字
				if($.trim(subtitleTime) == ""){
					alert("第一组字幕信息的时长为必填");
					return;
				}else{
	    		   	if(subtitleTime&&!refuserNum.test(subtitleTime)){
	    		   		alert("字幕时长必须是数字");	
	    		   		return;
	    		   	}else if(subtitleTime > 36000){
						alert("字幕时长不能超过36000");
						return;
					}
				}

				
				var allContent = $(".singleAdd");
				var panduan = false;
				//遍历每组数据  组成数组
				$.each(allContent,function(){
					singleNum++;
					var thisName = $(this).children(".subtitleName").val(); //获取一组数据中的名称
					//var thisContent = $(this).children(".subtitleContent").val();//获取一组数据中的内容
					var thisTime = $(this).children(".subtitleTime").val();//获取一组数据中的时长
					if($.trim(thisName) == ""){
						alert("字幕内容不能为空");
						panduan = true;
						return;
					}else{
						var refuserName=/^[A-Za-z0-9\u4e00-\u9fa5_'",.:]{1,100}$/;
		    		   	if(thisName&&!refuserName.test(thisName)){
		    		   		alert("字幕名称应是英文、数字、中文");	
		    		   		panduan = true;
		    		   		return;
		    		   	}
					}
					if(thisTime != ""){//如果时长有值 正则验证必须为数字
						if(thisTime&&!refuserNum.test(thisTime)){
		    		   		alert("字幕时长必须是数字");	
		    		   		return;
		    		   	}else if(thisTime > 36000){
							alert("字幕时长不能超过36000");
							return;
						}
					}
					
				
					var sendData = {
						PersonID: singleNum, //自增id
						SubtitleContent: thisName, //字幕名称
						//PersonContent: thisContent, //字幕内容
					};
					jsonDataList.push(sendData); //组成数组
					
				});
				
				if(panduan == true){
					return;
				}
				//获取第一组数据的时长  实际就以第一组的时长为准
				var oneTime = $(allContent[0]).children(".subtitleTime").val();
				jsonDataList[0].PersonMeetTime = oneTime;//只有第一个对象有时长  其他不传
 
				allNum = jsonDataList.length; //长度
				
				//包含除了ip和端口的所有数据
				var paramList = {
						TerminateNum:serverNumber, //终端号
						MsgType:subtitleSettings, //字幕设置
						DisplayType:displayMethod,//显示方式
						MeetPersonNum:allNum, //所有json的长度
						MeetPerson:jsonDataList,  //所有的json数据
				};
				
				paramList = JSON.stringify(paramList);//将字幕信息转换成字符串
				
				//要上传的数据对象
				var params = {
					serverIp:serverIp,  //ip
					serverPort:serverPort, //端口
					paramDate:paramList //字幕内容
				};
				console.log(params.paramDate)
				$.ajax({
					type: 'post',
					data: params,
					url: 'operationManagement/cascade/cmsHttpClient.do',
					success: function(data) {
						judag = false;
						data = JSON.parse(data);
						if(data.result == true){
							console.log(data);	
						}
						var dataMsg = filter(data.msg);
						var content="<ul>";
						/*content +=	"<li>result：<span>"+data.result+"</span></li>";*/
						content +=	"<li>返回消息：<span>"+dataMsg+"</span></li>";
						content +=	"</ul>";
					
						$(".backDataList").append(content); //添加返回信息
						$('.backDataList').scrollTop( $('.backDataList').height() );
					},
					error:function(data){
						judag = false;
					}
				});
				
			}
			
			function filter(value){
				var text;
				switch(value){
					case "-1":
						text = "参数错误";
						break;
						case "1":
						text = "超时";
						break;	
						case "0":
						text = "成功";
						break;	
						case "-2":
						text = "本地虚拟终端号未入网";
						break;	
						case "-3":
						text = "上一个消息还没处理完";
						break;		
						case "-4":
						text = "所发的数据过长，不支持";
						break;	
						case "-5":
						text = "指令格式有误";
						break;	
						case "-6":
						text = "参数错误";
						break;	
						case "-7":
						text = "终端不支持字幕";
						break;
						default:
							text = value;
						break;
				}
				return text;
			}
			
			function addDom(){
				var content="<div class='singleAdd'>";
				content +=	"<label>推送字幕</label>";
				content +=	"<input type='text' class='subtitleName' maxlength=\"100\">";
				/* content +=	"<label>字幕内容</label>";
				content +=	"<input type='text' class='subtitleContent'>"; */
				content +=	"<label>字幕时长</label>";
				content +=	"<input type='text' class='subtitleTime' maxlength=\"5\">";
				content +=	"</div>";
				
				$("#allSubtitleContent").append(content);
				
				
				
				
			}
			
			
		</script>
	</body>
</html>