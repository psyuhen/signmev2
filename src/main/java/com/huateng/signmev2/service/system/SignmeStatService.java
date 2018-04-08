/**
 * 
 */
package com.huateng.signmev2.service.system;

import org.mybatis.base.Service;

import com.huateng.signmev2.model.system.SignmeStat;

import java.util.List;

/**
 * @author sam.pan
 *
 */
public interface SignmeStatService extends Service<SignmeStat> {
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
