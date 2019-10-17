$(function(){
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
	
	$("#start_import").click(function(){
		var file = $("#file").val();
		if(!file || file.length == 0){
			alert("请先选择文件！");
			return false;
		}
		parent.$("#loading").show();
		$("#uploadForm").submit();
	});
	$("#downloadTemplate").click(function(){
		window.open("/import_tpl/import_template.xls");
	});
	$("#downloadQrcode").click(function(){
		window.open("/import_tpl/qr.png");
	});
});