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
	});
	$("#exportResume").click(function(){
		var workerId = $("#workerId").val();
		downloadResume(workerId);
	});
	
	//加载人才信息
	loadWorkerInfo();
});

function downloadResume(workerId){
	window.open("/word/export?workerId="+workerId);
}

/**
 * 加载人才信息
 * @param workerId
 * @returns
 */
function loadWorkerInfo(){
	var workerId = $("#workerId").val();
	$.ajax({
		url:"/worker/queryDetail",
		type:"get",
		dataType:"json",
		data:{workerId:workerId},
		success:function(data){
			if(data.code == 1){
				var worker = data.data;
				$("#name").text(worker.name);
				$("#telephone").text(worker.telephone);
				$("#email").text(worker.email);
				$("#idcard").text(worker.idcard);
				$("#workYear").text(worker.workYear);
				$("#maritalStatus").text(worker.maritalStatusName);
				$("#expectSalary").text(worker.expectSalaryName);
				$("#workStatus").text(worker.workStatusName);
				$("#languageLevel").text(worker.languageLevelName);
				$("#nightWork").text(worker.nightWorkName);
				$("#birthplace").text(worker.birthplaceName);
				$("#workplace").text(worker.workplaceName);
				$("#nation").text(worker.nationName);
				$("#title").text(worker.title);
				$("#sex").text(worker.sexName);
				$("#position").text(worker.position);
				$("#address").text(worker.address);
				$("#birthday").text(worker.birthday);
				$("#age").text(worker.age);
				$("#workExpect").text(worker.workExpect);
				$("#jobtype").text(worker.jobtypeName);
				$("#current_degree").text(worker.degreeName);
				$("#profile").text(worker.profile);
				$("#description").text(worker.description);
				$("#bank").text(worker.bank);
				$("#bankAccount").text(worker.bankAccount);
				$("#agent").text(worker.agent);
				$("#createUser").text("录入人员："+$("#createUserName").val());
				$("#createTime").text("录入时间："+worker.createTime);
				// 加载教育经历
				displayEducationList(worker.educationList);
				// 加载工作经历
				displayExperienceList(worker.experienceList);
			}
		}
	});
}


/**
 * 展示教育经历列表
 * @param educationList
 * @returns
 */
function displayEducationList(educationList){
	var content = "";
	for(var i=0; i<educationList.length; i++){
		var education = educationList[i];
		content += "<div class=\"history\">"+
//			"	<span class=\"edit fa fa-edit\" name=\"edit-education-dialog\" title=\"编辑\"></span>"+
//			"<span class=\"delete fa fa-close\" name=\"remove-education-dialog\" title=\"删除\"></span>"+
			"<ul>"+
			"	<li><span class=\"name\">学校</span> <span class=\"content\" name=\"school_text\">"+education.school+"</span></li>"+
			"	<li><span class=\"name\">学历</span> <span class=\"content\" name=\"degree_text\">"+education.degreeName+"</span></li>"+
			"	<input type=\"hidden\" id=\"educationId\" value=\""+education.id+"\" />"+
			"	<input type=\"hidden\" name=\"degree_value\" value=\""+education.degree+"\" />"+
			"	<input type=\"hidden\" name=\"beginTime_value\" value=\""+(education.beginTime == null ? '' : education.beginTime)+"\" />"+
			"	<input type=\"hidden\" name=\"endTime_value\" value=\""+(education.endTime == null ? '' : education.endTime)+"\" />"+
			"	<li><span class=\"name\">起止日期</span> <span class=\"content\" name=\"schoolTime_text\">"+(education.beginTime == null ? '' : education.beginTime)+" 至 "+(education.endTime == null ? '' : education.endTime)+"</span></li>"+
			"	<li><span class=\"name\">专业名称</span> <span class=\"content\" name=\"discipline_text\">"+(education.discipline == null ? '' : education.discipline)+"</span></li>"+
			"</ul>"+
		"</div>";
	}
	
	$("#education-list").append(content);
}
/**
 * 展示工作经历列表
 * @param educationList
 * @returns
 */
function displayExperienceList(experienceList){
	var content = "";
	for(var i=0; i<experienceList.length; i++){
		var experience = experienceList[i];
		content += "<div class=\"history\">"+
//			"	<span class=\"edit fa fa-edit\" name=\"edit-experience-dialog\" title=\"编辑\"></span>"+
//			"	<span class=\"delete fa fa-close\" name=\"remove-experience-dialog\" title=\"删除\"></span>"+
			"	<ul>"+
			"		<li><span class=\"name\">工作公司</span> <span class=\"content\" name=\"companyName_text\">"+experience.company+"</span>"+
			"		</li>"+
			"		<li><span class=\"name\">职位</span> <span class=\"content\" name=\"position_text\">"+experience.position+"</span>"+
			"		</li>"+
			"		<li><span class=\"name\">起止时间</span> <span class=\"content\" name=\"exp_time\">"+(experience.beginTime == null ? '' : experience.beginTime)+" 至 "+(experience.endTime == null ? '' : experience.endTime)+"</span>"+
			"		</li>"+
			"		<li><span class=\"name\">月工资</span> <span class=\"content\" name=\"salary_text\">"+(experience.salaryName == null ? '' : experience.salaryName)+"</span>"+
			"		</li>"+
			"		<li><span class=\"name\">工作内容</span> <span class=\"content\" name=\"description_text\">"+(experience.description == null ? '' : experience.description)+"</span>"+
			"		</li>"+
				"	<input type=\"hidden\" id=\"experienceId\" value=\""+experience.id+"\" />"+
				"	<input type=\"hidden\" name=\"salary_value\" value=\""+(experience.salary == null ? '' : experience.salary)+"\" />"+
				"	<input type=\"hidden\" name=\"beginTime_value\" value=\""+(experience.beginTime == null ? '' : experience.beginTime)+"\" />"+
				"	<input type=\"hidden\" name=\"endTime_value\" value=\""+(experience.endTime == null ? '' : experience.endTime)+"\" />"+
			"	</ul>"+
			"</div>";
	}
	
	$("#experience-list").append(content);
}

