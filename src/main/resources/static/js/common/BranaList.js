/**
 * function 
 * 机构表
 * @author sam.pan
 */
var BranaList = function(options){
	var _url = cfrm_path + "/brana/queryBranAreaPage";
	var $dataTable = null;
	var $table = null;
	var $dialog = null;
	var $radioValue = "";
	
	function table(){
		var t = new Table({
			"table_id"			: "brana_dialog_list",
			"autoLoad"			: false,
			"ordering"			: false,
			"row_btn_enabled"	: false,
			"download"			: {enabled:false},
			"radio_enabled"		: true,
			"radio_value_names"	: ["bran_no","bran_name"],
			"url"				: _url,
			"formId"			: "dialogConditionForm",
			"tableHeaders"		: ["网点名称"],
			"columnNames"		: ["bran_name"]
		});
		$dataTable = t.getDataTable();
		$table = t;
	}
	
	function condition(){
		var html = '';
		html += '<div class="row">';
		html += ' <div class="col-md-12">';
		html += '    <label class="control-label" for="_dialog_brana_name">网点名称</label>';
		html += '    <div class="form-inline input-group">';
		html += '        <input type="text" name="bran_name" class="form-control" id="_dialog_brana_name" placeholder="网点名称">';
		html += '        <span class="input-group-addon" style="cursor: pointer;" title="查询"><i class="glyphicon glyphicon-search red" id="searchDialogBarana"></i></span>';
		html += '    </div>';
		html += '</div>';
		
		return html;
	}
	//绑定查询事件
	function event(){
		$("#searchDialogBarana").bind("click",function (){
			if($dataTable != null){
				$dataTable.ajax.reload();
			}
		});
	}
	//初始化Dialog
	function init(){
		var _condtion = Html.form(condition(), "", "dialogConditionForm");
		var table = Html.table("brana_dialog_list");
		
		var dialog = new Dialog({"id": options.id || "_brana_dialog","width": "900px",
				"onShown" : function(){
					$("#searchDialogBarana").click();
				},
				"onHidden" : options.onHidden,
				"onConfirm": function(){
					if($table != null){
						$radioValue = $table.getRadioValue();
						if($radioValue == ""){
							Noty.warning("请选择网点");
						}
					}
				} ,"title": "选择网点","content": _condtion + table});
		return dialog;
	}
	
	$dialog = init();
	event();
	table();
	
	//获取Dialog
	this.getDialog = function(){
		return $dialog;
	}
	
	//获取Radio的值
	this.getRadioValue = function(){
		return $radioValue;
	}
};