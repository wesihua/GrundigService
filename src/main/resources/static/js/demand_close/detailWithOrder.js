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
		url:"/demand/queryDetailWithOrder",
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
				$("#signCount").text(info.signingCount);
				$("#totalIncome").text(info.totalIncome);
				$("#closeUserName").text(info.closeUserName);
				$("#closeTime").text(info.closeTime);
				$("#closeReason").text(info.closeReason);
				// 加载招聘工种
				displayDemandJobTable(info.demandJobList);
				displayDemandOrderTable(info.demandOrderList);
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
function displayDemandOrderTable(demandOrderList){
	var tableContent = "";
	for(var i=0; i<demandOrderList.length; i++){
		var order = demandOrderList[i];
		tableContent+=  "<tr>"+
		"	<td>"+(order.orderNumber == null ? "" : order.orderNumber)+"</td>"+
		"	<td>"+order.workerCount+"</td>"+
		"	<td>"+order.totalIncome+"</td>"+
		"	<td>"+(order.customer == null ? "" : order.customer)+"</td>"+
		"	<td>"+(order.confirmUserName == null ? "" : order.confirmUserName)+"</td>"+
		"	<td>"+(order.confirmTime == null ? "" : order.confirmTime)+"</td>"+
		"	<td>"+(order.confirmStateName == null ? "" : order.confirmStateName)+"</td>"+
		"	<td>"+(order.rejectReason == null ? "" : order.rejectReason)+"</td>"+
		"	<td>"+(order.description == null ? "" : order.description)+"</td>"+
		"	<td>"+(order.createUserName == null ? "" : order.createUserName)+"</td>"+
		"	<td>"+(order.createTime == null ? "" : order.createTime)+"</td>"+
		"	<td><span class=\"des\" onClick=\"openDialog("+order.id+")\">签订人员</span></td>"+
		"</tr>";
		$("#demand-order-table").find("tbody").empty().append(tableContent);
	}
}
/**
 * 打开弹窗
 * @returns
 */
function openDialog(id){
	// 先查询信息
	$.ajax({
		url:"/order/queryByOrderId",
		type:"get",
		data:{orderId:id},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var orderArr = data.data;
				var tableContent="";
				for(var i=0; i<orderArr.length; i++){
					var order = orderArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+(order.name == null ? "" : order.name)+"</td>"+
									"	<td>"+(order.idcard == null ? "" : order.idcard)+"</td>"+
									"	<td>"+(order.workerCreateUserName == null ? "" : order.workerCreateUserName)+"</td>"+
									"	<td>"+(order.jobTypeName == null ? "" : order.jobTypeName)+"</td>"+
									"	<td>"+(order.signSalary == null ? "" : order.signSalary)+"</td>"+
									"	<td>"+(order.businessIncome == null ? "0" : order.businessIncome)+"</td>"+
									"	<td>"+(order.undertakeUserIncome == null ? "0" : order.undertakeUserIncome)+"</td>"+
									"	<td>"+(order.collectUserIncome == null ? "0" : order.collectUserIncome)+"</td>"+
									"	<td>"+(order.description == null ? "" : order.description)+"</td>"+
									"	<td>"+order.createTime+"</td>"+
									"</tr>";
				}
				$("#detail-order-dialog").find("tbody").empty().append(tableContent);
				var content = $("#detail-order-dialog").html();
				top.$("#dialog").html(content);
				top.$("#dialog").show();
				// 因为弹窗页面是重新渲染到top页面的。所以事件绑定只能在渲染之后。否则不起作用！
				top.$("#cancel-dialog").click(function(){
					top.closeDialog();
				});
				top.$("#close-dialog").click(function(){
					top.closeDialog();
				});
				top.$("#export_workers").click(function(){
					window.open("/order/export/workerList?orderId="+id);
				});
			}
		}
	});
}
