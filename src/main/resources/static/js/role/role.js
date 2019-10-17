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
	$("#add-role").click(function(){
		saveRole();
	});
	$("#download").click(function(){
		var roleName = $("#roleName").val();
		window.open("/role/export?name="+roleName);
	});
});

/**
 * 查询
 * @returns
 */
function query(currentPage){
	var roleName = $("#roleName").val();
	$.ajax({
		url:"/role/list",
		type:"get",
		data:{name:roleName,pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var roleArr = data.data.data;
				var tableContent="";
				for(var i=0; i<roleArr.length; i++){
					var role = roleArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+role.name+"</td>"+
									"	<td>"+role.userCount+"</td>"+
									"	<td>"+role.createTime+"</td>"+
									"	<td>"+
									"		<span class=\"des\" onClick=\"editRole('"+role.id+"','"+role.name+"')\">编辑名称</span>"+
									"		<span class=\"des\" onClick=\"editMenuRight('"+role.id+"')\">权限管理</span> <span class=\"des\" onClick=\"deleteRole('"+role.id+"')\">移除</span>"+
									"	</td>"+
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
function saveRole(){
	openDialog("dialog-content");
	top.$(".save-role").click(function(){
		var roleName = top.$("#roleName").val();
		if(!roleName){
			alert("角色名不能为空！");
			return false;
		}
		if(roleName.length > 50){
			alert("角色名长度不能超过50个字！");
			return false;
		}
		$.ajax({
			url:"/role/addRole",
			type:"get",
			dataType:"json",
			data:{name:roleName},
			success:function(data){
				if(data.code == 1){
					top.closeDialog();
					alert("角色新增成功！");
					query(1);
				}
				else{
					alert("角色新增失败！原因："+data.msg);
				}
			}
		});
	});
}

function editRole(roleId,roleName){
	openDialog("dialog-content");
	top.$("#roleName").val(roleName)
	top.$(".save-role").click(function(){
		var roleName = top.$("#roleName").val();
		if(!roleName){
			alert("角色名不能为空！");
			return false;
		}
		if(roleName.length > 50){
			alert("角色名长度不能超过50个字！");
			return false;
		}
		$.ajax({
			url:"/role/updateRole",
			type:"get",
			dataType:"json",
			data:{id:roleId,name:roleName},
			success:function(data){
				if(data.code == 1){
					top.closeDialog();
					alert("角色名更改成功！");
					query(1);
				}
				else{
					alert("角色名更改失败！原因："+data.msg);
				}
			}
		});
	});
}
/**
 * 删除角色
 * @param roleId
 * @returns
 */
function deleteRole(roleId){
	var b = confirm("确定删除本条数据？");
	if(b){
		$.ajax({
			url:"/role/deleteRole",
			type:"get",
			dataType:"json",
			data:{roleId:roleId},
			success:function(data){
				if(data.code == 1){
					alert("角色删除成功！");
					query(1);
				}
				else{
					alert("角色删除失败！原因："+data.msg);
				}
			}
		});
	}
}
/**
 * 编辑菜单权限
 * @param roleId
 * @returns
 */
function editMenuRight(roleId){
	// 暂存roleId
	$("#roleId").val(roleId);
	$.ajax({
		url:"/role/queryMenuTreeByRoleId",
		type:"get",
		dataType:"json",
		data:{roleId:roleId},
		success:function(data){
			if(data.code == 1){
				var menuList = data.data;
				var content = "";
				for(var i=0; i<menuList.length; i++){
					var menu = menuList[i];
					if(menu.children.length > 0){
						content += "<div class=\"select\">"+
									"	<div class=\"s\">"+
									"		<div class=\"workType\">"+
									"			<input type=\"checkbox\" name=\"parentMenu\" id=\""+menu.id+"\" "+(menu.selected == 0 ? "" : "checked=\"checked\"")+"/><span>"+menu.name+"</span>"+
									"		</div>"+
									"	</div>";
						for(var j=0; j<menu.children.length; j++){
							var subMenu = menu.children[j];
							content += "	<div class=\"s two\">"+
										"		<div class=\"workType\">"+
										"			<input type=\"checkbox\" name=\"subMenu_"+menu.id+"\" id=\""+subMenu.id+"\" "+(subMenu.selected == 0 ? "" : "checked=\"checked\"")+" /><span>"+subMenu.name+"</span>"+
										"		</div>"+
										"	</div>";
						}
									
						content += "</div>";
					}
					else{
						content += "<div class=\"select\">"+
									"	<div class=\"s\">"+
									"		<div class=\"workType\">"+
									"			<input type=\"checkbox\" id=\""+menu.id+"\" "+(menu.selected == 0 ? "" : "checked=\"checked\"")+" /><span>"+menu.name+"</span>"+
									"		</div>"+
									"	</div>"+
									"</div>";
					}
				}
				$("#menu-content").empty().html(content);
				openDialog("dialog-menu-content");
			}
			else{
				alert("菜单权限失败！原因："+data.msg);
			}
			
			parent.$("input[type=checkbox]").click(function(){
				var name = this.name;
				if(name.indexOf("parentMenu") != -1){
					var id = this.id;
					if($(this).is(":checked")){
						parent.$("input[name=subMenu_"+id+"]").prop('checked',true);
				    }else{
				    	parent.$("input[name=subMenu_"+id+"]").prop('checked',false);
				    }
				}
				if(name.indexOf("subMenu") != -1){
					var parentId = name.substring(8);
					if($(this).is(":checked")){
						parent.$("#"+parentId).prop('checked',true);
				    }
				}
			});
			parent.$(".save-menuright").click(function(){
				saveMenuRight();
			});
		}
	});
}

/**
 * 保存菜单权限
 * @returns
 */
function saveMenuRight(){
	var roleId = $("#roleId").val();
	// 获取menuIds
	var menuIds = [];
	parent.$("input[type=checkbox]:checked").each(function(){
		menuIds.push(this.id);
	});
	if(menuIds.lendth == 0){
		alert("请选择菜单！");
		return false;
	}
	$.ajax({
		url:"/role/modifyMenuRight",
		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		data:JSON.stringify({roleId:roleId,menuIds:menuIds}),
		success:function(data){
			if(data.code == 1){
				top.closeDialog();
				alert("菜单权限保存成功！");
			}
			else{
				alert("菜单权限保存失败！原因："+data.msg);
			}
		}
	});
}


