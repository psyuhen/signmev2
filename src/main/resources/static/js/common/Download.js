/**
 * 下载功能的js封装
 * 
 * @author shijunkai
 */
var Download = function(param) {
	var $this = this;
	var _dialog = null;
	var downType = param.downType;
	var fileType = param.fileType;
	var tableId = param.tableId;
	var dialogId = "download_" + tableId + "_dialog";
	var serviceName = param.serviceName;
	var methodName = param.methodName;
	var paramType = param.paramType;
	var moduleName = param.moduleName;
	var columns = param.columns;
	var dataTable = param.dataTable;
	var conditions = param.conditions;

	/* 下载时可供选择的列名 */
	var columnNames = [];
	/* 传到后台的数据 */
	var data = {
		/* 查询数据的Service的全称 */
		serviceName : serviceName,
		/* 查询数据的方法名 */
		methodName : methodName,
		/* 查询方法的参数类型 */
		paramType : paramType,
		/* 菜单名称 */
		moduleName : moduleName,
		/* 下载文件类型 */
		fileType : fileType,
		/* 页面上表格ID，传到后台作文件名使用，在Excel中同时作sheet名称 */
		tableId : tableId,
		/* 展示数据的列名，传到后台作导出数据列的依据，在Excel中同时做列名 */
		columns : columns,
		/* 查询条件 */
		conditions : conditions,
		/* 查询起始位置，默认为1 */
		start : 1,
		/* 查询数据条数，默认为1000 */
		limit : 1000
	};

	var initButton = function() {
		if(!downType.enabled){
			return;
		}
		
		var toolbar = $("#" + tableId + "_wrapper div.toolbar");
		var download = '<div class="btn-group"><button id="downBtn" type="button" class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-download-alt"></i> 下载</button>';
		download += '<button class="btn dropdown-toggle btn-primary btn-sm" data-toggle="dropdown"><span class="caret"></span></button>';
		download += '<ul class="dropdown-menu">';
		
		for ( var key in downType.list) {
			if(downType.list[key].enabled){
				download += '	<li><a href="#" name="' + key + '"><i class="glyphicon glyphicon-file"></i> ' + downType.list[key].name + '</a></li>';
			}
		}
		
		download += '</ul>';
		download += '</div>';
		toolbar.html(download);
		/* 给下载按钮添加事件：下载或者申请下载 */
		toolbar.on("click", "#downBtn", function(evt) {
			/* 下载文件类型，默认为excel(xls) */
			var fileType = getFileType();
			if(fileType == ""){
				Noty.warning("未设置下载文件类型");
				return;
			}
			
			/* 根据shift键是否按下标记是否需要弹出窗以输入下载条数 */
			var needInput = false;
			if (evt.shiftKey) {
				needInput = true;
			}
			/* 将页面数据打包传送给弹出窗中的Form表单 */
			packageDownloadParameters(fileType, needInput);
		});
		/* 给下载按钮添加事件：下载或者申请下载 */
		toolbar.on("click", "ul", function(evt) {
			/* 根据事件判断下载文件类型 */
			var fileType = $(evt.target).attr("name");
			
			/* 标记是否需要弹出窗以输入下载条数 */
			var needInput = false;
			if (evt.shiftKey) {
				needInput = true;
			}
			/* 浏览器中shift键加链接会在新窗口中打开链接，下面一行代码禁用此快捷键功能 */
			evt.preventDefault();

			/* 将页面数据打包传送给弹出窗中的Form表单 */
			packageDownloadParameters(fileType, needInput);
		});
	}

	/**
	 * 将页面数据打包以便传送给弹出窗中的Form表单
	 */
	function packageDownloadParameters(fileType, needInput) {
		if (dataTable.data().length == 0) {
			Noty.warning("查询结果列表中没有数据，请先点击查询按钮进行查询!");
			return;
		} else {
			columnNames = [];
			for ( var name in dataTable.data()[0]) {
				if (name != "b_start_date" && name != "b_end_date"
						&& name != "b_order_name" && name != "b_order_asc"
						&& name != "start" && name != "limit") {
					columnNames.push(name);
				}
			}
		}
		if ($.trim(serviceName) == "") {
			Noty.warning("service_name not set in table's options, download abort!");
			return;
		}
		if ($.trim(methodName) == "") {
			Noty.warning("method_name not set in table's options, download abort!");
			return;
		}
		if ($.trim(paramType) == "") {
			Noty.warning("param_type not set in table's options, download abort!");
			return;
		}

		/* 获取结果集对应的查询条件 */
		var dataMap = dataTable.ajax.params();
		dataMap["start"] = undefined;
		dataMap["limit"] = undefined;
		/* 将查询条件转换为JSON格式的字符串 */
		var conditions = Download.dataMapToJOSN(dataMap);
		/* 添加数据 */
		data.fileType = fileType;
		data.conditions = conditions;

		$this.downloadOrApply(needInput);
	}

	/**
	 * 根据用户类别提交下载请求或下载申请
	 */
	this.downloadOrApply = function(needInput) {
		/* 先判断用户是否登录 */
		if (StringUtil.isBlank(_user)) {
			Noty.error("用户未登录或登录已超时，请登录后下载！");
			return;
		}
		tableSupport.get(ctx + "/mgr/user/isSuperUser", "", function(isSuperUser) {
			/* 判断是否是超级用户，如果不是，则添加需要申请标识 */
			if (!isSuperUser) {
				/* 当不是超级用户时，该值为true，表示需要申请下载 */
				var apply = true;
				/* 申请下载时，菜单名称不能为空 */
				if ($.trim(data.moduleName) == "") {
					Noty.warning("module_name not set in table's options, download abort!");
					return;
				}
			}
			/* 提交下载请求或下载申请 */
			$this.submit(apply, needInput);
		});
	};

	/**
	 * 提交下载请求或下载申请
	 */
	this.submit = function(apply, needInput) {
		var _apply = apply || false;
		var _needInput = needInput || false;
		/* 新建包含Form表单的弹出窗 */
		if (_dialog == null) {
			_dialog = new Dialog(geneOptions(_apply, _needInput));
			initEvent();
		}
		/* 如果是下载申请或需要输入下载条数，则显示弹出窗，默认不弹窗 */
		if (_apply || _needInput) {
			_dialog.show();
			if (_needInput) {
				$("#" + dialogId + " #fields").css("display", "block");
			} else {
				$("#" + dialogId + " #fields").css("display", "none");
			}
		} else {
			/* 否则，直接提交表单进行下载 */
			var form = $("#" + dialogId + " #downloadForm");
			for ( var item in data) {
				form.find("input[name=" + item + "]").val(data[item]);
			}
			setColumnsValue();
			form.submit();
		}
	}
	/**
	 * 获取新建弹出窗Dialog的参数options，主要包括：标题title、内容content、确认事件onConfirm
	 */
	function geneOptions(_apply) {
		/* 弹出窗标题 */
		var title = "提示";
		/* 弹出窗内容 */
		var content = "";

		/* Form表单action属性对应的URL */
		var url = "";
		if (_apply) {
			title = "下载申请";
			url = ctx + "/mgr/download/downloadApply";
		} else {
			title = "请输入下载条数：";
			url = ctx + "/mgr/download/";
		}
		/* 作为弹出窗内容的Form表单 */
		var form = '      <form id="downloadForm" action="' + url + '" method="post">';
		/* 将参数data转化为表单元素待提交 */
		if (data != "") {
			for ( var item in data) {
				if ("start" != item && "limit" != item) {
					form += '        <input name="' + item + '" type="hidden" />';
				}
			}
			var table = '        <div class="box-content">';
			table += '          <div class="row">';
			table += '            <div class="col-md-6">';
			table += '		        <div class="input-group">';
			table += '                <label class="input-group-addon" for="start">下载起始位置</label>';
			table += '                <input type="text" name="start" class="form-control" id="start" value="' + data.start + '" placeholder="下载起始位置">';
			table += '              </div>';
			table += '            </div>';
			table += '            <div class="col-md-6">';
			table += '		        <div class="input-group">';
			table += '                <label class="input-group-addon" for="limit">下载记录条数</label>';
			table += '                <input type="text" name="limit" class="form-control" id="limit" value="' + data.limit + '" placeholder="下载记录条数">';
			table += '              </div>';
			table += '            </div>';
			table += '          </div><br>';
			if (_apply) {
				table += '          <div class="row">';
				table += '            <div class="col-md-12">';
				table += '		        <div class="input-group">';
				table += '                <label class="input-group-addon" for="reason">申请下载事由</label>';
				table += '                <textarea name="reason" class="form-control" id="reason" placeholder="请输入申请事由"></textarea>';
				table += '              </div>';
				table += '            </div>';
				table += '          </div>';
			}
			table += '        </div>';
			form += table;
		}
		form += '      </form>';
		var fields = '';
		fields += '<div class="row" id="fields">';
		fields += '    <div class="box col-md-12">';
		fields += '        <div class="box-inner">';
		fields += '            <div class="box-header well">';
		fields += '                <h2><i class="glyphicon glyphicon-th"></i> 选择下载字段</h2>';
		fields += '            </div>';
		fields += '            <div class="box-content">';
		fields += '                <div class="row">';
		fields += '                    <div class="col-md-5">';
		fields += '                        <h5>未选字段：</h5>';
		fields += '                        <div class="well">';
		fields += '                            <ul class="nav nav-pills nav-stacked main_menu nav-list divul" style="height: 140px;overflow: auto;" id="canChoose">';
		for (var i = 0; i < columnNames.length; i++) {
			fields += '                            <li id="field_' + i + '"><a href="javascript:void(0);" title="' + columnNames[i] + '">' + columnNames[i] + '</a></li>';
		}
		fields += '                            </ul>';
		fields += '                        </div>';
		fields += '                    </div>';
		fields += '                    <div class="col-md-2">';
		fields += '                        <br /><br />';
		fields += '                        <div class="row"><a id="chooseField" class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="glyphicon glyphicon-arrow-right"></i> &nbsp;选&nbsp;择</a></div><br />';
		fields += '                        <div class="row"><a id="deleteField" class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="glyphicon glyphicon-arrow-left"></i> &nbsp;删&nbsp;除</a></div><br />';
		fields += '                        <div class="row"><a id="chooseAll" class="btn btn-primary btn-sm" href="javascript:void(0)">选择全部</a></div><br />';
		fields += '                        <div class="row"><a id="deleteAll" class="btn btn-primary btn-sm" href="javascript:void(0)">删除全部</a></div><br />';
		fields += '                    </div>';
		fields += '                    <div class="col-md-5">';
		fields += '                        <h5>选择字段：</h5>';
		fields += '                        <div class="well">';
		fields += '                            <ul class="nav nav-pills nav-stacked main_menu nav-list divul" style="height: 140px;overflow: auto;" id="hasChoose">';
		fields += '                            </ul>';
		fields += '                        </div>';
		fields += '                    </div>';
		fields += '                </div>';
		fields += '            </div>';
		fields += '        </div>';
		fields += '    </div>';
		fields += '</div>';
		content = form + fields;
		/* 确认事件：点击弹出窗的“确认”按钮触发 */
		var confirm = function() {
			/* 先校验输入参数 */
			if (checkInput()) {
				/* 如果是下载申请，先查看数据库中是否存在相应未审批数据 */
				if (_apply) {
					var _url = ctx + "/mgr/verify/isExist";
					var _data = {
						dl_table_id : data.tableId,
						module_name : data.moduleName,
						method_name : data.methodName,
						service_name : data.serviceName,
						dl_file_type : data.fileType
					};
					tableSupport.post(_url, _data, function(isExist) {
						if (isExist) {
							Noty.warning("下载申请已提交审核，请耐心等待！");
						} else {
							var form = $("#" + dialogId + " #downloadForm");
							var url = form.attr("action");
							data.start = form.find("#start").val();
							data.limit = form.find("#limit").val();
							data.reason = form.find("#reason").val();
							form.find("input[name=columns]").val(columns.join(","));
							setColumnsValue();
							data.columns = form.find("input[name=columns]").val();
							/* 通过Ajax方式而不是直接调用Form的submit方法，方便通过回调函数获取显示结果 */
							tableSupport.post(url, data, Noty.response);
						}
					});
				} else {
					var form = $("#" + dialogId + " #downloadForm");
					for ( var item in data) {
						if (item != "start" && item != "limit" && item != "reason") {
							form.find("input[name=" + item + "]").val(data[item]);
						}
					}
					setColumnsValue();
					form.submit();
				}
			}
		}
		return {
			show : false,
			simpleModal : false,
			id : dialogId,
			title : title,
			content : content,
			onConfirm : confirm
		};
		/* 校验输入参数 */
		function checkInput() {
			var startValue = $("#" + dialogId + " #start").val();
			if (!/^[1-9]([0-9])*$/.test(startValue)) {
				Noty.warning("下载起始位置不能为空且须为不以0开头的正整数！");
				return false;
			}
			var limitValue = $.trim($("#" + dialogId + " #limit").val());
			if (limitValue == "") {
				Noty.warning("下载记录条数不能为空！");
				return false;
			}
			if (isNaN(limitValue)) {
				Noty.warning("下载记录条数必须为数字！");
				return false;
			}

			var limit = parseInt(limitValue, 10);
			if (limit > 600000) {
				Noty.warning("下载记录条数不能大于600000！");
				return false;
			}
			if (limit <= 0) {
				Noty.warning("下载记录条数须大于0！");
				return false;
			}

			var reasonValue = $("#" + dialogId + " #reason").val();
			if (reasonValue != undefined) {
				var reason = $.trim(reasonValue);
				if (reason == "") {
					Noty.warning("申请下载事由不能为空！");
					return false;
				}
			}

			return true;
		}
	}

	/* 初始化 选择下载字段 的各种事件 */
	function initEvent() {
		/* 字段的鼠标点击事件 */
		$("#" + dialogId).on("click", "li", function() {
			if ($(this).hasClass("active")) {
				$(this).removeClass("active");
			} else {
				$(this).addClass("active");
			}
		});
		/* 字段的鼠标双击事件 */
		$("#" + dialogId + " #canChoose").on("dblclick", "li", function() {
			$("#" + dialogId + " #hasChoose").append($(this));
		});
		$("#" + dialogId + " #hasChoose").on("dblclick", "li", function() {
			$("#" + dialogId + " #canChoose").append($(this));
		});

		/* 选择按钮事件 */
		$("#" + dialogId).on("click", "#chooseField", function() {
			$("#" + dialogId + " #canChoose").find(".active").each(function() {
				$("#" + dialogId + " #hasChoose").append($(this));
				$(this).removeClass("active");
			});
		});
		/* 删除按钮事件 */
		$("#" + dialogId).on("click", "#deleteField", function() {
			$("#" + dialogId + " #hasChoose").find(".active").each(function() {
				$("#" + dialogId + " #canChoose").append($(this));
				$(this).removeClass("active");
			});
		});
		/* 全选按钮事件 */
		$("#" + dialogId).on("click", "#chooseAll", function() {
			$("#" + dialogId + " #canChoose").find("li").each(function() {
				$("#" + dialogId + " #hasChoose").append($(this));
				$(this).removeClass("active");
			});
		});
		/* 全删按钮事件 */
		$("#" + dialogId).on("click", "#deleteAll", function() {
			$("#" + dialogId + " #hasChoose").find("li").each(function() {
				$("#" + dialogId + " #canChoose").append($(this));
				$(this).removeClass("active");
			});
		});
	}

	/* 根据选择的下载字段设置值 */
	function setColumnsValue() {
		if ($("#" + dialogId).css("display") == "block"
				&& $("#" + dialogId + " #fields").css("display") == "block") {
			var columns = [];
			$("#" + dialogId + " #hasChoose").find("li").each(function() {
				columns.push($(this).text());
			});
			if (columns.length > 0) {
				$("#" + dialogId + " input[name=columns]").val(columns.join(","));
			}
		}
	}
	
	/* 默认的下载list*/
	var _downlist = {
		enabled:true,
		list : {
			xls:{enabled:true, name:"Excel(xls)"},
			xlsx:{enabled:true, name:"Excel(xlsx)"},
			txt:{enabled:true, name:"文本"},
			pdf:{enabled:true, name:"pdf"}
		}
	};
	
	//初始化只要enabled=true才初始化
	var init = function(){
		initDownlist();
		initButton();
	};
	
	//初始化下载列表
	var initDownlist = function (){
		if (typeof downType != "object") {
			downType = _downlist;
		}else if(downType.list == undefined){
			downType.list = _downlist.list;
		}else{
			var _list = downType.list;
			for ( var key in _downlist.list ) {
				if($.trim(downType.list[key]) === ""){//如果不设置，默认是开启的
					downType.list[key] = _downlist.list[key];
				}else if(downType.list[key].enabled){//如果开启了，看名字是否修改了，修改了即采用修改的
					var _name = downType.list[key].name;
					if($.trim(_name) === ""){//名称等于空时采用默认值
						downType.list[key].name = _downlist.list[key].name;
					}
				}
			}
		}
	};
	
	//获取下载的文件类型
	var getFileType = function(){
		var fileType = "";
		for ( var key in downType.list ) {
			if(downType.list[key].enabled){
				fileType = key;
				break;
			}
		}
		return fileType;
	};
	
	//初始化
	init();
};


Download.dataMapToJOSN = function(dataMap) {
	var conditions = "";
	var conditionMap = {};
	for ( var dataName in dataMap) {
		var dataValue = dataMap[dataName];
		if ($.trim(dataValue) != "") {
			if (StringUtil.endWith(dataName, "]")) {
				dataName = dataName.split("[")[0];
				var value = conditionMap[dataName] || "";
				dataValue = value + ",\"" + dataValue + "\"";
				conditionMap[dataName] = dataValue;
			} else if (StringUtil.startWith(dataValue, "[")
					&& StringUtil.endWith(dataValue, "]")) {
				conditions += "," + "\"" + dataName + "\":" + dataValue;
			} else {
				conditions += "," + "\"" + dataName + "\":\"" + dataValue + "\"";
			}
		}
	}
	for ( var conditionName in conditionMap) {
		var conditionValue = conditionMap[conditionName] || "";
		if (conditionValue != "" && StringUtil.startWith(conditionValue, ",")) {
			conditionValue = conditionValue.substring(1);
		}
		conditions += "," + "\"" + conditionName + "\":[" + conditionValue + "]";
	}
	if (conditions != "") {
		conditions = conditions.substr(1);
	}
	conditions = "{" + conditions + "}";

	return conditions;
}