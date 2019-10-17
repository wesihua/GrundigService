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
	// 加载角色下拉框
	loadAllRole();
	// 进入页面自动查询
	query(1);
	//按钮事件绑定
	$("#query-bottom2").click(function(){
		query(1);
	});
	$("#add-user").click(function(){
		addUser();
	});
	$("#download").click(function(){
		var userName = $("#userName").val();
		var realName = $("#realName").val();
		var roleId = $("#roleId").val();
		window.open("/user/export?userName="+userName+"&realName="+realName+"&roleId="+roleId);
	});
});

/**
 * 查询
 * @returns
 */
function query(currentPage){
	var userName = $("#userName").val();
	var realName = $("#real_name").val();
	var roleId = $("#roleId").val();
	$.ajax({
		url:"/user/list",
		type:"get",
		data:{userName:userName,realName:realName,roleId:roleId,pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var userArr = data.data.data;
				var tableContent="";
				for(var i=0; i<userArr.length; i++){
					var user = userArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+user.userName+"</td>"+
									"	<td>"+user.password+"</td>"+
									"	<td>"+user.realName+"</td>"+
									"	<td>"+user.roleName+"</td>"+
									"	<td>"+user.createTime+"</td>"+
									"	<td><span class=\"des\" onClick=\"updateUser("+user.id+")\">编辑</span><span class=\"delete\" onClick=\"deleteUser("+user.id+")\">移除</span></td>"+
									"</tr>";
				}
				$("tbody").empty().append(tableContent);
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

function loadAllRole(){
	$.ajax({
		url:"/role/queryAll",
		type:"get",
		dataType:"json",
		global: false,
		success:function(data){
			if(data.code == 1){
				var content = "<option value=\"\">---请选择角色---</option>";
				var roleList = data.data;
				for(var i=0; i<roleList.length; i++){
					var role = roleList[i];
					content += "<option value=\""+role.id+"\">"+role.name+"</option>";
				}
				$("#roleId").empty().html(content);
				$("#roleId_add").empty().html(content);
				$("#roleId_edit").empty().html(content);
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
	top.$("#dialog").fadeIn(300);
	// 因为弹窗页面是重新渲染到top页面的。所以事件绑定只能在渲染之后。否则不起作用！
	top.$(".cancel-dialog").click(function(){
		top.closeDialog();
	});
	top.$("#close-dialog").click(function(){
		top.closeDialog();
	});
}

function addUser(){
	openDialog("add-user-dialog");
	top.$(".add-user").click(function(){
		var userName = top.$("#userName_add").val();
		var realName = parent.$("#realName").val();
		var roleId = parent.$("#roleId_add").val();
		var password = parent.$("#password").val();
		var repassword = parent.$("#repassword").val();
		if(userName == null || userName.length == 0){
			alert("用户名不能为空！");
			return false;
		}
		if(userName.length > 50){
			alert("用户名长度不能超过50个字！");
			return false;
		}
		if(!realName){
			alert("真实用户名不能为空！");
			return false;
		}
		if(realName.length > 50){
			alert("真实用户名长度不能超过50个字！");
			return false;
		}
		if(!password){
			alert("密码不能为空！");
			return false;
		}
		if(password.length > 50){
			alert("密码不能超过50个字！");
			return false;
		}
		if(!repassword){
			alert("确认密码不能为空！");
			return false;
		}
		if(password != repassword){
			alert("确认密码不正确，两次输入不一致！");
			return false;
		}
		$.ajax({
			url:"/user/addUser",
			type:"get",
			dataType:"json",
			data:{userName:userName,realName:realName,roleId:roleId,password:password},
			success:function(data){
				if(data.code == 1){
					top.closeDialog();
					alert("新增用户成功！");
					query(1);
				}
				else{
					alert("新增用户失败！原因："+data.msg);
				}
			}
		});
	});
}

function updateUser(userId){
	$.ajax({
		url:"/user/queryById",
		type:"get",
		data:{userId:userId},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var user = data.data;
				// 打开页面
				openDialog("edit-user-dialog");
				parent.$("#userName_edit").val(user.userName);
				parent.$("#realName_edit").val(user.realName);
				parent.$("#roleId_edit").val(user.roleId);
				parent.$("#password_edit").val(user.password);
				
				top.$(".add-user").click(function(){
					var userId = user.id;
					var userName = parent.$("#userName_edit").val();
					var realName = parent.$("#realName_edit").val();
					var roleId = parent.$("#roleId_edit").val();
					var password = parent.$("#password_edit").val();
					if(!userName){
						alert("用户名不能为空！");
						return false;
					}
					if(userName.length > 50){
						alert("用户名长度不能超过50个字！");
						return false;
					}
					if(!realName){
						alert("真实用户名不能为空！");
						return false;
					}
					if(realName.length > 50){
						alert("真实用户名长度不能超过50个字！");
						return false;
					}
					if(!password){
						alert("密码不能为空！");
						return false;
					}
					if(password.length > 50){
						alert("密码不能超过50个字！");
						return false;
					}
					$.ajax({
						url:"/user/updateUser",
						type:"get",
						dataType:"json",
						data:{id:userId,userName:userName,realName:realName,roleId:roleId,password:password},
						success:function(data){
							if(data.code == 1){
								top.closeDialog();
								alert("更新用户成功！");
								query(1);
							}
							else{
								alert("更新用户失败！原因："+data.msg);
							}
						}
					});
				});
				
			}
		}
	});
	
}

function deleteUser(userId){
	var b = confirm("是否删除该用户？");
	if(b){
		$.ajax({
			url:"/user/deleteUser",
			type:"get",
			dataType:"json",
			data:{userId:userId},
			success:function(data){
				if(data.code == 1){
					alert("删除用户成功！");
					query(1);
				}
				else{
					alert("删除用户失败！原因："+data.msg);
				}
			}
		});
	}
}