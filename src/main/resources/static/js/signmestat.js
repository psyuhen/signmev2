var SignmeStatList = function (options){
	var $this = this;
	var $dataTable = null;
	var $table = null;
	
	/*初始化数据表格*/
	this.initTable = function(){
		var t = new Table({
			"table_id"	: "signmeStatList",
			"download"			: {enabled:false},
			"row_btn_enabled"	: false,
			"service_name"	: "com.huateng.signmev2.service.system.SignmeStatService",
			"method_name"	: "queryAccount",
			"param_type"	: "com.huateng.signmev2.model.system.SignmeStat",
			"module_name"	: "用户管理",
			"url"		: "/signmev2/mgr/signmestat/queryForListPage",
			"formId"			: "conditionForm",
			"tableHeaders"		: ["签到日期","MAC","姓名","签到","签退","加班"],
			"columnNames"		: [{"stat_date":statDateRender},"mac","name","sign_in","sign_out","sign_ot"]
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
		Form.dateTime("b_start_date","b_end_date");
		Form.dateTime("curr_date");
	};
	
	
	/*查询按钮事件初始化*/
	this.initBtn = function(){
		/*查询*/
		$("#btn_search").on("click", function(){
			
			if("1" === $("#stat_flag").val()){
				var start=$("#b_start_date");
				if("" === start.val()){
					Noty.popover(start.parent(), "请输入签到开始时间！");
					start.focus();
					return ;
				}
				var end=$("#b_end_date");
				if("" === end.val()){
					Noty.popover(end.parent(), "请输入签到结束时间！");
					end.focus();
					return ;
				}
			}
			
			$dataTable.ajax.reload();
		});
		
		$("#procSignmeStat").on("click", function(){
			var $cd = $("#curr_date");
			var curr_date = $cd.val();
			if($.trim(curr_date) == ""){
				Noty.popover($cd.parent(), "请输入批量日期");
				$("#curr_date").focus();
				return;
			}
			
			tableSupport.post("/signmev2/proc/"+curr_date, {}, function(resp){
				Noty.alert(resp.desc);
			});
		});
		
		/*清空*/
		$("#btn_reset").on("click", function(){
			$("#conditionForm").find(":input").val("");
		});
	};
	
	function init(){
		$this.initTable();
		$this.initDateTimePicker();
		$this.initBtn();
	}
	
	init();
};
