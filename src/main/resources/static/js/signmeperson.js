var SignmePerson = function (options){
	var $this = this;
	var $dataTable = null;
	var $table = null;
	
	/*初始化数据表格*/
	this.initTable = function(){
		var t = new Table({
			"table_id"	: "signmePerson",
			"download"			: {enabled:false},
			"row_btn_enabled"	: true,
			"btn_view_callback"	: btnViewEvent,
			"btn_edit_callback"	: btnEditEvent,
			"btn_del_callback"	: btnDelEvent,
			"service_name"	: "com.huateng.signmev2.service.system.SignpersonService",
			"method_name"	: "queryAccount",
			"param_type"	: "com.huateng.signmev2.model.system.Signperson",
			"module_name"	: "用户管理",
			"url"		: "/signmev2/mgr/signmeperson/queryForListPage",
			"formId"			: "conditionForm",
			"tableHeaders"		: ["MAC","姓名"],
			"columnNames"		: ["mac","name"]
		});
		$dataTable = t.getDataTable();
		$table = t;
	};
	
	/*初始化日期控件*/
	this.initDateTimePicker = function(){
	};
	
	/* 查看*/
	function btnViewEvent($rowData){
		var mac = $rowData.mac;
		var name = $rowData.name;
		
		var dialog = new Dialog({"onConfirm": function(){},"onShow":function(){
			$("#_dialog_win #mac1").val(mac);
			$("#_dialog_win #name1").val(name);
			
			$("#_dialog_win #mac1").attr("readonly",true);
			$("#_dialog_win #name1").attr("readonly",true);
		} ,"title": "查看","content": $("#addperson").html()});
		dialog.show();
	}
	
	/* 编辑*/
	function btnEditEvent($rowData){
		var mac = $rowData.mac;
		var name = $rowData.name;
		
		var dialog = new Dialog({"onConfirm": function(){
			var mac = $("#_dialog_win #mac1").val();
			var name = $("#_dialog_win #name1").val();
			if($.trim(mac) == ""){
				Noty.error("Mac地址不能为空");
				return;
			}
			if($.trim(name) == ""){
				Noty.error("姓名不能为空");
				return;
			}
			
			tableSupport.update("/signmev2/mgr/signmeperson/updateperson", {"mac" : mac, "name":name}, function(responseInfo){
				if(responseInfo.status == "0"){
					Noty.success(responseInfo.desc);
					$dataTable.ajax.reload();/*重新刷新数据*/
				}else{
					Noty.warning(responseInfo.desc);
				}
			});
		},"onShow":function(){
			$("#_dialog_win #mac1").val(mac);
			$("#_dialog_win #name1").val(name);
			$("#_dialog_win #mac1").attr("readonly",true);
		} ,"title": "编辑","content": $("#addperson").html()});
		dialog.show();
	}
	
	/* 删除*/
	function btnDelEvent($rowData){
		deletePerson($rowData.mac);
	}
	
	/*查询按钮事件初始化*/
	this.initBtn = function(){
		/*查询*/
		$("#btn_add").on("click", function(){
			var dialog = new Dialog({"onConfirm": function(){
				var mac = $("#_dialog_win #mac1").val();
				var name = $("#_dialog_win #name1").val();
				if($.trim(mac) == ""){
					Noty.error("Mac地址不能为空");
					return;
				}
				if($.trim(name) == ""){
					Noty.error("姓名不能为空");
					return;
				}
				
				tableSupport.insert("/signmev2/mgr/signmeperson/addperson", {"mac" : mac, "name":name}, function(responseInfo){
					if(responseInfo.status == "0"){
						Noty.success(responseInfo.desc);
						$dataTable.ajax.reload();/*重新刷新数据*/
					}else{
						Noty.warning(responseInfo.desc);
					}
				});
				
			},"title": "新增","content": $("#addperson").html()});
			dialog.show();
		});
		
		$("#btn_search").on("click", function(){
			$dataTable.ajax.reload();
		});
		
		/*清空*/
		$("#btn_reset").on("click", function(){
			$("#conditionForm").find(":input").val("");
		});
	};
	
	/*根据account_id删除数据*/
	function deletePerson(mac){
		/*获取Id，调用后台删除数据*/
		tableSupport.remove("/signmev2/mgr/signmeperson/deleteperson", {"mac" : mac}, function(responseInfo){
			if(responseInfo.status == "0"){
				Noty.success(responseInfo.desc);
				$dataTable.ajax.reload();/*重新刷新数据*/
			}else{
				Noty.error(responseInfo.desc);
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
