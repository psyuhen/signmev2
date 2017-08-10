/**
 * function:
 * Dialog.js
 * @author pansen
 * @createTime 2015-12-31 16:17:25
 */
var Dialog = function(options){
	var dialog_win = null;
	var $this = this;
	
	options = options || {};
	//ID
	var _id = options.id || "_dialog_win";
	//标题
	var _title = options.title || "提示";
	//内容，支持HTML
	var _content = options.content || "";
	//窗口宽度
	var _width = options.width || "";
	//按钮文本
	var _closeName = options.closeName || "关闭";
	var _confirmName = options.confirmName || "确认";
	//简单模式，默认为简单模式
	if(options.simpleModal == undefined){
		options.simpleModal = true;
	}
	var _simpleModal = options.simpleModal || false;
	
	//当初始化时是否显示，默认是显示的，见modal的option
	if(options.show  == undefined){
		options.show = true;
	}
	var _show = options.show || false;
	//点击其他时是否关闭，static等Includes a modal-backdrop element. Alternatively, 
	//specify static for a backdrop which doesn't close the modal on click.
	if(options.backdrop  == undefined){
		options.backdrop = true;
	}
	var _backdrop = options.backdrop;
	
	// 是否屏蔽按钮
	var _closeEnabled = options.closeEnabled;
	var _confirmEnabled = options.confirmEnabled;
	if(_closeEnabled  == undefined){
		_closeEnabled = true;
	}
	
	if(_confirmEnabled  == undefined){
		_confirmEnabled = true;
	}
	
	
	/**
	 * 显示
	 */
	this.show = function(){
		dialog_win.modal("show");
	};
	/**
	 * 隐藏
	 */
	this.hide = function(){
		dialog_win.modal("hide");
	};
	/**
	 * 隐藏事件
	 */
	this.onHidden = options.onHidden;
	/**
	 * 显示事件
	 */
	this.onShow = options.onShow;
	/**
	 * 显示事件
	 */
	this.onShown = options.onShown;
	/**
	 * 确认事件
	 */
	this.onConfirm = options.onConfirm;
	
	//生成Html内容
	function create(){
		dialog_win = $("#" + _id);
		if(dialog_win.length == 0){
			var m = Html.modal(_id, '','', _closeEnabled, _confirmEnabled);
			$("body").append(m);
			dialog_win = $("#" + _id);
		}
		//添加按钮名称
		if(_closeEnabled){
			dialog_win.find("a[name='btn_close']").html(_closeName);
		}
		if(_confirmEnabled){
			dialog_win.find("a[name='btn_confirm']").html(_confirmName);
		}
		
		if(_width != ""){
			dialog_win.find(".modal-dialog").css("width", _width);
		}
		
		dialog_win.modal({
			show 	 : _show,
			backdrop : _backdrop 
		});
		
	}
	
	/**
	 * 初始化模式窗口,默认追加一些隐藏事件和显示事件
	 * 
	 */
	this.init = function(){
		create();
		
		/* 先off所有事件*/
		dialog_win.off("show.bs.modal hidden.bs.modal");
		if(_confirmEnabled){
			dialog_win.off("click", "a[name='btn_confirm']");
			dialog_win.on("click", "a[name='btn_confirm']", $this.onConfirm);
		}
		
		dialog_win.on("show.bs.modal", $this.onShow)
		dialog_win.on("shown.bs.modal", $this.onShown)
		dialog_win.on("hidden.bs.modal", $this.onHidden)
		
		dialog_win.find(".modal-header > h3").html(_title);
		
		if(_simpleModal){
			_content = "<p>" + _content + "</p>";
		}
		dialog_win.find(".modal-body").html(_content);
	};
	
	/*默认初始化各种事件*/
	$this.init();
};
/**
 * 创建Dialog
 * @param title 标题
 * @param content 内容
 * @param callback onConfirm的回调方法
 * @returns {Dialog}
 */
Dialog.create = function(title, content, callback){
	var dialog = new Dialog({"onConfirm": callback ,"title": title,"content": content});
	dialog.show();
	return dialog;
};