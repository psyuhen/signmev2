var SignmeList = function (options){
	var $this = this;
	var $dataTable = null;
	var $table = null;
	
	/*初始化数据表格*/
	this.initTable = function(){
		var t = new Table({
			"table_id"	: "signmeList",
			"download"			: {enabled:false},
			"row_btn_enabled"	: false,
			"service_name"	: "com.huateng.signmev2.service.system.SignlogService",
			"method_name"	: "queryAccount",
			"param_type"	: "com.huateng.signmev2.model.system.Signlog",
			"module_name"	: "用户管理",
			"url"		: "/signmev2/mgr/signlog/queryForListPage",
			"formId"			: "conditionForm",
			"tableHeaders"		: ["记录ID","签到日期","签到时间","IP","MAC","姓名","签退日期","签退时间","最迟上班时间","控制签退时间","加班时间"],
			"columnNames"		: ["log_id",{"sign_in_date":RenderUtil.date},{"sign_in_time":RenderUtil.hour},"ip","mac","name",
				{"sign_out_date":RenderUtil.date},{"sign_out_time":RenderUtil.hour},{"late_time":RenderUtil.hour},
				{"early_time":RenderUtil.hour},{"ot_time":RenderUtil.hour}]
		});
		$dataTable = t.getDataTable();
		$table = t;
	};
	
	/*初始化日期控件*/
	this.initDateTimePicker = function(){
		Form.dateTime("sign_in_start_date","sign_in_end_date");
		Form.dateTime("sign_out_start_date","sign_out_end_date");
	};
	
	
	/*查询按钮事件初始化*/
	this.initBtn = function(){
		/*查询*/
		$("#btn_search").on("click", function(){
			$dataTable.ajax.reload();
		});
		
		/*清空*/
		$("#btn_reset").on("click", function(){
			$("#conditionForm").find(":input").val("");
		});
	};
	
	/*根据account_id删除数据*/
	function delAccount(account_id){
		/*获取Id，调用后台删除数据*/
		tableSupport.removeById(mgr_path + "/user/deleteAccount", {"account_id" : account_id}, function(responseInfo){
			if(responseInfo.status == "0"){
				Noty.success(responseInfo.desc);
				$dataTable.ajax.reload();/*重新刷新数据*/
			}else{
				Noty.warning(responseInfo.desc);
			}
		});
	}
	
	function init(){
		$this.initTable();
		$this.initDateTimePicker();
		$this.initBtn();
	}
	
	init();
};
