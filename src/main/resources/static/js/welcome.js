$(document).ajaxSuccess(function(event, xhr, settings){
	if(xhr.responseJSON.code == 1002){
		top.location.href="/";
	}
});

$(function(){
	
	$("#downloadAndroid").click(function(){
		window.open("/import_tpl/worker.apk");
	});
	
});

