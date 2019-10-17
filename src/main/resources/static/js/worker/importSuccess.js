$(function(){
	parent.$("#loading").hide();
	// 超时跳到登录
	$(document).ajaxSuccess(function(event, xhr, settings){
		if(xhr.responseJSON.code == 1002){
			top.location.href="/";
		}
	});
	$(document).bind("ajaxSend", function () {
		parent.$("#loading").show();
    }).bind("ajaxComplete", function () {
    	parent.$("#loading").hide();
    });
	
	var result = JSON.parse($("#result").val());
	if(result.code == 0){
		$("#title").val("导入失败");
		$("#success_tip").hide();
		$("#msg").text(result.msg);
		$("#fail_tip").show();
	}
	else{
		var data = result.data;
		$("#total").text(data.all);
		$("#success").text(data.success);
		$("#fail").text(data.fail);
		var exist = data.exist;
		if(exist && exist.length > 0){
			var content = "";
			for(var i=0; i<exist.length; i++){
				var info = exist[i];
				content += "<tr><td>"+info.name+"</td><td>"+info.idcard+"</td><td>"+info.telephone+"</td></tr>";
			}
			$("#exist").find("tbody").empty().append(content);
		}
		var wrongIdcard = data.wrongIdcard;
		if(wrongIdcard && wrongIdcard.length > 0){
			var content = "";
			for(var i=0; i<wrongIdcard.length; i++){
				var info = wrongIdcard[i];
				content += "<tr><td>"+info.name+"</td><td>"+info.idcard+"</td><td>"+info.telephone+"</td></tr>";
			}
			$("#wrongIdcard").find("tbody").empty().append(content);
		}
		var wrongPhone = data.wrongPhone;
		if(wrongPhone && wrongPhone.length > 0){
			var content = "";
			for(var i=0; i<wrongPhone.length; i++){
				var info = wrongPhone[i];
				content += "<tr><td>"+info.name+"</td><td>"+info.idcard+"</td><td>"+info.telephone+"</td></tr>";
			}
			$("#wrongPhone").find("tbody").empty().append(content);
		}
	}
});