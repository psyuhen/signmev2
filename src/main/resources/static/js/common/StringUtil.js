/**
 * function:
 * StringUtil.js
 * @author pansen
 * @createTime 2016-01-08 16:17:25
 */
var StringUtil = function(){};

/**
 * <pre>
 *  
 * 简单格式一个文件大小(xxx bytes, xxx KB, xxx MB, xxxGB). 
 * </pre>
 * 
 * @param size
 *            文件大小的数字
 * @return 格式后字符串
 */
StringUtil.fileSize = function(size) {
	if (size < 1024) {
		return size + " B";
	} else if (size < 1048576) {
		return (Math.round(((size * 10) / 1024)) / 10) + " KB";
	} else if (size < 1073741824) {
		return (Math.round(((size * 10) / 1048576)) / 10) + " MB";
	} else if (size < 1099511627776) {
		return (Math.round(((size * 10) / 1073741824)) / 10) + " GB";
	} else {
		return (Math.round(((size * 10) / 1099511627776)) / 10) + " TB";
	}
}
/**
 * 删除Map里面的mapkey元素。
 * 
 * @param map
 *            MAP对象
 * @param mapkey
 *            Map对象中的key
 */
StringUtil.removeMapKey = function(map, mapkey) {
	if (map == null || mapkey == null) {
		return;
	}

	if (Object.keys) {// 使用OBJECT 的KEYS
		Object.keys(map).forEach(function(key) {
			if (key.match(mapkey)) {
				delete map[key];
			}
		});
	} else {
		for ( var prop in map) {
			if (map.hasOwnProperty(prop) && prop == mapkey) {
				delete map[prop];
			}
		}
	}
};

/**
 * 替换字符中指定位置的字符串。
 * 
 * @param strObj
 *            str对象
 * @param leftPos
 *            str对象中被替换字符串的起始位置
 * @param rightPos
 *            str对象中被替换字符串的结束位置
 * @param replaceText
 *            替换的字符串
 * @returns 新字符串
 */
StringUtil.replacePos = function(strObj, leftPos, rightPos, replaceText) {
	if (strObj == null || strObj == undefined){
		strObj="";
	}
	if (replaceText == null || replaceText == undefined){
		replaceText="";
	}
	var str = strObj.substr(0, leftPos - 1) + replaceText
			+ strObj.substr(rightPos, strObj.length);
	return str;
};

/**
 * 先把name从key中删除，再添加list值到map中
 * @param map 把list拆分到map中
 * @param name 要删除的key
 * @param list list数据
 */
StringUtil.appendList2Map = function(map, name, list){
	if(list == null || list == []){
		return;
	}
	StringUtil.removeMapKey(map, name);
	
	var length = list.length;
	for (var i = 0; i < length; i++) {
		map[name + "["+ i +"]"] = list[i];
	}
};
/**
 * 一般用于查询条件，添加到查询条件中
 * @param listMap 查询条件
 * @param name 提交的名称
 * @param list list数据
 * @see serializeArray();
 */
StringUtil.append2ListMap = function(listMap, name, list){
	if(list == null || list == []){
		return;
	}
	var length = list.length;
	for (var i = 0; i < length; i++) {
		var obj = {};
		obj.name = name + "[" + i + "]";
		obj.value = list[i];
		listMap.push(obj);
	}
};

/**
 * <pre>
 * 截取一个字符串，若它超过指定的长度，并在其后面增加一个省略号('...')
 * </pre>
 * @param value 需要截取的字符串
 * @param len 允许截取的最大长度
 * @returns 返回转换后的字符串
 */
StringUtil.ellipsis = function(value, len){
	if(value && value.length > len){
        return value.substr(0, len-3)+"...";
    }
    return value;
};

/**
 * 把标题转换为dataTables的column格式
 * @param titles 标题
 * @returns {Array}
 */
StringUtil.convertColumn = function(titles){
	var columns = [];
	for (var i = 0; i < titles.length; i++) {
		var column = {};
		column.data = titles[i];
		columns[i] = column;
	}
	
	return columns;
};

/**
 * 判断某字符串以prefix开头,以prefix开头则返回true,否则返回false
 * 
 * @param source
 *            源字符串
 * @param prefix
 *            前缀
 * @returns {Boolean}
 */
StringUtil.startWith = function(source, prefix) {
	source = $.trim(source);
	if (source.indexOf(prefix) === 0) {
		return true;
	}
	return false;
};

/**
 * 判断某字符串以suffix结尾,以suffix结尾则返回true,否则返回false
 * 
 * @param source
 *            源字符串
 * @param suffix
 *            后缀
 * @returns {Boolean}
 */
StringUtil.endWith = function(source, suffix) {
	source = $.trim(source);
	if (source.lastIndexOf(suffix) === (source.length - suffix.length)) {
		return true;
	}
	return false;
};
/**
 * 判断字符串是否为空,undefined,“”等
 * @param source 空/true,否则/false
 */
StringUtil.isBlank = function(source){
	var strLen = 0;
	if(source == null || source == undefined || (strLen = source.length) == 0){
		return  true;
	}
	
	 for (var i = 0; i < strLen; i++) {
         if (source.charAt(i) != ' ') {
             return false;
         }
     }
     return true;
};

/**
 * 获取选中的文本
 * @returns {String}
 */
StringUtil.selectText = function(){
	var text = "";
	if(document.all){
		text = document.selection.createRange().text;
	}else{
		text = window.getSelection().toString();
	}

	return text;
}

/**
 * 把全IP转换为前非0的IP 例如:128.080.222.001=>128.80.222.1
 * 
 * @param ip
 * @returns
 */
StringUtil.ipRmZero = function(ip) {
	ip = StringUtil.rmNull(ip);
	if (!Validator.isIpv4(ip)) {
		return ip;
	}
	var ipd = ip.split(".");
	var newIp = "";
	for ( var i = 0; i < ipd.length; i++) {
		var tmp = ipd[i];
		tmp = (tmp == "*") ? "0" : parseInt(tmp, 10);
		newIp += tmp;
		newIp += (i < ipd.length - 1) ? "." : "";
	}
	return newIp;
};
/**
 * 把ip转换为全三位的ip 如128.128.80.226 => 128.128.080.226 或者128.128.*.* =>
 * 128.128.000.000
 * 
 * @param ip
 * @returns
 */
StringUtil.ip2all = function(ip) {
	ip = StringUtil.rmNull(ip);
	if (!Validator.isIpv4(ip)) {
		return ip;
	}

	var ipd = ip.split(".");
	var newIp = "";
	for ( var i = 0; i < ipd.length; i++) {
		var tmp = ipd[i];
		if (tmp.length < 3) {
			tmp = (tmp == "*") ? "000" : StringUtil.leftPad(tmp, 3, "0");
		}
		newIp += tmp;
		newIp += (i < ipd.length - 1) ? "." : "";
	}
	return newIp;
};

/**
 * 根据num的长度在source前面补pad, 当num<=source的长度，即返回source,否则返回pad+source,长度为num;
 * 
 * @param source
 *            源
 * @param num
 *            长度
 * @param pad
 *            补
 * @returns
 */
StringUtil.leftPad = function(source, num, pad) {
	source = StringUtil.rmNull(source);
	if (num <= source.length) {
		return source;
	}

	while (num > source.length) {
		source = pad + source;
	}

	return source;
};

/**
 * 根据num的长度在source前面补pad, 当num<=source的长度，即返回source,否则返回pad+source,长度为num;
 * 
 * @param source
 *            源
 * @param num
 *            长度
 * @param pad
 *            补
 * @returns
 */
StringUtil.rightPad = function(source, num, pad) {
	source = StringUtil.rmNull(source);
	if (num <= source.length) {
		return source;
	}

	while (num > source.length) {
		source = source + pad;
	}

	return source;
};


/**
 * 补齐浮点数小数后的0（用于金额等数据）
 * 		如:12.100
 * @param str 值
 * @param len 小数后位数
 * @returns {String}
 */
StringUtil.getDouble0 = function(str,len){
	if(!/^\d*(\.{1}\d*){0,1}$/.test(str)){
		return str;
	}
	str = str - 0 + "";/*补齐小数点前0;如：将.3转化为0.3*/
	if(!/\./g.test(str)){
		str += ".";
	}
	for(var i = 0 ; i < len ; i++){
		str += "0";
	}
	str = str.substring(0 , (str.indexOf(".") + len + 1));
	return str;
};

/**
 * 字符串的二分查找方法
 * @param list 字符串列表
 * @param searchText 搜索字符
 * @param fieldName 字段
 * @returns {Number} 返回-1即未找到 
 */
StringUtil.binarySearch = function(list, searchText, fieldName){
	if(searchText == null){
		return -1;
	}
	
	var low = 0;
	var high = list.length - 1;
	var mid = -1;
	
	while(low <= high){
		mid = Math.floor((low + high) / 2);
		var tmp = list[mid][fieldName];
		
		if(tmp < searchText){
			low = mid + 1;
		}else if(tmp > searchText){
			high = mid - 1;
		}else{
			return mid;
		}
	}
	
	return -1;
}

/**
 * 把null或者undefined的字符串转为"";
 * 
 * @param source
 * @returns
 */
StringUtil.rmNull = function(source) {
	source = (source == null || source == undefined) ? "" : source;
	return source;
};

/**
 * 判断是否全是数字
 * 
 * @param number
 * @returns {Boolean}
 */
StringUtil.isNumber = function(number) {
	number = StringUtil.rmNull(number);
	var regexp = /^\d+$/g;
	if (regexp.test(number)) {
		return true;
	}
	return false;
};

/**
 * 判断是否是浮点数
 * 
 * @param double
 * @returns {Boolean}
 */
StringUtil.isDouble = function(double) {
	double = StringUtil.rmNull(double);
	if (isNaN(double)) {
		return false;
	}
	return true;
};

/**
 * 打开URL页面
 */
StringUtil.openPage = function(url){
	window.open(url, "", "", "height=100%,width=100%");
};

/**
 * 删除Html标签
 * @param str
 */
StringUtil.delHtmlTag = function(str){
	str = StringUtil.rmNull(str);
	return str.replace(/<[^>]+>/g, "");
};