/**
 * 
 */
package com.huateng.signmev2.service.system;

import org.mybatis.base.Service;

import com.huateng.signmev2.model.system.SignmeStat;

/**
 * @author sam.pan
 *
 */
public interface SignmeStatService extends Service<SignmeStat> {
	/**
	 * 运行存储过程
	 * @param curr_date
	 */
	public void procSignmeStat(String curr_date);
}
