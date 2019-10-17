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
	$("#add-company").click(function(){
		addCompany();
	});
	$("#download").click(function(){
		var companyName = $("#companyName").val();
		window.open("/company/export?companyName="+companyName);
	});
});

/**
 * 查询
 * @returns
 */
function query(currentPage){
	var companyName = $("#companyName").val();
	$.ajax({
		url:"/company/list",
		type:"get",
		data:{name:companyName,pageNumber:currentPage},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var firmArr = data.data.data;
				var tableContent="";
				for(var i=0; i<firmArr.length; i++){
					var firm = firmArr[i];
					tableContent+=  "<tr>"+
									"	<td>"+firm.name+"</td>"+
									"	<td>"+firm.industry+"</td>"+
									"	<td>"+(firm.creditNumber == null ? "" : firm.creditNumber)+"</td>"+
									"	<td>"+(firm.bank == null ? "" : firm.bank)+"</td>"+
									"	<td>"+(firm.bankAccount == null ? "" : firm.bankAccount)+"</td>"+
									"	<td>"+firm.count+"</td>"+
									"	<td>"+firm.contactName+"</td>"+
									"	<td>"+firm.contactPhone+"</td>"+
									"	<td>"+firm.address+"</td>"+
									"	<td>"+firm.createTime+"</td>"+
									"	<td><span class=\"des\" onClick=\"updateCompany("+firm.id+")\">编辑</span><span class=\"delete\" onClick=\"deleteCompany("+firm.id+")\">移除</span></td>"+
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

function addCompany(){
	openDialog("add-company-dialog");
	top.$(".add-company").click(function(){
		var companyName = top.$("#companyName").val();
		var industry = parent.$("#industry").val();
		var contactName = parent.$("#contactName").val();
		var contactPhone = parent.$("#contactPhone").val();
		var address = parent.$("#address").val();
		var description = parent.$("#description").val();
		var creditNumber = parent.$("#creditNumber").val();
		var bank = parent.$("#bank").val();
		var bankAccount = parent.$("#bankAccount").val();
		
		if(companyName == null || companyName.length == 0){
			alert("企业名称不能为空！");
			return false;
		}
		if(companyName.length > 100){
			alert("企业名称长度不能超过100个字！");
			return false;
		}
		if(!contactName){
			alert("联系人不能为空！");
			return false;
		}
		if(contactName.length > 30){
			alert("联系人长度不能超过30个字！");
			return false;
		}
		if(!contactPhone){
			alert("联系电话不能为空！");
			return false;
		}
		if(contactPhone.length > 20){
			alert("联系电话长度不能超过20个字！");
			return false;
		}
		if(creditNumber && creditNumber.length > 50){
			alert("企业信用代码长度不能超过50个字！");
			return false;
		}
		if(bank && bank.length > 50){
			alert("开户行长度不能超过50个字！");
			return false;
		}
		if(bankAccount && bankAccount.length > 20){
			alert("银行卡号长度不能超过50个字！");
			return false;
		}
		if(address && address.length > 255){
			alert("企业地址长度不能超过50个字！");
			return false;
		}
		if(description && description.length > 255){
			alert("备注长度不能超过50个字！");
			return false;
		}
		if(industry && industry.length > 100){
			alert("所属行业长度不能超过50个字！");
			return false;
		}
		$.ajax({
			url:"/company/saveCompany",
			type:"get",
			dataType:"json",
			data:{name:companyName,industry:industry,address:address,contactName:contactName,
				contactPhone:contactPhone,description:description,creditNumber:creditNumber,bank:bank,bankAccount:bankAccount},
			success:function(data){
				if(data.code == 1){
					top.closeDialog();
					alert("新增企业成功！");
					query(1);
				}
				else{
					alert("新增企业失败！原因："+data.msg);
				}
			}
		});
	});
}

function updateCompany(companyId){
	$.ajax({
		url:"/company/queryDetail",
		type:"get",
		data:{companyId:companyId},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var firm = data.data;
				// 打开页面
				openDialog("add-company-dialog");
				parent.$("#companyName").val(firm.name);
				parent.$("#industry").val(firm.industry);
				parent.$("#address").val(firm.address);
				parent.$("#contactName").val(firm.contactName);
				parent.$("#contactPhone").val(firm.contactPhone);
				parent.$("#description").val(firm.description);
				parent.$("#creditNumber").val(firm.creditNumber);
				parent.$("#bank").val(firm.bank);
				parent.$("#bankAccount").val(firm.bankAccount);
				
				top.$(".add-company").click(function(){
					var companyId = firm.id;
					var companyName = top.$("#companyName").val();
					var industry = parent.$("#industry").val();
					var contactName = parent.$("#contactName").val();
					var contactPhone = parent.$("#contactPhone").val();
					var address = parent.$("#address").val();
					var description = parent.$("#description").val();
					var creditNumber = parent.$("#creditNumber").val();
					var bank = parent.$("#bank").val();
					var bankAccount = parent.$("#bankAccount").val();
					
					if(companyName == null || companyName.length == 0){
						alert("企业名称不能为空！");
						return false;
					}
					if(companyName.length > 100){
						alert("企业名称长度不能超过100个字！");
						return false;
					}
					if(!contactName){
						alert("联系人不能为空！");
						return false;
					}
					if(contactName.length > 30){
						alert("联系人长度不能超过30个字！");
						return false;
					}
					if(!contactPhone){
						alert("联系电话不能为空！");
						return false;
					}
					if(contactPhone.length > 20){
						alert("联系电话长度不能超过20个字！");
						return false;
					}
					if(creditNumber && creditNumber.length > 50){
						alert("企业信用代码长度不能超过50个字！");
						return false;
					}
					if(bank && bank.length > 50){
						alert("开户行长度不能超过50个字！");
						return false;
					}
					if(bankAccount && bankAccount.length > 20){
						alert("银行卡号长度不能超过50个字！");
						return false;
					}
					if(address && address.length > 255){
						alert("企业地址长度不能超过50个字！");
						return false;
					}
					if(description && description.length > 255){
						alert("备注长度不能超过50个字！");
						return false;
					}
					if(industry && industry.length > 100){
						alert("所属行业长度不能超过50个字！");
						return false;
					}
					$.ajax({
						url:"/company/saveCompany",
						type:"get",
						dataType:"json",
						data:{id:companyId,name:companyName,industry:industry,address:address,contactName:contactName,
							contactPhone:contactPhone,description:description,creditNumber:creditNumber,bank:bank,bankAccount:bankAccount},
						success:function(data){
							if(data.code == 1){
								top.closeDialog();
								alert("更新企业成功！");
								query(1);
							}
							else{
								alert("更新企业失败！原因："+data.msg);
							}
						}
					});
				});
				
			}
		}
	});
	
}

function deleteCompany(companyId){
	var b = confirm("是否删除该企业？");
	if(b){
		$.ajax({
			url:"/company/deleteCompany",
			type:"get",
			dataType:"json",
			data:{companyId:companyId},
			success:function(data){
				if(data.code == 1){
					alert("删除企业成功！");
					query(1);
				}
				else{
					alert("删除企业失败！原因："+data.msg);
				}
			}
		});
	}
}