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
    

    queryWorkerList(1);

    $(".select-worker").click(function(){
    	queryWorkerList(1);
    });
    
    $(document).on('click','input[name="check"]',function(){
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
					                '<span class="a">签约月工资（元)</span>'+
					                '<span class="b">到岗日期</span>'+
					                '<span class="c">业务收入（元）</span>'+
					                '<span class="b">采集金额（元）</span>'+
					                '<span class="c">接单金额（元）</span>'+
					            '</div>'+
					            '<div class="select-input">'+
					                '<input class="a signSalary" style="width: 8px;" type="text" value="" />'+
					                '<div class="c-datepicker-date-editor c-datepicker-single-editor J-yearMonthPicker-single mt10">'+
									'<input autocomplete="off" style="width: 9px;" type="text" placeholder="选择到岗日期"  class="b arriveWorkTime" id="requireTime" name="createTime"/>'+
							        '</div>'+
					                '<input class="c businessIncome" style="width: 80px;" type="text" value="" />'+
					                '<input class="c businessIncome" style="width: 80px;" type="text" value="" />'+
					                '<input class="c businessIncome" style="width: 80px;" type="text" value="" />'+
					           ' </div>'+
					        '</li>';
    	}else{
    		$("#check_"+id+"").remove();
    	}
    	
    	$(".result-area ul").append(content);
    
    	$('.J-yearMonthPicker-single').datePicker({
    		format : 'YYYY-MM-DD'
    	});
    	
    });
    
    $('.addWorker').click(function(){
    	
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
			async:true,
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
    	
    })

});

function queryWorkerList(pageNum){

    var workerName = $("#workerName").val();
	var telephone = $("#telephone").val();
	var idcard = $("#idcard").val();

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
									"	<td>"+worker.jobtypeName+"</td>"+
									"	<td>"+worker.expectSalaryName+"</td>"+
									"	<td>"+worker.workplaceName+"</td>"+
									"	<td><input type=\"checkbox\" name=\"check\" value="+worker.id+" ></td>"+
									/*"	<input type=\"hidden\" name=\"signSalary\" value="+worker.signSalary+" >"+
									"	<input type=\"hidden\" name=\"arriveWorkTime\" value="+worker.arriveWorkTime+" >"+
									"	<input type=\"hidden\" name=\"businessIncome\" value="+worker.businessIncome+" >"+*/
									"</tr>";
					/*"<span class=\"des\" onClick=\"updateWorker("+worker.id+")\">编辑</span>" */
				}
				$("tbody").empty().append(tableContent);
				$("#totalCount").text(data.data.totalCount+"个结果");
				$("#pagination1").pagination({
					currentPage: data.data.pageNumber,
					totalPage: data.data.pageCount,
					callback: function(current) {
						queryWorkerList(current);
					}
				});
			}
		}
    });
}

