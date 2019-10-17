$(function(){
	// alert提示框click事件
	top.$("#alert_close").click(function(){
		closeAlert();
	});
	// confirm提示框click事件
	top.$("#public-bottom1").click(function(){
		closeConfirm()
	});
	top.$("#confirm_close").click(function(){
		closeConfirm()
	});
	
});




/**
 * alert提示框
 */
function alert(msg,f){
	if(!msg){
		msg = "网络发生异常！";
	}
	top.$("#alert_msg").text(msg);
	top.$("#public-box2").show();
	if(f){
		top.$(".alert_sure").click(f);
	}
	else{
		top.$(".alert_sure").click(function(){
			top.$("#public-box2").hide();
		});
	}
}

/**
 * confirm提示框
 */
function confirm(msg,f){
	if(!msg){
		msg = "网络发生异常！";
	}
	top.$("#confirm_msg").text(msg);
	top.$("#public-box1").show();
	top.$(".confirm_sure").click(f);
}
/**
 * 关闭confirm
 * @returns
 */
function closeConfirm(){
	top.$("#public-box1").hide();
}
function closeAlert(){
	top.$("#public-box2").hide();
}
/**
 * 关闭弹窗
 * @returns
 */
function closeDialog(){
	top.$("#dialog").hide();
}