$(function(){
	initSelect();
	$("#save").click(function(){
		addWorker();
	});
});

function addWorker(){
	var worker = {};
	worker.name = $("#name").val();
	worker.telephone = $("#telephone").val();
	worker.email = $("#email").val();
	worker.idcard = $("#idcard").val();
	//worker.workYear = $("#workYear").val();
	worker.maritalStatus = $("#marital_status").val();
	worker.expectSalary = $("#expect_salary").val();
	worker.workStatus = $("#work_status").val();
	//worker.languageLevel = $("#languageLevel").val();
	//worker.nightWork = $("#nightWork").val();
	//worker.birthplaceCode = $("#birthplaceCode").val();
	//worker.workplaceCode = $("#workplaceCode").val();
	
	//worker.nation = $("#nation").val();
	worker.title = $("#title").val();
	worker.sex = $("#sex").val();
	worker.position = $("#position").val();
	worker.address = $("#address").val();
	//worker.birthday = $("#birthday").val();
	//worker.workExpect = $("#workExpect").val();
	//worker.jobtypeName = $("#jobtype").val();
	worker.degree = $("#degree").val();
	worker.profile = $("#profile").val();
	worker.description = $("#description").val();
	
	if(checkWorker(worker)){
		$.ajax({
			url:"/worker/addOutterWorker",
			type:"post",
			dataType:"json",
			contentType:"application/json",
			data:JSON.stringify(worker),
			success:function(data){
				if(data.code == 1){
					alert("您的求职信息录入成功！近期将由专人处理并与您电话联系，请保持电话通畅！");
					$("#name").val("");
					$("#telephone").val("");
					$("#email").val("");
					$("#idcard").val("");
					$("#marital_status").val("");
					$("#expect_salary").val("");
					$("#work_status").val("");
					$("#title").val("");
					$("#sex").val(0);
					$("#position").val("");
					$("#address").val("");
					$("#degree").val("");
					$("#profile").val("");
					$("#description").val("");
				}
				else{
					alert("新增人才信息失败！原因："+data.msg);
				}
			}
		});
	}
	
}

function initSelect(){
	var types = "expect_salary,work_status";
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
				var contentexpectSalary = "<option value=\"\">选择期望薪资</option>";
				for(var i=0; i<expectSalaryDics.length; i++){
					var expectSalaryDic = expectSalaryDics[i];
					contentexpectSalary += "<option value=\""+expectSalaryDic.code+"\">"+expectSalaryDic.name+"</option>";
				}
				$("#expect_salary").empty().html(contentexpectSalary);
				// 组装工作状态
				var workStatusDics = all.work_status;
				var contentWorkStatus = "<option value=\"\">选择工作状态</option>";
				for(var i=0; i<workStatusDics.length; i++){
					var workStatusDic = workStatusDics[i];
					contentWorkStatus += "<option value=\""+workStatusDic.code+"\">"+workStatusDic.name+"</option>";
				}
				$("#work_status").empty().html(contentWorkStatus);
			}
		}
	});
}

function checkWorker(worker){
	if(worker.name == null || worker.name.length == 0){
		alert("姓名不能为空！");
		return false;
	}
	if(worker.name.length > 50){
		alert("姓名长度不能超过50个字！");
		return false;
	}
	if(worker.telephone == null || worker.telephone.length == 0){
		alert("联系电话不能为空！");
		return false;
	}
	if(worker.telephone.length > 50){
		alert("电话号码长度不能超过50个字！");
		return false;
	}
	if(worker.idcard && worker.idcard.length > 50){
		alert("身份证号长度不能超过50个字！");
		return false;
	}
	if(worker.email && worker.email.length > 100){
		alert("邮箱长度不能超过100！");
		return false;
	}
	if(worker.position && worker.position.length > 50){
		alert("期望职位长度不能超过50！");
		return false;
	}
	if(worker.title && worker.title.length > 50){
		alert("职称长度不能超过50！");
		return false;
	}
	
	if(worker.address && worker.address.length > 200){
		alert("联系地址长度不能超过200！");
		return false;
	}
	if(worker.profile && worker.profile.length > 500){
		alert("个人简介长度不能超过500！");
		return false;
	}
	if(worker.description && worker.description.length > 500){
		alert("备注长度不能超过500！");
		return false;
	}
	return true;
}