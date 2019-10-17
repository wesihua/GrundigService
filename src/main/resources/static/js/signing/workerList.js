$(function () {
    // 超时跳到登录
    $(document).ajaxSuccess(function (event, xhr, settings) {
        if (xhr.responseJSON.code == 1002) {
            top.location.href = "/";
        }
    });
    
   
    
    $(document).bind("ajaxSend", function () {
		parent.$("#loading").show();
    }).bind("ajaxComplete", function () {
    	parent.$("#loading").hide();
    });

    $("#addWorder").click(function () {
//        var jobTypeId = $("input[name=jobTypeId]").val();
//        window.location.href = "/signing/addWorker?jobTypeId=" + jobTypeId;\
    	
    	addWorker();
    	
    	
    });
    
    var source = $("input[name=source]").val();
    if( source == 1){
    	 $("#addWorder").show();
    }
    
    query(1);
});

function query(pageNum) {
    var jobTypeId = $("input[name=jobTypeId]").val();

    $.ajax({
        url: "/demand/orderWorkerList",
        type: "post",
        data: { demandJobId: jobTypeId ,pageNumber:pageNum},
        dataType: "json",
        success: function (data) {
            if (data.code == 1) {

                var firmArr = data.data.pageData.data;
                var tableContent = "";
                $(".order-work-job-name").text(data.data.demandJob.jobTypeName);
                $(".worker-count").text("（需求"+ data.data.demandJob.workerCount +"人）");
                tableContent += "<tr>" +
                    "	<th>用工姓名</th>" +
                    "	<th>籍贯</th>" +
                    "	<th>身份证号</th>" +
                    "	<th>联系电话</th>" +
                    "	<th>擅长工种</th>" +
                    "	<th>签约月工资（元）</th>" +
                    "	<th>到岗日期</th>" +
                    "	<th width='120'>业务收入（元）</th>" +
                    "	<th width='150'>操作</th>" +
                    "</tr>";

                for (var i = 0; i < firmArr.length; i++) {
                    var firm = firmArr[i];
                    var worker = firm.worker;
                    tableContent += "<tr>" +
                        "	<td>" + worker.name + "</td>" +
                        "	<td>" + worker.birthplaceName + "</td>" +
                        "	<td>" + worker.idcard + "</td>" +
                        "	<td>" + worker.telephone + "</td>" +
                        "	<td>" + (worker.jobtypeName == null ? "" : worker.jobtypeName) + "</td>" +
                        "	<td>" + firm.signSalary + "</td>" +
                        "	<td>" + firm.arriveWorkTime + "</td>" +
                        "	<td width='120'>" + firm.businessIncome + "</td>" +
                        "   <td><span class=\"des\" onClick=\"deleteOrderWorker(" + firm.id + ")\">移除</span><span class=\"jiedan\" onClick=\"updateOrderWorker(" + firm.id + ",'"+ worker.name + "'," + firm.signSalary + ",'" + firm.arriveWorkTime + "'," + firm.businessIncome +")\">编辑</span></td>" +
                        "</tr>";
                }
            }
            
            $("#worker-list-table").empty().append(tableContent);
            $("#totalCount").text(data.data.pageData.totalCount+"个结果");
            $("#pagination1").pagination({
            	currentPage: data.data.pageData.pageNumber,
            	totalPage: data.data.pageData.pageCount,
            	callback: function(current) {
            		query(current);
            	}
            });
        }
    });



    // 初始化时间控件
//    $('.J-yearMonthPicker-single').datePicker({
//        format: 'YYYY-MM-DD'
//    });
}

function deleteOrderWorker(orderWorkerId) {

	var b = confirm("是否移除该用工？");
	if(b){
		$.ajax({
			url:"/demand/deleteOrderWorker",
			type:"get",
			dataType:"json",
			data:{orderWorkerId:orderWorkerId},
			success:function(data){
				if(data.code == 1){
					alert("移除用工成功！");
					query(1);
				}
				else{
					alert("移除用工失败！原因："+data.msg);
				}
			}
		});
	}

}

function updateOrderWorker(id, name, signSalary, arriveWorkTime, businessIncome) {
	openDialog("worker-edit");
	// 初始化时间控件
	parent.$('.J-yearMonthPicker-single').datePicker({
		format : 'YYYY-MM-DD'
	});

	parent.$("#worker-name").val(name);
	parent.$("#worker-signSalary").val(signSalary);
	parent.$("#worker-arriveWorkTime").val(arriveWorkTime);
	parent.$("#worker-businessIncome").val(businessIncome);

	top.$(".complete-edit").click(function() {

		var orderWorker = {};
		var signSalary_ = parent.$("#worker-signSalary").val();
		var arriveWorkTime_ = parent.$("#worker-arriveWorkTime").val();
		var businessIncome_ = parent.$("#worker-businessIncome").val();
		
//		if (!signSalary_) {
//			alert("签约工资不能为空！");
//			return false;
//		}
		if (!businessIncome_) {
			alert("业务收入不能为空！");
			return false;
		}
		if (!arriveWorkTime_) {
			alert("到岗时间不能为空！");
			return false;
		}
		top.closeDialog();
		
		var orderWorker = {};
		orderWorker.signSalary=signSalary_;
		orderWorker.arriveWorkTime=arriveWorkTime_;
		orderWorker.businessIncome=businessIncome_;
		orderWorker.id =id;
		
		$.ajax({
			url : "/demand/editOrderWorker",
			type : "post",
			dataType : "json",
			data : {json : JSON.stringify(orderWorker)},
			success : function(data) {
				if (data.code == 1) {
					top.closeDialog();
					alert("更新用工信息成功！");
					query(1);
				} else {
					alert("更新用工信息失败！原因：" + data.msg);
				}
			}
		});

	});
}



/**
 * 打开弹窗
 * @returns
 */
function openDialog(id) {
    var content = $("#" + id).html();
    top.$("#dialog").html(content);
    top.$("#dialog").fadeIn(300);
    // 因为弹窗页面是重新渲染到top页面的。所以事件绑定只能在渲染之后。否则不起作用！
    top.$(".cancel-edit").click(function () {
        top.closeDialog();
    });
//    top.$(".complete-edit").click(function () {
//        top.closeDialog();
//    });
}


function queryWorkerList(pageNum){

    var workerName = parent.$("#workerName").val();
	var telephone = parent.$("#telephone").val();
	var idcard = parent.$("#idcard").val();

    $.ajax({
		url:"/worker/list",
		type:"get",
		data:{name:workerName,telephone:telephone,idcard:idcard,pageNumber:pageNum},
		dataType:"json",
		success:function(data){
			if(data.code == 1){
				var workerArr = data.data.data;
				var tableContent="";
				for(var i=0; i<workerArr.length; i++){
					var worker = workerArr[i];
					tableContent+=  "<tr>"+
									"	<td class='worker-name'>"+worker.name+"</td>"+
									"	<td class='worker-idcard'>"+worker.idcard+"</td>"+
									"	<td>"+worker.birthplaceName+"</td>"+
									"	<td>"+(worker.jobtypeName == null ? "" : worker.jobtypeName)+"</td>"+
									"	<td>"+worker.expectSalaryName+"</td>"+
									"	<td>"+worker.workplaceName+"</td>"+
									"	<td><input class='check-input' type=\"checkbox\" name=\"check\" value="+worker.id+" ></td>"+
									/*"	<input type=\"hidden\" name=\"signSalary\" value="+worker.signSalary+" >"+
									"	<input type=\"hidden\" name=\"arriveWorkTime\" value="+worker.arriveWorkTime+" >"+
									"	<input type=\"hidden\" name=\"businessIncome\" value="+worker.businessIncome+" >"+*/
									"</tr>";
					/*"<span class=\"des\" onClick=\"updateWorker("+worker.id+")\">编辑</span>" */
				}
				parent.$("#add-worker-list-table").empty().append(tableContent);
				parent.$("#add-totalCount").text(data.data.totalCount+"个结果");
				parent.$("#add-pagination1").pagination({
					currentPage: data.data.pageNumber,
					totalPage: data.data.pageCount,
					callback: function(current) {
						queryWorkerList(current);
					}
				});
				
				parent.$('.check-input').click(function(){

			    	$that = $(this);
			    	var aaa = $that.prop("checked");
			    	var id = $that.val();
			    	if(aaa){
			    		var name = $that.parents('tr').find('.worker-name').text();
			    		var idcard = $that.parents('tr').find('.worker-idcard').text();
			/*    		var signSalary = $that.parents('tr').find('[name="signSalary"]').val();
			    		var arriveWorkTime = $that.parents('tr').find('[name="arriveWorkTime"]').val();
			    		var businessIncome = $that.parents('tr').find('[name="businessIncome"]').val();*/
			    		var content = '<li class="order-worder" id=check_'+id+' data="'+ id +'">'+
								            '<div class="select-name">'+name+'（'+ idcard +'）</div>'+
								            '<div class="select-title">'+
								                '<span class="a">签约月工资(元)</span>'+
								                '<span class="b">到岗日期</span>'+
								               ' <span class="c">业务收入(元)</span>'+
								            '</div>'+
								            '<div class="select-input">'+
								                '<input class="a signSalary" type="text" value="" />'+
								                '<div class="c-datepicker-date-editor c-datepicker-single-editor J-yearMonthPicker-single mt10">'+
												'<input autocomplete="off" type="text" placeholder="选择到岗日期"  class="b arriveWorkTime" id="requireTime" name="createTime"/>'+
										        '</div>'+
								                '<input class="c businessIncome" type="text" value="" />'+
								           ' </div>'+
								        '</li>';
			    	}else{
			    		parent.$("#check_"+id+"").remove();
			    	}
			    	
			    	parent.$(".result-area ul").append(content);
			    
			    	parent.$('.J-yearMonthPicker-single').datePicker({
			    		format : 'YYYY-MM-DD'
			    	});
			    
			    });
				
				  parent.$('.addWorker').click(function(){
				    	
				    	var jobTypeId = $("input[name='jobTypeId']").val();
				    	var workers = [];
				    	var flag = false;
				    	$(".order-worder").each(function(){
				    		if(flag){
				    			return;
				    		}
				    		$that = $(this).find(".select-input");
				    		var orderWorker = {};
				    		var signSalary = $that.find(".signSalary").val();
							if(signSalary!=""&&signSalary.length>0){
								orderWorker.signSalary=signSalary;
				    		}
//							else{
//				    			alert("签约月工资不能为空");
//				    			flag=true;
//				    			return;
//				    		}
				    		var arriveWorkTime = $that.find(".arriveWorkTime").val();
				    		if(arriveWorkTime!=""&&arriveWorkTime.length>0){
				    			orderWorker.arriveWorkTime = arriveWorkTime;
				    		}else{
				    			alert("到岗日期不能为空");
				    			flag=true;
				    			return;
				    		}
				    		var businessIncome= $that.find(".businessIncome").val();
				    		if(businessIncome!=""&&businessIncome.length>0){
				    			orderWorker.businessIncome = businessIncome;
				    		}else{
				    			alert("业务收入不能为空");
				    			flag=true;
				    			return;
				    		}
				    		orderWorker.workerId = $(this).attr("data");
				    		workers.push(orderWorker);
				    	});
				    	if(flag){
				    		return;
				    	}
						$.ajax({
							url:"/demand/addOrderWorker",
							type:"post",
							dataType:"json",
							data:{json:JSON.stringify(workers),demandJobId:jobTypeId},
							success:function(data){
								if(data.code == 1){
									alert("添加用工信息成功！");
									location.href=location.href;
								}
								else{
									alert("添加用工信息失败！原因："+data.msg);
								}
							}
						});
				    	
				    });
			    
				
			}
		}
    });
}




function addWorker(){

  
    // 打开弹框
	openDialog("content-workerLsit");

    queryWorkerList(1);

    parent.$(".select-worker").click(function(){
    	queryWorkerList(1);
    });

}

