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
	querySignDetail();
	
});

function querySignDetail(){
	var demandId = $("input:hidden[name='demandId']").val();
	$.ajax({
		url:"/demand/demandDetail",
		type:"get",
		data:{demandId:demandId},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var state = data.data.state;
				var tableContent="";
				var firmArr = data.data.demandJobList;
				
				$(".undertokeTime").text(data.data.undertakeTime);
				$(".totalIncome").text(data.data.totalIncome);
				$(".undertokeUserName").text(data.data.undertakeUserName);
				$(".companyName").text(data.data.companyName);
				$(".description").text(data.data.description);
				
//				if(state == 2 || state == 3){
//					$(".undertokeTime").parent().show();
//					$(".totalIncome").parent().show();
//					$(".undertokeUserName").parent().show();
//				}
				$(".signing-botton").hide();
				// 查看是否有已分配人数
				var isHaveAssign = false;
				for(var i=0; i<firmArr.length; i++){
					var firm = firmArr[i];
					if(firm.assignCount > 0){
						isHaveAssign = true;
						$(".signing-botton").show();
						break;
					}
				}
				
				// 处理中
				if(state == 1){
					tableContent+= "<tr>"+
									"	<th>用工工种</th>"+
									"	<th>到岗日期</th>"+
									"	<th>月工资（元）</th>"+
									"	<th>工作地区</th>"+
									"	<th>用工要求</th>"+
									"	<th>用工人数</th>"+
									"	<th>候选人</th>"+
									"	<th>操作</th>"+
									"</tr>";
					for(var i=0; i<firmArr.length; i++){
						var firm = firmArr[i];
						tableContent+=  "<tr>"+
										"	<td>"+firm.jobTypeName+"</td>"+
										"	<td>"+(firm.requireTime == null ? "":firm.requireTime)+"</td>"+
										"	<td>"+firm.salary+"</td>"+
										"	<td>"+firm.workAreaName +"</td>"+
										"	<td>"+firm.requirement+"</td>"+
										"	<td>"+firm.workerCount+"</td>"+
										"	<td><span class=\"des assignCount\" onClick=\"showAssignList("+firm.id+")\">"+firm.assignCount+"</span></td>"+
										"	<td><span class=\"des\" onClick=\"assignWorker("+firm.id+")\">分配用工</span></td>"+
										"</tr>";
					}
				}
				if(state == 2){
					
					if(isHaveAssign){
						
						tableContent += "<tr>"+
										"	<th>用工工种</th>"+
										"	<th>到岗日期</th>"+
										"	<th>工作地区</th>"+
										"	<th>用工要求</th>"+
										"	<th>用工人数</th>"+
										"	<th>已签约人数</th>"+
										"	<th>候选人</th>"+
										"	<th>操作</th>"+
										"</tr>";
						
						for(var i=0; i<firmArr.length; i++){
							var firm = firmArr[i];
							tableContent+=  "<tr>"+
											"	<td>"+(firm.jobTypeName == null ? '':firm.jobTypeName)+"</td>"+
											"	<td>"+(firm.requireTime == null ? '':firm.requireTime)+"</td>"+
											"	<td>"+(firm.workAreaName== null ? '':firm.workAreaName) +"</td>"+
											"	<td>"+(firm.requirement== null ? '':firm.requirement)+"</td>"+
											"	<td>"+(firm.workerCount== null ? 0:firm.workerCount)+"</td>"+
											"	<td><span class=\"des signingCount\" onClick=\"showSigningList("+firm.id+")\">"+firm.signingCount+"</span></td>"+
							                "	<td><span class=\"des assignCount\" onClick=\"showAssignList("+firm.id+")\">"+firm.assignCount+"</span></td>"+
							                "	<td><span class=\"des\" onClick=\"assignWorker("+firm.id+")\">分配用工</span></td>"+
											"</tr>";
						}
						
					} else {
						
						tableContent += "<tr>"+
										"	<th>用工工种</th>"+
										"	<th>到岗日期</th>"+
										"	<th>工作地区</th>"+
										"	<th>用工要求</th>"+
										"	<th>用工人数</th>"+
										"	<th>已签约人数</th>"+
										"	<th>操作</th>"+
										"</tr>";
						for(var i=0; i<firmArr.length; i++){
							var firm = firmArr[i];
							tableContent+=  "<tr>"+
											"	<td>"+(firm.jobTypeName == null ? '':firm.jobTypeName)+"</td>"+
											"	<td>"+(firm.requireTime == null ? '':firm.requireTime)+"</td>"+
											"	<td>"+(firm.workAreaName== null ? '':firm.workAreaName) +"</td>"+
											"	<td>"+(firm.requirement== null ? '':firm.requirement)+"</td>"+
											"	<td>"+firm.workerCount+"</td>"+
											"	<td><span class=\"des signingCount\" onClick=\"showSigningList("+firm.id+")\">"+firm.signingCount+"</span></td>"+
											"	<td><span class=\"des\" onClick=\"assignWorker("+firm.id+")\">分配用工</span></td>"+
											"</tr>";
						}
					}
				}
				$("#jobType-list-table").empty().append(tableContent);
				
				$("#jobType-list-table").find("span.signingCount").each(function(){
					 if($(this).html() == 0){
						 $(this).removeAttr("onclick");
						 $(this).removeClass("des");
					 }
				});
				
				$("#jobType-list-table").find("span.assignCount").each(function(){
					 if($(this).html() == 0){
						 $(this).removeAttr("onclick");
						 $(this).removeClass("des");
					 }
				});
				
			}
		}
	});
}



/**
 * 分配用工
 */
function assignWorker(demandJobId){
	// 打开弹框
	openDialog("add-worker-box-wp-div");
	
	// 搜索工人 按钮
	parent.$(".select-worker").click(function(){
    	queryWorkerList(1,null);
    });
	
	queryWorkerList(1,demandJobId);
	
	$("input[name='jobTypeId']").val(demandJobId)
	
	
	parent.$("#confirm-addWorker-botton").on("click",function(){
		  
    	//var jobTypeId = $("input[name='jobTypeId']").val();
    	var workers = [];
    	var flag = false;
    	parent.$(".order-worder").each(function(){
    		if(flag){
    			return;
    		}
    		$that = $(this).find(".select-input");
    		var orderWorker = {};
    		var signSalary = $that.find(".signSalary").val();
			if(signSalary!=""&&signSalary.length>0){
				orderWorker.signSalary=signSalary;
    		}
//			else{
//    			alert("签约月工资不能为空");
//    			flag=true;
//    			return;
//    		}
    		var arriveWorkTime = $that.find(".arriveWorkTime").val();
    		if(arriveWorkTime!=""&&arriveWorkTime.length>0){
    			orderWorker.arriveWorkTime = arriveWorkTime;
    		}
    		
    		var businessIncome= $that.find(".businessIncome").val();
    		if(businessIncome!=""&&businessIncome.length>0){
    			orderWorker.businessIncome = businessIncome;
    		}else{
    			alert("业务收入不能为空");
    			flag=true;
    			return;
    		}
    		
    		var collectUserIncome= $that.find(".collectUserIncome").val();
    		if(collectUserIncome!=""&&collectUserIncome.length>0){
    			orderWorker.collectUserIncome = collectUserIncome;
    		}
//    		else{
//    			alert("采集收入不能为空");
//    			flag=true;
//    			return;
//    		}
    		
    		
    		var undertakeUserIncome= $that.find(".undertakeUserIncome").val();
    		if(undertakeUserIncome!=""&&undertakeUserIncome.length>0){
    			orderWorker.undertakeUserIncome = undertakeUserIncome;
    		}else{
    			alert("接单收入不能为空");
    			flag=true;
    			return;
    		}
    		
    		orderWorker.workerId = $(this).attr("data");
    		workers.push(orderWorker);
    	});
    	
    	if(flag){
    		return;
    	}
    	
    	if(workers.length == 0){
    		alert("您未选择任何用工！");
			flag=true;
    		return;
    	}
    	
    	// 关闭弹框
    	top.closeDialog();
    	
		$.ajax({
			url:"/demand/addOrderWorker",
			type:"post",
			dataType:"json",
			async:false,
			data:{json:JSON.stringify(workers),demandJobId:demandJobId},
			success:function(data){
				if(data.code == 1){
					alert("添加用工信息成功！");
					querySignDetail();
				}
				else{
					alert("添加用工信息失败！原因："+data.msg);
				}
			}
		});
	
    });
	
}

// 查工人
function queryWorkerList(pageNum,demandJobId){


    var workerName = parent.$("#workerName").val();
	var telephone = parent.$("#telephone").val();
	var idcard = parent.$("#idcard").val();
	
	// 
	var demandId = $("input[name=demandId]").val();

    $.ajax({
		url:"/worker/assignList",
		type:"get",
		data:{name:workerName,telephone:telephone,idcard:idcard,pageNumber:pageNum,demandId:demandId,demandJobId:demandJobId},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var workerArr = data.data.data;
				var tableContent="";
				for(var i=0; i<workerArr.length; i++){
					var worker = workerArr[i];
					tableContent+=  "<tr>"+
									"	<td class='worker-name'>"+worker.name+"</td>"+
									"	<td class='worker-idcard'>"+(worker.idcard == null ? "" : worker.idcard)+"</td>"+
									//"	<td>"+worker.birthplaceName+"</td>"+
									"	<td>"+(worker.jobtypeName == null ? "" : worker.jobtypeName)+"</td>"+
									"	<td>"+worker.expectSalaryName+"</td>"+
									"	<td>"+worker.createUserName+"</td>"+
									"	<td><input class='check-input' type=\"checkbox\" name=\"check\" value="+worker.id+" ></td>"+
									"</tr>";
				}
				
				parent.$("#query-worker-list").empty().append(tableContent);
				parent.$("#query-worker-totalCount").text(data.data.totalCount+"个结果");
				parent.$("#query-worker-pagination1").pagination({
					currentPage: data.data.pageNumber,
					totalPage: data.data.pageCount,
					callback: function(current) {
						queryWorkerList(current,null);
					}
				});
				
				// 如果右侧已选中
				parent.$("#query-worker-list input[type='checkbox']").each(function(){
					
					var input_obj = $(this);
					var input_id = input_obj.val();
					    
					parent.$(".result-area ul #delete-worker-x").each(function(){
						var span_id = $(this).attr("data");
						if(input_id == span_id){
							$(input_obj).prop("checked",true);
						}
				    });
			    });
				
				parent.$('.check-input').click(function(){

			    	$that = $(this);
			    	var aaa = $that.prop("checked");
			    	var id = $that.val();
			    	if(aaa){
			    		var name = $that.parents('tr').find('.worker-name').text();
			    		var idcard = $that.parents('tr').find('.worker-idcard').text();
			    		var content = "<li class=\"order-worder\" id=\"check_"+ id +"\"" + " data="+ id +">"+
								            "<div class=\"select-name\">" +
								            	"<span>"+name+"（"+ idcard +"）</span>" +
								            	"<span style=\"float:right;\" id=\"delete-worker-x\" class=\"fa fa-close\"" + " data="+ id +" >&nbsp&nbsp;</span>" +
								            "</div>"+
								            "<div class=\"select-title\">"+
								                "<span class=\"a\">签约月工资(元)</span>"+
								                "<span class=\"b\">到岗日期</span>"+
								                "<span class=\"c\">业务收入(元)</span>"+
								                "<span class=\"b\">采集金额(元)</span>"+
								                "<span class=\"c\">接单金额(元)</span>"+
								            "</div>"+
								            "<div class=\"select-input\">"+
								                "<input name='xiaoshu' class=\"a signSalary\" type=\"text\" value=''/>"+
								                "<div class=\"c-datepicker-date-editor c-datepicker-single-editor J-yearMonthPicker-single mt10\">"+
												"<input autocomplete=\"off\" type=\"text\" placeholder=\"选择到岗日期\"  class=\"b arriveWorkTime\" id=\"requireTime\" name=\"createTime\"/>"+
										        "</div>"+
								                "<input name='xiaoshu' class=\"c businessIncome\" type=\"text\" value=''/>"+
								                "<input name='xiaoshu' class=\"c collectUserIncome\" type=\"text\" value='10'/>"+
								                "<input name='xiaoshu' class=\"c undertakeUserIncome\" type=\"text\" value='20'/>"+
								           "</div>"+
								        "</li>";
			    	}else{
			    		parent.$("#check_"+id+"").remove();
			    	}
			    	
			    	parent.$(".result-area ul").append(content);
			    	
			    	parent.$(".result-area ul").on("click","#delete-worker-x",function(){
			    		var id = $(this).attr("data");
			    		parent.$("#check_"+id+"").remove();
			    		
			    		//check   $(tr).find("select[name='measures']").val();
			    		
			    		parent.$("#query-worker-list").find("input[value='"+id+"']").prop("checked",false);
			    	});
			    	
			    	parent.$(".result-area ul").on("keyup afterpaste","input[name='xiaoshu']",function(){
			    		
			    		if(this.value.length==1){
			    			this.value=this.value.replace(/[^1-9]/g,'')
			    		}else{
			    			this.value = this.value.replace(/[^\d.]/g,''); 
			    			this.value = this.value.replace(/^\./g,'');
			    			this.value = this.value.replace(/\.{2,}/g,'');
			    			this.value = this.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
			    			this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
			    		}
			    	});
			    
			    	parent.$('.J-yearMonthPicker-single').datePicker({
			    		format : 'YYYY-MM-DD'
			    	});
			    
			    });
			}
		}
    });
}


/**
 * 需求单详情
 * @param demandId
 * @returns
 */
function workerList(jobTypeId){
	window.location.href = "/signing/workerList?source=0&jobTypeId=" + jobTypeId;
}

/**
 * 查询签约信息
 * @param demandId
 * @returns
 */
function signingDetail(){
	var demandId = $("input[name=demandId]").val();

	$.ajax({
		url:"/demand/demandAssignList",
		type:"get",
		dataType:"json",
		data:{demandId:demandId},
		success:function(data){
			if(data.code == 1){
                $("#companyName").text("客户名称:" + data.data.demand.companyName );
                $("#demandNumber").text("需求单号:" + data.data.demand.demandNumber);
                $("#workerCount").text("本次签约人数:" + data.data.workerCount);
                $("#income").text("本次签约总金额:" + data.data.income +"(元)");
               
                var firmArr = data.data.orderWorkerList;
                var tableContent = "";
      
                tableContent += "<tr>" +
                    "	<th>用工姓名</th>" +
                    "	<th>身份证号</th>" +
                    "	<th>联系电话</th>" +
                    "	<th>擅长工种</th>" +
                    "	<th>采集人</th>" +
                    "	<th>签约月工资（元）</th>" +
                    "	<th>到岗日期</th>" +
                    "	<th width='120'>业务收入（元）</th>" +
                    "	<th width='120'>采集收入（元）</th>" +
                    "	<th width='120'>接单收入（元）</th>" +
                    "</tr>";

                for (var i = 0; i < firmArr.length; i++) {
                    var firm = firmArr[i];
                    var worker = firm.worker;
                    tableContent += "<tr>" +
                        "	<td>" + worker.name + "</td>" +
                        "	<td>" + worker.idcard + "</td>" +
                        "	<td>" + worker.telephone + "</td>" +
                        "	<td>" + (worker.jobtypeName == null ? "" : worker.jobtypeName) + "</td>" +
                        "	<td>" + (worker.createUserName == null ? "" : worker.createUserName) + "</td>" +
                        "	<td>" + (firm.signSalary== null? "":firm.signSalary) + "</td>" +
                        "	<td>" + (firm.arriveWorkTime == null ? "" : firm.arriveWorkTime) + "</td>" +
                        "	<td width='120'>" + (firm.businessIncome ==null ?"":firm.businessIncome)+ "</td>" +
                        "	<td width='120'>" + (firm.collectUserIncome == null ? "":firm.collectUserIncome)+ "</td>" +
                        "	<td width='120'>" + (firm.undertakeUserIncome == null ? "":firm.undertakeUserIncome )+ "</td>" +
                        "</tr>";
                }
                
                
                if(firmArr.length > 0){
                	openDialog("signing-detail");
                    parent.$("#signing-detail-table").empty().append(tableContent);
                    
                    parent.$('#confirm-signing').click(function(){
                    	signing();
                    });
                    
                    
                }else{
                	alert("暂无分配用工！");
                }
			}
			else{
				alert("查询待签约详情失败！原因："+data.msg);
			}
		}
	});
}


/**
 * 签约
 * @param demandId
 * @returns
 */
function signing() {
	var demandId = $("input[name=demandId]").val();

	$.ajax({
		url : "/demand/signing",
		type : "get",
		dataType : "json",
		data : {
			demandId : demandId
		},
		success : function(data) {
			if (data.code == 1) {
				
				alert("签约成功！");
				if(data.data >=1){
					window.location.href="/signing/signed";
				} else {
					window.location.href="/signing/processing";
				}
				toSignedPage();
			} else {
				alert("签约失败！原因：" + data.msg);
			}
		}
	});

}


function toSignedPage(){
	
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

function showAssignList(jobTypeId){
	var url = "/demand/orderWorkerAssignList";
	var text = "本次已分配用工";
    $.ajax({
        url: url,
        type: "get",
        data: { demandJobId: jobTypeId},
        dataType: "json",
        success: function (data) {
            if (data.code == 1) {

                var firmArr = data.data.orderWorkerList;
                var tableContent = "";
                $("#order-worker-list-span").text(text);
               // $(".worker-count").text("（需求"+ data.data.demandJob.workerCount +"人）");
                tableContent += "<tr>" +
                    "	<th width='62'>用工姓名</th>" +
                    "	<th width='40'>籍贯</th>" +
                    "	<th width='120'>身份证号</th>" +
                    "	<th width='93'>联系电话</th>" +
                    "	<th width='90'>擅长工种</th>" +
                    "	<th width='90'>采集人</th>" +
                    "	<th width='90'>签约月工资(元)</th>" +
                    "	<th width='96'>到岗日期</th>" +
                    "	<th width='80'>业务收入（元）</th>" +
                    "	<th width='80'>采集收入（元）</th>" +
                    "	<th width='80'>接单收入（元）</th>" +
                    "	<th width='100'>操作</th>" +
                    "</tr>";

                for (var i = 0; i < firmArr.length; i++) {
                    var firm = firmArr[i];
                    var worker = firm.worker;
                    tableContent += "<tr>" +
                        "   <input id=\"id\" type=\"hidden\" value="+ firm.id +">" +
                        "	<td id=\"id\">" + worker.name + "</td>" +
                        "	<td>" + worker.birthplaceName + "</td>" +
                        "	<td>" + worker.idcard + "</td>" +
                        "	<td>" + worker.telephone + "</td>" +
                        "	<td>" + (worker.jobtypeName == null ? "" : worker.jobtypeName) + "</td>" +
                        "	<td>" + (worker.createUserName == null ? "" : worker.createUserName) + "</td>" +
                        "	<td id=\"signSalary\">" + (firm.signSalary==null?"":firm.signSalary) + "</td>" +
                        "	<td id=\"arriveWorkTime\">" + (firm.arriveWorkTime == null ? "" : firm.arriveWorkTime) + "</td>" +
                        "	<td id=\"businessIncome\" width='80'>" + (firm.businessIncome == null ? "" : firm.businessIncome) + "</td>" +
                        "	<td id=\"collectUserIncome\" width='80'>" + (firm.collectUserIncome == null ? "" : firm.collectUserIncome) + "</td>" +
                        "	<td id=\"undertakeUserIncome\" width='80'>" + (firm.undertakeUserIncome == null ? "" : firm.undertakeUserIncome) + "</td>" +
                        "   <td><span class='delete' id='delete-worker'>移除</span><span class='edit' id='edit-worker'>编辑</span><span class='edit' style ='display:none' id='confirm-edit'>确定</span></td>" +
                        "</tr>";
                    
                    // <span class=\"edit\" id=\"edit-worker\">编辑</span>
                }
                
                if(firmArr.length > 0){
                	openDialog("yifenpei-list");
                    parent.$("#worker-list-table").empty().append(tableContent);
                }else{
                	alert("暂无分配用工！");
                }
                // 分配工人的操作
                orderWorkerOperate();
            }
        }
    });
}

function orderWorkerOperate(){
	// 删除           
    parent.$("#worker-list-table").on("click","#delete-worker",function(){
    	deleteOrderWorker(this);
    });
    
    // 点击编辑
    parent.$("#worker-list-table").on("click","#edit-worker",function(){
    	 $(this).parents('td').children('#confirm-edit').show();
    	 $(this).hide();
    	 
    	// 签约工资变成可输入框
    	var signSalary = $(this).parents('tr').children('#signSalary').text();
    	var signSalaryTd = $(this).parents('tr').children('#signSalary');
		var signSalaryTxt = $("<input id='signSalary-input' type='text'>").val(signSalary);
		signSalaryTd.text("");
		signSalaryTd.append(signSalaryTxt);
		
		// 业务收入变成可输入框
    	var businessIncome = $(this).parents('tr').children('#businessIncome').text();
    	var businessIncomeTd = $(this).parents('tr').children('#businessIncome');
    	var businessIncomeTxt = $("<input id='businessIncome-input' type='text'>").val(businessIncome);
    	businessIncomeTd.text("");
    	businessIncomeTd.append(businessIncomeTxt);
    	
    	// 采集收入
    	var collectUserIncome = $(this).parents('tr').children('#collectUserIncome').text();
    	var collectUserIncomeTd = $(this).parents('tr').children('#collectUserIncome');
    	var collectUserIncomeTxt = $("<input id='collectUserIncome-input' type='text'>").val(collectUserIncome);
    	collectUserIncomeTd.text("");
    	collectUserIncomeTd.append(collectUserIncomeTxt);
    	
    	// 接单收入
    	var undertakeUserIncome = $(this).parents('tr').children('#undertakeUserIncome').text();
    	var undertakeUserIncomeTd = $(this).parents('tr').children('#undertakeUserIncome');
    	var undertakeUserIncomeTxt = $("<input id='undertakeUserIncome-input' type='text'>").val(undertakeUserIncome);
    	undertakeUserIncomeTd.text("");
    	undertakeUserIncomeTd.append(undertakeUserIncomeTxt);
    	
    	// 到岗日期变成可输入框
    	var arriveWorkTime = $(this).parents('tr').children('#arriveWorkTime').text();
    	var arriveWorkTimeTd = $(this).parents('tr').children('#arriveWorkTime');
    	
    	var arriveWorkTimeDev = $('<div class="c-datepicker-date-editor c-datepicker-single-editor J-yearMonthPicker-single mt10">');
     	
     	var arriveWorkTimeTxt = $("<input id='arriveWorkTime-input' type='text' style='width:100px' placeholder='选择到岗日期'  onchange=''>").val(arriveWorkTime);
     	arriveWorkTimeTd.text("");
     	arriveWorkTimeDev.append(arriveWorkTimeTxt);
     	arriveWorkTimeTd.append(arriveWorkTimeDev);
     	parent.$('.J-yearMonthPicker-single').datePicker({
     		format : 'YYYY-MM-DD'
     	});
     	
     	parent.$("#worker-list-table").on("keyup afterpaste","#businessIncome-input,#signSalary-input,#undertakeUserIncome-input,#collectUserIncome-input",function(){
    		
    		if(this.value.length==1){
    			this.value=this.value.replace(/[^1-9]/g,'')
    		}else{
    			this.value = this.value.replace(/[^\d.]/g,''); 
    			this.value = this.value.replace(/^\./g,'');
    			this.value = this.value.replace(/\.{2,}/g,'');
    			this.value = this.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    			this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    		}
    	});
    });
    
    
 
    // 确认编辑
	parent.$("#worker-list-table").on("click","#confirm-edit",function(){
		
		var id = $(this).parents('tr').children('#id').val();
        	
        // 隐藏确定  恢复编辑按钮	
       	$(this).parents('td').children('#edit-worker').show();
       	$(this).hide();
       	 // 取值
       	var signSalary = $(this).parents('tr').find('#signSalary-input').val();
       	$(this).parents('tr').children('#signSalary-input').remove();
       	$(this).parents('tr').children('#signSalary').text(signSalary);

       	var businessIncome = $(this).parents('tr').find('#businessIncome-input').val();
       	$(this).parents('tr').children('#businessIncome').text(businessIncome);;
       	$(this).parents('tr').children('#businessIncome-input').remove();
       	
       	var arriveWorkTime = $(this).parents('tr').find('#arriveWorkTime-input').val();
       	$(this).parents('tr').children('#arriveWorkTime-input').remove();
       	$(this).parents('tr').children('#arriveWorkTime').text(arriveWorkTime);
      
       	var undertakeUserIncome = $(this).parents('tr').find('#undertakeUserIncome-input').val();
       	$(this).parents('tr').children('#undertakeUserIncome-input').remove();
       	$(this).parents('tr').children('#undertakeUserIncome').text(undertakeUserIncome);
       	
       	var collectUserIncome = $(this).parents('tr').find('#collectUserIncome-input').val();
       	$(this).parents('tr').children('#collectUserIncome-input').remove();
       	$(this).parents('tr').children('#collectUserIncome').text(collectUserIncome);
       	
       	// 加校验
//       	if (!signSalary) {
//			alert("签约工资不能为空！");
//			return;
//		}
       		
   		if (!businessIncome) {
			alert("业务收入不能为空！");
			return;
		}
   		
   		if (!undertakeUserIncome) {
			alert("接单收入不能为空！");
			return;
		}
       	
       	updateOrderWorker(id,signSalary,businessIncome,arriveWorkTime,collectUserIncome,undertakeUserIncome);
   });
}

function showSigningList(jobTypeId){
	
	var url = "/demand/orderWorkerSigningList";
	var text = "已签约用工";
    $.ajax({
        url: url,
        type: "get",
        data: { demandJobId: jobTypeId},
        dataType: "json",
        success: function (data) {
            if (data.code == 1) {

                var firmArr = data.data.orderWorkerList;
                var tableContent = "";
                $("#order-worker-list-span").text(text);
                // 是否显示操作
                var isShowOpButton = 0;
                for (var i = 0; i < firmArr.length; i++) {
                	var firm = firmArr[i];
                	if(firm.confirmState != null && firm.confirmState != 2){
                		isShowOpButton = 1;
                		break;
                	}
                }
                
                tableContent += "<tr>" +
                    "	<th width='62'>用工姓名</th>" +
                    "	<th width='40'>籍贯</th>" +
                    "	<th width='120'>身份证号</th>" +
                    "	<th width='93'>联系电话</th>" +
                    "	<th width='90'>擅长工种</th>" +
                    "	<th width='90'>采集人</th>" +
                    "	<th width='90'>签约月工资(元)</th>" +
                    "	<th width='96'>到岗日期</th>" +
                    "	<th width='80'>业务收入（元）</th>" +
                    "	<th width='80'>采集收入（元）</th>" +
                    "	<th width='80'>接单收入（元）</th>" +
                    "	<th width='80'>订单编号</th>" +
                    "	<th width='80'>订单状态</th>";
                if(isShowOpButton == 1){
                	tableContent += "	<th width='100'>操作</th>";
                }
                    tableContent += "</tr>";
                
               

                for (var i = 0; i < firmArr.length; i++) {
                    var firm = firmArr[i];
                    var worker = firm.worker;
                    tableContent += "<tr>" +
                        "   <input id=\"id\" type=\"hidden\" value="+ firm.id +">" +
                        "	<td id=\"id\">" + worker.name + "</td>" +
                        "	<td>" + worker.birthplaceName + "</td>" +
                        "	<td>" + worker.idcard + "</td>" +
                        "	<td>" + worker.telephone + "</td>" +
                        "	<td>" + (worker.jobtypeName == null ? "" : worker.jobtypeName) + "</td>" +
                        "	<td>" + (worker.createUserName == null ? "" : worker.createUserName) + "</td>" +
                        "	<td id=\"signSalary\">" + firm.signSalary + "</td>" +
                        "	<td id=\"arriveWorkTime\">" + (firm.arriveWorkTime == null ? "" : firm.arriveWorkTime) + "</td>" +
                        "	<td id=\"businessIncome\" width='80'>" + (firm.businessIncome == null ? "" : firm.businessIncome) + "</td>" +
                        "	<td id=\"collectUserIncome\" width='80'>" + (firm.collectUserIncome == null ? "" : firm.collectUserIncome) + "</td>" +
                        "	<td id=\"undertakeUserIncome\" width='80'>" + (firm.undertakeUserIncome == null ? "" : firm.undertakeUserIncome) + "</td>" +
                        "	<td>" + (firm.orderNumber == null ? "" : firm.orderNumber) + "</td>"+
                        "	<td>" + (firm.confirmStateName == null ? "" : firm.confirmStateName) + "</td>";
                        if(isShowOpButton == 1){
                        	if(firm.confirmState == 2){
                            	tableContent +="   <td></td>" ;
                            }else{
                            	tableContent +="   <td><span class='edit' id='edit-worker'>编辑</span><span class='edit' style ='display:none' id='confirm-edit'>确定</span></td>";
                            }
                        }
                        tableContent += "</tr>";
                    
                    // <span class=\"edit\" id=\"edit-worker\">编辑</span>
                }
                
                if(firmArr.length > 0){
                	openDialog("yifenpei-list");
                    parent.$("#worker-list-table").empty().append(tableContent);
                }else{
                	alert("暂无分配用工！");
                }
                
                // 分配工人的操作
                orderWorkerOperate();
            }
        }
    });

}

/**
 * 删除已分配用工
 * @param orderWorkerId
 * @returns
 */
function deleteOrderWorker(obj) {
	
	var orderWorkerId = parent.$(obj).parents('tr').children('#id').val();
	
	var b = confirm("是否移除该用工？");
	if(b){
		$.ajax({
			url:"/demand/deleteOrderWorker",
			type:"get",
			dataType:"json",
			async:false,
			data:{orderWorkerId:orderWorkerId},
			success:function(data){
				if(data.code == 1){
					// 弹框删除该行
					parent.$(obj).parents('tr').remove();
					var trLength = parent.$("#worker-list-table").children("tr").length;
					if(trLength == 1){
						// 关闭弹框
				    	top.closeDialog();
					}
					alert("移除用工成功！");
					// 页面数字
					querySignDetail(1);
				}
				else{
					alert("移除用工失败！原因："+data.msg);
				}
			}
		});
	}
}


function updateOrderWorker(id,signSalary,businessIncome,arriveWorkTime,collectUserIncome,undertakeUserIncome) {
	
	var orderWorker = {};
	
	orderWorker.signSalary=signSalary;
	orderWorker.businessIncome=businessIncome;
	orderWorker.arriveWorkTime = arriveWorkTime;
	orderWorker.collectUserIncome=collectUserIncome;
	orderWorker.undertakeUserIncome = undertakeUserIncome;
	orderWorker.id =id;
	
	$.ajax({
		url : "/demand/editOrderWorker",
		type : "post",
		dataType : "json",
		data : {json : JSON.stringify(orderWorker)},
		success : function(data) {
			if (data.code != 1) {
				alert("更新用工信息失败！原因：" + data.msg);
			}
		}
	});
}




