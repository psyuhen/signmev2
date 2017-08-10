/**
 * function:
 * Form.js
 * @author pansen
 * @createTime 2016-01-08 16:17:25
 */
var Form = function (){};

/**
 * 设置Form下面所有:input字段为readonly,但不包括button
 * @param formId Form 的Id，必传
 * @param isReadOnly 若此字段不输入，默认为true
 */
Form.setReadOnly = function(formId, isReadOnly){
	isReadOnly = $.trim(isReadOnly) == "" ? true : isReadOnly;
	
	$("#" + formId).find(":input:not(:button)").attr("readonly", isReadOnly);
};
/**
 * 设置Form下面所有:input字段为Disabled,但不包括button
 * @param formId  Form 的Id，必传
 * @param isReadOnly 若此字段不输入，默认为true
 */
Form.setDisabled = function(formId, isDisabled){
	isDisabled = $.trim(isDisabled) == "" ? true : isDisabled;
	
	$("#" + formId).find(":input:not(:button)").prop("disabled", isDisabled);
};
/**
 * 重置FormId
 * @param formId
 */
Form.reset = function(formId){
	var formIdObj = null;
	if(typeof formId === 'string'){
		formIdObj = $("#" + formId);
	}else{
		formIdObj = formId;
	}
	
	formIdObj.find(":input:not(:checkbox,:radio,:button,:hidden)").val("");
	formIdObj.find("select").val("").trigger("chosen:updated");
	formIdObj.find(":checkbox,:radio").prop("checked", false);
};
/**
 * 获取id的值
 * @param _id
 * @returns {*|{}}
 */
Form.id = function(_id){
	var _idObj = null;
	if(typeof _id === 'string'){
		_idObj = $("#" + _id);
	}else{
		_idObj = _id;
	}

	return _idObj.val();
}
/**
 * 给Form里面的字段赋值
 * @param map map对象(可以任何bean对象)
 */
Form.setValue = function(map){
	if(map == null){
		return;
	}
	for(key in map){
		$("#" + key).val(map[key]);
	}
};

/**
 * 主要是serializeArray()方法不获取disabled的元素，此方法重写来获取disabled
 * @param formId
 */
Form.form = function(formId){
	var list = [];
	$("#" + formId).find(":input:not(button)").each(function(){
		var name = $(this).prop("name");
		if($.trim(name) != ""){
			var type = $(this).prop("type");
			if(("checkbox" !== type && "radio" !== type)
					//只提交radio或者checkbox选中的
					|| (("checkbox" === type ||"radio" === type) 
							&& $(this).is(":checked"))){
				var map = {};
				map.name = name;
				map.value = $.trim($(this).val());
				list.push(map);
			}
		}
	});
	
	return list;
};

/**
 * 增加获取规则号的方法
 * @param formId formId/conditionId
 * @returns
 */
Form.getValue = function(formId){
	var array = Form.form(formId);
	
	var flagMap = {};
	for (var i = 0; i < array.length; i++) {
		var obj = array[i];
		
		if(StringUtil.endWith(obj.name, "[]")){
			var prefixLength = obj.name.indexOf("[") + 1;
			var suffixLength = obj.name.length;
			
			var number = flagMap[obj.name] || 0;
			array[i] = {
				"name" : obj.name.slice(0, prefixLength) + number + obj.name.slice(prefixLength, suffixLength),
				"value": $.trim(obj.value)
			};
			
			number ++;
			flagMap[obj.name] = number;
		}
	}
	
	return array;
};
/**
 * 增加获取规则号的方法
 * @param formId formId/conditionId
 * @returns
 */
Form.getValue2Download = function(formId){
	var array = $("#" + formId).serializeArray();
	
	var valueAarray = [];
	/* 把规则号的[]去掉变成json的list方式*/
	var flagMap = {};
	for (var i = 0; i < array.length; i++) {
		var obj = array[i];
		
		if(StringUtil.endWith(obj.name, "[]")){
			var prefixLength = obj.name.indexOf("[");
			
			var listname = obj.name.slice(0, prefixLength);
			var list = flagMap[listname] || [];
			
			list.push(obj.value);
			
			flagMap[listname] = list;
		}else{
			valueAarray.push(obj);
		}
	}
	for ( var key in flagMap) {
		var $val = flagMap[key].join("\",\"");
		$val = "[\"".concat($val).concat("\"]");
		valueAarray.push({
			"name" : key,
			"value": $val
		})
	}
	
	return valueAarray;
};
/**
 * 根据表单ID获取表单中字段名称中英文对照信息
 * @param formId formId/conditionId
 */
Form.getName = function(formId) {
	var nameMap = {};
	$("#" + formId).find("label").each(function() {
		var input = $(this).find(" ~ :input");
		if (input.length == 0) {
			input = $(this).find(" ~ div").find(":input");
		}
		var nameEn = input.attr("name");
		var nameCn = this.innerText;
		nameMap[nameEn] = nameCn;
	});
	return nameMap;
};

/**
 * 查询上报分行
 * @param selectId 下拉框Id
 * @param isChosen 是否为chosen下拉框
 */
Form.rptBank = function(selectId, isChosen){
	var _key = "__RPT_BANK";
	var _list = [];
	//先从本地缓存中获取，能获取到就取本地缓存的数据
	var tmp = Storage.getItem(_key);
	tmp = $.trim(tmp);
	if(tmp !== ""){
		var list = JSON.parse(tmp);
		_list = list;
	}else{
		//本地没有先查询数据库
		tableSupport.synchGet(cfrm_path + "/brana/rptbank", {}, function(list){
			_list = list;
			Storage.addItem(_key, JSON.stringify(list));
		});
	}
	
	var selectIdObj = $("#" + selectId);
	selectIdObj.empty();
	
	selectIdObj.append(SOption("", "请选择..."));
	
	var length = _list.length;
	for (var i = 0; i < length; i++) {
		var branaArea = _list[i];
		
		var option = SOption(branaArea.bran_no, branaArea.bran_name);
		var opObj = $(option);
		
		opObj.attr("city", branaArea.city);
		selectIdObj.append(opObj);
	}
	
	if(isChosen){
		selectIdObj.trigger("chosen:updated");
	}
};
/**
 * 绑定bootstrap datetime
 * @param startIdObj 起始时间(String/jQuery对象)
 * @param endIdObj 结束时间(String/jQuery对象)
 * @param format 格式 默认为 YYYYMMDD
 */
Form.dateTime = function(startIdObj, endIdObj, format){
	format = format || 'YYYYMMDD';
	/*起始日期*/
	if(null == startIdObj){
		return;
	}
	if(startIdObj.constructor != jQuery){
		if(startIdObj.constructor != String || StringUtil.isBlank(startIdObj)){
			return;
		}
		startIdObj = $("#" + startIdObj);
	}
	startIdObj.datetimepicker({
		locale: lang,
		format: format
	});
	/*结束日期*/
	if(null == endIdObj){
		return;
	}
	if(endIdObj.constructor != jQuery){
		if(endIdObj.constructor != String || StringUtil.isBlank(endIdObj)){
			return;
		}
		endIdObj = $("#" + endIdObj);
	}
	endIdObj.datetimepicker({
		locale: lang,
		format: format,
		useCurrent: false
	});
	
	startIdObj.on("dp.change", function (e) {
		endIdObj.data("DateTimePicker").minDate(e.date);
    });
	endIdObj.on("dp.change", function (e) {
    	startIdObj.data("DateTimePicker").maxDate(e.date);
    });
	
	startIdObj.trigger("dp.change");
	endIdObj.trigger("dp.change");
};
/**
 * 获取规则信息，生成下拉列表的
 * @param selectId 下拉列表的Id
 * @param condition 查询条件，要符合RuleCondition的规则
 * @param isChosen 是否chosen下拉列表
 */
Form.rule = function(selectId, condition, isChosen){
	var selectIdObj = $("#" + selectId);
	selectIdObj.empty();
	
	selectIdObj.append(SOption("", "请选择..."));
	StringUtil.appendList2Map(condition, "belongToList", condition["belongToList"]);
	StringUtil.appendList2Map(condition, "ruleTypeList", condition["ruleTypeList"]);
	StringUtil.appendList2Map(condition, "ruleNoOrList", condition["ruleNoOrList"]);
	StringUtil.appendList2Map(condition, "flowTypeList", condition["flowTypeList"]);
	StringUtil.appendList2Map(condition, "flowTypeNotInList", condition["flowTypeNotInList"]);
	
	tableSupport.synchGet(cfrm_path + "/rule/checkbox", condition, function(list){
		
		var length = list.length;
		for (var i = 0; i < length; i++) {
			var rule = list[i];
			selectIdObj.append(SOption(rule.rule_no, rule.rule_no, rule.rule_desc));
		}
		
		if(isChosen){
			selectIdObj.trigger("chosen:updated");
		}
	});
};
/**
 * 获取数据字典生成复选框
 * @param divId 复选框所在div的ID
 * @param checkboxName 复选框name
 * @param dictname 数据字典名称
 * @param delIds 数组类型，不需要的数据字典ID
 */
Form.dictCheckbox = function(divId, checkboxName, dictname, delIds) {
	delIds = delIds || [];
	var dict = new Dictionary({});
	dict.synchQueryDictByName(dictname, function(list) {
		var content = "";
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item.dd_id;
			var text = item.dd_text;
			var desc = item.dd_desc;
			if (delIds.contains(id)) {
				continue;
			}
			content += Html.checkbox(id, id, checkboxName, text, desc);
		}
		$("#" + divId).html(content);
	});
};
/**
 * 获取复选框的值（以listMap的格式返回）
 * @param formId
 * @param checkboxName
 */
Form.getCheckboxListMap = function(formId, checkboxName) {
	var index = 0;
	var values = [];
	var prefix = checkboxName.split("[")[0];
	$("#" + formId).find("input[name='" + checkboxName + "']:checked").each(function() {
		values.push({
			"name" : prefix + "[" + index++ + "]",
			"value" : $.trim($(this).val())
		});
	});
	return values;
};