extension.setMessageListener(function(json) {
	/*console.log("=============setting extension=============");
	console.log(json);*/
	json = eval('(' + json + ')');
	var command = json.command;
	var type = json.type;
	var _token = json.token;
//	var result = json.data.result;
	if (type == "request") {
		//console.log("========request===========");
		// 根据command命令不同，处理不同逻辑
	} else if (type == "response") {
		console.log("========response===========");
		if(command == "ACK_SETTING_GET_INPUT_CONTENT"){
            //输入设置
			/*var result = json.params;
			console.log(result);
			if(result == "undefined" || result == "[]" || result == ""){
				console.log("ACK_SETTING_GET_VIDEO_CAPABILITY========没有数据");
				result = "";
			}*/
            getInputSetting(json)
		}else if(command == "ACK_SETTING_GET_OUTPUT_CONTENT"){
            //输出设置
           /* var result = json.params;
            console.log(result);
            if(result == "undefined" || result == "[]" || result == ""){
                console.log("ACK_SETTING_GET_OUTPUT_CONTENT========没有数据");
                result = "";
            }*/
            getOutinputSetting(json);
        }else if(command == "ACK_SETTING_GET_CODING_PARAMETER_CONTENT"){
           //编码参数
            /*var result = json.params;
            console.log(result);
            if(result == "undefined" || result == "[]" || result == ""){
                console.log("ACK_SETTING_GET_OUTPUT_CONTENT========没有数据");
                result = "";
            }*/
            getCodingParameter(json);
        }else if(command == "ACK_SETTING_GET_ABOUT_CONTENT"){
            console.log(json.params);
            setVersionInit(json);
        }
	}
});

/***
 * 页面向android发送命令
 * @param requestJson
 */
function postMessage(requestJson) {
	console.log("=========== setting->postMessage ===========");
	console.log(requestJson);
	extension.postMessage(requestJson);
}

// 对外开放接口，便于页面直接调用
// 发送消息
exports.postMessage = postMessage;