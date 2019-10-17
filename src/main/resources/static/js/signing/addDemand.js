$(function(){
	// 超时跳到登录
	$(document).ajaxSuccess(function(event, xhr, settings){
		if(xhr.responseJSON.code == 1002){
			top.location.href="/";
		}
	});
	//$(document).bind("ajaxSend", function () {
	//	parent.$("#loading").show();
    //}).bind("ajaxComplete", function () {
    //	parent.$("#loading").hide();
    //});
	//按钮事件绑定
//	$("#add-demand-bottom").click(function(){
//		addDemand();
//	});
	var demandId = $("input:hidden[name='demandId']").val();
	if(demandId > 0){
		$("#title-name").text("编辑需求单");
	}
	
	// 初始化企业下拉框
	initCompanySelection();
	
	//监听公司名称变化
	$('#companyName').bind('input propertychange', function() {
		queryCompany();
	});
	
	queryDetail();
	
});

/**
 * 查询
 * @returns
 */
function queryDetail(){
	
	var demandId = $("input:hidden[name='demandId']").val();
	if(demandId > 0){
		$('#companyName').selectivity({readOnly:true});
		$.ajax({
			url:"/demand/waitingDemand",
			type:"get",
			data:{demandId:demandId},
			dataType:"json",
			success:function(data){
				if(data.code == 1){
					var state = data.data.state;
					var tableContent="";
					var firmArr = data.data.demandJobList;
					//$("#companyId").val(data.data.companyId);
					$("#companyName").selectivity('data',{id:data.data.companyId,"text":data.data.companyName});
					$("#description").text(data.data.description);
					if(firmArr.length > 0){
						tableContent+= "<tr>"+
										"	<th>用工工种</th>"+
										"	<th>用工人数</th>"+
										"	<th>到岗日期</th>"+
										"	<th>月工资（元）</th>"+
										"	<th>工作地区</th>"+
										"	<th>性别要求</th>"+
										"	<th>学历要求</th>"+
										"	<th>年龄要求</th>"+
										"	<th>专业要求</th>"+
										"	<th>用工要求</th>"+
										"	<th>操作</th>"+
										"</tr>";
						for(var i=0; i<firmArr.length; i++){
							var firm = firmArr[i];
							tableContent+=  "<tr class=\"tr-body\">"+
											"  <td id='jobTypeName'>"+firm.jobTypeName+"</td>"+
											"  <td id='workerCount'>"+firm.workerCount+"</td>"+
											"  <td id='requireTime'>"+(firm.requireTime == null ? '' : firm.requireTime)+"</td>"+
											"  <td id='salary'>"+firm.salary+"</td>"+
											"  <td id='workAreaName'>"+firm.workAreaName+"</td>"+
											"  <td id='genderName'>"+(firm.genderName == null ? '': firm.genderName)+"</td>"+
											"  <td id='degreeName'>"+(firm.degreeName == null ? '': firm.degreeName)+"</td>"+
											"  <td id='age'>"+(firm.age == null ? '':firm.age)+"</td>"+
											"  <td id='major'>"+(firm.major == null ? '':firm.major)+"</td>"+
											"  <td id='requirement'>"+firm.requirement+"</td>"+
											"  <input id='id' type=\"hidden\" name=\"id\" value="+ firm.id +">" +
											"  <input id='jobTypeId' type=\"hidden\" name=\"jobTypeId\" value="+ firm.jobTypeId +">" +
											"  <input id='parentJobTypeId' type=\"hidden\" name=\"parentJobTypeId\" value="+ firm.parentJobTypeId +">" +
											"  <input id='workArea' type='hidden' name='workArea' value="+ firm.workArea +">" +
											//"  <input id='parentCode' type='hidden' name='parentCode' value="+ firm.parentCode +">" +
											"  <input id='degree' type='hidden' name='degree' value="+ firm.degree +">" +
											"  <input id='gender' type='hidden' name='gender' value="+ firm.gender +">" +
											"  <td><span class=\"des\" onclick=\"editJob(this)\">编辑</span><span class=\"delete\" onclick=\"deleteJob(this)\">移除</span></td>"+
											"</tr>";
						}
					}
					$("table").empty().append(tableContent);
				}
			}
		});

	}
	
}

// 删除工种
function deleteJob(obj){
	var thisObj=$(obj);
	thisObj.parent().parent().remove();
}

// 查父级工种
function queryParentJobType(parentJobTypeId){
	$.ajax({
		url:"/jobType/queryRootJobType",
		type:"get",
		dataType:"json",
		async:false,
		global: false,
		success:function(data){
			if(data.code == 1){
				var dics = data.data;
				var infoList = [];
				var default_id;
				var default_name;
				for(var i=0; i<dics.length; i++){
					var dic = dics[i];
					var info = {};
					info.id = dic.id;
					info.text = dic.name;
					infoList.push(info);
					if(parentJobTypeId != undefined && parentJobTypeId == dic.id){
						 default_id = dic.id;
						 default_name = dic.name;
					}
				}
				parent.$("#firstId").selectivity({
					allowClear: true,
				    items: infoList,
				    placeholder: '一级工种'
				});
				
				if(parentJobTypeId != undefined){
					parent.$('#firstId').selectivity('data', { id: default_id, text: default_name});
				}
				
				parent.$("#secondId").selectivity({
					allowClear: true,
				    items: [],
				    placeholder: '二级工种'
				});
			}
		}
	});

}

function initCompanySelection(){
	$.ajax({
		url:"/company/queryAll",
		type:"get",
		dataType:"json",
		async:false,
		success:function(data){
			if(data.code == 1){
				var firmArr = data.data;
				var frimList = [];
				if(firmArr.length > 0){
					for(var i=0; i<firmArr.length; i++){
						var company = firmArr[i];
						var info = {};
						info.id = company.id;
						info.text = company.name;
						frimList.push(info);
					}
				}
				$("#companyName").selectivity({
					allowClear: true,
				    items: frimList,
				    placeholder: '选择企业'
				});
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

function initOtherSelect(gender,degree){

	var types = "gender_demand,degree_demand";
	$.ajax({
		url:"/common/queryDicByTypes",
		type:"get",
		async:false,
		dataType:"json",
		data:{types:types},
		success:function(data){
			if(data.code == 1){
				var all = data.data;
				
				// 性别
				var genderDics = all.gender_demand;
				var contentGender = "<option value=\"\">---请选择---</option>";
				for(var i=0; i<genderDics.length; i++){
					var genderDic = genderDics[i];
					if(gender != undefined && gender == genderDic.code){
						contentGender += "<option value=\""+genderDic.code+"\" selected=\"selected\">"+genderDic.name+"</option>";
					} else {
						contentGender += "<option value=\""+genderDic.code+"\">"+genderDic.name+"</option>";
					}
				}
				parent.$("#gender").empty().html(contentGender);
			
				// 学历
				var degreeDics = all.degree_demand;
				var contentdegree = "<option value=\"\">---请选择---</option>";
				for(var i=0; i<degreeDics.length; i++){
					var degreeDic = degreeDics[i];
					if(degree != undefined && degree == degreeDic.code){
						contentdegree += "<option value=\""+degreeDic.code+"\" selected=\"selected\">"+degreeDic.name+"</option>";
					} else {
						contentdegree += "<option value=\""+degreeDic.code+"\">"+degreeDic.name+"</option>";
					}
					
				}
				parent.$("#degree").empty().html(contentdegree);	
			}
		}
	});
}

/**
 * 初始化工种
 * @param provinceCode
 * @param areaCode
 * @param parentJobTypeId
 * @param jobTypeId
 * @returns
 */
function initJob(parentJobTypeId,jobTypeId){
	
	// 学历选中
	parent.$("select#degree").change(function(){
		// 选中事件
		var degree = parent.$('select#degree option:selected').val();
		var degreeName = parent.$('select#degree option:selected').text();
		//parent.$('#degree').val(degree);
		parent.$('#degreeName').val(degreeName);
		
    });
	
	
	// 性别选中事件
	parent.$("select#gender").change(function(){
		// 选中事件
		var gender = parent.$('select#gender option:selected').val();
		var genderName = parent.$('select#gender option:selected').text();
		//parent.$('#gender').val(gender);
		parent.$('#genderName').val(genderName);
		
    });
	
	
	// 初始化父级工种
	queryParentJobType(parentJobTypeId);
	
	
	// 二级工种选中事件
	parent.$("#secondId").change(function(){
		// 选中事件
		if(parent.$(this).selectivity('data')){
			var jobTypeId = parent.$(this).selectivity('data').id;
			var jobTypeName = parent.$(this).selectivity('data').text;
			parent.$('#jobTypeId').val(jobTypeId);
			parent.$('#jobTypeName').val(jobTypeName);
		}
    });
	
	
	// 二级工种联动
	parent.$("#firstId").change(function(){
		// 
		if(!parent.$(this).selectivity('data')){
			parent.$("#secondId").selectivity('clear');
			parent.$("#secondId").selectivity({
				allowClear: true,
			    items: [],
			    placeholder: '二级工种'
			});
		}else{
			var firstId = parent.$(this).selectivity('data').id;
			parent.$("#secondId").selectivity('clear');
			parent.$('#parentJobTypeId').val(firstId);
			$.ajax({
				url:"/jobType/queryByParentId",
				type:"get",
				async:false,
				dataType:"json",
				data:{parentId:firstId},
				success:function(data){
					if(data.code == 1){
						var dics = data.data;
						var infoList = [];
						var default_secondId;
						var default_secondName;
						for(var i=0; i<dics.length; i++){
							var dic = dics[i];
							var info = {};
							info.id = dic.id;
							info.text = dic.name;
							infoList.push(info);
						}
						parent.$("#secondId").selectivity({
							allowClear: true,
						    items: infoList,
						    placeholder: '二级工种'
						});
					}
				}
			});
		}
		
	});
	
	
	if(jobTypeId != undefined  && jobTypeId != null && parentJobTypeId != undefined  && parentJobTypeId != null){

		parent.$("#secondId").selectivity('clear');
		$.ajax({
			url:"/jobType/queryByParentId",
			type:"get",
			async:false,
			dataType:"json",
			data:{parentId:parentJobTypeId},
			success:function(data){
				if(data.code == 1){
					var dics = data.data;
					var infoList = [];
					var default_secondId;
					var default_secondName;
					for(var i=0; i<dics.length; i++){
						var dic = dics[i];
						var info = {};
						info.id = dic.id;
						info.text = dic.name;
						infoList.push(info);
						if(jobTypeId != undefined && jobTypeId == dic.id){
							 default_secondId  = dic.id;
							 default_secondName = dic.name;
						}
					}
					parent.$("#secondId").selectivity({
						allowClear: true,
					    items: infoList,
					    placeholder: '二级工种'
					});
					if(jobTypeId != undefined  && default_secondId != undefined){
						parent.$('#secondId').selectivity('data', { id: default_secondId, text: default_secondName });
					}
				}
			}
		});
	}
}


/**
 * 添加工种
 * @returns
 */
function addJob(){
	// 打开弹窗
	openDialog("add-job-dialog");
	// 时间框格式
	parent.$('.J-yearMonthPicker-single').datePicker({
        format: 'YYYY-MM-DD'
    });
	//  初始化工种
	initJob(null,null);
	
	initOtherSelect(null,null);
	
	// 初始化工作地区
	initArea();
	
	parent.$(".add-job-type-content").click(function(){
		
		
		var jobTypeName = parent.$("#jobTypeName").val();
		var jobTypeId = parent.$("#jobTypeId").val();
		var parentJobTypeId = parent.$("#parentJobTypeId").val();
		var workerCount = parent.$("#workerCount").val();
		var salary = parent.$("#salary").val();
		var requireTime = parent.$("#requireTime").val();
		var workArea = parent.$("#workAreaList").val();
		var requirement = parent.$("#requirement").val();
		var degree = parent.$("#degree").val();
		var gender = parent.$("#gender").val();
		var age = parent.$("#age").val();
		var major = parent.$("#major").val();
		var degreeName ="";
		var genderName ="";
		var workAreaName ='';
//		var parentCode = 0;
//		if(workArea > 0){
//			workAreaName = parent.$("#workAreaName").val();
//			parentCode = parent.$("#parentCode").val();
//		}
		if(degree > 0){
			degreeName = parent.$("#degreeName").val();
		}
		if(gender > 0){
			genderName = parent.$("#genderName").val();
		}
		
		if(parent.$("#workplaceCode").selectivity('data')){
			workAreaName = parent.$("#workplaceCode").selectivity('data').text;
			workArea = parent.$("#workplaceCode").selectivity('data').id;
		}
		
		var p_check = checkParameter();	
		
		// 判断工种是否已存在
		$(".tr-body").each(function(){
			
			var this_jobTypeId =  $(this).children("#jobTypeId").val();
			if(this_jobTypeId == jobTypeId){
				p_check = false;
				alert("此工种在列表种已存在！");
				return;
			}
			
		});
		
		
		if(p_check){
			top.closeDialog();
			
			var content = "<tr class=\"tr-body\">"+
						  "  <td id='jobTypeName'>"+jobTypeName+"</td>"+
						  "  <input id='jobTypeId' type=\"hidden\" name=\"jobTypeId\" value="+ jobTypeId +">" +
						  "  <input id='parentJobTypeId' type=\"hidden\" name=\"parentJobTypeId\" value="+ parentJobTypeId +">" +
						  "  <td id='workerCount'>"+workerCount+"</td>"+
						  "  <td id='requireTime'>"+requireTime+"</td>"+
						  "  <td id='salary'>"+salary+"</td>"+
						  "  <td id='workAreaName'>"+workAreaName+"</td>"+
						  "  <td id='genderName'>"+genderName+"</td>"+
						  "  <td id='degreeName'>"+degreeName+"</td>"+
						  "  <td id='age'>"+age+"</td>"+
						  "  <td id='major'>"+major+"</td>"+
						  "  <input id='workArea' type='hidden' name='workArea' value="+ workArea +">" +
						  //"  <input id='parentCode' type='hidden' name='parentCode' value="+ parentCode +">" +
						  "  <input id='degree' type='hidden' name='degree' value="+ degree +">" +
						  "  <input id='gender' type='hidden' name='gender' value="+ gender +">" +
						  "  <td id='requirement'>"+requirement+"</td>"+
						  "  <td><span class=\"des\" onclick=\"editJob(this)\">编辑</span><span class=\"delete\" onclick=\"deleteJob(this)\">移除</span></td>"+
						  "</tr>";
			$("table").append(content);
		}
		
	});
}

function checkParameter() {

	var jobTypeId = parent.$("#jobTypeId").val();
	var workerCount = parent.$("#workerCount").val();
	var salary = parent.$("#salary").val();
	var requireTime = parent.$("#requireTime").val();
	var workArea = parent.$("#workAreaList").val();
	var requirement = parent.$("#requirement").val();
	if (!jobTypeId) {
		alert("用工工种不能为空！");
		return false;
	}
	if (!workerCount) {
		alert("用工人数不能为空！");
		return false;
	}
	if (isNaN(workerCount)) {
		alert("请输入正确的用工人数！");
		return false;
	}
	if (workerCount<=0) {
		alert("用工人数不少于0！");
		return false;
	}

	return true;

}

function editJob(obj) {
	openDialog("add-job-dialog");
	parent.$('.J-yearMonthPicker-single').datePicker({
		format : 'YYYY-MM-DD'
	});
	
	var trobj = $(obj).parent().parent();
	var jobTypeName = trobj.children("#jobTypeName").html();
	var workerCount = trobj.children("#workerCount").html();
	var salary = trobj.children("#salary").html();
	var requireTime = trobj.children("#requireTime").html();
	var workArea = trobj.children("#workArea").val();
	var requirement = trobj.children("#requirement").html();
	var jobTypeId = trobj.children("#jobTypeId").val();
	//var parentCode = trobj.children("#parentCode").val();
	var workAreaName = trobj.children("#workAreaName").html();
	var parentJobTypeId = trobj.children("#parentJobTypeId").val();
	var age = trobj.children("#age").html();
    var degreeName = trobj.children("#degreeName").html();
	var genderName = trobj.children("#genderName").html();
	var degree = trobj.children("#degree").val();
	var gender = trobj.children("#gender").val();
	var major = trobj.children("#major").html();
    // provinceCode,areaCode,parentJobTypeId,jobTypeId
	initJob(parentJobTypeId, jobTypeId)
	// queryArea(parentCode, workArea);
	// queryJobType(parentJobTypeId,jobTypeId);
	initOtherSelect(gender,degree);
	// 初始化工作地区
	initArea(workArea,workAreaName);
	
	
	parent.$("#jobTypeName").val(jobTypeName);
	parent.$("#workerCount").val(workerCount);
	parent.$("#salary").val(salary);
	parent.$("#requireTime").val(requireTime);
	parent.$("#workArea").val(workArea);
	parent.$("#requirement").val(requirement);
	parent.$("#jobTypeId").val(jobTypeId);
	parent.$("#parentJobTypeId").val(parentJobTypeId);
//	parent.$("#parentCode").val(parentCode);
	parent.$("#workAreaName").val(workAreaName);
	parent.$("#age").val(age);
	parent.$("#degree").val(degree);
	parent.$("#gender").val(gender);
	parent.$("#major").val(major);
	parent.$("#degreeName").val(degreeName);
	parent.$("#genderName").val(genderName);
	
	parent.$(".add-job-type-content").click(function() {
		
		var workAreaName_ = "";
		var parentCode_ = 0;

		var jobTypeName_ = parent.$("#jobTypeName").val();
		var jobTypeId_ = parent.$("#jobTypeId").val();
		var parentJobTypeId_ = parent.$("#parentJobTypeId").val();
		var workerCount_ = parent.$("#workerCount").val();
		var salary_ = parent.$("#salary").val();
		var requireTime_ = parent.$("#requireTime").val();
		var workArea_ = parent.$("#workArea").val();
		var requirement_ = parent.$("#requirement").val();
		var age_ = parent.$("#age").val();
		var degree_ = parent.$("#degree").val();
		var gender_ = parent.$("#gender").val();
		var major_ = parent.$("#major").val();
		var degreeName_ = "";
		var genderName_ = "";
		
		if(degree_ > 0){
			degreeName_ = parent.$("#degreeName").val();
		}
		if(gender_ > 0){
			genderName_ = parent.$("#genderName").val();
		}
		
		if(parent.$("#workplaceCode").selectivity('data')){
			workAreaName_ = parent.$("#workplaceCode").selectivity('data').text;
			workArea_ = parent.$("#workplaceCode").selectivity('data').id;
		}

		var p_check = checkParameter();
		
		var jobIdCount = 0;
        $(".tr-body").each(function(){
			
			var this_jobTypeId =  $(this).children("#jobTypeId").val();
			if(this_jobTypeId == jobTypeId_){
				jobIdCount= jobIdCount+1;
			}
			
		});
        
        // 如果换了
        if(jobTypeId!=jobTypeId_ && jobIdCount>=1){
        	alert("此工种在列表种已存在！");
        	p_check = false;
        	return;
        }

		if (p_check) {

			top.closeDialog();

			trobj.children("#jobTypeName").html(jobTypeName_);
			trobj.children("#jobTypeId").val(jobTypeId_);
			trobj.children("#parentJobTypeId").val(parentJobTypeId_);
			trobj.children("#workerCount").html(workerCount_);
			trobj.children("#salary").html(salary_);
			trobj.children("#requireTime").html(requireTime_);
			trobj.children("#workArea").val(workArea_);
			trobj.children("#workAreaName").html(workAreaName_);
//			trobj.children("#parentCode").val(parentCode_);
			trobj.children("#requirement").html(requirement_);
			trobj.children("#age").html(age_);
			trobj.children("#degree").val(degree_);
			trobj.children("#gender").val(gender_);
			trobj.children("#major").html(major_);
			trobj.children("#degreeName").html(degreeName_);
			trobj.children("#genderName").html(genderName_);
		}

	});
}

/**
 * 打开弹窗
 * 
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

function addDemand(){

	var demand = {};
	
	if($("#companyName").selectivity('data') == null ||
			$("#companyName").selectivity('data') == undefined){
		alert("请选择企业！");
		return false;
	}
	
	demand.id=$("input:hidden[name='demandId']").val();
	demand.companyId =$("#companyName").selectivity('data').id;
	demand.description =$("#description").val();
	
	if (!demand.companyId  || demand.companyId ==0) {
		alert("请搜索已有企业！");
		return false;
	}
	if (!demand.description) {
		alert("备注说明不能为空！");
		return false;
	}
	//
	var demandJobList = [];
	$(".tr-body").each(function(){
		var demandJob = {};
		demandJob.id = $(this).children("#id").val();
		demandJob.jobTypeId =  $(this).children("#jobTypeId").val();
		demandJob.workerCount =  $(this).children("#workerCount").html();
		demandJob.salary =  $(this).children("#salary").html();
		demandJob.requireTime =  $(this).children("#requireTime").html();
		demandJob.workArea =  $(this).children("#workArea").val() == "undefined" ? "":$(this).children("#workArea").val() ;
		demandJob.requirement =  $(this).children("#requirement").html();
		demandJob.age =  $(this).children("#age").html();
		demandJob.degree =  $(this).children("#degree").val();
		demandJob.gender =  $(this).children("#gender").val();
		demandJob.major =  $(this).children("#major").html();
		demandJobList.push(demandJob);
	});
	
	demand.demandJobList = demandJobList;
	
	if(demandJobList.length==0){
		alert("用工工种不能为空！");
		return false;
	}
	
	var demandId = $("input:hidden[name='demandId']").val();
	
	var v_url = "/demand/saveDemand";
	if (demandId > 0){
		v_url = "/demand/editDemand";
	}
	
	$.ajax({
		url:v_url,
		type:"post",
		dataType:"json",
		contentType:"application/json",
		data:JSON.stringify(demand),
		success:function(data){
			if(data.code == 1){
				if (demandId > 0){
					alert("编辑成功！");
				}else{
					alert("新增成功！");
				}
				
				location.href="/signing/waiting";
			}
			else{
				if (demandId > 0){
					alert("编辑失败！原因："+data.msg);
				}else{
					alert("新增失败！原因："+data.msg);
				}
				
			}
		}
	});

}


//function initProvinceSelect(provinceCode){
//	$.ajax({
//		url:"/common/queryAllProvince",
//		type:"get",
//		dataType:"json",
//		async:false,
//		success:function(data){
//			if(data.code == 1){
//				var dics = data.data;
//				var content = "<option value=\"\">请选择</option>";
//				for(var i=0; i<dics.length; i++){
//					var dic = dics[i];
//					if(provinceCode != undefined && provinceCode == dic.code){
//						content += "<option value=\""+dic.code+"\" selected=\"selected\">"+dic.name+"</option>";
//					}else{
//						content += "<option value=\""+dic.code+"\">"+dic.name+"</option>";
//					}
//					
//				}
//				parent.$("#province").empty().html(content);
//			}
//		}
//	});
//}

function initArea(workArea,workAreaName){
	$.ajax({
		url:"/allAreaTree.json",
		type:"get",
		dataType:"json",
		global: false,
		success:function(data){
			if(data.code == 1){
				var infoList = data.data;
				parent.$("#workplaceCode").selectivity({
				    items: infoList,
				    allowClear: true,
				    placeholder: ''
				});
				
				if(workArea > 0){
					parent.$("#workplaceCode").selectivity('data',{id:workArea,"text":workAreaName});
				}
			}
		}
	});
}


