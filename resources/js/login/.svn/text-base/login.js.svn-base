$(function(){
	var userName = $('#user_name'),
		passWord = $('#pass_word'),
		loginBtn = $('#login_btn');
	
	loginBtn.click(function(){
		loginAjax();
	});
	
	document.onkeydown=function(e){
		if(e.keyCode == 13){  
			loginAjax();
	    }  
	};
	
	//用户登陆
	function loginAjax(){
		var _name = userName.val().trim(),
		_lock=loginBtn.attr('data-lock'),
		_pass = passWord.val().trim();
		if(_lock==1){
			return;
		}
		if(!_name){
			layer.msg('用户名不能为空');
			return;
		}
		if(!_pass){
			layer.msg('密码不能为空');
			return;
		}
		loginBtn.attr('data-lock',1);
		$.ajax({
			type:'POST',
			url:'userManagement/logon.do',
			data:{
				username:_name,
				password:_pass
			},
			success:function(data){
				
				if(data.result){
					layer.msg(data.msg);
					window.location.href="/cms/main/main.do";
				}else{
					layer.msg(data.msg);
					loginBtn.attr('data-lock','');
				}
				
			},
			error:function(data){
				loginBtn.attr('data-lock','');
				layer.msg(data.msg);
			},
			beforeSend:function(){},
			dataType:'JSON'
		});
	}
	
});