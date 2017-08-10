/**
 * 
 */
package org.mybatis.base;

import java.util.List;

/**
 * @author sam.pan
 *
 */
public interface Service<T> {
	/**
	 * 根据t查询单表数据
	 * @param t
	 * @return
	 */
	public T queryForObject(T t);
	
	/**
	 * 根据t查询单表列表数据
	 * @param t
	 * @return
	 */
	public List<T> queryForList(T t);
	/**
	 * 根据t查询单表列表数据(分页)
	 * @param t
	 * @return
	 */
	public List<T> queryForListPage(T t);
	
	/**
	 * 插入数据
	 * @param t
	 * @return
	 */
	public int save(T t);
	
	/**
	 * 更新数据
	 * @param t
	 * @return
	 */
	public int update(T t);
	
	/**
	 * 删除数据
	 * @param t
	 * @return
	 */
	public int delete(T t);
}
