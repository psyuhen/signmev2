/**
 * 批量导入的提交
 * 
 * @author shijunkai
 */
$(document).ready(function() {
	var photofmts = ["gif","jpg","jpeg","png","bmp"];
	$("#upload").bind("click", function(e) {
		e.preventDefault();
		var file = $("#importForm #uploadFile").val();
		if (file == "") {
			Dialog.create("","未选择文件：请选择gif,jpg,jpeg,png,bmp格式的图片！",null);
			return false;
		}

		var isRightFmt = false;
		$.each(photofmts, function (index, item) {
			if (StringUtil.endWith(file, item)) {
				isRightFmt = true;
				return false;
			}
		});

		if(!isRightFmt){
			Dialog.create("","文件格式不正确：请选择gif,jpg,jpeg,png,bmp格式的图片！",null);
			return false;
		}

		Dialog.create("","确定要上传吗？",function () {
			submit();
		});

		function submit() {
			if (Html5Util.supports_formdata()) {
				html5Upload();
			} else {
				$("#importForm").submit();
			}
		}

		function html5Upload() {
			$("#upload").attr("disabled", true);
			var url = $("#importForm").attr("action");
			var success = function(evt) {
				var text = evt.target.responseText;
				if(text != ""){
					var kemsg = eval("(" + text + ")");
					if(kemsg.error == "0"){
						var li = $("#logophoto")
                        var _a = li.children("a:eq(0)");
                        _a.attr({
                            id : kemsg.data,
                            href: kemsg.url
                        });
                        _a.css("background","url(" + kemsg.url + ")");
                        _a.children("img:eq(0)").attr("src", kemsg.url);
						Noty.information("上传成功");
					}else{
						Noty.error(kemsg.message);
					}
				}
				$("#upload").attr("disabled", false);
			};
			new FileUpload({
				"url" : url,
				"progress" : $("#progress"),
				"showDefaultSuccess" : false,
				"success" : success
			}).uploadByFormId("importForm");
		}
	});
});