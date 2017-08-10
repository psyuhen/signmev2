/**
 * function
 * MenuTree.js
 * @author pansen
 * @createTime 2016-01-05 10:42:23
 */
var MenuTree = function(options){
	var $this = this;
	this.menuTree = {};
	this.searchNode = [];
	this.lastSearchText = "";
	var _searchTime = 0;
	
	/* 上次打开的菜单*/
	var lastOpenModuleId = options.module_id || "";
	var currUser = options.account_id;
	var leafMenu = options.leaf_menu;
	
	this.template = {
		list : '<ul class="nav nav-pills nav-stacked main-menu"></ul>',
		item : '<li class="accordion"></li>',
		icon : '<i class="glyphicon glyphicon-folder-close"></i>',
		link : '<a href="javascript:void(0);"></a>',
		text : '<span> </span>'
	};
	
	/* 根据父节点查询下层数据  */
	this.findTree = function(){
		
		if(leafMenu == ""){
			Storage.addItem("last_user", currUser);
			queryServer();
			return;
		}
		
		var lastUser = Storage.getItem("last_user");
		//如果当前用户不相等，即需要更新菜单
		if(lastUser != currUser){
			Storage.addItem("last_user", currUser);
			queryServer();
			return;
		}
		
		//每天更新一下菜单
		var lastTime = Storage.getItem("last_time");
		var now = DateUtil.local_now("yyyyMMddHHmmss");
		if($.trim(lastTime) == ""){
			Storage.addItem("last_time", now);
		}else{
			var day = DateUtil.getDateDiff(now, lastTime);
			if(parseInt(day, 10) > 0){
				Storage.addItem("last_time", now);
				queryServer();
				return;
			}
		}
		
		//本地不存在时
		var localMenuTree = Storage.getItem("local_menu_tree");
		localMenuTree = $.trim(localMenuTree);
		if(localMenuTree !== "" && localMenuTree !== "null"){
			var moduleList = JSON.parse(localMenuTree);
			buildAndExpand(moduleList, false);
			return;
		}
		
		queryServer();
	};
	
	function queryServer(){
		/*获取Root*/
		var url = mgr_path + "/module/findRoleMenu";
		var menu_tree = $("#menu_tree");
		tableSupport.get(url, {}, function(moduleList){
			buildAndExpand(moduleList, true);
		});
	}
	
	/* 创建树，并展开*/
	function buildAndExpand(moduleList, isAddChildren){
		if(moduleList.length === 0){
			console.warn("没菜单权限");
			return;
		}

		buildTree(moduleList, isAddChildren);
		
		/* 打开点击的菜单*/
		if(lastOpenModuleId !== ""){
			expandParent(lastOpenModuleId);
			$("#" + lastOpenModuleId).addClass('active');
			scrollTo(lastOpenModuleId);
		}else{
			var link = String(window.location);
			if(link.indexOf("?") != -1){
				link = StringUtil.replacePos(link, link.indexOf("?")+1, link.length, "");
			}
			
			$('ul.main-menu li a').each(function() {
				var href = $($(this))[0].href;
				if(href.indexOf("?") != -1){
					href = StringUtil.replacePos(href, href.indexOf("?")+1, href.length, "");
				}
				
				/* 先比较是否相等*/
				if(link === href){
					$(this).parent().addClass('active');
					var activeModuleId=$(this).parent().attr("id");
					expandParent(activeModuleId);
					scrollTo(activeModuleId);
					return false;
				}
				
				/* 不相等时，比较前缀*/
				if (StringUtil.startWith(link, href)){
					$(this).parent().addClass('active');
					var activeModuleId=$(this).parent().attr("id");
					expandParent(activeModuleId);
					scrollTo(activeModuleId);
					return false;
				}
			});
		}
	
	}
	
	
	/*生成树*/
	function buildTree(moduleList, isAddChildren){
		
		if(isAddChildren){
			var menuJson = moduleList;
			/*给每个节点添加一个children*/
			$.each(menuJson,function(i, module){
				this.children = [];
				$this.menuTree[this.module_id] = this;
			});
			
			/*把子节点附加到父节点的children身上*/
			$.each(menuJson,function(i, module){
				if(this.pmodule_id != null){
					$this.menuTree[this.pmodule_id].children.push(this);
				}
			});
			
			menuJson = null;
			/*menuTree只要一个根就行*/
			$this.menuTree = $this.menuTree.Module;
			Storage.addItem("local_menu_tree", JSON.stringify($this.menuTree));
		}else{
			$this.menuTree = moduleList;
		}
		
		
		/* 默认下Module节点不需要生成 */
		var children = $this.menuTree.children;
		for (var i = 0,len = children.length; i < len; i++) {
			var node = children[i];
			buildTreeHtml(node);
		}
	}
	
	/* 生成HTMl树
	 例子：
		 <li class="accordion">
		  <a href="#"><i class="glyphicon glyphicon-plus"></i><span> Accordion Menu</span></a>
          <ul class="nav nav-pills nav-stacked">
             <li><a href="#">Child Menu 1</a></li>
          </ul>
          </li>
	 *  */
	function buildTreeHtml(curNode){
		/* 生成Html  */
		var children = curNode.children;
		var len = children.length;
		appendToTree(curNode);
		/* 没有子节点了，说明该节点是叶子节点 */
		if(len <= 0){
			return;
		}
		for (var i = 0; i < len; i++) {
			var node = children[i];
			
			buildTreeHtml(node);
		}
	}
	
	var __text = $($this.template.text);/*文本*/
	var __link = $($this.template.link);/*链接*/
	var __item = $($this.template.item);/*li*/
	var __icon = $($this.template.icon);/* i */
	/* 添加节点到其节点的根下*/
	function appendToTree(curNode){
		var $text = __text.clone().text(" " + curNode.module_name);/*文本*/
		var $link = __link.clone();/*链接*/
		var $item = __item.clone();/*li*/
		var $icon = __icon.clone();/* i */
		var $module_id = curNode.module_id;
		$item.attr("id", $module_id);/* 为li增加一个字段，方便处理  */
		
		var children = curNode.children;
		if(children.length > 0 || (children.length == 0 && curNode.module_type == 1)){/* 如果是有子节点的，生成目录图标，并增加事件*/
			$link.on("click", function(){
				var tmpLi = $(this).parent();
				$this.toggleClass(tmpLi.attr("id"));
			});
			$link.append($icon).append($text);
			$item.append($link).append($this.template.list);
		}else{/* 如果是叶子节点的，增加路径，方便点击哟*/
			$icon.removeClass("glyphicon-folder-close");
			$icon.addClass("glyphicon-file");
			
			/* 判断module_entry是不是旧系统的*/
			var _module_entry = $.trim(curNode.module_entry)
			if(_module_entry.indexOf(".jsp") >= 0 || _module_entry.indexOf(".do") >= 0){
				$link.attr("href", "javascript:void(0);");
				$link.prop("data-url", mgr_path + "/tofxjkweb?url=" + _module_entry + "&module_id="+$module_id);
				$link.on("click", function(event){
					event.preventDefault();
					var url = $(this).prop("data-url");
					openFxjkweb(url);
				});
			}else{
				if(_module_entry.indexOf("?") >= 0){
					$link.attr("href", mgr_path + _module_entry + "&module_id="+$module_id);
				}else{
					$link.attr("href", mgr_path + _module_entry + "?module_id="+$module_id);
				}
			}
			
			var $module_target=$.trim(curNode.module_target);
			$link.attr("target", $module_target === "" ? "_self" : $module_target);
			$link.append($icon).append($text);
			$item.append($link);
		}
		
		var pmodule_id = curNode.pmodule_id;
		if(pmodule_id === "Module"){
			$("#" + pmodule_id).append($item);
		}else{
			$("#" + pmodule_id + " > ul").append($item);
		}
	}
	
	/* 打开fxjkweb的页面*/
	function openFxjkweb(url){
		StringUtil.openPage(url);
	}
	
	/*显示或者打开节点*/
	this.toggleClass = function(pmodule_id){
		var $li = $("#" + pmodule_id);
		var $ul = $li.find('ul:first');
		if($ul.size() == 0){
			return;
		}
		toggleClass2($li, $ul.is(':visible'));
	};
	
	/*
	 * 增加一个私有方法用于节点的展示与折叠
	 * pmodule_id父节点
	 * isVisible 是否可见
	 * */
	function toggleClass2 (liIdObj, isVisible){
		var $li = liIdObj;
		var $ul = $li.find('ul:first');
		var $i = $li.find("a:first > i");
		if(isVisible){
			$li.removeClass('active');
			$i.addClass("glyphicon-folder-close");
			$i.removeClass("glyphicon-folder-open");
			$ul.slideUp();
		}else{
			$li.addClass('active');
			$i.addClass("glyphicon-folder-open");
			$i.removeClass("glyphicon-folder-close");
			$ul.slideDown();
		}
	}
	
	/* 搜索文本 */
	this.onSearch = function(searchText){
		/*如果此次搜索的关键词跟上一次不一样，重置搜索次数*/
		if(searchText !=  $this.lastSearchText){
			_searchTime = 0;
			$this.lastSearchText = searchText;
			$this.searchNode=[];
		}
		
		_searchTime ++;
		
		/*如果搜索次数大于1，而且关键词相同，则可以直接返回了*/
		if(_searchTime > 1 && searchText ==  $this.lastSearchText){
			var moduleId = "";
			/*当找到尽头了，重头再找了*/
			if(_searchTime > $this.searchNode.length){
				_searchTime = 1;
			}
			moduleId = $this.searchNode[_searchTime - 1];
			expandParent(moduleId);
			scrollTo(moduleId);
			return;
		}
		
		$("#Module > li").find("span").each(function(){
			var text = $(this).text();
			var $li = $(this).parent().parent();
			var $i = $(this).prev();
			if(!$i.hasClass("glyphicon-file")){
				toggleClass2($li, true);/*先折叠*/
			}
			
			/*如果能匹配上*/
			if(text.indexOf(searchText) != -1){
				var moduleId = $li.attr("id");
				$this.searchNode.push(moduleId);
				
				/*if(!$i.hasClass("glyphicon-file")){
					$this.toggleClass(moduleId);再展开
				}else{如果是叶子节点的展开父节点
					expandParent(moduleId);
				}*/
			}
		});
		
		if($this.searchNode.length == 0){
			Noty.warning("没有找到相应菜单项");
			return;
		}
		
		/* 跳转到第一个菜单*/
		var moduleId = $this.searchNode[0];
		expandParent(moduleId);
		scrollTo(moduleId);
	};
	
	/* 滚动到对应的节点*/
	function scrollTo(moduleId, selectObj){
		selectObj = selectObj || $("#menu_list");
		
		var moduleIdObj = $("#" + moduleId);

		if(moduleIdObj.size() == 0){
			return;
		}

		setTimeout(function(){
			selectObj.scrollTop(moduleIdObj.offset().top - selectObj.offset().top + selectObj.scrollTop());
			selectObj.animate({scrollTop: moduleIdObj.offset().top - selectObj.offset().top + selectObj.scrollTop()}, "fast");
		}, 200);
	}
	
	/* 遍历展开父节点*/
	function expandParent(moduleId){
		$("#"+moduleId).parents("ul").each(function(){
			var ulId = $(this).attr("id");
			if(ulId == "Module"){/*来到最顶的时候退出循环*/
				return false;
			}
			/*展开上级*/
			toggleClass2($(this).parent(), false);
		});
		
	}
	
	this.init = function(){
		/* 注册一个enter事件*/
		$("#searchMenuTree").on("keyup", function(event){
			if(event.keyCode == 13){
				var searchText = $.trim($(this).val());
				if(searchText !== ""){
					$this.onSearch(searchText);
				}
			}
		});
		$("#searching").bind("click", function(event){
			var searchText = $.trim($("#searchMenuTree").val());
			if(searchText !== ""){
				$this.onSearch(searchText);
			}
		});
		
		/* 获取高度与宽度 */
		var _height = screen.availHeight;
		_height = _height * 0.85;
		$("#menu_list").css("height", _height + "px");
	};
	
	/*默认初始化*/
	$this.init();
};
