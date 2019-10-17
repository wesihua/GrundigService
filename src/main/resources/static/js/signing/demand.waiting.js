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
		var parameters = "companyName=" + $("#companyName").val() +
		"&demandNumber=" + $("#demandNo").val() +
		"&createBeginTimeStr=" + $("#beginTime").val() +
		"&createEndTimeStr=" + $("#endTime").val() +
		"&state=" + $("input:hidden[name='state']").val();
		window.open("/demand/export?"+parameters);
	});
	

});

/**
 * 查询
 * @returns
 */
function query(currentPage) {
	var quertJson = {};
	quertJson.companyName = $("#companyName").val();
	quertJson.demandNumber = $("#demandNo").val();
	quertJson.createBeginTime = $("#beginTime").val();
	quertJson.createEndTime = $("#endTime").val();
	quertJson.state = $("input:hidden[name='state']").val();

	parent.$("#loading").show();
	
			$.ajax({
				url : "/demand/queryDemand",
				type : "post",
				data : {
					demandQueryJson : JSON.stringify(quertJson),
					pageNumber : currentPage
				},
				dataType : "json",
				success : function(data) {

					parent.$("#loading").hide();

					if (data.code == 1) {
						var firmArr = data.data.data;
						var tableContent = "";

						if (firmArr.length > 0) {

							tableContent += "<tr>"
								+ "	<th width='200'>招聘编号</th>"
								+ "	<th width='200'>企业客户</th>"
								+ " <th width='200'>招聘工种</th>"
								+ "	<th width='250'>招聘人数</th>"
								+ "	<th width='200'>性别要求</th>"
								+ "	<th width='250'>学历要求</th>"
								+ "	<th width='250'>专业要求</th>"
								+ "	<th width='120'>状态</th>" 
								+ "	<th width='120'>创建人</th>"
								+ "	<th width='220'>创建时间</th>"
								+ "	<th width='300'>备注说明</th>"
								+ "	<th width='200'>操作</th>" + "</tr>";

							for (var i = 0; i < firmArr.length; i++) {
								var firm = firmArr[i];
								tableContent += "<tr>" 
									+ "	<td>" + firm.demandNumber + "</td>"
									+ "	<td>" + firm.companyName	+ "</td>";
								if(firm.demandJobList != null && firm.demandJobList.length > 0){
									var demandJob = firm.demandJobList[0];
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
				tableContent+= "	<td>" + firm.stateName + "</td>"
									+ "	<td>" + firm.createUserName + "</td>"
									+ "	<td>" + firm.createTime + "</td>"
									+ "	<td width='120'>" + firm.description+ "</td>"
									+ "   <td><span class=\"des\" onClick=\"updateDemand("+ firm.id+ ")\">编辑</span><span class=\"des\" onClick=\"demandDetail("+ firm.id+ ")\">详情</span><span class=\"jiedan\" onClick=\"undertakeDemand("+ firm.id + ")\">接单</span></td>"
								+ "</tr>";
							}
						}

						$("table").empty().append(tableContent);
						// 初始化时间控件
						
						$('.J-datepicker-range').datePicker({
							format : 'YYYY-MM-DD HH:mm',
					        hasShortcut: true,
					        isRange: true,
					        shortcutOptions: [{
					          name: '昨天',
					          day: '-1,-1',
					          time: '00:00,23:59'
					        },{
					          name: '最近一周',
					          day: '-7,0',
					          time:'00:00,'
					        }, {
					          name: '最近一个月',
					          day: '-30,0',
					          time: '00:00,'
					        }, {
					          name: '最近三个月',
					          day: '-90, 0',
					          time: '00:00,'
					        }]
					      });
						$("#totalCount").text(data.data.totalCount + "个结果");
						$("#pagination1").pagination({
							currentPage : data.data.pageNumber,
							totalPage : data.data.pageCount,
							callback : function(current) {
								query(current);
							}
						});
					}
				},
				error : function() {
					parent.$("#loading").hide();
				}
			});
}

/**
 * 需求单详情
 * @param demandId
 * @returns
 */
function demandDetail(demandId){
	window.location.href="/demand/detail?demandId="+demandId;
}

/**
 * 编辑 跳转
 */
function updateDemand(demandId){
	window.location.href= "/signing/addDemand?demandId=" + demandId ;
}

/**
 * 新增需求单 跳转
 */ 
function addDemand(){
	window.location.href= "/signing/addDemand";
}

/**
 * 接单
 * @param demandId
 * @returns
 */
function undertakeDemand(demandId){
	var b = confirm("确认接单？");
	if(b){
		comfirmUndertake(demandId)
	}
}

/**
 * 接单
 * @param demandId
 * @returns
 */
function comfirmUndertake(demandId){
	$.ajax({
		url : "/demand/undertake",
		type : "get",
		dataType : "json",
		data:{demandId:demandId},
		success : function(data) {
			if (data.code == 1) {
				query(1);
				alert("接单成功！");
			}
		},
		error: function(data){
			alert(data.msg);
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



