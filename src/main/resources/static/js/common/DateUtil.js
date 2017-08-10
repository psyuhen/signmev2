/**
 * function:
 * DateUtil.js
 * @author pansen
 * @createTime 2016-01-04 16:17:25
 */
var DateUtil = function(){};

/**
 * 日期格式化
 * 
 * @param date
 *            日期类型的日期
 * @param format
 *            如:yyyy-MM-dd
 * @returns
 */
DateUtil.format = function(date, format) {
	var val = {
		"M+" : date.getMonth() + 1,
		"d+" : date.getDate(),
		"h+" : date.getHours(),
		"H+" : date.getHours(),
		"m+" : date.getMinutes(),
		"s+" : date.getSeconds(),
		"q+" : Math.floor((date.getMonth() + 3) / 3),
		"S+" : date.getMilliseconds()
	};
	// 处理年的情况
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	// 遍历处理其他情况
	for ( var k in val) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? val[k]
					: ("00" + val[k]).substr(("" + val[k]).length));
		}
	}

	return format;
};


/**
 * 获取当前服务器日期（字符串）
 * 
 * @param format
 *            日期格式 (默认格式为yyyyMMdd)
 * @returns
 */
DateUtil.now = function(format) {
	format = format || "yyyyMMdd";

	var now = null;
	tableSupport.synchPost(cfrm_path + "/date/getDate", null , function(date){
		now = DateUtil.str2date(date);
	});
	now = DateUtil.format(now, format);
	return now;
};
/**
 * 获取当前机器日期（字符串）
 *
 * @param format
 *            日期格式 (默认格式为yyyyMMdd)
 * @returns
 */
DateUtil.local_now = function(format) {
	format = format || "yyyyMMdd";

    var now = DateUtil.format(new Date(), format);
    return now;
};
/**
 * 获取前一天日期
 * 
 * @author shijunkai
 * @param format
 *            日期格式 (默认格式为yyyyMMdd)
 * @returns
 */
DateUtil.yesterday = function(format) {
	format = format || "yyyyMMdd";

	var yesterday = null;
	tableSupport.synchGet(cfrm_path + "/date/getDate", {}, function(date) {
		date = DateUtil.str2date(date);
		date.setDate(date.getDate() - 1);
		yesterday = date;
	});
	yesterday = DateUtil.format(yesterday, format);

	return yesterday;
}

/**
 * 获取下一天日期
 * 
 * @author yiyou
 * @param format
 *            日期格式 (默认格式为yyyyMMddHHmmss)
 * @returns
 */
DateUtil.tomorrow = function() {
	var tomorrow = null;
	tableSupport.synchGet(cfrm_path + "/date/getDate", {}, function(date) {
		tomorrow = parseInt(date) + 1000000;
	});
	return tomorrow + '';
}

/**
 * 判断输入的日期是否正确 默认为yyyyMMdd
 * 
 * @param datestr
 *            日期字符串
 */
DateUtil.isDate = function(datestr) {
	// 先检验是否为数字
	if (/^\d{4}\d{2}\d{2}$/.test(datestr)) {
		var year = datestr.substring(0, 4);
		var month = datestr.substring(4, 6);
		var day = datestr.substring(6, 8);

		var date = new Date(year, month - 1, day);
		// 判断转换后的是否跟输入的相等
		if ((parseInt(year,10) == date.getFullYear())
				&& (parseInt(month,10) == (date.getMonth() + 1))
				&& (parseInt(day,10) == date.getDate())) {
			return true;
		}
	}

	return false;
};
/**
 * 专门格式化类似这种形式201311271449
 * 
 * @param date
 *            类似这种形式201311271449
 * @param format
 *            类似这种形式yyyyMMdd
 * @returns
 */
DateUtil.dateFormat = function(date, format) {
	date = $.trim(date);
	format = $.trim(format);
	if (date == "") {
		return date;
	}
	/*去除-、/、 :、 年、月、日、时、分、秒、空格等*/
	date = date.replace(/[-/:：年月日时分秒\s]/g,"");

	var fm = [ "yyyy", "yy", "MM", "dd", "HH", "mm", "ss" ];
	for ( var i = 0; i < fm.length; i++) {
		var f = fm[i];
		if (format.indexOf(f) != -1) {
			format = format.replace(f, date.substring(0, f.length));
			date = date.substring(f.length);
		}
	}

	return format;
};

/**
 * 字符串to日期
 * 
 * @author chengz
 * 
 * @param date
 *            "yyyyMMdd" 或 "yyyy/MM/dd" 或 "yyyy-MM-dd" 或 "yyyy年MM月dd日"
 * @returns
 * 				Date
 */
DateUtil.str2date = function(date) {
	date = date || "";
	/*验证日期格式*/
	if(!DateUtil.isDate(date)){
		return new Date();
	}
	/*格式化字符串日期*/
	date = DateUtil.dateFormat(date,"yyyyMMdd");
	date = date.substring(0,4) + "/" + date.substring(4,6) + "/" + date.substring(6,8);
	
	return new Date(date);
};
/**
 * 字符串to日期
 *
 * @author sam.pan
 * @param date
 * @returns Date
 */
DateUtil.str2dateTime = function(date) {
       /*格式化字符串日期*/
       date = DateUtil.dateFormat(date,"yyyyMMddHHmmss");

       var y = date.substring(0,4);
       var M = date.substring(4,6);
       var d = date.substring(6,8);
       var H = date.substring(8,10);
       var m = date.substring(10,12);
       var s = date.substring(12,14);

       var dt = new Date();
       dt.setFullYear(parseInt(y, 10), parseInt(M, 10) - 1, parseInt(d, 10));
       dt.setHours(parseInt(H, 10), parseInt(m, 10), parseInt(s, 10), 0);

       return dt;
};
/**
 * 获取某时间段相差天数
 * 
 * @author chengz
 * 
 * @param start
 *            "yyyyMMdd" 或 "yyyy/MM/dd" 或 "yyyy-MM-dd" 或 "yyyy年MM月dd日"
 * @param end
 *            "yyyyMMdd" 或 "yyyy/MM/dd" 或 "yyyy-MM-dd" 或 "yyyy年MM月dd日"
 * @returns
 * 			  number
 */
DateUtil.getDateDiff = function(start, end) {
	/*生成日期对象*/
	var startDate = DateUtil.str2date(start);
	var endDate = DateUtil.str2date(end);
	/*获取天数差*/
	var interval = Math.abs((endDate.getTime() - startDate.getTime())/(1000*60*60*24));
	
	return interval;
};
/**
 * 获取某时间段相差小时，分钟，秒等
 *
 * @author sam.pan
 * @param start
 * @param end
 * @returns number
 */
DateUtil.getDateTimeDiff = function(start, end, type) {
       /*生成日期对象*/
       var startDate = DateUtil.str2dateTime(start);
       var endDate = DateUtil.str2dateTime(end);
       var subTime = endDate.getTime() - startDate.getTime();

       if(type === "h"){/*小时:3600000 = 60 * 60 * 1000*/
               return Math.round(subTime / 3600000);
       }

       if(type === "m"){/*分钟60000 = 60 * 1000*/
               return Math.round(subTime / 60000);
       }
       //秒
       return Math.round(subTime / 1000);
};
/**
 * 通过日期与天数差，获取相差天数后的日期
 * 
 * @author chengz
 * 
 * @param start
 *            "yyyyMMdd" 或 "yyyy/MM/dd" 或 "yyyy-MM-dd" 或 "yyyy年MM月dd日"
 * @param diff
 *            number
 * @returns
 * 			  "yyyyMMdd"
 */
DateUtil.getDateByDiff = function(start, diff) {
	/*生成日期对象*/
	var startDate = DateUtil.str2date(start);
	var endDate = new Date();
	endDate.setTime(startDate.getTime() + ((diff - 0) * 1000 * 60 * 60 * 24));
	/*获取相差天数后日期*/
	var end = DateUtil.format(endDate,"yyyyMMdd");

	return end;
};
/**
 * 获取相差指定月份的日期
 * @author shijunkai
 * @param date
 * @param months
 * @param format
 * @returns
 */
DateUtil.getDateByAddMonths = function(date, months, format) {
	date = DateUtil.str2dateTime(date);
	date.setMonth(date.getMonth() + months);
	return DateUtil.format(date, format);
};
/**
 * 将数字的毫秒数转换为文字描述(如：1天11小时24分36秒)
 * 
 * @param mills 毫秒
 * @param flag 是否精确到毫秒
 * @returns {String}
 */
DateUtil.getDateDesc = function(mills, flag) {
	if (mills == null || $.trim(mills) == "") {
		return "";
	}
	flag == undefined ? false : flag;
	/* 计算毫秒 */
	var mill  = mills % 1000.0;
	/* 计算秒数 */
	var sec = mills / 1000.0;
	/* 计算分钟数 */
	var min = Math.floor(sec / 60);
	/* 获取返回的秒数 */
	sec = Math.floor(sec % 60);

	/*计算小时数*/
	var hour = 0;
	if (min >= 60) {
		hour = Math.floor(min / 60);
		/*获取返回的分钟数*/
		min = min % 60;
	}
	/*计算天数*/
	var day = 0;
	if (hour >= 24) {
		day = Math.floor(hour / 24);
		/*获取返回的小时数*/
		hour = hour % 24;
	}
	/* 返回的文字描述 */
	var desc = "";
	if (day > 0) {
		desc = day + "天";
	}
	if (hour > 0) {
		desc = desc + hour + "小时";
	}
	if (min > 0) {
		desc = desc + min + "分";
	}
	if(!flag){
		return desc + sec + "秒";
	}else{
		if(sec > 0){
			desc = desc + sec + "秒";
		}
		return desc + mill + "毫秒";
	}
};
/**
 * 计算两个日期之前所有月份
 * @param start
 * @param end
 * @returns {Array}
 */
DateUtil.getMonths = function(start, end){
	var startYear = parseInt(start.substring(0,4), 10);
	var startMonth = parseInt(start.substring(4,6), 10);
	
	var endYear = parseInt(end.substring(0,4), 10);
	var endMonth = parseInt(end.substring(4,6), 10);
	
	var list = [];
	if(startYear == endYear){
		for (var i = 0,len = (endMonth - startMonth); i <= len; i++) {
			var m = (startMonth + i);
			list.push("" + startYear + (m < 10 ? "0" + m : m));
		}
		return list;
	}
	
	var subYear = endYear - startYear;
	/* 第一年的所有月份*/
	for (var j = startMonth; j <= 12; j++) {
		list.push("" + startYear + (j < 10 ? "0" + j : j));
	}
	/* 中间年的所有月份*/
	for (var i = startYear + 1; i < endYear; i++) {
		for (var j = 1; j <= 12; j++) {
			list.push("" + i + (j < 10 ? "0" + j : j));
		}
	}
	/* 最后一年的所有月份*/
	for (var j = 1; j <= endMonth; j++) {
		list.push("" + endYear + (j < 10 ? "0" + j : j));
	}
	return list;
};

/**
 * 根据输入的开始日期和结果日期，生成天数列表
 * 日期格式默认为yyyyMMdd
 * @param startDate
 * @param endDate
 */
DateUtil.getDayList = function(startDate, endDate ,format){
	format = format || 'yyyyMMdd';
	var s = new Date();
	var sd = parseInt(startDate.substring(6,8), 10);
	s.setFullYear(parseInt(startDate.substring(0,4), 10), 
			parseInt(startDate.substring(4,6), 10)-1, 
			sd);
	
	var e = new Date();
	e.setFullYear(parseInt(endDate.substring(0,4), 10), 
			parseInt(endDate.substring(4,6), 10)-1, 
			parseInt(endDate.substring(6,8), 10));
	
	var days = (e.getTime() - s.getTime()) / 3600 / 1000 /24;
	
	var dayLists = [];
	dayLists.push(DateUtil.format(s,format));
	
	for ( var i = 0; i < days; i++) {
		
		s.setDate(s.getDate() + 1);
		
		var d = DateUtil.format(s,format);
		
		dayLists.push(d);
	}
	return dayLists;
};

/**
 * 获取相差mills的time
 * @param date 时间日期（Date类型）
 * @param mills 毫秒（2000表示2秒)
 * @returns 返回类似"15:41:47"
 */
DateUtil.getSubTime = function(date, mills){
	date = new Date(date - mills);
	return date.toTimeString().replace(/\s.*$/g,'');
}