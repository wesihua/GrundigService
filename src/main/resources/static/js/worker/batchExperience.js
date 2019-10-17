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
	$("#add-worker").click(function(){
		addWorker();
	});
	$("#cancel").click(function(){
		historyBack();
		//location.href="/worker/index";
	});
	
	
	initSelect();
	// 初始化时间控件
	$('.J-yearMonthPicker-single').datePicker({
        format: 'YYYY-MM-DD'
    });
	$("#add-education").click(function(){
		openEducationDialog();
	});
	$("#add-experience").click(function(){
		openExperienceDialog();
	});
	
});

function historyBack(){
	var current = $("#current_rem").val();
	var workerName = $("#workerName_rem").val();
	var telephone = $("#telephone_rem").val();
	var idcard = $("#idcard_rem").val();
	var firstId = $("#firstId_rem").val();
	var secondId = $("#secondId_rem").val();
	var createUser = $("#createUser_rem").val();
	var source = $("#source_rem").val();
	var company = $("#company_rem").val();
	var beginTime = $("#beginTime_rem").val();
	var endTime = $("#endTime_rem").val();
	var minAge = $("#minAge_rem").val();
	var maxAge = $("#maxAge_rem").val();
	var sex = $("#sex_rem").val();
	var degree = $("#degree_rem").val();
	var expectSalary = $("#expectSalary_rem").val();
	var workYear = $("#workYear_rem").val();
	var discipline = $("#discipline_rem").val();
	var workStatus = $("#workStatus_rem").val();
	var agent = $("#agent_rem").val();
	location.href="/worker/index?workerName="+workerName+"&telephone="+telephone+"&idcard="+idcard
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
	top.$("#dialog").fadeIn(300);
	// 因为弹窗页面是重新渲染到top页面的。所以事件绑定只能在渲染之后。否则不起作用！
	top.$(".cancel-dialog").click(function(){
		top.closeDialog();
	});
	top.$("#close-dialog").click(function(){
		top.closeDialog();
	});
}

function openEducationDialog(){
	openDialog("dialog-education-content");
	parent.$('.J-yearMonthPicker-single').datePicker({
        format: 'YYYY-MM-DD'
    });
	parent.$(".add-education-content").click(function(){
		if(checkWorkerEducation(parent.$("#school").val(),parent.$("#degree").val())){
			top.closeDialog();
			var school = parent.$("#school").val();
			var degree = parent.$("#degree").find("option:selected").text() == "---请选择---" ? "" : parent.$("#degree").find("option:selected").text() ;
			var degree_value = parent.$("#degree").val();
			var beginTime = parent.$("#beginTime").val();
			var endTime = parent.$("#endTime").val();
			var discipline = parent.$("#discipline").val();
			// 拼接学历展示的内容
			var content = "<div class=\"history\">"+
								"	<span class=\"edit fa fa-edit\" name=\"edit-education-dialog\" title=\"编辑\"></span>"+
								"<span class=\"delete fa fa-close\" name=\"remove-education-dialog\" title=\"删除\"></span>"+
								"<ul>"+
								"	<li><span class=\"name\">学校</span> <span class=\"content\" name=\"school_text\">"+school+"</span></li>"+
								"	<li><span class=\"name\">学历</span> <span class=\"content\" name=\"degree_text\">"+degree+"</span></li>"+
								"	<input type=\"hidden\" name=\"degree_value\" value=\""+degree_value+"\" />"+
								"	<input type=\"hidden\" name=\"beginTime_value\" value=\""+beginTime+"\" />"+
								"	<input type=\"hidden\" name=\"endTime_value\" value=\""+endTime+"\" />"+
								"	<li><span class=\"name\">起止日期</span> <span class=\"content\" name=\"schoolTime_text\">"+beginTime+" 至 "+endTime+"</span></li>"+
								"	<li><span class=\"name\">专业名称</span> <span class=\"content\" name=\"discipline_text\">"+discipline+"</span></li>"+
								"</ul>"+
							"</div>";
			$("#education-list").append(content);
			// 绑定删除事件
			$("span[name=remove-education-dialog]").click(function(){
				$(this).parent().remove();
			});
			// 绑定编辑事件
			$("span[name=edit-education-dialog]").click(function(){
				var school = $(this).parent().find("span[name=school_text]").text();
				var degree_value = $(this).parent().find("input[name=degree_value]").val();
				var beginTime = $(this).parent().find("input[name=beginTime_value]").val();
				var endTime = $(this).parent().find("input[name=endTime_value]").val();
				var discipline = $(this).parent().find("span[name=discipline_text]").text();
				editEducationDialog(this,school,degree_value,beginTime,endTime,discipline);
			});
		}
		
	});
}

function editEducationDialog(ts,school,degree,beginTime,endTime,discipline){
	openDialog("dialog-education-content");
	parent.$('.J-yearMonthPicker-single').datePicker({
        format: 'YYYY-MM-DD'
    });
	parent.$("#school").val(school);
	parent.$("#degree").val(degree);
	parent.$("#beginTime").val(beginTime);
	parent.$("#endTime").val(endTime);
	parent.$("#discipline").val(discipline);
	
	parent.$(".add-education-content").click(function(){
		if(checkWorkerEducation(parent.$("#school").val(),parent.$("#degree").val())){
			top.closeDialog();
			$(ts).parent().find("span[name=school_text]").text(parent.$("#school").val());
			var degree_text = parent.$("#degree").find("option:selected").text() == "---请选择---" ? "" : parent.$("#degree").find("option:selected").text();
			var degree_value = parent.$("#degree").val();
			$(ts).parent().find("span[name=degree_text]").text(degree_text);
			$(ts).parent().find("input[name=degree_value]").val(degree_value);
			var beginTime = parent.$("#beginTime").val();
			var endTime = parent.$("#endTime").val();
			var discipline = parent.$("#discipline").val();
			$(ts).parent().find("span[name=schoolTime_text]").text(beginTime +" 至 "+endTime);
			$(ts).parent().find("input[name=beginTime_value]").val(beginTime);
			$(ts).parent().find("input[name=endTime_value]").val(endTime);
			$(ts).parent().find("span[name=discipline_text]").text(discipline);
		}
		
	});
}

function openExperienceDialog(){
	openDialog("dialog-experience-content");
	parent.$('.J-yearMonthPicker-single').datePicker({
		format: 'YYYY-MM-DD'
	});
	parent.$(".add-experience-content").click(function(){
		if(checkWorkerExperience(parent.$("#exp_company").val(),parent.$("#exp_position").val())){
			top.closeDialog();
			var companyName = parent.$("#exp_company").val();
			var position = parent.$("#exp_position").val();
			var beginTime = parent.$("#exp_beginTime").val();
			var endTime = parent.$("#exp_endTime").val();
			var salary = parent.$("#exp_salary").find("option:selected").text() == "---请选择---" ? "" : parent.$("#exp_salary").find("option:selected").text();
			var salary_value = parent.$("#exp_salary").val();
			var description = parent.$("#exp_description").val();
			
			var content = "<div class=\"history\">"+
							"	<span class=\"edit fa fa-edit\" name=\"edit-experience-dialog\" title=\"编辑\"></span>"+
							"	<span class=\"delete fa fa-close\" name=\"remove-experience-dialog\" title=\"删除\"></span>"+
							"	<ul>"+
							"		<li><span class=\"name\">工作公司</span> <span class=\"content\" name=\"companyName_text\">"+companyName+"</span>"+
							"		</li>"+
							"		<li><span class=\"name\">职位</span> <span class=\"content\" name=\"position_text\">"+position+"</span>"+
							"		</li>"+
							"		<li><span class=\"name\">起止时间</span> <span class=\"content\" name=\"exp_time\">"+beginTime+" 至 "+endTime+"</span>"+
							"		</li>"+
							"		<li><span class=\"name\">月工资</span> <span class=\"content\" name=\"salary_text\">"+salary+"</span>"+
							"		</li>"+
							"		<li><span class=\"name\">工作内容</span> <span class=\"content\" name=\"description_text\">"+description+"</span>"+
							"		</li>"+
								"	<input type=\"hidden\" name=\"salary_value\" value=\""+salary_value+"\" />"+
								"	<input type=\"hidden\" name=\"beginTime_value\" value=\""+beginTime+"\" />"+
								"	<input type=\"hidden\" name=\"endTime_value\" value=\""+endTime+"\" />"+
							"	</ul>"+
							"</div>";
			$("#experience-list").append(content);
			// 绑定删除事件
			$("span[name=remove-experience-dialog]").click(function(){
				$(this).parent().remove();
			});
			// 绑定编辑事件
			$("span[name=edit-experience-dialog]").click(function(){
				var companyName = $(this).parent().find("span[name=companyName_text]").text();
				var position = $(this).parent().find("span[name=position_text]").text();
				var beginTime = $(this).parent().find("input[name=beginTime_value]").val();
				var endTime = $(this).parent().find("input[name=endTime_value]").val();
				var salary_value = $(this).parent().find("input[name=salary_value]").val();
				var description = $(this).parent().find("span[name=description_text]").text();
				editExperienceDialog(this,companyName,position,beginTime,endTime,salary_value,description);
			});
		}
		
	});
}

function editExperienceDialog(ts,companyName,position,beginTime,endTime,salary_value,description){
	openDialog("dialog-experience-content");
	parent.$('.J-yearMonthPicker-single').datePicker({
		format: 'YYYY-MM-DD'
	});
	parent.$("#exp_company").val(companyName);
	parent.$("#exp_position").val(position);
	parent.$("#exp_beginTime").val(beginTime);
	parent.$("#exp_endTime").val(endTime);
	parent.$("#exp_salary").val(salary_value);
	parent.$("#exp_description").val(description);
	
	parent.$(".add-experience-content").click(function(){
		if(checkWorkerExperience(parent.$("#exp_company").val(),parent.$("#exp_position").val())){
			top.closeDialog();
			$(ts).parent().find("span[name=companyName_text]").text(parent.$("#exp_company").val());
			$(ts).parent().find("span[name=position_text]").text(parent.$("#exp_position").val());
			var salary_text = parent.$("#exp_salary").find("option:selected").text() == "---请选择---" ? "" : parent.$("#exp_salary").find("option:selected").text();
			var salary_value = parent.$("#exp_salary").val();
			$(ts).parent().find("span[name=salary_text]").text(salary_text);
			$(ts).parent().find("input[name=salary_value]").val(salary_value);
			var beginTime = parent.$("#exp_beginTime").val();
			var endTime = parent.$("#exp_endTime").val();
			var description = parent.$("#exp_description").val();
			$(ts).parent().find("span[name=exp_time]").text(beginTime +" 至 "+endTime);
			$(ts).parent().find("input[name=beginTime_value]").val(beginTime);
			$(ts).parent().find("input[name=endTime_value]").val(endTime);
			$(ts).parent().find("span[name=description_text]").text(description);
		}
		
	});
}

function initSelect(){
	var types = "expect_salary";
	$.ajax({
		url:"/common/queryDicByTypes",
		type:"get",
		async:true,
		dataType:"json",
		data:{types:types},
		success:function(data){
			if(data.code == 1){
				var all = data.data;
				// 组装期望薪资
				var expectSalaryDics = all.expect_salary;
				var contentexpectSalary = "<option value=\"\">---请选择---</option>";
				for(var i=0; i<expectSalaryDics.length; i++){
					var expectSalaryDic = expectSalaryDics[i];
					contentexpectSalary += "<option value=\""+expectSalaryDic.code+"\">"+expectSalaryDic.name+"</option>";
				}
				$("#exp_salary").empty().html(contentexpectSalary);
			}
		}
	});
}


function addWorker(){
	// 收集教育经历
	/**
	var educationList = [];
	$("#education-list").find(".history").each(function(){
		var education = {};
		education.school = $(this).find("span[name=school_text]").text();
		education.degree = $(this).find("input[name=degree_value]").val();
		education.beginTime = $(this).find("input[name=beginTime_value]").val();
		education.endTime = $(this).find("input[name=endTime_value]").val();
		education.discipline = $(this).find("span[name=discipline_text]").text();
		educationList.push(education);
	});
	*/
	var workerIds = $("#workerIds").val();
	// 收集工作经历
	var experienceList = [];
	$("#experience-list").find(".history").each(function(){
		var experience = {};
		experience.company = $(this).find("span[name=companyName_text]").text();
		experience.position = $(this).find("span[name=position_text]").text();
		experience.salary = $(this).find("input[name=salary_value]").val();
		experience.beginTime = $(this).find("input[name=beginTime_value]").val();
		experience.endTime = $(this).find("input[name=endTime_value]").val();
		experience.description = $(this).find("span[name=description_text]").text();
		experienceList.push(experience);
	});
	
	$.ajax({
		url:"/worker/batchInsertExperience",
		type:"get",
		dataType:"json",
		data:{experienceJson:JSON.stringify(experienceList),workerIds:workerIds},
		success:function(data){
			if(data.code == 1){
				alert("批量新增人才工作经历成功！");
				historyBack();
			}
			else{
				alert("批量新增人才工作经历失败！原因："+data.msg);
			}
		}
	});
}


function checkWorkerEducation(school,degree){
	if(school == null || school.length == 0){
		alert("学校不能为空！");
		return false;
	}
	if(school.length > 100){
		alert("学校长度不能超过100！");
		return false;
	}
	if(degree == null || degree.length == 0){
		alert("学历不能为空！");
		return false;
	}
	return true;
}

function checkWorkerExperience(company,position){
	if(company == null || company.length == 0){
		alert("公司不能为空！");
		return false;
	}
	if(company.length > 100){
		alert("公司长度不能超过100！");
		return false;
	}
	if(position == null || position.length == 0){
		alert("职位不能为空！");
		return false;
	}
	if(position.length > 50){
		alert("职位长度不能超过50！");
		return false;
	}
	return true;
}
