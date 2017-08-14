/**
 * 
 */
package com.huateng.signmev2.mapper.system;

import java.util.List;

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
	
	/**
	 * 查询未签到的数据
	 * @param t
	 * @return
	 */
	public List<Signlog> queryUnSign(Signlog t);
}
