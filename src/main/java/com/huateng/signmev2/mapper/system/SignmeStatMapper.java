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
	List<SignmeStat> queryGroupStat(SignmeStat signmeStat);
	
	/**
	 * 运行存储过程
	 * @param curr_date
	 */
	void procSignmeStat(String curr_date);

	/**
	 * 前10名迟到排行
	 * @param signmeStat
	 * @return
	 */
	List<SignmeStat> queryTopLateList(SignmeStat signmeStat);
}
