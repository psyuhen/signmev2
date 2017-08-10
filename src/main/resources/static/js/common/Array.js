/**
 * 扩展Array
 * @author sam.pan
 * @createTime 2016-02-29 10:09:14
 */
/**
 * 在哪个位置插入数据
 * @param index 位置
 * @param item 数据
 */
Array.prototype.insert = function (index, item){
	this.splice(index, 0, item);
};
/**
 * 判断是否为数组
 * @param arr
 */
Array.isArray = function(arr){
	return arr instanceof Array;
};
/**
 * 返回元素在数组中的位置，不存在则返回-1
 * @param item
 * @returns {Number}
 */
Array.prototype.indexOf = function(item) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == item) {
			return i;
		}
	}
	return -1;
};
/**
 * 判断数组是否包含某项数据
 * @param item
 * @returns {Boolean}
 */
Array.prototype.contains = function(item) {
	return this.indexOf(item) != -1;
};