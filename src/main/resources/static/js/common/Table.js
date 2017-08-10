/**
 * function:
 * Table.js
 * @author pansen
 * @createTime 2015-12-31 16:17:25
 */
var Table = function(options){
	var $this = this;
	/*默认为空*/
	options = options || {};
	
	var _table_id = options.table_id;
	var _url = options.url;
	var _type = options.type || "POST";
	/* table header*/
	var _tableHeaders = options.tableHeaders || [];
	/* 此列定义为dataTable 里面的列定义，要看dataTable的相关文档*/
	var _columnDefs = options.columnDefs || [];
	/* 此列定义为dataTable 里面的列定义，要看dataTable的相关文档*/
	var _columns = options.columns || [];
	/* 
	 * 增加columns field数组
	 * 数组里面可以{},也可以为字符串
	 * 1、{}: fieldName : render
	 * 2、"": fieldName
	 */
	var _columnNames = options.columnNames || [];
	var _tmpDefs = {};
	
	/* 默认为自动排序 */
	var _ordering = $.trim(options.ordering) == ""
						|| (options.ordering == true) ? true : false;
	/* 默认为自动查询数据 */
	var _auto_load = $.trim(options.autoLoad) == "" 
						|| (options.autoLoad == true)  ? null : 0;
	/*自定义输入默认的页数，默认为10条*/
	var _pageLength = options.pageLength || 10;
	
	/****************************DOWNLOAD*******************************/
	/* 默认是添加下载连接的*/
	var _download = options.download;
	/* 查询方法所在Service的全称，下载用 */
	var _service_name = options.service_name;
	/* 查询方法的名称，下载用 */
	var _method_name = options.method_name;
	/* 查询方法的参数类型 */
	var _param_type = options.param_type;
	/* 增加菜单名称module_name，供下载申请功能用 */
	var _module_name = options.module_name;
	
	/****************************FETCH CONDITION**************************/
	/* 增加condition form id */
	var _form_id = $.trim(options.formId);
	/* 此[]必须为list map的方法，map 为name/value */
	var _listMap = options.listMap || [];
	
	/****************************ROW BUTTON*******************************/
	/* 是否开启生成三个按钮（查看，编辑，删除）*/
	var _row_btn_enabled = options.row_btn_enabled || false;
	/* 添加生成按钮选项，默认为生成三个按钮（查看，编辑，删除）*/
	var _row_btn = options.row_btn || "111";
	/* 是否开启生成自定义按钮*/
	var _row_other_btn_enabled = options.row_other_btn_enabled || false;
	/* 生成其他按钮
	 * name 	: 按钮名称
	 * acls	 	: 连接的样式
	 * cls	 	: 图标样式 默认为glyphicon glyphicon-edit icon-white
	 * text 	: 按钮文本名称
	 * event	: 点击事件
	 * */
	var _row_other_btns = options.row_other_btns || [];
	
	/* 三个按钮（查看，编辑，删除）的回调事件*/
	var _btn_view_callback = options.btn_view_callback;
	var _btn_edit_callback = options.btn_edit_callback;
	var _btn_del_callback = options.btn_del_callback;
	
	/****************************CHECKBOX*****************************/
	/* 支持checkbox*/
	var _checkbox_enabled = options.checkbox_enabled || false;
	/* checkbox 名称*/
	var _checkbox_name = options.checkbox_name || "_checkbox_table";
	/* 获取row的值，放到value中，以#分隔*/
	var _checkbox_value_names = options.checkbox_value_names || [];
	/* checkbox回调事件*/
	var _checkbox_callback = options.checkbox_callback;
	
	/****************************RADIO*******************************/
	/* 支持radio*/
	var _radio_enabled = options.radio_enabled || false;
	/* radio 名称*/
	var _radio_name = options.radio_name || "_radio_table";
	/* 获取row的值，放到value中，以#分隔*/
	var _radio_value_names = options.radio_value_names || [];
	
	/****************************CONDITION VALIDATE*******************/
	/* Table的查询条件检验, 必须返回true/false.true表示检验通过,false表示检验失败*/
	var _condition_validate = options.condition_validate;
	var _draw_count = 0;
	
	/* 支持JS数据源,默认为服务器端*/
	var _dataSet = options.dataSet || "serverSide";
	var _dataList = options.dataList || [];
	
	var _dataTable = null;
	var _downloadObj = null;
	
	var $tableId = $("table[id=" + _table_id + "]");
	
	/* 增加表头自动生成*/
	function __tableHeaders(){
		var thSize = $tableId.find("th").length;
		var length = _tableHeaders.length;
		if(thSize == 0 && length == 0){
			Noty.warning("table header is not set");
			return false;
		}
		
		if(thSize == 0 && length > 0){
			$tableId.find("thead").remove();
			var thead = "<thead><tr>";
			for(var i = 0; i < length; i ++){
				var th = "<th>" + _tableHeaders[i] + "</th>";
				thead += th;
			}
			thead += "</tr></thead>";
			$tableId.append(thead);
		}
		
		return true;
	}
	
	/* 根据columnNames生成*/
	function __columns(){
		var _len = _columns.length, _name_len = _columnNames.length;
		if(_len == 0 && _name_len == 0){
			Noty.warning("columns is not set");
			return false;
		}
		
		if(_len == 0 && _name_len > 0){
			for(var i = 0; i < _name_len; i ++){
				var _name = _columnNames[i];
				if(typeof _name === "string"){
					_columns[i] = {"data" : _name,"defaultContent":''};
				}else if(typeof _name === "object"){//当字段名为{}对象时，只取出其字段名称
					for(key in _name){
						_columns[i] = {"data" : key,"defaultContent":''};
						break;
					}
				}
			}
		}
		
		return true;
	}
	
	/* 在第一列中里面生成checkbox*/
	function __checkboxHtml(){
		if(!_checkbox_enabled){
			return;
		}
		var checkbox = '<input type="checkbox" style="cursor:pointer;" />';
		
		/* 全选或者反选事件*/
		var allCheckbox = $(checkbox);
		allCheckbox.click(function (e) {
	        var $target = $("#" + _table_id + " input[name=" + _checkbox_name + "]");
			$target.prop("checked", $(this).is(":checked"));
	    });
		var $th = $("<th></th>");
		$th.append(allCheckbox);
		$tableId.find("thead tr").prepend($th);
		
		_columns.insert(0, { "data": null });
		
		var _column = {"targets": 0, "data": null, "orderable": false, "render": function(data, type, row){
			if(typeof _checkbox_callback == "function"){
				return _checkbox_callback(data, type, row);
			}
			
			/* 获取值，组装成xx#xx#xx的形式放到val中*/
			var $checkbox = allCheckbox.clone();
			$checkbox.attr("name", _checkbox_name);
			var $val = "";
			for (var i = 0; i < _checkbox_value_names.length; i++) {
				$val += row[_checkbox_value_names[i]];
				$val += "#";
			}
			
			if(StringUtil.endWith($val, "#")){
				$val = $val.substring(0, $val.length - 1);
			}
			$checkbox.val($val);
			
			return $checkbox.prop("outerHTML");
		}};
		//_columnDefs.insert(0, _column);
		_tmpDefs.checkbox = _column;
	}
	
	/* 在第一列中里面生成radio*/
	function __radioHtml(){
		if(!_radio_enabled){
			return;
		}
		var radio = '<input type="radio" style="cursor:pointer;" />';
		
		/* 全选或者反选事件*/
		var $radio = $(radio);
		var $th = $("<th>请选择</th>");
		$tableId.find("thead tr").prepend($th);
		
		_columns.insert(0, { "data": null });
		
		var _column = {"targets": 0, "data": null, "orderable": false, "render": function(data, type, row){
			/* 获取值，组装成xx#xx#xx的形式放到val中*/
			var $$radio = $radio.clone();
			$$radio.attr("name", _radio_name);
			var $val = "";
			for (var i = 0,len = _radio_value_names.length; i < len; i++) {
				$val += row[_radio_value_names[i]];
				$val += "#";
			}
			
			if(StringUtil.endWith($val, "#")){
				$val = $val.substring(0, $val.length - 1);
			}
			$$radio.val($val);
			
			return $$radio.prop("outerHTML");
		}};
		//_columnDefs.insert(0, _column);
		_tmpDefs.radio = _column;
	}
	
	/* 生成行Btn*/
	function __rowBtnHtml(){
		/* 生成按钮*/
		if(!_row_btn_enabled){
			return;
		}

		//首先要判断列是否相同
		var htmlTH = $tableId.find("thead th");
		/* HTML多列*/
		if(htmlTH.length > _columns.length){
			_columns.push({ "data": null });
		}else if(htmlTH.length < _columns.length){/* columns多列*/
			$tableId.find("thead tr").append("<th>操作</th>");
		}else{
			if($tableId.last().text() != "操作"){
				_columns.push({ "data": null });
				$tableId.find("thead tr").append("<th>操作</th>");
			}
		}
		
		var _btn_view_html = "<a class='btn btn-success btn-xs' name='_btn_view' href='javascript:void(0);'>	<i class='glyphicon glyphicon-zoom-in icon-white'></i> 查看</a> ";
		var _btn_edit_html = "  <a class='btn btn-info btn-xs'  name='_btn_edit' href='javascript:void(0);'>	<i class='glyphicon glyphicon-edit icon-white'></i> 编辑</a> ";
		var _btn_del_html = "  <a class='btn btn-danger btn-xs'  name='_btn_del' href='javascript:void(0);'>	<i class='glyphicon glyphicon-trash icon-white'></i> 删除</a> ";
		
		var _column = {"targets": -1, "data": null, "orderable": false, "defaultContent":null};
		var _defaultContent = "";
		if(_row_btn.charAt(0) == "1"){/* 查看*/
			_defaultContent += _btn_view_html;
			$tableId.on("click", "a[name='_btn_view']", function(evt){
				var $rowData = __rowData($(this).parents('tr'));
				_btn_view_callback($rowData);
			});
		}
		if(_row_btn.charAt(1) == "1"){/* 编辑*/
			_defaultContent += _btn_edit_html;
			$tableId.on("click", "a[name='_btn_edit']", function(evt){
				var $rowData = __rowData($(this).parents('tr'));
				_btn_edit_callback($rowData);
			});
		}
		if(_row_btn.charAt(2) == "1"){/* 删除*/
			_defaultContent += _btn_del_html;
			$tableId.on("click", "a[name='_btn_del']", function(evt){
				evt.preventDefault();
				var $rowData = __rowData($(this).parents('tr'));
				Dialog.create("删除", "确定需要删除吗?", function(){
					_btn_del_callback($rowData);
				});
			});
		}
		_column.defaultContent = _defaultContent;
		
		__otherBtn(_column);
		
//		_columnDefs.insert(0, _column);
		_tmpDefs.btn = _column;
	}
	
	/* 获取行数据*/
	function __rowData(trObj){
		return _dataTable.row(trObj).data();
	}
	
	/* 其他事件的生成*/
	function __otherBtn(column){
		/* 生成按钮*/
		if(!_row_other_btn_enabled){
			return;
		}
		
		var _length = _row_other_btns.length;
		var _btn_html = "  <a class=''  name='' href='javascript:void(0);'>	<i class=''></i> </a> ";
		var _btn_html_obj = $(_btn_html);
		for(var i = 0; i < _length; i ++){
			var _name = _row_other_btns[i].name;
			var _class = _row_other_btns[i].cls || "glyphicon glyphicon-edit icon-white";
			var _aclass = _row_other_btns[i].acls || "btn btn-info btn-xs";
			var _event = _row_other_btns[i].event;
			var _text = _row_other_btns[i].text || "自定义按钮" + i;
			
			var _clone = _btn_html_obj.clone();
			_clone.addClass(_aclass).attr("name", _name).find("i").addClass(_class).end().append(" " + _text);
			
			column.defaultContent += " " + _clone.prop("outerHTML");
			bindEvent(_event, _name);
		}
	}
	/* 给其它按钮绑定事件 */
	function bindEvent(_event, _name){
		$tableId.on("click", "a[name='" + _name + "']", function(evt){
			evt.preventDefault();
			var $rowData = __rowData($(this).parents('tr'));
			
			_event($rowData);
		});
	}
	/* 生成columnDefs，默认跟columnNames配对使用*/
	function __columnDefs(){
		var defLen = _columnDefs.length;
		if(defLen == 0){
			var i = (_checkbox_enabled || _radio_enabled) ? 1 : 0;
			var j = 0;
			for(var len = _columns.length; i < len; i ++){
				var _name = _columnNames[j ++];
				if(typeof _name === "object"){
					var render;/*格式化*/
					var visible = _name["visible"]||true;/*字段可见性,可在columnNames或者columnDefs中配置*/
					for(key in _name){
						render = _name[key];
						break;
					}
					
					_columnDefs.push({
						"visible":visible,
						"render" : render,
						"targets": i
					})
				}
			}
		}
		
		if(_checkbox_enabled){
			_columnDefs.push(_tmpDefs.checkbox);
		}
		
		if(_radio_enabled){
			_columnDefs.push(_tmpDefs.radio);
		}
		
		if(_row_btn_enabled){
			_columnDefs.push(_tmpDefs.btn);
		}
	}
	
	/*默认初始化一个dataTable，不用每个人都自己操作一遍*/
	function _init(){
		$tableId.removeClass().addClass("table table-striped table-bordered hover").attr("width", "100%");
		
		/* 表头生成*/
		if(!__tableHeaders()){
			return;
		}
		
		/* 列生成*/
		if(!__columns()){
			return;
		}
		
		if(_checkbox_enabled && _radio_enabled){
			Noty.warning("表格中不能同时存在checkbox 和 radio");
			return;
		}
		
		/* 表格按钮、复选框生成*/
		__rowBtnHtml();
		__checkboxHtml();
		__radioHtml();
		
		/* render生成*/
		__columnDefs();
		
		/* 定义事件*/
		/**
		 * @e jQuery event object
		 * @settings DataTables settings object  DataTables.Settings
		 * @json Data returned from the server. This will be null if triggered by the Ajax error callback.
		 * @xhr Since 1.10.7: jQuery XHR object that can be used to access the low level Ajax options.
		 */
		$tableId.on({
			/*"processing.dt":function(e, settings, show){
				if (show) {
					$(settings.aanFeatures.r).css({
						'background-color':'#d6e9c6',
						'color': '#468847',
						"font-weight":"bold"
					});
				}
			},*/
			//当ajax加载完成时调用
			"xhr.dt": function(e, settings, json, xhr){
				if(xhr.status === 200){
					if(xhr.responseText.indexOf("记住用户名和密码") > -1){
						Noty.error("登录超时,请先登录!");
					}
				}else{
					Noty.error("数据加载失败！");
				}
			}
		});
		
		var map = {
			/*横坐标滚动*/
	        "scrollX": true,
	        /*列数据显示，可以显示一些特殊要求的数据*/
	        "columnDefs": _columnDefs,
	        /*显示第一页,前一页，数字页数，后一页，最后一页*/
	        "pagingType": "full_numbers",
	        /*默认每页显示的条数*/
	        "pageLength": _pageLength,
	        /*更改每页的页数，以及一些页的信息*/
	        "language": {
	        	"lengthMenu"	: "显示<select class='form-inline' style='cursor:pointer;'>"
					        		+ "<option value='10'>10</option>" 
					        		+ "<option value='20'>20</option>" 
					        		+ "<option value='50'>50</option>" 
					        		+ "<option value= '100'>100</option>" 
					        		+ "<option value= '500'>500</option>" 
					        		+" </select> 页数",
	    		"zeroRecords"	: "没有数据",
	            "info"			: "当前 _PAGE_ / _PAGES_ 页,共 _TOTAL_ 条记录",
	            "infoEmpty"		: "没有可用数据",
	            /*上一页下一页信息*/
	            "paginate"		: {
				                	first:      "首页",
				                	previous:   "上一页",
				                	next:       "下一页",
				                	last:       "尾页"
				                },
	            /*显示加载中*/
	            "processing"	: "正在加载中...请稍候！",
	            "loadingRecords": "数据加载中...请稍候！",
	            /*搜索框*/
	            "search"		: "搜索"
	        },
	        "preDrawCallback" : function (settinngs){
	        	if($.isFunction(_condition_validate) && _draw_count > 0){
					return _condition_validate();
				}
	        	_draw_count ++;
	        	return true;
	        },
	        "columns": _columns,
	         /*这个dom可以控制表格摆的位置等
	          * l - Length changing
				f - Filtering input
				t - The Table!
				i - Information
				p - Pagination
				r - pRocessing
				< and > - div elements
				<"#id" and > - div with an id
				<"class" and > - div with a class
				<"#id.class" and > - div with an id and class
	          * */
	        "dom": '<"toolbar"><"row"<"col-sm-12"tr>><"row"<"col-sm-6"l><"col-sm-6"f>><"row"<"col-sm-5"i><"col-sm-7"p>>'
		};
		//是否排序的
		map["ordering"] = _ordering;
		
		//服务器端
		if("serverSide" == _dataSet){
			map["deferLoading"] = _auto_load;
			map["processing"] = true;
			map["serverSide"] = true;
			map["deferRender"] = true;
			map["ajax"] = {
		        	"url": _url,
		        	"type": _type,
		        	//"dataSrc": "",/*这个用来控制数据源格式的，得注意一下*/
		        	/**
		        	 * @param data :Object {draw: 6, columns: Array[5], order: Array[1], start: 10, length: 10…}
		        	 * @param setting
		        	 */
		        	"data": function(data, setting){
		        		
		        		var listMap;
		        		if(_form_id == ""){
		        			listMap = _listMap;
		        		}else{
		        			listMap = Form.getValue(_form_id);
		        		}
		        		
		        		var dataMap = {};
		        		for(map in listMap){
		        			if($.trim(listMap[map].value) != ""){
		        				dataMap[listMap[map].name] = listMap[map].value;
		        			}
		        		}
		        		
		        		/* 如果排序，即获取排序字段*/
		        		if(_ordering){
		        			/*查询排序的字段名*/
			        		var columnId = data.order[0].column;
			        		var orderName = data.columns[columnId].data;/*为字段名*/
			        		/*查询排序的顺序是正序还是倒序*/
			        		var dir = data.order[0].dir;/*会是asc和desc*/
			        		/*增加排序与分页的数据*/
			        		dataMap["b_order_name"] = orderName;
			        		dataMap["b_order_asc"] = dir;
		        		}
		        		
		        		dataMap["start"] = data.start + 1;
		        		dataMap["limit"] = data.length;
		        		
		        		return dataMap;
		        	}
		        };
		}else{
			map["data"] = _dataList;
		}
		
		_dataTable = $tableId.DataTable(map);

		/* 获取展示列 */
		var columns = [];
		for ( var column in _columns) {
			if ($.trim(_columns[column].data) != "") {
				columns.push(_columns[column].data);
			}
		}

		var downParam = {
			downType : _download,
			tableId : _table_id,
			serviceName : _service_name,
			methodName : _method_name,
			paramType : _param_type,
			moduleName : _module_name,
			columns : columns,
			dataTable : _dataTable
		};
		_downloadObj = new Download(downParam);
	}
	
	/*静静地初始化*/
	_init();
	
	/*暴露一下获取dataTable的方法*/
	this.getDataTable = function(){
		return _dataTable;
	};
	
	/*暴露一下获取download的方法*/
	this.getDownload = function(){
		return _downloadObj;
	};
	
	/*修正输入条件不能查询的Bug.在点击查询后必须重设一下此listMap*/
	this.setListMap = function(listMap){
		listMap = listMap || [];
		_listMap = listMap;
	};
	
	/* 获取所有选中的checkbox*/
	this.getCheckboxValues = function(){
		if(!_checkbox_enabled){
			return [];
		}
		var $target = $tableId.find("input[name=" + _checkbox_name + "]:checked");
		
		var checkboxVals = [];
		$target.each(function(){
			checkboxVals.push($(this).val());
		});
		
		return checkboxVals;
	}
	
	/* 获取选中的radio*/
	this.getRadioValue = function(){
		if(!_radio_enabled){
			return "";
		}
		var $target = $tableId.find("input[name=" + _radio_name + "]:checked");
		return $target.val();
	}
};
