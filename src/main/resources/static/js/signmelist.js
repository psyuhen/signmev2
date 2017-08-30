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
			"tableHeaders"		: ["记录ID","IP","MAC","姓名","签到日期","签到时间","签退日期","签退时间","最迟上班时间","控制签退时间","加班时间"],
			"columnNames"		: ["log_id","ip","mac","name",{"sign_in_date":statDateRender},{"sign_in_time":RenderUtil.hour},
				{"sign_out_date":RenderUtil.date},{"sign_out_time":RenderUtil.hour},{"late_time":RenderUtil.hour},
				{"early_time":RenderUtil.hour},{"ot_time":RenderUtil.hour}]
		});
		$dataTable = t.getDataTable();
		$table = t;
	};
	
	function statDateRender (data, type, row){
		if(data.indexOf("-") != -1){
			var s = data.split("-")[0];
			var e = data.split("-")[1];
			return DateUtil.dateFormat(s, "yyyy年MM月dd日")+"至"+DateUtil.dateFormat(e, "yyyy年MM月dd日");
		}
		
		return DateUtil.dateFormat(data, "yyyy年MM月dd日");
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
			
			if("5" === $("#sign_flag").val()){
				var start=$("#sign_in_start_date");
				if("" === start.val()){
					Noty.popover(start.parent(), "请输入签到开始时间！");
					start.focus();
					return ;
				}
				var end=$("#sign_in_end_date");
				if("" === end.val()){
					Noty.popover(end.parent(), "请输入签到结束时间！");
					end.focus();
					return ;
				}
			}
			
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
