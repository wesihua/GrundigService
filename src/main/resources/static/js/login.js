$(function(){
	
	// 进来先加载一遍json刷新下浏览器缓存。【无奈之举】
	initArea();
	initBirthplaceArea();
	
	$(".submit").click(function(){
		login();
	});
	$("#public-bottom2").click(function(){
		$("#public-box2").hide();
	});
	$("#alert_close").click(function(){
		$("#public-box2").hide();
	});
});
$(document).keyup(function (e) {//捕获文档对象的按键弹起事件
    if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
        //此处编写用户敲回车后的代码
    	login();
    }
});

function login(){
	var username = $("#username").val();
	var password = $("#password").val();
	if(username == "" || username.length == 0){
		alert("请输入用户名！");
		return false;
	}
	if(password == "" || password.length == 0){
		alert("请输入密码！");
		return false;
	}
	$.ajax({
		url:"/account/login",
		type:"get",
		dataType:"json",
		data:{userName:username,password:password,flag:0},
		success:function(data){
			if(data.code == 0){
				alert(data.msg);
			}
			else{
				location.href="./home.html"
			}
		},
		error: function(data){
			alert(data.msg);
		}
	});
}
///**
// * alert提示框
// */
//function alert(msg){
//	if(!msg){
//		msg = "请加入提示信息！";
//	}
//	$("#alert_msg").text(msg);
//	$("#public-box2").show();
//}

function initBirthplaceArea(){
	$.ajax({
		url:"/cityAreaTree.json",
		type:"get",
		dataType:"json",
		global: false,
		success:function(data){
			/**
			if(data.code == 1){
				var infoList = data.data;
				$("#birthplaceCode").selectivity({
				    items: infoList,
				    allowClear: true,
				    placeholder: ''
				});
			}
			**/
		}
	});
}

function initArea(){
	$.ajax({
		url:"/allAreaTree.json",
		type:"get",
		dataType:"json",
		global: false,
		success:function(data){
			/**
			if(data.code == 1){
				var infoList = data.data;
				$("#workplaceCode").selectivity({
				    items: infoList,
				    allowClear: true,
				    placeholder: ''
				});
			}
			**/
		}
	});
}