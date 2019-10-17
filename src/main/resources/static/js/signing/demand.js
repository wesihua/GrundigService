$(function(){
	// 超时跳到登录
	$(document).ajaxSuccess(function(event, xhr, settings){
		if(xhr.responseJSON.code == 1002){
			top.location.href="/";
		}
	});
	
	// 统计信息
	statisticsByState();
	
//    $(document).bind("ajaxSend", function () {
//		parent.$("#loading").show();
//    }).bind("ajaxComplete", function () {
//    	parent.$("#loading").hide();
//    });
    
	// 进入页面自动查询
	query(1);
	//按钮事件绑定
	$("#query-bottom").click(function(){
		query(1);
	});
	
	//监听公司名称变化
	$('#companyName').bind('input propertychange', function() {
		queryCompany();
	});
	
	// 监听公司输入框失去焦点 事件
	$("#companyName").blur(function(){
		$("#companyList").hide();
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
 * 查公司
 * @param 
 * @returns
 */
function queryCompany(){
	var name = $("#companyName").val();

	$.ajax({
		url:"/company/queryByName",
		type:"get",
		data:{name:name},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var firmArr = data.data;
				
				var divContent="";
				if(firmArr.length > 0){
				
					for(var i=0; i<firmArr.length; i++){
						var company = firmArr[i];
						divContent+=  "<div class='li' value_id= "+company.id+" value_name= "+company.name+"  onclick='changCompany(this)'>"+company.name +"</div>";
					}
				}
				$("#companyList").show();
				$("#companyList").empty().append(divContent);
			}
		}
	});

}

function changCompany(obj){
	var thisObj = $(obj);
	$("#companyName").val(thisObj.attr("value_name"));
	$("#companyId").val(thisObj.attr("value_id"));
	$("#companyList").hide();
}

/**
 * 查询
 * @returns
 */
function query(currentPage){
	
	var companyId = $("#companyId").val();
	//var createTime = $("#createTime").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var state = $("input:hidden[name='state']").val();
	
	var quertJson = {};
	quertJson.companyName = $("#companyName").val();
	quertJson.demandNumber = $("#demandNo").val();
	quertJson.createBeginTime = $("#createBeginTime").val();
	quertJson.createEndTime = $("#createEndTime").val();
	quertJson.state = $("input:hidden[name='state']").val();
	
	parent.$("#loading").show();
	$.ajax({
		url:"/demand/queryDemand",
		type:"post",
		data:{demandQueryJson : JSON.stringify(quertJson),
			pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			
			parent.$("#loading").hide();
			
			if(data.code == 1){
				var firmArr = data.data.data;
				var tableContent="";
				
				if(state == 0 && firmArr.length > 0){
					
					tableContent+= "<tr>"+
									"	<th>单号</th>"+
									"	<th>录单日期</th>"+
									"	<th>企业客户</th>"+
									"	<th>用工工种</th>"+
									"	<th>用工人数</th>"+
									"	<th>状态</th>"+
									"	<th>录单人员</th>"+
									"	<th width='120'>备注说明</th>"+
									"	<th width='150'>操作</th>"+
									"</tr>";
					
					for(var i=0; i<firmArr.length; i++){
						var firm = firmArr[i];
						tableContent+=  "<tr>"+
										"	<td>"+firm.demandNumber+"</td>"+
										"	<td>"+firm.createTime+"</td>"+
										"	<td>"+firm.companyName+"</td>"+
										"	<td>"+firm.jobTypeName+"</td>"+
										"	<td>"+firm.workCount+"</td>"+
										"	<td>"+firm.stateName+"</td>"+
										"	<td>"+firm.createUserName+"</td>"+
										"	<td width='120'>"+firm.description+"</td>"+
										"   <td><span class=\"des\" onClick=\"demandDetail("+firm.id+")\">详情</span><span class=\"jiedan\" onClick=\"undertakeDemand("+firm.id+")\">接单</span><span class=\"delete \" onClick=\"closeDemand("+firm.id+")\">关单</span></td>"+
										"</tr>";
					}
				}
				
				if(state == 1 && firmArr.length > 0){
					tableContent+= "<tr>"+
									"	<th>单号</th>"+
									"	<th>录单日期</th>"+
									"	<th>接单时间</th>"+
									"	<th>企业客户</th>"+
									"	<th>用工工种</th>"+
									"	<th>用工总人数</th>"+
									"	<th>状态</th>"+
									"	<th>录单人员</th>"+
									"	<th>操作人员</th>"+
									"	<th width='120'>备注说明</th>"+
									"	<th width='150'>操作</th>"+
									"</tr>";
					for(var i=0; i<firmArr.length; i++){
						var firm = firmArr[i];
						tableContent+=  "<tr>"+
										"	<td>"+firm.demandNumber+"</td>"+
										"	<td>"+firm.createTime+"</td>"+
										"	<td>"+firm.undertakeTime+"</td>"+
										"	<td>"+firm.companyName+"</td>"+
										"	<td>"+firm.jobTypeName+"</td>"+
										"	<td>"+firm.workCount+"</td>"+
										"	<td>"+firm.stateName+"</td>"+
										"	<td>"+firm.createUserName+"</td>"+
										"	<td>"+firm.undertakeUserName+"</td>"+
										"	<td width='120'>"+firm.description+"</td>"+
										"   <td><span class=\"des\" onClick=\"demandDetail("+firm.id+")\">详情</span><span class=\"jiedan\" onClick=\"signings("+firm.id+")\">签约</span><span class=\"delete \" onClick=\"closeDemand("+firm.id+")\">关单</span></td>"+
										"</tr>";
					}
				}
				
				if(state == 2 && firmArr.length > 0){
					tableContent+= "<tr>"+
									"	<th>单号</th>"+
									"	<th>签约日期</th>"+
									"	<th>企业客户</th>"+
									"	<th>收入总金额（元）</th>"+
									"	<th>用工人数</th>"+
									"	<th>已签人数</th>"+
									"	<th>操作人员</th>"+
									"	<th>状态</th>"+
									"	<th width='150'>操作</th>"+
									"</tr>";
					for(var i=0; i<firmArr.length; i++){
						var firm = firmArr[i];
						tableContent+=  "<tr>"+
										"	<td>"+firm.demandNumber+"</td>"+
										"	<td>"+firm.createTime+"</td>"+
										"	<td>"+firm.companyName+"</td>"+
										"	<td>"+firm.totalIncome+"（元）</td>"+
										"	<td>"+firm.workCount+"</td>"+
										"	<td>"+firm.signingCount+"</td>"+
										"	<td>"+firm.undertakeUserName+"</td>"+
										"	<td width='120'>"+firm.stateName+"</td>"+
										"   <td><span class=\"des\" onClick=\"demandDetail("+firm.id+")\">详情</span><span class=\"delete \" onClick=\"closeDemand("+firm.id+")\">关单</span></td>"+
										"</tr>";
					}
				}
				
				if(state == 3 && firmArr.length > 0){
					tableContent+= "<tr>"+
									"	<th>单号</th>"+
									"	<th>录单日期</th>"+
									"	<th>关单时间</th>"+
									"	<th>企业客户</th>"+
									"	<th>用工工种</th>"+
									"	<th>用工人数</th>"+
									"	<th>已签约人数</th>"+
									"	<th>状态</th>"+
									"	<th>录单人员</th>"+
									"	<th>操作人员</th>"+
									"	<th>关单说明</th>"+
									"	<th width='80'>操作</th>"+
									"</tr>";
					for(var i=0; i<firmArr.length; i++){
						var firm = firmArr[i];
						tableContent+=  "<tr>"+
										"	<td>"+firm.demandNumber+"</td>"+
										"	<td>"+firm.createTime+"</td>"+
										"	<td>"+firm.closeTime+"</td>"+
										"	<td>"+firm.companyName+"</td>"+
										"	<td>"+firm.jobTypeName+"</td>"+
										"	<td>"+firm.workCount+"</td>"+
										"	<td>"+firm.signingCount+"</td>"+
										"	<td>"+firm.stateName+"</td>"+
										"	<td>"+firm.createUserName+"</td>"+
										"	<td>"+firm.undertakeUserName+"</td>"+
										"	<td>"+firm.closeReason+"</td>"+
										"   <td><span class=\"des\" onClick=\"demandDetail("+firm.id+")\">详情</span></td>"+
										"</tr>";
					}
				}
				
				$("table").empty().append(tableContent);
				// 初始化时间控件
				$('.J-yearMonthPicker-single').datePicker({
			        format: 'YYYY-MM-DD'
			    });
				$("#totalCount").text(data.data.totalCount+"个结果");
				$("#pagination1").pagination({
					currentPage: data.data.pageNumber,
					totalPage: data.data.pageCount,
					callback: function(current) {
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
	window.location.href= "/signing/demandDetail?source=0&demandId=" + demandId ;
}

/**
 * 签约
 * @param demandId
 * @returns
 */
function signings(demandId){
	window.location.href= "/signing/demandDetail?source=1&demandId=" + demandId;
}

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
				statisticsByState();
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
 * 关单
 * @param demandId
 * @returns
 */
function closeDemand(demandId){
	openDialog("close-demand-dialog");
	// 每次打开清空上次的内容
	top.$("#close-demand-textarea").val(null);
	top.$("#confirm-close-demand").click(function(){
		var closeReason = top.$("#close-demand-textarea").val();
		if(closeReason == null || closeReason.length == 0){
			alert("关单原因不能为空！");
			return false;
		}
		
		$.ajax({
			url:"/demand/closeDemand",
			type:"get",
			dataType:"json",
			data:{demandId:demandId,
				closeReason:closeReason},
			success:function(data){
				if(data.code == 1){
					top.closeDialog();
					query(1);
					statisticsByState();
					alert("关单成功！");
				}
				else{
					alert("关单失败！原因："+data.msg);
				}
			}
		});
	});
}


function statisticsByState() {
	
	// 所有的数置空
	$("#count-state-0").text(0);
	$("#count-state-1").text(0);
	$("#count-state-2").text(0);
	$("#count-state-3").text(0);
	
	$.ajax({
		url : "/demand/statisticsByState",
		type : "get",
		dataType : "json",
		success : function(data) {
			if (data.code == 1) {
				var countList = data.data;
				
				if(countList!= null && countList.length > 0){
					for(var i=0; i<countList.length; i++){
						var countObj = countList[i];
						$("#count-state-" + countObj.state).text(countObj.count);
						//console.log(countObj);
					}
				}
			}
		}
	});
}


/**
 * 状态栏点击事件
 * @param obj
 * @returns
 */
function stateChange(obj){
	// 清空company  清空时间控件
	$("#companyId").val('');
	$("#createTime").val('');
	$("#companyName").val('');
	// 修改样式
	var thisObj=$(obj);
	thisObj.addClass("on");
	thisObj.siblings().each(function(){
	    $(this).removeClass("on");
	  });
	// 修改state值
    var state=thisObj.attr("state"); 
	$("input:hidden[name='state']").val(state);
	if(state == 3){
		$("#createTime").attr('placeholder','关单日期');
	}else{
		$("#createTime").attr('placeholder','录单日期');
	}
	
	query(1);
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



