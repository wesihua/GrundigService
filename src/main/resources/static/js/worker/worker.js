var currentPage = 1;
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
	
	//按钮事件绑定
	$("#query").click(function(){
		query(1);
	});
	$("#reset").click(function(){
		currentPage = 1;
		resetQuery();
	});
	$("#add-worker").click(function(){
		location.href="/worker/add"
	});
	$("#download").click(function(){
		var workerName = $("#workerName").val();
		var telephone = $("#telephone").val();
		var idcard = $("#idcard").val();
		var firstId = "";
		var secondId = "";
		if($("#firstId").selectivity('data')){
			firstId = $("#firstId").selectivity('data').id;
		}
		if($("#secondId").selectivity('data')){
			secondId = $("#secondId").selectivity('data').id;
		}	
		var createUser = $("#createUser").val();
		var source = $("#source").val();
		var workStatus = $("#workStatus").val();
		var beginTime = $("#beginTime").val();
		var endTime = $("#endTime").val();
		var company = $("#company").val();
		var minAge = $("#minAge").val();
		var maxAge = $("#maxAge").val();
		var sex = $("#sex").val();
		var degree = $("#degree").val();
		var expectSalary = $("#expectSalary").val();
		var workYear = $("#workYear").val();
		var discipline = $("#discipline").val();
		
		window.open("/worker/export?name="+workerName+"&telephone="+telephone+"" +
				"&idcard="+idcard+"&firstId="+firstId+"&secondId="+secondId+"" +
				"&company="+company+"&minAge="+minAge+"&maxAge="+maxAge+"&sex="+sex+"&workStatus="+workStatus+"" +
				"&degree="+degree+"&expectSalary="+expectSalary+"&workYear="+workYear+"&discipline="+discipline+""+
				"&createUser="+createUser+"&source="+source+"&beginTime="+beginTime+"&endTime="+endTime);
	});
	// 初始化来源
	initSelect();
	// 初始化创建人
	initCreateUserSelect("createUser");
	
	$('.J-datepicker-range').datePicker({
        hasShortcut: true,
        format : 'YYYY-MM-DD HH:mm',
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
	// 初始化工作状态
	//initWorkStatusSelect("workStatus","work_status");
	// 初始化学历要求
	//initDegreeSelect("degree","degree");
	// 初始化期望薪资
	//initExpectSalarySelect("expectSalary","expect_salary");
	// 初始化一级工种
	initFirstIdSelect("firstId");
	// 二级工种联动
	$("#firstId").change(function(){
		if(!$(this).selectivity('data')){
			$("#secondId").selectivity('clear');
			$("#secondId").selectivity({
				allowClear: true,
			    items: [],
			    placeholder: '二级工种'
			});
		}
		else{
			var firstId = $(this).selectivity('data').id;
			$("#secondId").selectivity('clear');
			$.ajax({
				url:"/jobType/queryByParentId",
				type:"get",
				dataType:"json",
				data:{parentId:firstId},
				success:function(data){
					if(data.code == 1){
						var dics = data.data;
						var infoList = [];
						for(var i=0; i<dics.length; i++){
							var dic = dics[i];
							var info = {};
							info.id = dic.id;
							info.text = dic.name;
							infoList.push(info);
						}
						$("#secondId").selectivity({
							allowClear: true,
						    items: infoList,
						    placeholder: '二级工种'
						});
					}
				}
			});
		}
		
	});
	
	$("#all_worker").click(function(){
		
		if(this.checked){
			$("input[name='single_worker']").attr("checked", "checked");
		}
		else{
			$("input[name='single_worker']").attr("checked", null);
		}
		
		//$("input[name='single_worker']").attr("checked", $("#all_worker").prop("checked"));
	});
	
	$("#batch-delete-worker").click(function(){
		var idArray = [];
		$.each($("input:checkbox[name=single_worker]:checked"),function(){
			idArray.push($(this).attr("id"));
		});
		if(idArray.length == 0){
			alert("请选择简历");
			return false;
		}
		batchDeleteWorker(idArray);
	});
	$("#batch-experience").click(function(){
		var workerIds = "";
		$.each($("input:checkbox[name=single_worker]:checked"),function(){
			workerIds+=$(this).attr("id")+",";
		});
		if(workerIds.length == 0){
			alert("请选择简历");
			return false;
		}
		
		var workerName = $("#workerName").val();
		var telephone = $("#telephone").val();
		var idcard = $("#idcard").val();
		var firstId = "";
		if($("#firstId").selectivity('data')){
			firstId = $("#firstId").selectivity('data').id;
		}
		var secondId = "";
		if($("#secondId").selectivity('data')){
			secondId = $("#secondId").selectivity('data').id;
		}
		var createUser = $("#createUser").val();
		var source = $("#source").val();
		var company = $("#company").val();
		var beginTime = $("#beginTime").val();
		var endTime = $("#endTime").val();
		var minAge = $("#minAge").val();
		var maxAge = $("#maxAge").val();
		var sex = $("#sex").val();
		var degree = $("#degree").val();
		var expectSalary = $("#expectSalary").val();
		var workYear = $("#workYear").val();
		var discipline = $("#discipline").val();
		var workStatus = $("#workStatus").val();
		var agent = $("#agent").val();
		var current = $("#pageCurrent").val();
		
		location.href="/worker/batchExperience?workerIds="+workerIds+"&workerName="+workerName+"&telephone="+telephone+"&idcard="+idcard
		+"&firstId="+firstId+"&secondId="+secondId+"&createUser="+createUser+"&source="+source+"&company="+company
		+"&beginTime="+beginTime+"&endTime="+endTime+"&minAge="+minAge+"&maxAge="+maxAge+"&sex="+sex+"&degree="+degree+"&agent="+agent
		+"&expectSalary="+expectSalary+"&workYear="+workYear+"&discipline="+discipline+"&workStatus="+workStatus+"&current="+current;
		
		//location.href="/worker/batchExperience?workerIds="+workerIds
	});
});

function resetQuery(){
	
	$("#current_rem").val("");
	$("#workerName_rem").val("");
	$("#telephone_rem").val("");
	$("#idcard_rem").val("");
	$("#firstId_rem").val("");
	$("#secondId_rem").val("");
	$("#createUser_rem").val("");
	$("#source_rem").val("");
	$("#company_rem").val("");
	$("#beginTime_rem").val("");
	$("#endTime_rem").val("");
	$("#minAge_rem").val("");
	$("#maxAge_rem").val("");
	$("#sex_rem").val("");
	$("#degree_rem").val("");
	$("#expectSalary_rem").val("");
	$("#workYear_rem").val("");
	$("#discipline_rem").val("");
	$("#workStatus_rem").val("");
	$("#agent_rem").val("");
	
	$("#createUser").val("");
	$("#source").val("");
	$("#company").val("");
	$("#beginTime").val("");
	$("#endTime").val("");
	$("#minAge").val("");
	$("#maxAge").val("");
	$("#sex").val("");
	$("#degree").val("");
	$("#expectSalary").val("");
	$("#workYear").val("");
	$("#discipline").val("");
	$("#workStatus").val("");
	$("#workerName").val("");
	$("#telephone").val("");
	$("#idcard").val("");
	$("#agent").val("");
	if($("#firstId").selectivity('data')){
		$("#firstId").selectivity('clear');
	}
	var secondId = "";
	if($("#secondId").selectivity('data')){
		$("#secondId").selectivity('clear');
	}
}

/**
 * 查询
 * @returns
 */
function query(currentPage,onPage){
	
	var workerName = $("#workerName").val();
	var telephone = $("#telephone").val();
	var idcard = $("#idcard").val();
	
	if(!onPage){
		var firstId = "";
		if($("#firstId").selectivity('data')){
			firstId = $("#firstId").selectivity('data').id;
		}
		var secondId = "";
		if($("#secondId").selectivity('data')){
			secondId = $("#secondId").selectivity('data').id;
		}
	}
	
	var createUser = $("#createUser").val();
	var source = $("#source").val();
	var company = $("#company").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var minAge = $("#minAge").val();
	var maxAge = $("#maxAge").val();
	var sex = $("#sex").val();
	var degree = $("#degree").val();
	var expectSalary = $("#expectSalary").val();
	var workYear = $("#workYear").val();
	var discipline = $("#discipline").val();
	var workStatus = $("#workStatus").val();
	var agent = $("#agent").val();
	$.ajax({
		url:"/worker/list",
		type:"get",
		data:{name:workerName,telephone:telephone,idcard:idcard,createUser:createUser,
			souce:source,firstId:firstId,secondId:secondId,beginTime:beginTime,agent:agent,
			minAge:minAge,maxAge:maxAge,sex:sex,degree:degree,expectSalary:expectSalary,
			workYear:workYear,company:company,discipline:discipline,workStatus:workStatus,
			endTime:endTime,pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var userId = parent.$("#userId").val();
				var roleId = parent.$("#roleId").val();
				var workerArr = data.data.data;
				var tableContent="";
				for(var i=0; i<workerArr.length; i++){
					var worker = workerArr[i];
					tableContent+=  "<tr>"+
									"<td><input type=\"checkbox\" name=\"single_worker\" id="+worker.id+"></td>"+
									"<td>"+(i+1)+"</td>"+
									"	<td>"+worker.name+"</td>"+
									"	<td>"+worker.telephone+"</td>"+
									//"	<td>"+(worker.idcard == null ? "" : worker.idcard)+"</td>"+
									"	<td>"+worker.sexName+"</td>"+
									"	<td>"+(worker.age == null ? "" : worker.age)+"</td>"+
									"	<td>"+(worker.title == null ? "" : worker.title)+"</td>"+
									"	<td>"+(worker.jobtypeName == null ? "" : worker.jobtypeName)+"</td>";
									if(worker.experienceList != null && worker.experienceList.length > 0){
										var experience = worker.experienceList[0];
										var beginTime = experience.beginTime == null ? "-" : experience.beginTime;
										var endTime = experience.endTime == null ? "-" : experience.endTime;
										tableContent += "<td>"+experience.company+"</td><td>"+beginTime+"至"+endTime+"</td>";
									}
									else{
										tableContent += "<td></td><td></td>";
									}
									tableContent += "	<td>"+(worker.bank == null ? "" : worker.bank)+"</td>"+
									"	<td>"+(worker.bankAccount == null ? "" : worker.bankAccount)+"</td>"+
									"	<td>"+(worker.agent == null ? "" : worker.agent)+"</td>"+
									"	<td>"+worker.workStatusName+"</td>"+
									"	<td>"+worker.createUserName+"</td>"+
									"	<td>"+worker.sourceName+"</td>"+
									"	<td>"+worker.createTime+"</td>";
									if(roleId != 2){
										tableContent += "	<td><span class=\"des\" onClick=\"editWorker("+worker.id+","+data.data.pageNumber+")\">编辑</span>" +
										"<span class=\"delete\" onClick=\"deleteWorker("+worker.id+","+data.data.pageNumber+")\">删除</span>" +
										"<span class=\"delete\" onClick=\"downloadResume("+worker.id+")\">简历</span>" +
										"<span class=\"delete\" onClick=\"detailWorker('"+worker.id+"','"+worker.createUserName+"','"+data.data.pageNumber+"')\">详情</span></td>"+
										"</tr>";
									}
									else if(roleId == 2 && userId == worker.createUser){
										tableContent += "	<td><span class=\"des\" onClick=\"editWorker("+worker.id+","+data.data.pageNumber+")\">编辑</span>" +
										"<span class=\"delete\" onClick=\"deleteWorker("+worker.id+","+data.data.pageNumber+")\">删除</span>" +
										"<span class=\"delete\" onClick=\"downloadResume("+worker.id+")\">简历</span>" +
										"<span class=\"delete\" onClick=\"detailWorker('"+worker.id+"','"+worker.createUserName+"','"+data.data.pageNumber+"')\">详情</span></td>"+
										"</tr>";
									}
									else if(roleId == 2 && userId != worker.createUser){
										tableContent += "	<td><span class=\"delete\" onClick=\"detailWorker('"+worker.id+"','"+worker.createUserName+"','"+data.data.pageNumber+"')\">详情</span></td>"+
										"</tr>";
									}
				}
				$("tbody").empty().append(tableContent);
				$("#all_worker").prop("checked", false);
				$("#totalCount").text(data.data.totalCount+"个结果");
				$("#pageCurrent").val(data.data.pageNumber);
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

function editWorker(workerId,current){
	var workerName = $("#workerName").val();
	var telephone = $("#telephone").val();
	var idcard = $("#idcard").val();
	var firstId = "";
	if($("#firstId").selectivity('data')){
		firstId = $("#firstId").selectivity('data').id;
	}
	var secondId = "";
	if($("#secondId").selectivity('data')){
		secondId = $("#secondId").selectivity('data').id;
	}
	var createUser = $("#createUser").val();
	var source = $("#source").val();
	var company = $("#company").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var minAge = $("#minAge").val();
	var maxAge = $("#maxAge").val();
	var sex = $("#sex").val();
	var degree = $("#degree").val();
	var expectSalary = $("#expectSalary").val();
	var workYear = $("#workYear").val();
	var discipline = $("#discipline").val();
	var workStatus = $("#workStatus").val();
	var agent = $("#agent").val();
	
	location.href="/worker/edit?workerId="+workerId+"&workerName="+workerName+"&telephone="+telephone+"&idcard="+idcard
	+"&firstId="+firstId+"&secondId="+secondId+"&createUser="+createUser+"&source="+source+"&company="+company
	+"&beginTime="+beginTime+"&endTime="+endTime+"&minAge="+minAge+"&maxAge="+maxAge+"&sex="+sex+"&degree="+degree+"&agent="+agent
	+"&expectSalary="+expectSalary+"&workYear="+workYear+"&discipline="+discipline+"&workStatus="+workStatus+"&current="+current;
}
function detailWorker(workerId,createUserName,current){
	var workerName = $("#workerName").val();
	var telephone = $("#telephone").val();
	var idcard = $("#idcard").val();
	var firstId = "";
	if($("#firstId").selectivity('data')){
		firstId = $("#firstId").selectivity('data').id;
	}
	var secondId = "";
	if($("#secondId").selectivity('data')){
		secondId = $("#secondId").selectivity('data').id;
	}
	var createUser = $("#createUser").val();
	var source = $("#source").val();
	var company = $("#company").val();
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	var minAge = $("#minAge").val();
	var maxAge = $("#maxAge").val();
	var sex = $("#sex").val();
	var degree = $("#degree").val();
	var expectSalary = $("#expectSalary").val();
	var workYear = $("#workYear").val();
	var discipline = $("#discipline").val();
	var workStatus = $("#workStatus").val();
	var agent = $("#agent").val();
	location.href="/worker/detail?workerId="+workerId+"&createUserName="+createUserName+"&workerName="+workerName+"&telephone="+telephone+"&idcard="+idcard
	+"&firstId="+firstId+"&secondId="+secondId+"&createUser="+createUser+"&source="+source+"&company="+company
	+"&beginTime="+beginTime+"&endTime="+endTime+"&minAge="+minAge+"&maxAge="+maxAge+"&sex="+sex+"&degree="+degree+"&agent="+agent
	+"&expectSalary="+expectSalary+"&workYear="+workYear+"&discipline="+discipline+"&workStatus="+workStatus+"&current="+current;
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

function initSelect(){
	var types = "expect_salary,work_status,degree,worker_souce";
	$.ajax({
		url:"/common/queryDicByTypes",
		type:"get",
		//async:true,
		dataType:"json",
		data:{types:types},
		global: false,
		success:function(data){
			if(data.code == 1){
				var all = data.data;
				// 组装期望薪资
				var expectSalaryDics = all.expect_salary;
				var contentexpectSalary = "<option value=\"\">---期望薪资---</option>";
				for(var i=0; i<expectSalaryDics.length; i++){
					var expectSalaryDic = expectSalaryDics[i];
					contentexpectSalary += "<option value=\""+expectSalaryDic.code+"\">"+expectSalaryDic.name+"</option>";
				}
				$("#expectSalary").empty().html(contentexpectSalary);
				// 组装工作状态
				var workStatusDics = all.work_status;
				var contentWorkStatus = "<option value=\"\">---工作状态---</option>";
				for(var i=0; i<workStatusDics.length; i++){
					var workStatusDic = workStatusDics[i];
					contentWorkStatus += "<option value=\""+workStatusDic.code+"\">"+workStatusDic.name+"</option>";
				}
				$("#workStatus").empty().html(contentWorkStatus);
				// 组装学历
				var degreeDics = all.degree;
				var contentdegree = "<option value=\"\">---学历---</option>";
				for(var i=0; i<degreeDics.length; i++){
					var degreeDic = degreeDics[i];
					contentdegree += "<option value=\""+degreeDic.code+"\">"+degreeDic.name+"</option>";
				}
				$("#degree").empty().html(contentdegree);
				// 组装来源
				var sourceDics = all.worker_souce;
				var contentsource = "<option value=\"\">---来源---</option>";
				for(var i=0; i<sourceDics.length; i++){
					var sourceDic = sourceDics[i];
					contentsource += "<option value=\""+sourceDic.code+"\">"+sourceDic.name+"</option>";
				}
				$("#source").empty().html(contentsource);
			}
		}
	});
}

function initDegreeSelect(id,type){
	$.ajax({
		url:"/common/queryDicByType",
		type:"get",
		dataType:"json",
		data:{type:type},
		global: false,
		success:function(data){
			if(data.code == 1){
				var dics = data.data;
				var content = "<option value=\"\">---学历要求---</option>";
				for(var i=0; i<dics.length; i++){
					var dic = dics[i];
					content += "<option value=\""+dic.code+"\">"+dic.name+"</option>";
				}
				$("#"+id).empty().html(content);
			}
		}
	});
}

function initWorkStatusSelect(id,type){
	$.ajax({
		url:"/common/queryDicByType",
		type:"get",
		dataType:"json",
		data:{type:type},
		global: false,
		success:function(data){
			if(data.code == 1){
				var dics = data.data;
				var content = "<option value=\"\">---工作状态---</option>";
				for(var i=0; i<dics.length; i++){
					var dic = dics[i];
					content += "<option value=\""+dic.code+"\">"+dic.name+"</option>";
				}
				$("#"+id).empty().html(content);
			}
		}
	});
}
function initExpectSalarySelect(id,type){
	$.ajax({
		url:"/common/queryDicByType",
		type:"get",
		dataType:"json",
		data:{type:type},
		global: false,
		success:function(data){
			if(data.code == 1){
				var dics = data.data;
				var content = "<option value=\"\">---薪资要求---</option>";
				for(var i=0; i<dics.length; i++){
					var dic = dics[i];
					content += "<option value=\""+dic.code+"\">"+dic.name+"</option>";
				}
				$("#"+id).empty().html(content);
			}
		}
	});
}

function initCreateUserSelect(id){
	$.ajax({
		url:"/user/queryByRealName",
		type:"get",
		dataType:"json",
		global: false,
		success:function(data){
			if(data.code == 1){
				var dics = data.data;
				var content = "<option value=\"\">---录入人---</option>";
				for(var i=0; i<dics.length; i++){
					var dic = dics[i];
					content += "<option value=\""+dic.id+"\">"+dic.realName+"</option>";
				}
				$("#"+id).empty().html(content);
			}
		}
	});
}

function initFirstIdSelect(id){
	$.ajax({
		url:"/jobType/queryRootJobType",
		type:"get",
		dataType:"json",
		global: false,
		success:function(data){
			if(data.code == 1){
				var dics = data.data;
				var infoList = [];
				for(var i=0; i<dics.length; i++){
					var dic = dics[i];
					var info = {};
					info.id = dic.id;
					info.text = dic.name;
					infoList.push(info);
				}
				$("#"+id).selectivity({
					allowClear: true,
				    items: infoList,
				    placeholder: '一级工种'
				});
				$("#secondId").selectivity({
					allowClear: true,
				    items: [],
				    placeholder: '二级工种'
				});
				
				// 设置条件历史
				setHistory();
				// 进入页面自动查询
				query(currentPage,1);
			}
		}
	});
}

function deleteWorker(workerId, current){
	var b = confirm("是否删除该人才？");
	if(b){
		$.ajax({
			url:"/worker/deleteWorker",
			type:"get",
			dataType:"json",
			data:{workerId:workerId},
			success:function(data){
				if(data.code == 1){
					alert("删除人才成功！");
					query(current);
				}
				else{
					alert("删除人才失败！原因："+data.msg);
				}
			}
		});
	}
}

/**
 * 批量删除
 * @param ids
 * @returns
 */
function batchDeleteWorker(ids){
	var current = $("#pageCurrent").val();
	var b = confirm("是否删除所选人才？");
	if(b){
		$.ajax({
			url:"/worker/batchDeleteWorker",
			type:"get",
			dataType:"json",
			data:{workerIdArray:JSON.stringify(ids)},
			success:function(data){
				if(data.code == 1){
					alert("删除人才成功！");
					$("#all_worker").prop("checked", null);
					query(current);
				}
				else{
					alert("删除人才失败！原因："+data.msg);
				}
			}
		});
	}
}

function downloadResume(workerId){
	window.open("/word/export?workerId="+workerId);
}

function setHistory(){
	// 设置条件记录
	if($("#current_rem").val()){
		currentPage = $("#current_rem").val();
	}
	if($("#workerName_rem").val()){
		$("#workerName").val($("#workerName_rem").val());
	}
	if($("#telephone_rem").val()){
		$("#telephone").val($("#telephone_rem").val());
	}
	if($("#idcard_rem").val()){
		$("#idcard").val($("#idcard_rem").val());
	}
	if($("#createUser_rem").val()){
		$("#createUser").val($("#createUser_rem").val());
	}
	if($("#source_rem").val()){
		$("#source").val($("#source_rem").val());
	}
	if($("#company_rem").val()){
		$("#company").val($("#company_rem").val());
	}
	if($("#beginTime_rem").val()){
		$("#beginTime").val($("#beginTime_rem").val());
	}
	if($("#endTime_rem").val()){
		$("#endTime").val($("#endTime_rem").val());
	}
	if($("#minAge_rem").val()){
		$("#minAge").val($("#minAge_rem").val());
	}
	if($("#maxAge_rem").val()){
		$("#maxAge").val($("#maxAge_rem").val());
	}
	if($("#sex_rem").val()){
		$("#sex").val($("#sex_rem").val());
	}
	if($("#degree_rem").val()){
		$("#degree").val($("#degree_rem").val());
	}
	if($("#expectSalary_rem").val()){
		$("#expectSalary").val($("#expectSalary_rem").val());
	}
	if($("#workYear_rem").val()){
		$("#workYear").val($("#workYear_rem").val());
	}
	if($("#discipline_rem").val()){
		$("#discipline").val($("#discipline_rem").val());
	}
	if($("#workStatus_rem").val()){
		$("#workStatus").val($("#workStatus_rem").val());
	}
	if($("#agent_rem").val()){
		$("#agent").val($("#agent_rem").val());
	}
}