/**
 * function
 * Theme.js
 * @author pansen
 * @createTime 2016-01-07 09:24:52
 */
var Theme = function (){
	var $this = this;
	
	this.defaultTheme = 'cerulean';
    this.currentTheme = "";
	
    /*切换主题或者皮肤*/
	this.switchTheme = function(themeName){
		if (themeName == 'classic') {
            $('#css_theme').attr('href', cfrm_path + '/css/bootstrap/bootstrap.min.css');
        } else {
            $('#css_theme').attr('href', cfrm_path + '/css/bootstrap/bootstrap-' + themeName + '.min.css');
        }
	};
	
	/*增加切换主题或皮肤事件*/
	this.onThemeChange = function(){
		$('#themes a').click(function (e) {
	        e.preventDefault();
	        $this.currentTheme = $(this).attr('data-value');
	        $.cookie('currentTheme', $this.currentTheme, {expires: 365});
	        $this.switchTheme($this.currentTheme);
	    });
	};
	
	/*默认初始化*/
	this.init = function(){
		$this.onThemeChange();
		$this.currentTheme = $.cookie('currentTheme') == null ? $this.defaultTheme : $.cookie('currentTheme');
		$this.switchTheme($this.currentTheme);
	};
	
	/* 生成时间*/
	var _date_time = null;
	
	var _now_time_id = $("#now_time");
	
	function interval(){
		_now_time_id.html(DateUtil.local_now("yyyy年MM月dd日hh时mm分ss秒"));
	}
	
	this.startInterval = function(){
		interval();
		setInterval(interval, 1000);
	};
	
	/* 检测浏览器版本*/
	this.checkBrowseVersion = function(){
		var account_id = $.cookie(_user);
		account_id = JSON.parse(account_id);
		
		var now = DateUtil.local_now("yyyyMMddHHmmss");
		if(!account_id){
		        account_id = {count:0,time:now};
		}
		
		//相同用户在10分钟之内不重复显示
		var min = DateUtil.getDateTimeDiff(account_id.time, now, "m");
		if(min > 10){
		        account_id.count = 0;
		}
		
		if(!window.FormData && account_id.count == 0){
		        account_id.count = 1;
		        account_id.time = now;
		        $.cookie(_user, JSON.stringify(account_id),{expires: 365});
		}
	};
};
$(document).ready(function(){
	var theme = new Theme();
	theme.checkBrowseVersion();
	theme.startInterval();
});