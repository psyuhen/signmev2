/**
 * 
 */
package {base.package}.service.imp.{service.package};

import java.util.List;

import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import {base.package}.mapper.{mapper.package}.{mapper.interface};
import {base.package}.model.{model.subpackage}.{model.object};
import {base.package}.service.{model.subpackage}.{service.interface};
import {base.package}.web.page.PageHelper;

/**
 * {table.name}服务实现类
 * @author {author}
 *
 */
@Service
public class {service.interface}Imp implements {service.interface} {

	private @Autowired @Setter @Getter {mapper.interface} {mapper.interface.lowercase};
	/**
	 * 查询{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	public List<{model.object}> query{model.object}({model.object} {model.object.lowercase}){
		int start = {model.object.lowercase}.getStart();
		int limit = {model.object.lowercase}.getLimit();
		/* 分页  */
		PageHelper.startPage(start, limit);
		return this.{mapper.interface.lowercase}.query{model.object}({model.object.lowercase});
	}
	/**
	 * 查询{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	public List<{model.object}> queryBy({model.object} {model.object.lowercase}){
		return this.{mapper.interface.lowercase}.query{model.object}({model.object.lowercase});
	}
	/**
	 * 根据Key查询{table.name}信息
	 * @param {table.key}
	 * @return
	 */
	public {model.object} queryByKey(String {table.key}){
		{model.object} {model.object.lowercase} = new {model.object}();
		{model.object.lowercase}.set{table.ukey}({table.key});
		List<{model.object}> list = this.{mapper.interface.lowercase}.query{model.object}({model.object.lowercase});
		if(list == null || list.isEmpty()){
			return null;
		}
		
		return list.get(0);
	}
	/**
	 * 新增{table.name}信息
	 * @param {model.object.lowercase}
	 */
	public int add{model.object}({model.object} {model.object.lowercase}){
		return this.{mapper.interface.lowercase}.add{model.object}({model.object.lowercase});
	}
	/**
	 * 批量新增{table.name}信息
	 * @param {model.object.lowercase}
	 */
	public int addBatch{model.object}(List<{model.object}> {model.object.lowercase}){
		if({model.object.lowercase} == null || {model.object.lowercase}.isEmpty()){
			return 0;
		}
		return this.{mapper.interface.lowercase}.addBatch{model.object}({model.object.lowercase});
	}
	/**
	 * 更新{table.name}信息
	 * @param {model.object.lowercase}
	 */
	public int update{model.object}({model.object} {model.object.lowercase}){
		return this.{mapper.interface.lowercase}.update{model.object}({model.object.lowercase});
	}
	/**
	 * 根据{table.key}删除{table.name}信息
	 * @param {model.object.lowercase}
	 */
	public int delete{model.object}({model.object} {model.object.lowercase}){
		return this.{mapper.interface.lowercase}.delete{model.object}({model.object.lowercase});
	}
	/**
	 * 根据{table.key}批量删除{table.name}信息
	 * @param {model.object.lowercase}
	 */
	public int deleteBatch{model.object}(List<{model.object}> {model.object.lowercase}){
		if({model.object.lowercase} == null || {model.object.lowercase}.isEmpty()){
			return 0;
		}
		return this.{mapper.interface.lowercase}.deleteBatch{model.object}({model.object.lowercase});
	}
}
