/**
 * 
 */
package {base.package}.web.{service.package};

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import lombok.Getter;
import lombok.Setter;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import {base.package}.model.ResponseInfo;
import {base.package}.model.{service.package}.{model.object};
import {base.package}.service.{service.package}.{model.object}Service;
import {base.package}.util.HttpUtil;

/**
 * {table.name} Controller类
 * @author {author}
 *
 */
@Controller
public class {model.object}Controller implements {base.package}.service.upload.Validator<{model.object}>{
	private static final Log LOGGER = LogFactory.getLog({model.object}Controller.class);
	private @Autowired @Setter @Getter {service.interface} {service.interface.lowercase};
	/**
	 * 初始化页面
	 * @return
	 */
	@RequestMapping(value = "{request.param}/listmgr")
	public String toListPage(HttpServletRequest request){
		request.setAttribute("page", "mgr");
		request.setAttribute("module_id", "{module_id}");
		return "{jsp.path}/{model.object}List";
	}

	/**
	 * query页面
	 * @return
	 */
	@RequestMapping(value = "{request.param}/query")
	public String toQueryPage(HttpServletRequest request){
		request.setAttribute("page", "query");
		request.setAttribute("module_id", "{module_id}");
		return "{jsp.path}/{model.object}List";
	}
	
	/**
	 * 跳转新增页面
	 * @return
	 */
	@RequestMapping(value = "{request.param}/add")
	public String toAddPage(HttpServletRequest request){
		request.setAttribute("page", "add");
		request.setAttribute("module_id", "{module_id}");
		return "{jsp.path}/{model.object}Add";
	}
	
	/**
	 * 跳转到更新页面
	 * @return
	 */
	@RequestMapping(value = "{request.param}/update")
	public String toUpdatePage(HttpServletRequest request){
		request.setAttribute("page", "update");
		request.setAttribute("module_id", "{module_id}");
		return "{jsp.path}/{model.object}Add";
	}
	/**
	 * 跳转到查看页面
	 * @return
	 */
	@RequestMapping(value = "{request.param}/view")
	public String toViewPage(HttpServletRequest request){
		request.setAttribute("page", "view");
		request.setAttribute("module_id", request.getParameter("module_id"));
		return "{jsp.path}/{model.object}Add";
	}
	
	/**
	 * 查询{table.name}信息(分页)
	 * @param {model.object.lowercase}
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "{request.param}/query{model.object}Page", method = RequestMethod.POST)
	public {base.package}.web.page.Page query{model.object}({model.object} {model.object.lowercase}){
		Page<{model.object}> list = (Page<{model.object}>)this.{service.interface.lowercase}.query{model.object}({model.object.lowercase});
		
		return new {base.package}.web.page.Page(list);
	}
	
	/**
	 * 根据Key查询{table.name}信息
	 * @param {table.key}
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "{request.param}/queryByKey", method = RequestMethod.GET)
	public {model.object} queryByKey(String {table.key}){
		return this.{service.interface.lowercase}.queryByKey({table.key});
	}
	/**
	 * 新增{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "{request.param}/add{model.object}", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> add{model.object}({model.object} {model.object.lowercase}){
		try{
			ResponseInfo responseInfo = validate({model.object.lowercase});
			if(ResponseInfo.FAILURE.equals(responseInfo.getStatus())){
				return HttpUtil.failure(responseInfo.getDesc());
			}
			
			int c = this.{service.interface.lowercase}.add{model.object}({model.object.lowercase});
			if(c==0){
				return HttpUtil.failure("新增{table.name}失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("新增{table.name}失败!");
		}
		
		return HttpUtil.success("新增{table.name}成功!");
	}
	
	/*校验*/
	public ResponseInfo validate({model.object} {model.object.lowercase}){
		if({model.object.lowercase} == null){
			return ResponseInfo.fail("{table.name}信息为空!");
		}
		
{validate.field}
		
		return ResponseInfo.success("校验成功");
	}
	
	
	/**
	 * 更新{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "{request.param}/update{model.object}", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> update{model.object}({model.object} {model.object.lowercase}){
		try{
			ResponseInfo responseInfo = validate({model.object.lowercase});
			if(ResponseInfo.FAILURE.equals(responseInfo.getStatus())){
				return HttpUtil.failure(responseInfo.getDesc());
			}
			
			int c = this.{service.interface.lowercase}.update{model.object}({model.object.lowercase});
			if(c == 0){
				return HttpUtil.failure("更新{table.name}失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("更新{table.name}失败!");
		}
		
		return HttpUtil.success("更新{table.name}成功!");
	}
	
	/**
	 * 删除{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "{request.param}/delete{model.object}", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> delete{model.object}({model.object} {model.object.lowercase}){
		try{
			int c = this.{service.interface.lowercase}.delete{model.object}({model.object.lowercase});
			if(c == 0){
				return HttpUtil.failure("删除{table.name}失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("删除{table.name}失败!");
		}
		
		return HttpUtil.success("删除{table.name}成功!");
	}
	/**
	 * 批量删除{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "{request.param}/deleteBatch{model.object}", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> deleteBatch{model.object}(List<{model.object}> {model.object.lowercase}){
		try{
			this.{service.interface.lowercase}.deleteBatch{model.object}({model.object.lowercase});
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("批量删除{table.name}失败!");
		}
		
		return HttpUtil.success("批量删除{table.name}成功!");
	}
}
