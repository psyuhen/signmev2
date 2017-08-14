/**
 * 
 */
package com.huateng.signmev2.mapper.system;

import java.util.List;

import org.mybatis.base.Mapper;

import com.huateng.signmev2.model.system.SignmeStat;

/**
 * @author sam.pan
 *
 */
public interface SignmeStatMapper extends Mapper<SignmeStat> {

	/**
	 * 查询一段时间的统计信息
	 * @param signmeStat
	 * @return
	 */
	public List<SignmeStat> queryGroupStat(SignmeStat signmeStat);
}
