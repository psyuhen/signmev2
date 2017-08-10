/**
 * 
 */
package {base.package}.mapper.{mapper.package};

import java.util.List;

import {base.package}.model.{model.subpackage}.{model.object};

/**
 * {table.name}Mapper
 * @author {author}
 *
 */
public interface {mapper.interface} {
	/**
	 * 查询{table.name}信息
	 * @param {model.object.lowercase}
	 * @return
	 */
	List<{model.object}> query{model.object}({model.object} {model.object.lowercase});
	/**
	 * 新增{table.name}信息
	 * @param {model.object.lowercase}
	 */
	int add{model.object}({model.object} {model.object.lowercase});
	/**
	 * 批量新增{table.name}信息
	 * @param {model.object.lowercase}
	 */
	int addBatch{model.object}(List<{model.object}> {model.object.lowercase});
	/**
	 * 更新{table.name}信息
	 * @param {model.object.lowercase}
	 */
	int update{model.object}({model.object} {model.object.lowercase});
	/**
	 * 根据{table.key}删除{table.name}信息
	 * @param {model.object.lowercase}
	 */
	int delete{model.object}({model.object} {model.object.lowercase});
	/**
	 * 根据{table.key}批量删除{table.name}信息
	 * @param {model.object.lowercase}
	 */
	int deleteBatch{model.object}(List<{model.object}> {model.object.lowercase});
}