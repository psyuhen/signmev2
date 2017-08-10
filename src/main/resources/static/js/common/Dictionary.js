/**
 * function:
 * Dictionary.js
 * @author pansen
 * @createTime 2015-12-23 16:17:25
 */
var Dictionary = function(options){
	var $this = this;
	
	/** 
	 * <pre>
	 * dictnames 格式：
	 * 	[{"comboId" : "","dictname": "","sync":"","callback":function(){}}]
	 * comboId可以为字符串也可以为jQuery对象
	 * dictname为字典的名称
	 * sync为sync(同步)和async(异步)
	 * </pre>
	 * */
	var _dictnames = options.dictnames || [];
	/* 是否添加空行的标志*/
	var _emptyOption = options.emptyOption || false;
	
	var _tmpDictnames = {};
	
	/* 相同的dictname不再重复请求*/
	function __handleDictname(){
		var length = _dictnames.length;
		for (var i = 0; i < length; i++) {
			var dictnameObj = _dictnames[i];
			var dictnameArr = _tmpDictnames[dictnameObj.dictname] || [];
			dictnameArr.push(dictnameObj);
			
			_tmpDictnames[dictnameObj.dictname] = dictnameArr;
		}
	}
	
	/**
	 * 根据dd_dictname和dd_enabled查询
	 * 对应的数字字典
	 * @param dd_dictname 
	 * @param dd_enabled 0/1
	 */
	this.queryDictBy = function(dd_dictname, dd_enabled, callback){
		tableSupport.get(ctx + "/mgr/dict/queryBy", {
			"dd_dictname" : dd_dictname,
			"dd_enabled"  : dd_enabled
		} , callback);
	};
	/**
	 * 根据dd_dictname和dd_enabled查询(同步)
	 * 对应的数字字典
	 * @param dd_dictname 
	 * @param dd_enabled 0/1
	 */
	this.synchQueryDictBy = function(dd_dictname, dd_enabled, callback){
		tableSupport.synchGet(ctx + "/mgr/dict/queryBy", {
			"dd_dictname" : dd_dictname,
			"dd_enabled"  : dd_enabled
		} , callback);
	};
	
	/**
	 * 根据dd_dictname和dd_enabled查询
	 * 对应的数字字典,其中dd_enabled默认为1
	 * @param dd_dictname 
	 */
	this.queryDictByName = function(dd_dictname, callback){
		$this.queryDictBy(dd_dictname, 1, callback);
	};
	/**
	 * 根据dd_dictname和dd_enabled查询(同步)
	 * 对应的数字字典,其中dd_enabled默认为1
	 * @param dd_dictname 
	 */
	this.synchQueryDictByName = function(dd_dictname, callback){
		$this.synchQueryDictBy(dd_dictname, 1, callback);
	};
	
	
	/**
	 * 根据dd_dictname查询
	 * 对应的数字字典
	 * @param dd_dictname 
	 */
	this.queryDictOnlyByName = function(dd_dictname, callback){
		tableSupport.get(ctx + "/mgr/dict/queryDictOnlyByName", {
			"dd_dictname" : dd_dictname
		} , callback);
	};
	
	/**
	 * 根据dd_dictname查询
	 * 对应的数字字典
	 * @param dd_dictname 
	 */
	this.queryOnlyByName = function(dd_dictname, callback){
		$this.queryDictOnlyByName(dd_dictname, callback);
	};
	
	/**
	 * 查询数据并渲染下拉列表
	 * 它依赖于options
	 * @see #options.dictnames
	 */
	this.renderCombo = function(){
		__handleDictname();
		
		for ( var dictname in _tmpDictnames) {
			var _dictnameArr = _tmpDictnames[dictname];
			var sync = false;
			for (var i = 0, len = _dictnameArr.length; i < len; i++) {
				var dictnameObj = _dictnameArr[i];
				if($.trim(dictnameObj.sync) === "true"){
					sync = true;
					break;
				}
			}
			
			__query(dictname, sync, _dictnameArr);
		}
	};
	/* 同步或者异步查询*/
	function __query(dictname, sync, dictnameArr){
		//先从本地缓存中获取，能获取到就取本地缓存的数据
		var tmp = Storage.getItem(dictname);
		tmp = $.trim(tmp);
		if(tmp !== ""){
			var map = JSON.parse(tmp);
			__render(dictnameArr, __mapToList(map));
			return;
		}
		
		if(!sync){/*异步*/
			$this.queryDictByName(dictname, function(list){
				__addItem(dictname, list);
				__render(dictnameArr, list);
			});
		}else{
			$this.synchQueryDictByName(dictname, function(list){
				__addItem(dictname, list);
				__render(dictnameArr, list);
			})
		}
	}
	/* map转为list*/
	function __mapToList(map){
		var list = [];
		for(key in map){
			list.push({"dd_id": key, "dd_text": map[key]});
		}
		return list;
	}
	
	/* 加到缓存中*/
	function __addItem(dictname, list){
		var dicttext = {};
		for (var i = 0, len = list.length; i < len; i++) {
			dicttext[list[i].dd_id] = list[i].dd_text;
		}
		Storage.addItem(dictname, JSON.stringify(dicttext));
	}
	
	/* 获取Option的html*/
	function __OptionHtml(list){
		var html = "";
		/* 添加空行*/
		if(_emptyOption){
			html += SOption("", "请选择...");
		}
		
		for (var i = 0, len = list.length; i < len; i++) {
			html += SOption(list[i].dd_id, list[i].dd_text);
		}
		
		return html;
	}
	
	/* 渲染option*/
	function __render(dictnameArr, list){
		var html = __OptionHtml(list);
		for (var i = 0, len = dictnameArr.length; i < len; i++) {
			var comboId = dictnameArr[i].comboId;
			if(typeof comboId == "string"){
				$("#" + comboId).append(html);;
			}else if(Array.isArray(comboId)){/* 增加对相同dictname的多个Id进行赋值*/
				for (var j = 0, length = comboId.length; j < length; j++) {
					$("#" + comboId[j]).append(html);
				}
			}else {
				comboId.append(html);
			}
			
			if(typeof dictnameArr[i]["callback"] === "function"){
				dictnameArr[i].callback(list);
			}
		}
	}
	
	/* 默认自动生成*/
	$this.renderCombo();
};