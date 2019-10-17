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
	query();
	//加载一级工种下拉框
	parentJobTypeInfo();
	
	// 点击事件
	$("#edit-jobtype").click(function(){
		$("#jobtype-content").addClass("on");
		$(".button-control").show();
	});
	$("#public-bottom2").click(function(){
		query();
		$("#jobtype-content").removeClass("on");
		$(".button-control").hide();
	});
	
	$("#add-jobtype-btn").click(function(){
		saveJobtype();
	});
	$("#import-jobtype").click(function(){
		$.ajax({
			url:"/jobtype.json",
			type:"get",
			dataType:"json",
			success:function(data){
				var jobtypeArray = [];
				var arr = data.data;
				for(var i=0; i<arr.length; i++){
					var firstInfo = arr[i];
					var secondArr = firstInfo.subLevelModelList;
					for(var j=0; j<secondArr.length; j++){
						var secondInfo = secondArr[j];
						var info = {};
						info.id = secondInfo.code;
						info.name = secondInfo.name;
						info.parentId = 0;
						info.level = 1;
						jobtypeArray.push(info);
						var thirdArr = secondInfo.subLevelModelList;
						for(var k=0; k<thirdArr.length; k++){
							var thirdInfo = thirdArr[k];
							var info2 = {};
							info2.id = thirdInfo.code;
							info2.name = thirdInfo.name;
							info2.parentId = secondInfo.code;
							info2.level = 2;
							jobtypeArray.push(info2);
						}
						
					}
				}
				console.log(jobtypeArray);
				var obj = {};
				obj.jobTypeList = jobtypeArray;
				
				$.ajax({
					url:"/jobType/importJobType",
					contentType: "application/json",
					type:"post",
					dataType:"json",
					data: JSON.stringify(jobtypeArray),
					success:function(data){
						if(data.code == 1){
							alert("导入成功！");
						}
					}
				});
			}
		});
	});
});

/**
 * 加载一级工种
 * @returns
 */
function parentJobTypeInfo(){
	$.ajax({
		url:"/jobType/queryRootJobType",
		type:"get",
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var content = "<option value=\"\">---请选择---</option>";
				for(var i=0; i<data.data.length; i++){
					var jobtype = data.data[i];
					content += "<option value=\""+jobtype.id+"\">"+jobtype.name+"</option>";
				}
				parent.$("#parentId").empty().append(content);
			}
		}
	});
}
/**
 * 查询
 * @returns
 */
function query(){
	$.ajax({
		url:"/jobType/queryTree",
		type:"get",
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var jobtypeArr = data.data;
				var tableContent="";
				for(var i=0; i<jobtypeArr.length; i++){
					var jobtype = jobtypeArr[i];
					tableContent+= "<div class=\"g-block\">"+
										"<h2>"+"<span onClick=\"editJobtype('"+jobtype.id+"','"+jobtype.name+"')\">"+jobtype.name+"</span>"+"<span class=\"fa fa-close\" onClick=\"deleteJobtype('"+jobtype.id+"',1)\"></span>"+
										"</h2>"+
										"<ul>";
					if(jobtype.children.length > 0){
						for(var j=0; j< jobtype.children.length; j++){
							var subJobtype = jobtype.children[j];
							tableContent+= "	<li><span class=\"name\" onClick=\"editJobtype('"+subJobtype.id+"','"+subJobtype.name+"')\">"+subJobtype.name+"</span><span class=\"fa fa-close\" onClick=\"deleteJobtype("+subJobtype.id+")\"></span></li>";
						}
						
					}
					tableContent+=		"</ul>"+
									"</div>";
				}
				$("#jobtype-content").empty().html(tableContent);
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

/**
 * 保存角色
 * @returns
 */
function saveJobtype(){
	// 先刷新下拉框
	parentJobTypeInfo();
	openDialog("add-jobtype");
	top.$("#level").change(function(){
		if(this.value == 2){
			top.$("#parentId_div").show();
		}
		else{
			top.$("#parentId_div").hide();
		}
	});
	top.$(".save-jobtype").click(function(){
		var jobtypeName = top.$("#jobtypeName").val();
		var level = top.$("#level").val();
		var parentId = top.$("#parentId").val();
		if(!jobtypeName){
			alert("名称不能为空！");
			return false;
		}
		if(jobtypeName.length > 50){
			alert("名称长度不能超过50个字！");
			return false;
		}
		$.ajax({
			url:"/jobType/saveJobType",
			type:"get",
			dataType:"json",
			data:{name:jobtypeName,level:level,parentId:parentId},
			success:function(data){
				if(data.code == 1){
					top.closeDialog();
					alert("工种新增成功！");
					query();
				}
				else{
					alert("工种新增失败！原因："+data.msg);
				}
			}
		});
	});
}

function editJobtype(jobtypeId,jobtypeName){
	// 编辑状态下才弹出编辑框
	if($("#jobtype-content").hasClass("on")){
		openDialog("update-jobtype");
		
		top.$("#jobtypeName").val(jobtypeName)
		top.$(".save-jobtype").click(function(){
			var jobtypeName = top.$("#jobtypeName").val();
			if(!jobtypeName){
				alert("工种名不能为空！");
				return false;
			}
			if(jobtypeName.length > 50){
				alert("工种名长度不能超过50个字！");
				return false;
			}
			$.ajax({
				url:"/jobType/saveJobType",
				type:"get",
				dataType:"json",
				data:{id:jobtypeId,name:jobtypeName},
				success:function(data){
					if(data.code == 1){
						top.closeDialog();
						alert("工种更改成功！");
						query();
						$("#jobtype-content").addClass("on");
						$(".button-control").show();
					}
					else{
						alert("工种更改失败！原因："+data.msg);
					}
				}
			});
		});
	}
}
/**
 * 删除角色
 * @param roleId
 * @returns
 */
function deleteJobtype(jobtypeId,flag){
	var b = null;
	if(flag){
		b = confirm("删除该工种将会删除其下所有子工种，确定删除该工种？");
	}
	else{
		b = confirm("确定删除该工种？");
	}
	if(b){
		$.ajax({
			url:"/jobType/removeJobType",
			type:"get",
			dataType:"json",
			data:{jobTypeId:jobtypeId},
			success:function(data){
				if(data.code == 1){
					alert("工种删除成功！");
					query();
					$("#jobtype-content").addClass("on");
					$(".button-control").show();
				}
				else{
					alert("工种删除失败！原因："+data.msg);
				}
			}
		});
	}
// event.stopPropagation();
}

