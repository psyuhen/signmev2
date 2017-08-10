/**
 * 
 */
package com.huateng.signmev2.mapper.system;

import org.mybatis.base.Mapper;

import com.huateng.signmev2.model.system.Signlog;

/**
 * @author sam.pan
 *
 */
public interface SignlogMapper extends Mapper<Signlog>{
	/**
	 * 签退
	 * @param t
	 * @return
	 */
	public int updateSignout(Signlog t);
}
