/**
 * 
 */
package com.huateng.signmev2.service.system;

import java.util.List;

import org.mybatis.base.Service;

import com.huateng.signmev2.model.system.Datadict;

/**
 * @author sam.pan
 *
 */
public interface DatadictService extends Service<Datadict> {
	
	/**
	 * 批量更新
	 * @param list
	 * @return
	 */
	public int updateBatch(List<Datadict> list);
	
	/**
	 * 根据名称查询
	 * @param dd_name
	 * @return
	 */
	public Datadict queryByName(String dd_name);
}
