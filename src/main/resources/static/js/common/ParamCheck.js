/**
 * 参数复核类
 * function:
 * ParamCheck.js
 * @author chengz
 * @createTime 2016-02-14
 */
var ParamCheck = function() {
};

/**
 * 生成复核字段对象
 * @param input_en
 * 				字段英文名
 * @param input_cn
 * 				字段中文名
 * @param input_value 
 * 				字段值
 * @returns
 */
ParamCheck.initChkObj = function(input_en, input_cn, input_value){
	return {input_en : input_en , input_cn : input_cn , input_value : input_value};
};
/**
 * add by shijunkai
 * */
ParamCheck.commonSubmit = function(options) {
	/* 操作对应Service的全称 */
	var _service_name = options.service_name;
	/* 操作对应方法的名称 */
	var _method_name = options.method_name;
	/* 操作对应的参数类型的类名全称 */
	var _parameter_type = options.parameter_type;
	/* 操作类型：1、新增(add)；2、修改(update)；3、删除(delete) */
	var _oper_type = options.oper_type;
	/* 操作描述 */
	var _oper_desc = options.oper_desc;
	/* 复核参数 */
	var _params = options.params || [];
	/* other params*/
	var _o_params = options.oparams || {};
	/* 复核参数的字段 */
	var _param_fields = options.param_fields || [];
	/* 判断参数在复核表中是否存在的字段 */
	var _check_fields = options.check_fields;
	/* 提交数据的表单ID */
	var _form_id = $.trim(options.form_id);
	/* 是否批量操作 */
	var _batch_flag = options.batch_flag || "0";
	/* 批量操作时，有数据在复核表中时是否继续添加不在复核表中的数据到复核表中，默认不添加 */
	var _exist_continue = options.exist_continue || "0";
	/* 复核开关名称 */
	var _switch_name = options.switch_name || "";
	/* 菜单ID */
	var _module_id = options.module_id || module_id;
	/* 复核成功或操作成功后的回调 */
	var _success = options.success;
	/* 复核失败或操作失败后的回调 */
	var _failure = options.failure;
	/* 成功提示信息 */
	var _successTip = options.successTip;
	/* 失败提示信息 */
	var _failureTip = options.failureTip;
	/* 复核参数 */
	if (_params.length == 0 && _form_id !== "" && "0" == _batch_flag) {
		_params = getParams(_form_id, _param_fields);
		
		/* 添加其他字段*/
		for(key in _o_params){
			_params.push(ParamCheck.initChkObj(key, key, _o_params[key]));
		}
	}
	
	if(_params.length == 0){
		Noty.warning("没有需要提交的复核数据，请检查！");
		return;
	}
	
	if (isNaN(_oper_type)) {
		switch (_oper_type) {
		case "add":
			_oper_type = "1";
			break;
		case "update":
			_oper_type = "2";
			break;
		case "delete":
			_oper_type = "3";
			break;
		}
	}

	var _url = mgr_path + "/paramChk/commonCheckSubmit";
	if ("1" == _batch_flag) {
		_url = mgr_path + "/batchChk/commonBatchCheckSubmit";
	}
	var _data = {
		service_name : _service_name,
		method_name : _method_name,
		parameter_type : _parameter_type,
		oper_type : _oper_type,
		oper_desc : _oper_desc,
		exist_continue : _exist_continue,
		switch_name : _switch_name,
		module_id : _module_id,
		check_fields : JSON.stringify(_check_fields),
		params : JSON.stringify(_params)
	};
	var _callback = function(responseInfo) {
		if (responseInfo.status == "0") {
			Noty.success(_successTip || responseInfo.desc);
			if (typeof _success == "function") {
				_success();
			}
		} else {
			Noty.warning(_failureTip || responseInfo.desc);
			if (typeof _failure == "function") {
				_failure();
			}
		}
	};
	tableSupport.post(_url, _data, _callback);
	/* 根据表单ID获取复核参数 */
	function getParams(formId, paramFields) {
		var params = [];
		var listMap = Form.getValue(formId);
		var nameMap = Form.getName(formId);
		if (paramFields.length == 0) {
			for (var i = 0; i < listMap.length; i++) {
				var valueMap = listMap[i];
				var input_en = valueMap.name;
				var input_cn = nameMap[input_en] || input_en;
				var input_value = valueMap.value;
				var param = ParamCheck.initChkObj(input_en, input_cn, input_value);
				params.push(param);
			}
		} else {
			for (var i = 0; i < listMap.length; i++) {
				var valueMap = listMap[i];
				var input_en = valueMap.name;
				if (paramFields.indexOf(input_en) != -1) {
					var input_cn = nameMap[input_en] || input_en;
					var input_value = valueMap.value;
					var param = ParamCheck.initChkObj(input_en, input_cn, input_value);
					params.push(param);
				}
			}
		}
		return params;
	}
};