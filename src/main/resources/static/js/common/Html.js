/**
 * function:
 * Html.js
 *
 * @author sam.pan
 * @CreateTime 2016-03-26 21:37:55
 */
var Html = function(){};

/**
 * 生成grid的网格
 * @param title 标题 
 * @param content 内容，可为Html,
 * @param icon 图标的Html或者文字,
 * @param maxHeight 高度，默认300,
 * @returns {String}
 */
Html.grid = function (title, content, icon, maxHeight, dataDiv){
	maxHeight = maxHeight || 300;
	dataDiv  = dataDiv || "dataListDiv";
	var row = '<div class="row" style="max-height: ' + maxHeight + 'px;overflow: auto;">';
	row += '		<div class="box col-md-12">';
	row += '			<div class="box-inner">';
	row += '				<div class="box-header well" >';
	row += title;
	row += '    				<div class="box-icon">';
	row += icon;
	row += '					</div>';
	row += '				</div>';
	row += '				<div class="box-content" id="'+ dataDiv +'">';
	row += content;
	row += '				</div>';
	row += '			</div>';
	row += '		</div>';
	row += '	</div>';
	
	return row;
};

/**
 * 生成checkbox-inline的html代码
 * @param cbId checkboxId
 * @param cbVal checkbox Value
 * @param cbName checkbox Name
 * @param cbDesc checkbox Desc
 * @param title 标题
 * @returns {String}
 */
Html.checkbox = function (cbId, cbVal, cbName, cbDesc, title){
	var label = '<label class="checkbox-inline" title="' + title + '">';
	label += '		<input type="checkbox" id="' + cbId + '" value="' + cbVal + '" name="' + cbName + '"> ' + cbDesc;
	label += '	</label>';
	
	return label;
}
/**
 * 生成几行几列
 * @param row 多少行
 * @param col 多少列
 * @returns {String}
 */
Html.row = function (row, col){
	row = row || 1;
	col = col || 1;
	
	var html = '';
	//生成行
	for (var i = 0; i < row; i++) {
		var r = '<div class="row">';
		
		//生成列
		for (var j = 0; j < col; j++) {
			var c = '<div class="col-md-'+ (12/col) +'"></div>';
			r += c;
		}
		
		r += '</div>';
		html += r;
	}
	
	return html;
};

/**
 * 生成可关闭的警告框
 * @param content 可为文本，也可以为html内容
 * @returns {String}
 */
Html.alert = function(content){
	var alert = '<div class="alert alert-success alert-dismissible" role="alert">';
	alert += ' <button type="button" class="close" data-dismiss="alert" aria-label="Close" title="删除"><span aria-hidden="true">&times;</span></button>';
	alert += content;
	alert += '</div>';
	return alert;
};
/**
 * 生成可关闭，可连接的警告框
 * @param content 可为文本
 * @param title 连接标题
 * @returns {String}
 */
Html.alertLink = function(content, title){
	var link = ' <a href="javascript:void(0);" class="alert-link" title="' + $.trim(title) + '">' + content + '</a>';
	return Html.alert(link);
};
/**
 * 生成链接
 * @param content 可为文本
 * @param title 连接标题
 * @returns {String}
 */
Html.link = function(href, content, title, cls){
	href = href || "javascript:void(0);";
	var link = ' <a href="' + href + '" class="' + cls + '" title="' + $.trim(title) + '">' + content + '</a>';
	return link;
};

/**
 * Modal Html
 * @param title
 * @param body
 * @param closeEnabled
 * @param confirmEnabled
 * @returns {String}
 */
Html.modal = function(id, title, body, closeEnabled, confirmEnabled){
	if(closeEnabled == undefined){
		closeEnabled = true;
	}
	if(confirmEnabled == undefined){
		confirmEnabled = true;
	}
	
	var _id = id || "_dialog_win";
	
	var div = '';
	div += '<div class="modal" id="' + _id + '"  role="dialog"  tabindex="-1" aria-labelledby="dialog_winLabel" aria-hidden="true">';
	div += '    <div class="modal-dialog" role="document">';
	div += '        <div class="modal-content">';
	div += '            <div class="modal-header">';
	div += '                <h3>' + title + '</h3>';
	div += '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">×</button>';
	div += '            </div>';
	div += '            <div class="modal-body">';
	div += '                ' + body;
	div += '            </div>';
	div += '            <div class="modal-footer">';
	if(closeEnabled){
		div += '                <a href="#" name="btn_close" class="btn btn-secondary" data-dismiss="modal">关闭</a>';
	}
	if(confirmEnabled){
		div += '                <a href="#" name="btn_confirm" class="btn btn-primary" data-dismiss="modal">确认</a>';
	}
	div += '            </div>';
	div += '        </div>';
	div += '    </div>';
	div += '</div>';
	return div;
};
/**
 * Form表单的HTML
 * @param rows
 * @param buttons
 * @param formId
 * @returns {String}
 */
Html.form = function(rows, buttons, formId) {
	var div = '';
	div += '<div class="row">';
	div += '    <div class="box col-md-12">';
	div += '        <div class="box-inner">';
	div += '            <form id="' + formId + '">';
	div += '                <div class="box-content">';
	div += rows;
	div += '                </div>';
	div += '            </form>';
	if (buttons != "") {
		div += '            <div class="modal-footer">';
		div += buttons;
		div += '            </div>';
	}
	div += '        </div>';
	div += '    </div>';
	div += '</div>';
	return div;
};
/**
 * 数据表格的HTML
 * @param tableId
 * @returns {String}
 */
Html.table = function(tableId) {
	var div = '';
	div += '<div class="row">';
	div += '    <div class="box col-md-12">';
	div += '        <div class="box-inner">';
	div += '            <div class="box-content">';
	div += '                <table id="' + tableId + '" class="table table-striped table-bordered" cellspacing="0" width="100%">';
	div += '                </table>';
	div += '            </div>';
	div += '        </div>';
	div += '    </div>';
	div += '</div>';
	return div;
};
/**
 * 数据表格的col6的HTML
 * @param content
 * @returns {String}
 */
Html.colmd6 = function(content) {
	var div = '';
	div += '<div class="col-md-6">';
	div += content;
	div += '</div>';
	return div;
};

/**
 *  生成一个id和height的DIV
 * @param id div的ID
 * @param height div的高度
 * @returns {String}
 */
Html.div = function(id, height){
	return '<div id="' + id + '" style="height: '+ height +'px;"></div>';
}
