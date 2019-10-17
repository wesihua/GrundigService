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
	$("#query-bottom").click(function(){
		query(1);
	});
	$("#download").click(function(){
		var companyName = $("#companyName").val();
		var orderNumber = $("#orderNumber").val();
		var demandNumber = $("#demandNumber").val();
		var createUserName = $("#createUserName").val();
		var beginTime = $("#beginTime").val();
		var endTime = $("#endTime").val();
		var confirmState = $("#confirmState").val();
		window.open("/order/confirmList/export?companyName="+companyName+"&orderNumber="+orderNumber+"&createUserName="+
				createUserName+"&beginTime="+beginTime+"&endTime="+endTime+"&confirmState="+confirmState+"&demandNumber="+demandNumber);
	});
	
	$('.J-datepicker-range').datePicker({
        hasShortcut: true,
        format: 'YYYY-MM-DD',
        isRange: true,
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
	var orderNumber = $("#orderNumber").val();
	var demandNumber = $("#demandNumber").val();
	var createUserName = $("#createUserName").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var confirmState = $("#confirmState").val();
	$.ajax({
		url:"/order/confirmList",
		type:"get",
		data:{companyName:companyName,orderNumber:orderNumber,
			createUserName:createUserName,beginTime:beginTime,
			endTime:endTime,confirmState:confirmState,demandNumber:demandNumber,
			pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var orderArr = data.data.data;
				var tableContent="";
				for(var i=0; i<orderArr.length; i++){
					var order = orderArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+order.companyName+"</td>"+
									"	<td>"+(order.orderNumber == null ? "" : order.orderNumber)+"</td>"+
									"	<td>"+order.workerCount+"</td>"+
									"	<td>"+order.totalIncome+"</td>";
									if(null != order.orderWorkerList && order.orderWorkerList.length > 0){
										var orderWorker = order.orderWorkerList[0];
										tableContent+= "<td>"+(orderWorker.undertakeUserIncome == null ? "" : orderWorker.undertakeUserIncome)+"</td>"+
														"<td>"+(orderWorker.collectUserIncome == null ? "" : orderWorker.collectUserIncome)+"</td>"+
														"<td>"+orderWorker.workerCreateUserName+"</td>";
									}
									else{
										tableContent+= "<td></td><td></td><td></td>";
									}
									tableContent+= "	<td>"+order.createUserName+"</td>"+
									"	<td>"+(order.confirmUserName == null ? "" : order.confirmUserName)+"</td>"+
									"	<td>"+(order.confirmTime == null ? "" : order.confirmTime)+"</td>"+
									"	<td>"+(order.confirmStateName == null ? "" : order.confirmStateName)+"</td>"+
									"	<td>"+(order.rejectReason == null ? "" : order.rejectReason)+"</td>"+
									"	<td>"+order.createTime+"</td>";
									if(order.confirmState == 2){
										tableContent+= "<td><span class=\"des\" onClick=\"openDialog("+order.id+")\">签订人员</span></td>";
									}
									else{
										tableContent+= "<td><span class=\"des\" onClick=\"confirmOrder("+order.id+")\">确认</span>" +
										"<span class=\"des\" onClick=\"rejectOrder("+order.id+")\">驳回</span>"+
										"<span class=\"des\" onClick=\"openDialog("+order.id+")\">签订人员</span></td>";
									}
									
									tableContent+= "</tr>";
				}
				$("#order_table").find("tbody").empty().append(tableContent);
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

function confirmOrder(orderId){
	var b = confirm("是否确认该笔订单？确认后该订单信息不可更改！");
	if(b){
		$.ajax({
			url:"/order/confirm",
			type:"get",
			dataType:"json",
			data:{orderId:orderId},
			success:function(data){
				if(data.code == 1){
					alert("订单确认成功！");
					query(1);
				}
				else{
					alert("订单确认失败！原因："+data.msg);
				}
			}
		});
	}
}

function rejectOrder(orderId){
	openRejectDialog("reject-order-dialog");
	parent.$("#reject-order").click(function(){
		var content = parent.$("#reject-order-textarea").val();
		$.ajax({
			url:"/order/reject",
			type:"get",
			data:{orderId:orderId,rejectReason:content},
			dataType:"json",
			success:function(data){
				if(data.code == 1){
					alert("驳回成功！");
					top.closeDialog();
					query(1);
				}
			}
		});
	});
}
/**
 * 打开弹窗
 * @returns
 */
function openRejectDialog(id){
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

