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
	// 进入页面自动查询
	query(1);
	//按钮事件绑定
	$("#query").click(function(){
		query(1);
	});
	$("#download").click(function(){
		var companyName = $("#companyName").val();
		var demandNumber = $("#demandNumber").val();
		var undertakeUserName = $("#undertakeUserName").val();
		var closeUserName = $("#closeUserName").val();
		var state = $("#state").val();
		var beginTime = $("#beginTime").val();
		var endTime = $("#endTime").val();
		window.open("/demand/queryByPage4CloseExport?companyName="+companyName+"&demandNumber="+demandNumber+"" +
				"&undertakeUserName="+undertakeUserName+"&closeUserName="+closeUserName+"&state="+state+"" +
				"&beginTime="+beginTime+"&endTime="+endTime);
	});
	
	$('.J-datepicker-range').datePicker({
        hasShortcut: true,
        isRange: true,
        format: 'YYYY-MM-DD',
        shortcutOptions: [{
          name: '昨天',
          day: '-1,-1',
          time: '00:00:00,23:59:59'
        },{
          name: '最近一周',
          day: '-7,0',
          time:'00:00:00,'
        }, {
          name: '最近一个月',
          day: '-30,0',
          time: '00:00:00,'
        }, {
          name: '最近三个月',
          day: '-90, 0',
          time: '00:00:00,'
        }]
      });
});

/**
 * 查询
 * @returns
 */
function query(currentPage){
	var companyName = $("#companyName").val();
	var demandNumber = $("#demandNumber").val();
	var undertakeUserName = $("#undertakeUserName").val();
	var closeUserName = $("#closeUserName").val();
	var state = $("#state").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	$.ajax({
		url:"/demand/queryByPage4Close",
		type:"get",
		data:{companyName:companyName,demandNumber:demandNumber,undertakeUserName:undertakeUserName,
			closeUserName:closeUserName,state:state,beginTime:beginTime,endTime:endTime,pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var workerArr = data.data.data;
				var tableContent="";
				for(var i=0; i<workerArr.length; i++){
					var worker = workerArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+worker.demandNumber+"</td>"+
									"	<td>"+worker.companyName+"</td>";
									if(worker.demandJobList != null && worker.demandJobList.length > 0){
										var demandJob = worker.demandJobList[0];
										tableContent+= "<td>"+demandJob.jobTypeName+"</td>"+
										"<td>"+(demandJob.workerCount == null ? "" : demandJob.workerCount)+"</td>"+
										"<td>"+(demandJob.genderName == null ? "" : demandJob.genderName)+"</td>"+
										"<td>"+(demandJob.degreeName == null ? "" : demandJob.degreeName)+"</td>"+
										"<td>"+(demandJob.major == null ? "" : demandJob.major)+"</td>";
									}
									else{
										tableContent+= "<td></td>"+
										"<td></td>"+
										"<td></td>"+
										"<td></td>"+
										"<td></td>";
									}
									
									if(worker.demandOrderList != null && worker.demandOrderList.length > 0){
										var demandOrder = worker.demandOrderList[0];
										tableContent+= "<td>"+(demandOrder.confirmStateName == null ? "" : demandOrder.confirmStateName)+"</td>";
										if(demandOrder.confirmState == 1){
											tableContent+= "<td>"+(demandOrder.rejectReason == null ? "" : demandOrder.rejectReason)+"</td>";
										}else{
											tableContent+= "<td></td>";
										}
									}
									else{
										tableContent+= "<td></td>"+
										"<td></td>";
									}
									tableContent+= "	<td>"+worker.undertakeUserName+"</td>"+
									"	<td>"+worker.closeUserName+"</td>"+
									"	<td>"+(worker.closeTime == null ? "" : worker.closeTime)+"</td>"+
									"	<td>"+(worker.closeReason == null ? "" : worker.closeReason)+"</td>"+
									"	<td>"+worker.stateName+"</td>"+
									//"	<td>"+worker.createUserName+"</td>"+
									"	<td>"+worker.createTime+"</td>";
									if(worker.state != 3){
										tableContent += "<td><span class=\"delete\" onClick=\"closeDemand("+worker.id+")\">关单</span>"+
										"<span class=\"des\" onClick=\"detailDemand("+worker.id+","+worker.state+")\">详情</span></td>";
									}
									else{
										tableContent += "<td><span class=\"des\" onClick=\"detailDemand("+worker.id+","+worker.state+")\">详情</span></td>";
									}
									tableContent += "</tr>";
				}
				$("tbody").empty().append(tableContent);
				$("#totalCount").text(data.data.totalCount+"个结果");
				$("#pagination1").pagination({
					currentPage: data.data.pageNumber,
					totalPage: data.data.pageCount,
					callback: function(current) {
						query(current);
					}
				});
			}
		}
	});
}

function detailDemand(demandId,state){
	if(state == 0 || state == 1){
		location.href="/demand/detail?demandId="+demandId;
	}
	else{
		location.href="/demand/detailWithOrder?demandId="+demandId;
	}
}

function closeDemand(demandId){
	
	$.ajax({
		url:"/demand/isDemandConfirmed",
		type:"get",
		data:{demandId:demandId},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				if(data.data){
					alert("该招聘需求下有未确认的订单，请先确认订单相关金额再关闭该招聘！");
				}
				else{
					openDialog("close-demand-dialog");
					parent.$("#confirm-close-demand").click(function(){
						var content = parent.$("#close-demand-textarea").val();
						$.ajax({
							url:"/demand/closeDemand",
							type:"get",
							data:{demandId:demandId,closeReason:content},
							dataType:"json",
							success:function(data){
								if(data.code == 1){
									alert("关单成功！");
									top.closeDialog();
									query(1);
								}
							}
						});
					});
				}
			}
		}
	});
	
}
/**
 * 打开弹窗
 * @returns
 */
function openDialog(id){
	var content = $("#"+id).html();
	top.$("#dialog").html(content);
	top.$("#dialog").show();
	// 因为弹窗页面是重新渲染到top页面的。所以事件绑定只能在渲染之后。否则不起作用！
	top.$(".cancel-dialog").click(function(){
		top.closeDialog();
	});
	top.$("#close-dialog").click(function(){
		top.closeDialog();
	});
}

