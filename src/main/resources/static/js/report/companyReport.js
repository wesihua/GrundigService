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
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		window.open("/report/companyReport/export?companyName="+companyName+"&startDate="+startDate+"&endDate="+endDate);
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
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	$.ajax({
		url:"/report/companyReport",
		type:"get",
		data:{companyName:companyName,startDate:startDate,endDate:endDate,pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var orderArr = data.data.data;
				var tableContent="";
				for(var i=0; i<orderArr.length; i++){
					var order = orderArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+order.companyName+"</td>"+
									"	<td>"+order.orderCount+"</td>"+
									"	<td>"+order.orderMemberCount+"</td>"+
									"	<td>"+order.orderIncome+"</td>"+
									"</tr>";
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


