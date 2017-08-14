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

import com.huateng.signmev2.mapper.system.SignlogMapper;
import com.huateng.signmev2.model.system.Signlog;
import com.huateng.signmev2.service.system.SignlogService;
import com.huateng.signmev2.web.page.PageHelper;

/**
 * @author sam.pan
 *
 */
@Service
public class SignlogServiceImp extends BaseService<Signlog> implements SignlogService {
	
	@Resource(type=SignlogMapper.class)
	private SignlogMapper signlogMapper;
	
	@PostConstruct
	public void initMapper() {
		super.setMapper(signlogMapper);
	}
	
	@Override
	public List<Signlog> queryForListPage(Signlog t) {
		if(StringUtils.equals(t.getSign_flag(), "5")) {
			PageHelper.startPage(t);
			return signlogMapper.queryUnSign(t);
		}
		
		return super.queryForListPage(t);
	}
	/**
	 * 签退
	 * @param t
	 * @return
	 */
	@Override
	public int updateSignout(Signlog t) {
		return signlogMapper.updateSignout(t);
	}
	
	@Override
	public boolean isSignIn(String signInDate, String mac) {
		Signlog signlog = new Signlog();
		signlog.setSign_in_date(signInDate);
		signlog.setMac(mac);
		List<Signlog> signlogList = signlogMapper.queryForList(signlog);
		if(signlogList == null || signlogList.isEmpty()) {
			return false;
		}
		
		return true;
	}

}
