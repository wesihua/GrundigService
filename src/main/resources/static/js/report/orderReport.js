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
	
	$('.J-yearMonthPicker-single').datePicker({
        format: 'YYYY-MM-DD'
    });
	$("#query").click(function(){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		loadTotalOrderCount(startDate,endDate);
		loadBar(startDate, endDate);
		loadPie(startDate, endDate);
	});
	$("#today").click(function(){
		$(this).css("background-color","#409eff");
		$(this).css("color","#ffffff");
		$(this).siblings().css("background-color","#ecf5ff");
		$(this).siblings().css("color","#409eff");
		var startDate = getNowFormatDate();
		$("#startDate").val(startDate);
		loadTotalOrderCount(startDate);
		loadBar(startDate);
		loadPie(startDate);
	});
	$("#thisWeek").click(function(){
		$(this).css("background-color","#409eff");
		$(this).css("color","#ffffff");
		$(this).siblings().css("background-color","#ecf5ff");
		$(this).siblings().css("color","#409eff");
		var startDate = getFirstDayOfWeek(new Date());
		$("#startDate").val(startDate);
		loadTotalOrderCount(startDate);
		loadBar(startDate);
		loadPie(startDate);
	});
	$("#thisMonth").click(function(){
		$(this).css("background-color","#409eff");
		$(this).css("color","#ffffff");
		$(this).siblings().css("background-color","#ecf5ff");
		$(this).siblings().css("color","#409eff");
		var startDate = getFirstDayOfMonth(new Date());
		$("#startDate").val(startDate);
		loadTotalOrderCount(startDate);
		loadBar(startDate);
		loadPie(startDate);
	});
	$("#thisSeason").click(function(){
		$(this).css("background-color","#409eff");
		$(this).css("color","#ffffff");
		$(this).siblings().css("background-color","#ecf5ff");
		$(this).siblings().css("color","#409eff");
		var startDate = getFirstDayOfSeason(new Date());
		$("#startDate").val(startDate);
		loadTotalOrderCount(startDate);
		loadBar(startDate);
		loadPie(startDate);
	});
	$("#thisYear").click(function(){
		$(this).css("background-color","#409eff");
		$(this).css("color","#ffffff");
		$(this).siblings().css("background-color","#ecf5ff");
		$(this).siblings().css("color","#409eff");
		var startDate = getFirstDayOfYear(new Date());
		$("#startDate").val(startDate);
		loadTotalOrderCount(startDate);
		loadBar(startDate);
		loadPie(startDate);
	});
	loadTotalOrderCount();
	loadBar();
	loadPie();
	
	$("#demandtype").change(function(){
//		var startDate = $("#startDate").val();
//		var endDate = $("#endDate").val();
		var type = this.value;
		loadDemandBar(type);
	});
	$("#orderType").change(function(){
		var type = this.value;
		loadOrderBar(type);
	});
	$("#orderMembertype").change(function(){
		var type = this.value;
		loadOrderMemberBar(type);
	});
	$("#orderIncometype").change(function(){
		var type = this.value;
		loadOrderIncomeBar(type);
	});
});

function loadBar(startDate,endDate){
	$("#demandtype").val("month");
	$("#orderType").val("month");
	$("#orderMembertype").val("month");
	$("#orderIncometype").val("month");
	$.ajax({
		url:"/report/orderBar",
		type:"get",
		async:false,
		dataType:"json",
		data:{beginDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var data = data.data;
				renderDemandBar(data.demandBar);
				renderOrderBar(data.orderBar);
				renderOrderMemberBar(data.orderMemberBar);
				renderOrderIncomeBar(data.orderIncomeBar);
			}
		}
	});
}

function loadPie(startDate,endDate){
	$.ajax({
		url:"/report/orderPie",
		type:"get",
		async:false,
		dataType:"json",
		data:{beginDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var data = data.data;
				renderDemandTakerPie(data.demandTakerPie);
				renderOrderTakerPie(data.orderTakerPie);
				renderOrderMemberTakerPie(data.orderMemberTakerPie);
				renderOrderIncomeTakerPie(data.orderIncomeTakerPie);
			}
		}
	});
}

function loadTotalOrderCount(startDate,endDate){
	$.ajax({
		url:"/report/totalOrderCountReport",
		type:"get",
		async:false,
		dataType:"json",
		data:{startDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var data = data.data;
				var content = "<tr><td>"+data.demandCount+"</td><td>"+data.orderCount+"</td>" +
						"<td>"+data.orderMemberCount+"</td><td>"+data.orderIncome+"</td></tr>";
				$("#someCount").find("tbody").empty().html(content);
			}
		}
	});
	
}


function renderDemandTakerPie(data){
	var series = [];
	for(var i=0; i<data.length; i++){
		var info = data[i];
		var obj = {};
		obj.name = info.name;
		obj.y = info.count;
		series.push(obj);
	}
	// 企业招聘需求接单人pie
	Highcharts.chart('demandTakerPie', {
		chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
		},
		title: {
				text: '招聘需求接单人分布'
		},
		tooltip: {
				pointFormat: '{series.name}:<b>{point.percentage:.1f}%</b>，数量：{point.y}'
		},
		plotOptions: {
				pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
								enabled: true,
								format: '<b>{point.name}</b>: （{point.y}）{point.percentage:.1f} %',
								style: {
										color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
								}
						}
				}
		},
		series: [{
				name: '占比',
				colorByPoint: true,
				data: series
		}]
	});
}
function renderOrderTakerPie(data){
	var series = [];
	for(var i=0; i<data.length; i++){
		var info = data[i];
		var obj = {};
		obj.name = info.name;
		obj.y = info.count;
		series.push(obj);
	}
	Highcharts.chart('orderTakerPie', {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '已签订订单接单人分布'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>，数量：{point.y}'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: （{point.y}）{point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: '占比',
			colorByPoint: true,
			data: series
		}]
	});
}
function renderOrderMemberTakerPie(data){
	var series = [];
	for(var i=0; i<data.length; i++){
		var info = data[i];
		var obj = {};
		obj.name = info.name;
		obj.y = info.count;
		series.push(obj);
	}
	// 企业招聘需求接单人pie
	Highcharts.chart('orderMemberTakerPie', {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '已签订人数接单人分布'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>，数量：{point.y}'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: （{point.y}）{point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: '占比',
			colorByPoint: true,
			data: series
		}]
	});
}
function renderOrderIncomeTakerPie(data){
	var series = [];
	for(var i=0; i<data.length; i++){
		var info = data[i];
		var obj = {};
		obj.name = info.name;
		obj.y = info.count;
		series.push(obj);
	}
	// 企业招聘需求接单人pie
	Highcharts.chart('orderIncomeTakerPie', {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '订单总收入接单人分布'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>，金额：{point.y}元'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: （{point.y}元）{point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: '占比',
			colorByPoint: true,
			data: series
		}]
	});
}

function renderDemandBar(data){
	// 企业需求
	var demandBarCategories = [];
	var demandBarSeries = [];
	
	var demandData = data;
	var demandCount = 0;
	for(var i=0; i<demandData.length; i++){
		var info = demandData[i];
		demandBarCategories.push(info.name);
		demandBarSeries.push(info.count);
		demandCount += info.count;
	}
	$("#demandCount").text(demandCount);
	$("#demandTakerCount").text(demandCount);
	// 企业招聘需求bar chart
	Highcharts.chart('demandBar', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: '企业招聘需求数量'
	    },
	    xAxis: {
	        categories: demandBarCategories,
	        crosshair: true
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: '数量 (个)'
	        }
	    },
	    tooltip: {
	        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	            '<td style="padding:0"><b>{point.y:.0f} 个</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
	        column: {
	            pointPadding: 0.2,
	            borderWidth: 0
	        }
	    },
	    series: [{
	        name: '新增企业需求数',
	        data: demandBarSeries

	    }]
	});
}
function renderOrderBar(data){
	var orderData = data;
	// 订单
	var orderBarCategories = [];
	var orderBarSeries = [];
	var orderCount = 0;
	for(var i=0; i<orderData.length; i++){
		var info = orderData[i];
		orderBarCategories.push(info.name);
		orderBarSeries.push(info.count);
		orderCount+=info.count;
	}
	$("#orderCount").text(orderCount);
	$("#orderTakerCount").text(orderCount);
	// 订单bar chart
	Highcharts.chart('orderBar', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: '订单数量'
	    },
	    xAxis: {
	        categories: orderBarCategories,
	        crosshair: true
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: '数量 (个)'
	        }
	    },
	    tooltip: {
	        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	            '<td style="padding:0"><b>{point.y:.0f} 个</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
	        column: {
	            pointPadding: 0.2,
	            borderWidth: 0
	        }
	    },
	    series: [{
	        name: '新增订单数',
	        data: orderBarSeries

	    }]
	});
}

function renderOrderMemberBar(data){
	var orderMemberData = data;
	// 订单人数
	var orderMemberBarCategories = [];
	var orderMemberBarSeries = [];
	var orderMemberCount = 0;
	for(var i=0; i<orderMemberData.length; i++){
		var info = orderMemberData[i];
		orderMemberBarCategories.push(info.name);
		orderMemberBarSeries.push(info.count);
		orderMemberCount += info.count;
	}
	$("#orderMemberCount").text(orderMemberCount);
	$("#orderMemberTakerCount").text(orderMemberCount);
	// 订单签订人数bar chart
	Highcharts.chart('orderMemberBar', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: '订单签订人数'
	    },
	    xAxis: {
	        categories: orderMemberBarCategories,
	        crosshair: true
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: '数量 (人)'
	        }
	    },
	    tooltip: {
	        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	            '<td style="padding:0"><b>{point.y:.0f} 人</b></td></tr>',
	        footerFormat: '</table>',
	        shared: true,
	        useHTML: true
	    },
	    plotOptions: {
	        column: {
	            pointPadding: 0.2,
	            borderWidth: 0
	        }
	    },
	    series: [{
	        name: '签订人数',
	        data: orderMemberBarSeries

	    }]
	});
}

function renderOrderIncomeBar(data){
	var orderIncomeData = data;
	// 订单金额
	var orderIncomeBarCategories = [];
	var orderIncomeBarSeries = [];
	
	var orderIncomeCount = 0;
	for(var i=0; i<orderIncomeData.length; i++){
		var info = orderIncomeData[i];
		orderIncomeBarCategories.push(info.name);
		orderIncomeBarSeries.push(info.count);
		orderIncomeCount += info.count;
	}
	$("#orderIncomeCount").text(orderIncomeCount);
	$("#orderIncomeTakerCount").text(orderIncomeCount);
	// 订单签订金额bar chart
	Highcharts.chart('orderIncomeBar', {
		chart: {
			type: 'column'
		},
		title: {
			text: '订单收入金额'
		},
		xAxis: {
			categories: orderIncomeBarCategories,
			crosshair: true
		},
		yAxis: {
			min: 0,
			title: {
				text: '金额 (元)'
			}
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			'<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: '签订金额',
			data: orderIncomeBarSeries
			
		}]
	});
}
/**
 * 获取指定日期的周的第一天、月的第一天、季的第一天、年的第一天
 * @param date new Date()形式，或是自定义参数的new Date()
 * @returns 返回值为格式化的日期，yy-mm-dd
 */
//日期格式化，返回值形式为yy-mm-dd
function timeFormat(date) {
    if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
    }
    var y = date.getFullYear(); //年
    var m = date.getMonth() + 1; //月
    var d = date.getDate(); //日

    return y + "-" + m + "-" + d;
}

//获取这周的周一
function getFirstDayOfWeek (date) {

    var weekday = date.getDay()||7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7

    date.setDate(date.getDate()-weekday+1);//往前算（weekday-1）天，年份、月份会自动变化
    return timeFormat(date);
}

//获取当月第一天
function getFirstDayOfMonth (date) {
    date.setDate(1);
    return timeFormat(date);
}

//获取当季第一天
function getFirstDayOfSeason (date) {
    var month = date.getMonth();
    if(month <4 ){
        date.setMonth(0);
    }else if(3 < month && month < 7){
        date.setMonth(3);
    }else if(6 < month && month < 10){
        date.setMonth(6);
    }else if(9 < month && month < 13){
        date.setMonth(9);
    }
    date.setDate(1);
    return timeFormat(date);
}

//获取当年第一天
function getFirstDayOfYear (date) {
    date.setDate(1);
    date.setMonth(0);
    return timeFormat(date);
}

//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function loadDemandBar(type){
	var url = "/report/demandMonthBar";
	if(type == "day"){
		url = "/report/demandDayBar";
	}
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	$.ajax({
		url:url,
		type:"get",
		//async:false,
		dataType:"json",
		data:{beginDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var reportData = data.data;
				// 订单金额
				var barCategories = [];
				var barSeries = [];
				for(var i=0; i<reportData.length; i++){
					var info = reportData[i];
					barCategories.push(info.name);
					barSeries.push(info.count);
				}
				
				Highcharts.chart('demandBar', {
				    chart: {
				        type: 'column'
				    },
				    title: {
				        text: '企业招聘需求数量'
				    },
				    xAxis: {
				        categories: barCategories,
				        crosshair: true
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: '数量 (个)'
				        }
				    },
				    tooltip: {
				        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				            '<td style="padding:0"><b>{point.y:.0f} 人</b></td></tr>',
				        footerFormat: '</table>',
				        shared: true,
				        useHTML: true
				    },
				    plotOptions: {
				        column: {
				            pointPadding: 0.2,
				            borderWidth: 0
				        }
				    },
				    series: [{
				        name: '新增招聘需求',
				        data: barSeries

				    }]
				});
			}
		}
	});
	
}
function loadOrderBar(type){
	var url = "/report/orderMonthBar";
	if(type == "day"){
		url = "/report/orderDayBar";
	}
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	$.ajax({
		url:url,
		type:"get",
		//async:false,
		dataType:"json",
		data:{beginDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var reportData = data.data;
				// 订单金额
				var barCategories = [];
				var barSeries = [];
				for(var i=0; i<reportData.length; i++){
					var info = reportData[i];
					barCategories.push(info.name);
					barSeries.push(info.count);
				}
				
				Highcharts.chart('orderBar', {
					chart: {
						type: 'column'
					},
					title: {
						text: '订单数量'
					},
					xAxis: {
						categories: barCategories,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: '数量 (个)'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.0f} 个</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: '新增订单数',
						data: barSeries
						
					}]
				});
			}
		}
	});
	
}
function loadOrderMemberBar(type){
	var url = "/report/orderMemberMonthBar";
	if(type == "day"){
		url = "/report/orderMemberDayBar";
	}
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	$.ajax({
		url:url,
		type:"get",
		//async:false,
		dataType:"json",
		data:{beginDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var reportData = data.data;
				// 订单金额
				var barCategories = [];
				var barSeries = [];
				for(var i=0; i<reportData.length; i++){
					var info = reportData[i];
					barCategories.push(info.name);
					barSeries.push(info.count);
				}
				
				Highcharts.chart('orderMemberBar', {
					chart: {
						type: 'column'
					},
					title: {
						text: '订单签订人数'
					},
					xAxis: {
						categories: barCategories,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: '数量 (人)'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.0f} 人</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: '签订人数',
						data: barSeries
						
					}]
				});
			}
		}
	});
	
}
function loadOrderIncomeBar(type){
	var url = "/report/orderIncomeMonthBar";
	if(type == "day"){
		url = "/report/orderIncomeDayBar";
	}
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	$.ajax({
		url:url,
		type:"get",
		//async:false,
		dataType:"json",
		data:{beginDate:startDate,endDate:endDate},
		success:function(data){
			if(data.code == 1){
				var reportData = data.data;
				// 订单金额
				var barCategories = [];
				var barSeries = [];
				for(var i=0; i<reportData.length; i++){
					var info = reportData[i];
					barCategories.push(info.name);
					barSeries.push(info.count);
				}
				
				Highcharts.chart('orderIncomeBar', {
					chart: {
						type: 'column'
					},
					title: {
						text: '订单收入金额'
					},
					xAxis: {
						categories: barCategories,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: '金额 (元)'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: '签订金额',
						data: barSeries
						
					}]
				});
			}
		}
	});
	
}