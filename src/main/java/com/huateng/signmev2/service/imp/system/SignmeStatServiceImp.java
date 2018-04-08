/**
 * 
 */
package com.huateng.signmev2.service.imp.system;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.mybatis.base.BaseService;
import org.springframework.stereotype.Service;

import com.huateng.signmev2.mapper.system.SignmeStatMapper;
import com.huateng.signmev2.model.system.SignmeStat;
import com.huateng.signmev2.service.system.SignmeStatService;
import com.huateng.signmev2.web.page.PageHelper;

/**
 * @author sam.pan
 *
 */
@Service
public class SignmeStatServiceImp  extends BaseService<SignmeStat> implements SignmeStatService {
	@Resource(type=SignmeStatMapper.class)
	private SignmeStatMapper signmeStatMapper;
	
	@PostConstruct
	public void initMapper() {
		super.setMapper(signmeStatMapper);
	}

	
	@Override
	public List<SignmeStat> queryForListPage(SignmeStat t) {
		
		if(StringUtils.equals(t.getStat_flag(), "1")) {
			PageHelper.startPage(t);
			return signmeStatMapper.queryGroupStat(t);
		}
		
		return super.queryForListPage(t);
	}
	
	@Override
	public void procSignmeStat(String curr_date) {
		signmeStatMapper.procSignmeStat(curr_date);
	}

	/**
	 * 前10名迟到排行
	 * @param signmeStat
	 * @return
	 */
	public List<SignmeStat> queryTopLateList(SignmeStat signmeStat){
		return signmeStatMapper.queryTopLateList(signmeStat);
	}
}
