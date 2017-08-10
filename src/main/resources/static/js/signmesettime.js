var SignmeSetTime = function (options){
	var $this = this;
	var $dataTable = null;
	
	/*初始化日期控件*/
	this.initDateTimePicker = function(){
		Form.dateTime("late_time",null,"HHmmss");
		Form.dateTime("early_time",null,"HHmmss");
		Form.dateTime("ot_time",null,"HHmmss");
	};
	
	this.initData = function(){
		//
		
		tableSupport.post("/signmev2/mgr/signmesettime/query", {}, function(list){
			if(list == null){
				return;
			}
			
			for(var i = 0;i<list.length;i++){
				var dd = list[i];
				var name = dd.dd_name;
				var val = dd.dd_id;
				
				$("#" + name.toLowerCase()).val(val);
			}
			
		});
	}
	
	/*查询按钮事件初始化*/
	this.initBtn = function(){
		/*查询*/
		$("#btn_add").on("click", function(){
			var late_time=$("#late_time").val();
			var early_time=$("#early_time").val();
			var ot_time=$("#ot_time").val();
			
			var obj = {};
			obj.late_time = late_time;
			obj.early_time = early_time;
			obj.ot_time = ot_time;
			
			tableSupport.update("/signmev2/mgr/signmesettime/updateBatch", obj, function(responseInfo){
				if(responseInfo.status == "0"){
					Noty.success(responseInfo.desc);
				}else{
					Noty.error(responseInfo.desc);
				}
			});
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
		$this.initDateTimePicker();
		$this.initData();
		$this.initBtn();
	}
	
	init();
};
