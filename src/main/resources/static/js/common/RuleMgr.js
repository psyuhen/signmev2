/**
 * 规则管理类，提供一些规则号的查询等常用方法
 * function:
 * RuleMgr.js
 * @author sam.pan
 * @createTime 2016-01-26 11:25:55
 */
var RuleMgr = function(options){
	var $this = this;
	/* 所放的位置*/
	var _id = options.id;
	var _boxContent = null;
	//回调函数，查询完数据后调用
	var _callback = options.callback;
	//同步标志，默认为false
	var _sync = options.sync || false;
	
	/* 查询数据字典获得规则号时的数据字典名称 */
	var _dictname = options.dictname || "";
	
	/* 支持其他URL，但需要使用RuleCondition的Model*/
	var _url = options.url || "/rule/checkbox";
	
	/**
	 * {rule_no:'', belongToList:[]', ruleTypeList:[], flow_type:'', b_order_name:''}
	 * 其中belongToList、ruleTypeList为数组类型
	 * @see RuleCondition类
	 * */
	var _ruleCondition = options.condition || {};
	
	/**
	 * 查询规则号
	 */
	this.queryErmRuleList = function(){
		/* 默认把数组的值转换为Spring可转换的值*/
		StringUtil.appendList2Map(_ruleCondition, "belongToList", _ruleCondition["belongToList"]);
		StringUtil.appendList2Map(_ruleCondition, "ruleTypeList", _ruleCondition["ruleTypeList"]);
		StringUtil.appendList2Map(_ruleCondition, "ruleNoOrList", _ruleCondition["ruleNoOrList"]);
		StringUtil.appendList2Map(_ruleCondition, "ruleNoNotInList", _ruleCondition["ruleNoNotInList"]);
		StringUtil.appendList2Map(_ruleCondition, "flowTypeList", _ruleCondition["flowTypeList"]);
		StringUtil.appendList2Map(_ruleCondition, "flowTypeNotInList", _ruleCondition["flowTypeNotInList"]);
		
		if(_sync){
			tableSupport.synchGet(cfrm_path + _url, _ruleCondition, function(list){
				doList(list);
			});
		}else{
			tableSupport.get(cfrm_path + _url, _ruleCondition, function(list){
				doList(list);
			});
		}
	};
	
	/**
	 * 根据数据字典名称查询规则号
	 */
	this.queryRuleListFromDict = function() {
		Form.dictCheckbox(_id + " .box-content", "ruleList[]", _dictname);
	}
	
	function doList(list){
		$this.toCheckboxHtml(list);
		
		if(typeof _callback === "function"){
			_callback(list);
		}
	}
	
	/**
	 * 生成规则号checkbox
	 * @param list 规则数据
	 */
	this.toCheckboxHtml = function(list){
		if(list == null || list.length == 0){
			_boxContent.html("没有查询到相应规则！");
			return;
		}
		
		var allCheckboxHtml = "&nbsp;&nbsp;&nbsp;";
		for (var i = 0; i < list.length; i++) {
			var rule = list[i];
			var rule_no = rule.rule_no;
			var rule_desc = rule.rule_desc;
			
			allCheckboxHtml += checkboxHtml(rule_no, rule_desc);
		}
		
		_boxContent.html(allCheckboxHtml);
	};
	
	/* 全选按钮 */
	function btnCheckAllEvent(){
		$('#' + _id + ' button.btn-checkall').click(function (e) {
	        e.preventDefault();
	        var $target = $(this).parent().next('.box-content');
			$target.find(":checkbox").prop("checked", true);
	    });
	}
	/* 取消全选按钮 */
	function btnCancelEvent(){
		$('#' + _id + ' button.btn-cancel').click(function (e) {
			e.preventDefault();
			var $target = $(this).parent().next('.box-content');
			$target.find(":checkbox").prop("checked", false);
		});
	}
	/* 反选按钮 */
	function btnRecheckEvent(){
		$('#' + _id + ' button.btn-recheck').click(function (e) {
			e.preventDefault();
			var $target = $(this).parent().next('.box-content');
			$target.find(":checkbox").each(function(){
				$(this).prop("checked",!$(this).is(":checked"));
			});
		});
	}
	/* 隐藏按钮 */
	function btnMinimizeEvent(){
		$('#' + _id + ' button.btn-minimize').click(function (e) {
			e.preventDefault();
			var $target = $(this).parent().next('.box-content');
			if ($target.is(':visible')){
				$('i', $(this)).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
			} else {
				$('i', $(this)).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
			}
			$target.slideToggle();
			
			/* 切换文字*/
			var text = $(this).text();
			if(text == "隐    藏"){
				$(this).text("展    开");
			}else{
				$(this).text("隐    藏");
			}
		});
	}
	/* 重新查询按钮 */
	function btnRequeryEvent(){
		$('#' + _id + ' button.btn-requery').click(function (e) {
			e.preventDefault();
			
			if (_dictname == "") {
				$this.queryErmRuleList();
			} else {
				$this.queryRuleListFromDict();
			}
		});
	}
	
	/* checkbox html */
	function checkboxHtml(rule_no, rule_desc){
		var label = Html.checkbox(rule_no, rule_no, "ruleList[]", rule_no, rule_desc);
		return label;
	}
	
	/* row html */
	function grid(content){
		var row = Html.grid(buttonHtml(), content, "", 200);
		return row;
	}
	
	/* btn html*/
	function buttonHtml(){
		var btn = '';
//		btn += '<p class="btn-group">';
        btn += '	<button class="btn btn-primary btn-xs btn-checkall">全    选</button>';
        btn += '	<button class="btn btn-primary btn-xs btn-cancel">取消全选</button>';
        btn += '	<button class="btn btn-primary btn-xs btn-recheck">反    选</button>';
        btn += '	<button class="btn btn-primary btn-xs btn-minimize">隐    藏</button>';
        btn += '	<button class="btn btn-primary btn-xs btn-requery">重新查询</button>';
//        btn += '</p>';
        
        return btn;
	}
	
	/* 初始化规则div*/
	function init(){
		$("#" + _id).html(grid(""));
		
		/* 增加按钮事件 */
		btnCheckAllEvent();
		btnCancelEvent();
		btnRecheckEvent();
		btnMinimizeEvent();
		btnRequeryEvent();
		
		_boxContent = $("#" + _id).find(".box-content");
		
		/*默认查询*/
		$("#" + _id + " button.btn-requery").click();
	}
	
	init();
};


