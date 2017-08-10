/**
 *机构信息(所属机构)常用方法
 * *@author yiyou
 */
var BranaMgr = function(id,dataSource,sync){
	var $this = this;
	
	/*数据来源*/
	var _dataSource = $.trim(dataSource) == ""
		|| (dataSource == true) ? true : false;
	
	/* 所放的位置*/
	var _id = id;
	var _boxContent = null;
	//同步标志，默认为false
	var _sync = sync || false;
	
	/* checkbox html */
	function checkboxHtml(bran_no, bran_name){
		var label = Html.checkbox("bran_no_" + bran_no, bran_no, "bran_no", bran_name, bran_name);
		return label;
	}
	
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
	
	/* row html */
	function grid(content){
		var row = Html.grid(buttonHtml(), content, "", 300, "branTableDiv");
		return row;
	}
	
	/* btn html*/
	function buttonHtml(){
		var btn = '';
//		btn += '<p class="btn-group">';
        btn += '	<button id="checkAll" class="btn btn-primary btn-xs btn-checkall">全    选</button>';
        btn += '	<button id="cancelCheck" class="btn btn-primary btn-xs btn-cancel">取消全选</button>';
        btn += '	<button id="reCheck" class="btn btn-primary btn-xs btn-recheck">反    选</button>';
//        btn += '</p>';
        
        return btn;
	}
	
	/* 同步 或 异步查询*/
	function _query(url){
		if(_sync){
			tableSupport.synchGet(cfrm_path + url, {}, function(list){
				$this.toCheckboxHtml(list);
			});
		}else{
			tableSupport.get(cfrm_path + url, {}, function(list){
				$this.toCheckboxHtml(list);
			});
		}
	}
	/**
	 * 生成机构checkbox
	 * @param list 规则数据
	 */
	this.toCheckboxHtml = function(list){
		var index = 1;
		if(list == null || list.length == 0){
			_boxContent.html("没有查询到机构！");
			return;
		}
		
		var tab = $("<table style='width:100%'></table>"); 
		var tbody = $("<tbody>");
		var td = "";
		for (var i = 0; i < list.length; i++) {
			var branch = list[i];
			var bran_no = branch.bran_no;
			var bran_name = branch.bran_name;
			
			td += "<td>";
			td += checkboxHtml(bran_no, bran_name);
			td += "</td>";
			
			index++;
			if(index == 8){
				var tr = "<tr>" + td + "</tr>";
				tbody.append(tr);
				td = "";
				index = 1;
			}
		}
		if(td != ""){
			var tr = "<tr>" + td + "</tr>";
			tbody.append(tr);
		}
		tab.append(tbody);
		_boxContent.html(tab);
	};
	
	/* 初始化机构div*/
	function init(){
		$("#" + _id).html(grid(""));
		
		/* 增加按钮事件 */
		btnCheckAllEvent();
		btnCancelEvent();
		btnRecheckEvent();
		
		_boxContent = $("#" + _id).find(".box-content");
		
		var url = "";
		/*查询*/
		if(_dataSource){
			//默认查询机构信息(所属机构)常用方法
			url = "/brana/rptbank";
		}else{
			//_dataSource为false时查询海外规则机构
			url = "/foreignBranchBank/queryBranchnameASBranName";
		}
		
		_query(url);
	}
	
	init();
}