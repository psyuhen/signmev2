/**
 * function:
 * Option.js
 * 下拉列表的option
 * @author sam.pan
 * @createTime 2016-03-24 10:08:22
 */
var SOption = function(value, text, title){
	title = title || "";
	return "<option value='" + value + "' title='" + title + "'>" + text + "</option>"
};
