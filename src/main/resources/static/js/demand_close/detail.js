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
	$("#back").click(function(){
		history.back();
	});
	
	//加载招聘需求信息
	loadDemandInfo();
});

/**
 * 加载人才信息
 * @param workerId
 * @returns
 */
function loadDemandInfo(){
	var demandId = $("#demandId").val();
	$.ajax({
		url:"/demand/queryDetail",
		type:"get",
		dataType:"json",
		data:{demandId:demandId},
		success:function(data){
			if(data.code == 1){
				var info = data.data;
				$("#companyName").text(info.companyName);
				$("#demandNumber").text(info.demandNumber);
				$("#undertakeUserName").text(info.undertakeUserName);
				$("#undertakeTime").text(info.undertakeTime);
				$("#workerCount").text(info.workCount);
				$("#createUserName").text(info.createUserName);
				$("#createTime").text(info.createTime);
				$("#stateName").text(info.stateName);
				$("#description").text(info.description);
				// 加载招聘工种
				displayDemandJobTable(info.demandJobList);
			}
		}
	});
}

function displayDemandJobTable(demandJobList){
	var tableContent = "";
	for(var i=0; i<demandJobList.length; i++){
		var job = demandJobList[i];
		tableContent+=  "<tr>"+
			"	<td>"+job.jobTypeName+"</td>"+
			"	<td>"+job.workerCount+"</td>"+
			"	<td>"+(job.requireTime == null ? "" : job.requireTime)+"</td>"+
			"	<td>"+(job.salary == null ? "" : job.salary)+"</td>"+
			"	<td>"+(job.workAreaName == null ? "" : job.workAreaName)+"</td>"+
			"	<td>"+(job.genderName == null ? "" : job.genderName)+"</td>"+
			"	<td>"+(job.age == null ? "" : job.age)+"</td>"+
			"	<td>"+(job.degreeName == null ? "" : job.degreeName)+"</td>"+
			"	<td>"+(job.major == null ? "" : job.major)+"</td>"+
			"	<td>"+(job.requirement == null ? "" : job.requirement)+"</td>"+
			"</tr>";
		$("#demand-job-table").find("tbody").empty().append(tableContent);
	}
}

