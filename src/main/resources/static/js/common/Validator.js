/**
 * function Validator.js
 * 
 * @author sam.pan
 * @createTime 2016-01-12 14:18:31
 */
var Validator = function() {
};
/**
 * 获取字符的UTF8编码的字节数长度
 * 
 * @param inputs
 * @returns {Number}
 */
Validator.charUTF8Length = function(inputs) {
	inputs = $.trim(inputs);
	if (inputs == "") {
		return 0;
	}

	var charCode;
	var length = 0;
	for (var i = 0; i < inputs.length; i++) {
		charCode = inputs.charCodeAt(i);
		if (charCode < 0x007f) {
			length += 1;
		} else if (charCode >= 0x0080 && charCode <= 0x07ff) {
			length += 2;
		} else if (charCode >= 0x0800 && charCode <= 0xffff) {
			length += 3;
		}
	}

	return length;
};
/**
 * 获取mysql的长度
 * @param inputs
 * @returns {*}
 */
Validator.mysql = function (inputs) {
	inputs = $.trim(inputs);
	if (inputs == "") {
		return 0;
	}

	return inputs.length;
};
/**
 * 获取字符的GBK编码的字节数长度
 * 
 * @param inputs
 * @returns {Number}
 */
Validator.charGBKLength = function(inputs) {
	inputs = $.trim(inputs);
	if (inputs == "") {
		return 0;
	}

	var charCode;
	var length = 0;
	for (var i = 0; i < inputs.length; i++) {
		charCode = inputs.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) {
			length += 1;
		} else {
			length += 2;
		}
	}

	return length;
};

/**
 * 非空
 * 
 * @param msg
 * @returns {___anonymous1085_1124}
 */
Validator.notEmpty = function(msg) {
	msg = msg || "此字段不能为空!";
	return {
		notEmpty : {
			message : msg
		}
	};
};
/**
 * 以utf8编码字节判断，范围
 * 
 * @param min
 *            最小值，默认为0
 * @param max
 *            最大值，默认为4096
 * @param msg
 * @returns {___anonymous1336_1571}
 */
Validator.between = function(min, max, msg) {
	min = min || 0;
	max = max || 4096;
	msg = msg || "此字段长度不在" + min + "到" + max + "范围内!";

	return {
		message : msg,
		callback : function(value, validator, $field) {
			var u8Length = Validator.mysql(value);
			if (u8Length >= min && u8Length <= max) {
				return true;
			}

			return false;
		}
	}
};
/**
 * 以utf8编码字节判断，小于等于最大值
 * 
 * @param max
 *            最大值，默认为4096
 * @param msg
 * @returns
 */
Validator.lte = function(max, msg) {
	msg = msg || "此字段长度必须小于等于" + max + "!";

	return Validator.between(null, max, msg);
};
/**
 * 以utf8编码字节判断，大于等于最小值
 * 
 * @param min
 *            最小值，默认为0
 * @param msg
 * @returns
 */
Validator.gte = function(min, msg) {
	msg = msg || "此字段长度必须大于等于" + min + "!";

	return Validator.between(min, null, msg);
};
/**
 * 计算密码的复杂度
 * 
 * @returns {___anonymous2155_3026}
 */
Validator.pwdScore = function() {
	return {
		callback : function(value, validator, $field) {
			var score = 0;

			if (value === '') {
				return {
					valid : true,
					score : null
				};
			}

			/* 检查密码长度 */
			score += ((value.length >= 6) ? 1 : -1);

			/* 密码包含大写字母 */
			if (/[A-Z]/.test(value)) {
				score += 1;
			}

			/* 密码包含小写字母 */
			if (/[a-z]/.test(value)) {
				score += 1;
			}

			/* 密码包含数字 */
			if (/[0-9]/.test(value)) {
				score += 1;
			}

			/* 密码包含特殊字符 */
			if (/[!#$%&^~*_]/.test(value)) {
				score += 1;
			}

			return {
				valid : true,
				score : score
			/* 在触发事件中使用 */
			};
		}
	};
};

/**
 * 字段验证，生成formvalidation的validators.
 * 
 * @param notEmpty
 *            true/false
 * @param length
 *            {min, max}
 * @param regex
 *            正则表达式{r,m},f为正则表达式，m为message
 * @param callback
 *            自定义的function验证，比如验证唯一等
 * @param ip true/false
 * @param date {f,m},f为格式，m为message ,注意，在验证YYYYMMDD这种格式时有bug,慎用
 * @returns {___anonymous3176_3177}
 */
Validator.validate = function(notEmpty, length, regex, callback, ip, date) {
	var _f = {};
	var _validator = {};
	_f["validators"] = _validator;

	/* 非空 */
	notEmpty = notEmpty || false;
	if (notEmpty) {
		_validator.notEmpty = {
			message : "必填"
		};
	}

	/* 正则表达式 */
	if (regex) {
		_validator.regexp = {
			regexp : regex.r,
			message : regex.m || "输入信息必须符合[" + regex.r + "]正则表达式"
		};
	}

	var _callback = {};
	_callback.callback = function(value, validator, $field) {
		/* 长度 */
		if(length){
			var u8Length = Validator.mysql(value);
			var min = length.min || 0;
			var max = length.max || 4096;
			if (u8Length < min) {
				return {
					message : "长度必须大于" + min,
					valid : false
				};
			}

			if (u8Length > max) {
				return {
					message : "长度必须小于" + max,
					valid : false
				};
			}
		}
		
		/* 其他callback */
		if (typeof callback == 'function') {
			return callback(value, validator, $field);
		}
		if (typeof callback == 'object') {
			return callback.callback(value, validator, $field);
		}

		return {
			valid : true
		};
	};

	_validator.callback = _callback;
	
	//增加IP地址校验
	if(ip){
		_validator.ip = {
				ipv6: false,
			message : "请输入正确的ip地址"
		};
	}
	
	//增加时间校验
	if(date){
		_validator.date = {
			format: date.f || "YYYYMMDD",
			message : date.m || "请输入正确的日期"
		};
	}

	return _f;
};

/**
 * 判断是否为URL
 * @param url
 * @returns
 */
Validator.isURL = function(url) {
	if (!StringUtil.isBlank(url)) {
		var flag = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/
				.test(url);
		if (!flag) {
			return false;
		}
	}
	return true;
};
/**
 * form校验URL
 * @returns {Function}
 */
Validator.validateURL = function(url) {
	return {
		message : "网址格式错误，正确格式为：http://xxx.xxx或https://xxx.xxx",
		valid : Validator.isURL(url)
	};
};

/**
 * 判断是否为IPV4
 * 
 * @param ip
 *            ip地址
 * @returns {Boolean}
 */
Validator.isIpv4 = function(ip) {
	ip = $.trim(ip);
	if (ip.indexOf(".") == -1) {
		return false;
	}
	var flag = /\s*^(25[0-5]|2[0-4]\d|1\d\d|[0]?[0-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[0]?[0-9]?\d)){3}\s*$/
			.test(ip);
	if (flag) {
		return true;
	}
	return false;
};

/**
 * 判断是否为IPV4前段
 * 
 * @param ip
 *            ip地址
 * @returns {Boolean}
 */
Validator.isShotIpv4 = function(ip) {
	ip = $.trim(ip);
	var flag = /\s*^(25[0-5]|2[0-4]\d|1\d\d|[0]?[0-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[0]?[0-9]?\d)){0,3}\s*$/
			.test(ip);
	if (flag) {
		return true;
	}
	return false;
};

/**
 * 校验IP非空以及输入正确IP地址！
 * 
 * @param id
 *            Ip控件的ID
 * @param text
 *            对应的文本
 * @returns {Boolean} true/校验成功,false/校验失败
 */
Validator.ip = function(id, text) {
	var ip = $("#" + id).val();
	if (StringUtil.isBlank(ip)) {
		Noty.popover(id, text + "不能为空！");
		return false;
	}

	if (!Validator.isIpv4(ip)) {
		Noty.popover(id, "请输入正确的IP地址！");
		return false;
	}
	return true;
};

/**
 * 校验输入值是否为手机号
 * @param val 输入值
 * @returns {Boolean} 是-true,不是-false
 */
Validator.isMobileNo = function(val) {
	return /^1(\d){10}$/.test(val);
};
/**
 * formvalidation校验手机号码
 * @returns {Function}
 */
Validator.validateMobileNo = function(val) {
	return {
		message : "该字段不是11位数字的手机号码",
		valid : Validator.isMobileNo(val)
	};
};

/**
 * 检验一下输入值是否存在特殊字符
 * 
 * @param val
 *            输入值
 * @returns {Boolean} 存在-true,不存在-false
 */
Validator.checkInvalidChar = function(val) {
	var pattern = new RegExp(
			"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
	if (pattern.test(val)) {
		return true;
	}
	return false;
};
/**
 * formvalidation校验特殊字符
 * @returns {Function}
 */
Validator.validateInvalidChar = function(val) {
	val = $.trim(val);
	
	return {
		message : "该字段不允许存在特殊字符",
		valid : !Validator.checkInvalidChar(val)
	};
};
/**
 * 校验输入值是否符合浮点数
 * 比如：16,3
 * @param val 输入值
 * @param len 长度
 * @param per 小数位
 * @returns {Boolean}
 */
Validator.double = function(val, len, per) {
	val = $.trim(val);
	if(val == ""){
		return true;
	}

	per = per || 0;
	len = len || 16;
	
	var reg = "^\s*^[0-9]{1," + len + "}\s*$";
	if(per > 0){
		reg = "^\s*^[0-9]{1," + len + "}([\.][0-9]{1," + per + "})?\s*$";
	}
	
	var pattern = new RegExp(reg);
	if (pattern.test(val)) {
		return true;
	}
	return false;
};

/**
 * formvalidation校验浮点数和整数
 * @param len 长度
 * @param per 精度
 * @returns {Function}
 */
Validator.d = function(len, per) {
	return function(val){
		val = $.trim(val);
		
		var pass = true;
		var msg = "";
		if(per == 0){
			msg = "输入有误, 最多为" + len + "位整数";
			pass = Validator.double(val, len);
		}else{
			if(val.indexOf("\.") != -1){
				pass = Validator.double(val, len, per);
			}else{
				pass = Validator.double(val, len);
			}
			msg = "输入有误, 最多" + len + "位整数和最多" + per + "位小数组成的数字";
		}
		
		if(pass){
			return {valid:true};
		}
		return {message: msg, valid:false};
	};
};
/**
 * 校验输入是否为email
 * @author shijunkai
 * @param val
 * @returns {Boolean}
 */
Validator.isEmail = function(val) {
	var pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if (pattern.test(val)) {
		return true;
	}
	return false;
};

/**
 * 身份证验证
 * @param val
 * @returns {Boolean}
 */
Validator.isIdCard = function(val) {
	var aCity =
	 {'11' : "北京", '12' : "天津", '13' : "河北",   '14' : "山西", '15' : "内蒙古", 
	  '21' : "辽宁", '22' : "吉林", '23' : "黑龙江", '31' : "上海", '32' : "江苏", 
	  '33' : "浙江", '34' : "安徽", '35' : "福建",   '36' : "江西", '37' : "山东", 
	  '41' : "河南", '42' : "湖北", '43' : "湖南",   '44' : "广东", '45' : "广西", 
	  '46' : "海南", '50' : "重庆", '51' : "四川",   '52' : "贵州", '53' : "云南", 
	  '54' : "西藏", '61' : "陕西", '62' : "甘肃",   '63' : "青海", '64' : "宁夏", 
	  '65' : "新疆", '71' : "台湾", '81' : "香港",   '82' : "澳门", '91' : "国外" 
	 };
	var iSum = 0;
	var len = val.length;
	var re;
	var ret = 0;

	if (len === 15) {
		re = new RegExp(/^(\d{14})(\d)$/);
	} else if (len === 18) {
		re = new RegExp(/^\d{17}(\d|x)$/i);
	} else {
		return false;
	}

	if (!re.test(val)) {
		return false;
	}

	val = val.replace(/x$/i, "a");
	var day;
	var month;
	var year;
	if (aCity[parseInt(val.substr(0, 2))] == null) {
		ret = 1;
	}

	if (len == 18) {
		day = val.substr(12, 2);
		month = val.substr(10, 2);
		year = val.substr(6, 4);
		if (!DateUtil.isDate(year + "" + month + "" + day)) {
			ret = 1;
		}

		for (var i = 17; i >= 0; i--) {
			iSum += (Math.pow(2, i) % 11) * parseInt(val.charAt(17 - i), 11)
		}

		if (iSum % 11 != 1) {
			ret = 1;
		}
	} else {
		day = Number(val.substr(10, 2));
		month = Number(val.substr(8, 2));
		if (month < 1 || month > 12) {
			ret = 1;
		}
		if (day < 1 || day > 31) {
			ret = 1;
		}
		if ((month == 4 || month == 6 || month == 9 || month == 11)
				&& (day == 31)) {
			ret = 1;
		}
		if ((day == 30 || day == 31) && (month == 2)) {
			ret = 1;
		}
	}

	if (ret == 1) {
		return false;
	}

	return true;

}
/**
 * formvalidation校验身份证号码
 * @returns {Function}
 */
Validator.validateIdCard = function(val) {
	return {
		message : "请输入正确的身份证号码",
		valid : Validator.isIdCard(val)
	};
};