/**
 * function:
 * Noty.js
 * @author pansen
 * @createTime 2015-12-23 16:17:25
 */
var Noty = function(){};

/*生成noty对象*/
Noty.generate = function(txt,typ,lay) {
	lay = lay || "center";
    var n = noty({
        text        : txt,
        type        : typ,
        dismissQueue: false,
        timeout     : 2000,
        layout      : lay
    });
    return n;
};

/*生成noty的information对象*/
Noty.information = function(txt,lay) {
    return Noty.generate(txt, "information", lay);
};

/*生成noty的alert对象*/
Noty.alert = function(txt,lay) {
	return Noty.generate(txt, "alert", lay);
};

/*生成noty的warning对象*/
Noty.warning = function(txt,lay) {
	return Noty.generate(txt, "warning", lay);
};

/*生成noty的success对象*/
Noty.success = function(txt,lay) {
	return Noty.generate(txt, "success", lay);
};

/*生成noty的response*/
Noty.response = function(responseInfo){
	if(responseInfo.status == "0"){
		Noty.success(responseInfo.desc);
	}else{
		Noty.warning(responseInfo.desc);
	}
};

/*右下角的提示*/
Noty.error = function(txt) {
	var title = "<p>信息提醒:</p>";
	
    var n = noty({
        text        : title + txt,
        type        : "error",
        closeButton : "true",
        dismissQueue: true,
        maxVisible  : 20,
        layout      : "bottomRight"
    });
    return n;
};

/* 增加popover提示*/
Noty.popover = function(id, text){
	var popoverObj = null;
	if(typeof id === "string"){
		popoverObj = $("#" + id);
	}else{
		popoverObj = id;
	}
	popoverObj.attr({
		"data-container" : "body",
		"data-toggle" : "popover",
		"data-placement" : "top",
		"data-content" : text
	});
	popoverObj.popover("show");
	popoverObj.focus();
	
	setTimeout(function(){
		popoverObj.popover("destroy");
	}, 3000);
};
