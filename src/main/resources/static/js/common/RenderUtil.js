/**
 * function:
 * RenderUtil.js
 * @author sam.pan
 * @createTime 2016-04-11 16:35:49
 */
var RenderUtil = function(){};

/**
 * 格式化表格的time[yyyy年MM月dd日HH时mm分ss秒]
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.time = function (data, type, row){
	return DateUtil.dateFormat(data, "yyyy年MM月dd日HH时mm分ss秒");
};

/**
 * 格式化表格的date[yyyy年MM月dd日]
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.date = function (data, type, row){
	return DateUtil.dateFormat(data, "yyyy年MM月dd日");
};
/**
 * 格式化表格的hour[HH时mm分ss秒]
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.hour = function (data, type, row){
	return DateUtil.dateFormat(data, "HH时mm分ss秒");
};
/**
 * 格式化datetime
 * @param format 格式
 * @returns {Function}
 */
RenderUtil.datetime = function (format){
	format = format || "yyyy年MM月dd日HH时mm分ss秒";
	
	return function (data, type, row){
		return DateUtil.dateFormat(data, format);
	};
};
/**
 * 格式化金额
 * @author shijunkai
 */
RenderUtil.formatMoney = function(data, type, row) {
	data = data + "";
	if (!StringUtil.isBlank(data)) {
		if (data == "null") {
			return "0.00";
		}
		if (StringUtil.startWith(data, "\.")) {
			data = "0" + data;
		}
		var m = data.split("\.");
		if (m.length == 1) {
			return data + ".00";
		} else {
			if (m[1].length == 0) {
				return data + "00";
			} else if (m[1].length == 1) {
				return data + "0";
			}
			return data;
		}
	}
	return "0.00";
};
/**
 * 0-否，1-是
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.yesOrNo = function (data, type, row){
	if(data == "0"){
		return "否";
	}else if(data == "1"){
		return "是";
	}
	return "";
};

/**
 * 0-未下架，1-已下架
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.out_published = function (data, type, row){
    if(data == "0"){
        return "未下架";
    }else if(data == "1"){
        return "已下架";
    }
    return "";
};
/**
 * 0-未推荐，1-已推荐
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.sm_recommend = function (data, type, row){
    if(data == "0"){
        return "未推荐";
    }else if(data == "1"){
        return "已推荐";
    }
    return "";
};
/**
 * 0-不包邮，1-已包邮
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.free_shipping = function (data, type, row){
    if(data == "0"){
        return "不包邮";
    }else if(data == "1"){
        return "已包邮";
    }
    return "";
};

/**
 * "0" >买方待付款
 "1" >卖方确认订单
 "2" >买方已付款
 "3" >卖方已发货
 "4" >交易完成/买方确认收货
 "5" >交易取消
 "6" >交易关闭
 * @param data
 * @param type
 * @param row
 * @returns
 */
RenderUtil.trad_status = function (data, type, row){
    if(data == "0"){
        return '<span class="label-info label label-default">买方待付款</span>';
    }else if(data == "1"){
        return '<span class="label-info label label-default">卖方确认订单</span>';
    }else if(data == "2"){
        return '<span class="label-info label label-default">买方已付款</span>';
    }else if(data == "3"){
        return '<span class="label-info label label-default">卖方已发货</span>';
    }else if(data == "4"){
        return '<span class="label-success label label-default">交易完成/买方确认收货</span>';
    }else if(data == "5"){
        return '<span class="label-default label label-danger">交易取消</span>';
    }else if(data == "6"){
        return '<span class="label-warning label label-default">交易关闭</span>';
    }
    return "";
};