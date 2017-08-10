/**
 * 只能在支持HTML5的浏览器下使用
 * FileUpload.js
 * @author sam.pan
 * @creatTime 2016-03-03 11:37:52
 */
var FileUpload = function(options){
	var _this = this;
	var _url = options.url || "";
	var _progress = options.progress;
	/* 上传成功后的操作 */
	var _success = options.success;
	/* 是否显示默认上传成功提示，默认显示 */
	var _showDefaultSuccess = $.trim(options.showDefaultSuccess) == "" ? true
			: options.showDefaultSuccess;
	
	/* 更新进度条*/
	var updateProgress = function(state) {
		var progress = _progress;
		if (state === 'start') {
			progress.fadeIn(500);
			state = "0";
		} else if (state === 'stop') {
			return progress.fadeOut(500);
		} else if (state === "done"){
			state = "100";
		}
		//bootstrap progress
		var progressBar=progress.children();
		progressBar.attr("aria-valuenow", state);
		progressBar.html(state + "%");
		return progressBar.css("width", state + "%");
	};
	
	/* 上传文件*/
	var uploadBlob = function uploadBlob(params) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', params.url, true);
		xhr.onload = params.success;
		xhr.onerror = params.error;
		// Listen to the upload progress.
		xhr.upload.onprogress = params.progress;
		xhr.send(params.blob);
		return params;
	};

	function hideProgress(){
		_progress.fadeOut(500);
	}
	
	/* 包装参数*/
	function packageFiles(formData){
		var block = {
			url 	: _url,
			error	: function(evt){
				Noty.warning("上传失败, 文件大小超过100MB或者网络异常!");
			},
			success : function(evt) {
				updateProgress('done');
				hideProgress();
				if (_showDefaultSuccess) {
					Noty.success("上传成功!");
				}
				if(typeof _success == "function"){
					_success(evt);
				}
			},
			progress : function(evt) {
				var progressNum = evt.loaded / evt.total;
				updateProgress(100 * (progressNum.toFixed(2)));
			},
			blob : formData
		};
		return block;
	}
	
	/** 通过formId上传*/
	this.uploadByFormId = function (formId) {
		updateProgress('start');
		var formElement = document.getElementById(formId);
		var formData = new FormData(formElement);
		uploadBlob(packageFiles(formData));
	};
	
	/** 通过自定义formData包装*/
	this.uploadByFormData = function (formData){
		updateProgress('start');
		uploadBlob(packageFiles(formData));
	};
	
};
