<%@ page language="java" contentType="text/html; charset=utf-8"  
    pageEncoding="utf-8"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html>  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">  
<title>文件上传下载</title>  
<script>
    window.onload=function(){
    	/*原生JS版*/
    	document.getElementById("btn").onclick = function() {
    		
    	 /* FormData 是表单数据类 */
    	 var fd = new FormData();
    	 var ajax = new XMLHttpRequest();
    	 fd.append("upload", 1);
    	 /* 把文件添加到表单里 */
    	 fd.append("upfile", document.getElementById("upfile").files[0]);
    	 ajax.open("post", "http://localhost:8080/cms/file/uploadFile.do", true);
    	 
    	 ajax.onload = function () {
    	 console.log(ajax.responseText);
    	 };
    	 
    	 ajax.send(fd);
    	  
    	};
    	
    	/* var oBtn=document.getElementById('btn');
    	oBtn.onclick=function(){
    		alert(1);
    	}; */
    };
</script>
</head>  
<body>  
   <form action="http://localhost:8080/cms/file/uploadFile.do" method="post" enctype="multipart/form-data">  
        选择文件:<input type="file" name="file" width="120px">  
        <input type="submit" value="上传">  
    </form>   
  <!--   <hr>  
    <input type="file"  id="upfile" >
    
    <input type="button" id='btn' value='上传'>
     -->
</body>  
</html>  