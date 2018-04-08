var ShowYourLog = function (options){
	var $this = this;
	var $dataTable = null;
	var $table = null;
	
	/*初始化数据表格*/
	this.initTable = function(){
		var t = new Table({
			"table_id"	: "showyourloglist",
			"autoLoad" : false,
			"download"			: {enabled:false},
			"row_btn_enabled"	: false,
			"service_name"	: "com.huateng.signmev2.service.system.SignlogService",
			"method_name"	: "queryAccount",
			"param_type"	: "com.huateng.signmev2.model.system.Signlog",
			"module_name"	: "用户管理",
			"url"		: "/signmev2/queryByMac",
			"tableHeaders"		: ["记录ID","IP","MAC","姓名","签到日期","签到时间","签退日期","签退时间","最迟上班时间","控制签退时间","加班时间"],
			"columnNames"		: ["log_id","ip","mac","name",{"sign_in_date":RenderUtil.statDateRender},{"sign_in_time":RenderUtil.colorLateRender},
				{"sign_out_date":RenderUtil.date},{"sign_out_time":RenderUtil.colorOutRender},{"late_time":RenderUtil.hour},
				{"early_time":RenderUtil.hour},{"ot_time":RenderUtil.hour}]
		});
		$dataTable = t.getDataTable();
		$table = t;
	};
	

	/*初始化日期控件*/
	this.initDateTimePicker = function(){
	};
	
	
	/*查询按钮事件初始化*/
	this.initBtn = function(){
	};
	
	function init(){
		$this.initTable();
		$this.initDateTimePicker();
		$this.initBtn();

		var listMap = [];

        listMap.push({"name" : "name", "value": decodeURIComponent(options.name)});
        listMap.push({"name" : "mac", "value": options.mac});
        listMap.push({"name" : "sign_flag", "value": options.sign_flag});
        listMap.push({"name" : "sign_in_start_date", "value": options.b_start_date});
        listMap.push({"name" : "sign_in_end_date", "value": options.b_end_date});
        $table.setListMap(listMap);
        $dataTable.ajax.reload();
	}
	
	init();
};
