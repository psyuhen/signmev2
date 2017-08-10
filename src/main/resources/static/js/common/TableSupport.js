/**
 * function:
 * TableSupport.js
 * @author pansen
 * @createTime 2015-12-31 16:17:25
 */
var TableSupport = function(){
	var $this = this;
	/*
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 * @param type 返回内容格式
	 * @param method 默认为GET,(POST)
	 * @param async 默认为true
	 * @param contentType 默认为application/x-www-form-urlencoded
	 */
	function _query(url, data, callback, type, method, async, contentType){
		method = method || "GET";
		if($.trim(async) == ""){
			async = true;
		}
		/*发送信息至服务器时内容编码类型*/
		contentType = contentType || "application/x-www-form-urlencoded";
		
		$.ajax({
			"url" 			: url,
			"data" 			: data,
			"type"			: method,
			"dataType" 		: type,
			"async"			: async,
			"contentType"	: contentType,
			"success"		: callback,
			"error"         : function(xmlHttpRequest, textStatus, errorThrown){
	            console.error(textStatus);
	            console.error(errorThrown);
			}
		});
	}
	
	/**
	 * 同步查询数据(默认返回json,采用GET方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.synchGet = function(url,data,callback){
		_query(url, data, callback, "json", "GET", false);
	};
	/**
	 * 查询数据(默认返回json,采用GET方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.get = function(url,data,callback){
		_query(url, data, callback, "json", "GET", true);
	};
	/**
	 * 查询数据(默认返回json,采用POST方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 * @param async 默认为true
	 * @param contentType 默认为application/x-www-form-urlencoded
	 * @param dataType 默认json方式
	 */
	this.post = function(url,data,callback,async,contentType,dataType){
		dataType = dataType || "json";
		_query(url, data, callback, dataType, "POST", async, contentType);
	};
	/**
	 * 查询数据(默认返回json,采用POST方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.synchPost = function(url,data,callback){
		$this.post(url, data, callback, false);
	};
	/**
	 * 查询数据(默认返回json,采用POST方法,默认提交的信息编码为application/json)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.synchPostJson = function(url,data,callback){
		this.post(url, data, callback, false, "application/json");
	};
	/**
	 * 查询数据(默认返回json,采用POST方法,默认提交的信息编码为application/json)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.postJson = function(url,data,callback){
		$this.post(url, data, callback, true, "application/json");
	};
	
	/**
	 * 插入数据(默认返回json,采用POST方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.insert = function(url,data,callback){
		$this.post(url, data, callback);
	};
	/**
	 * 更新数据(默认返回json,采用POST方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.update = function(url,data,callback){
		$this.post(url, data, callback);
	};
	/**
	 * 更新数据(默认返回json,采用POST方法,默认提交的信息编码为application/json)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.updateJson = function(url,data,callback){
		$this.postJson(url, data, callback);
	};
	/**
	 * 删除数据,(默认返回json,采用POST方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.remove = function(url,data,callback){
		$this.post(url, data, callback);
	};
	/**
	 * 删除数据,(默认返回json,采用GET方法)
	 * @param url 请求url
	 * @param data Key/value 参数
	 * @param callback 载入成功时回调函数
	 */
	this.removeById = function(url,data,callback){
		$this.get(url, data, callback);
	};
};
/*默认实例化一个全局的tableSupport，主要导入此JS即可使用*/
if(typeof(tableSupport) == "undefined"){
	tableSupport = new TableSupport();
}