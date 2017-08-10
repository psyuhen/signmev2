/**
 * 
 */
package org.mybatis.base;

import java.util.List;

import com.huateng.signmev2.model.BaseModel;
import com.huateng.signmev2.web.page.PageHelper;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sam.pan
 *
 */
public class BaseService<T extends BaseModel> implements Service<T> {
	
	private @Setter @Getter Mapper<T> mapper;
	
	@Override
	public T queryForObject(T t) {
		return mapper.queryForObject(t);
	}

	@Override
	public List<T> queryForList(T t) {
		return mapper.queryForList(t);
	}

	@Override
	public List<T> queryForListPage(T t) {
		PageHelper.startPage(t);
		return mapper.queryForList(t);
	}

	@Override
	public int save(T t) {
		return mapper.save(t);
	}

	@Override
	public int update(T t) {
		return mapper.update(t);
	}

	@Override
	public int delete(T t) {
		return mapper.delete(t);
	}

}
