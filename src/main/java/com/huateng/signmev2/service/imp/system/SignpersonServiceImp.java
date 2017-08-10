/**
 * 
 */
package com.huateng.signmev2.service.imp.system;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.mybatis.base.BaseService;
import org.springframework.stereotype.Service;

import com.huateng.signmev2.mapper.system.SignpersonMapper;
import com.huateng.signmev2.model.system.Signperson;
import com.huateng.signmev2.service.system.SignpersonService;

/**
 * @author sam.pan
 *
 */
@Service
public class SignpersonServiceImp extends BaseService<Signperson> implements SignpersonService {
	
	@Resource(type=SignpersonMapper.class)
	private SignpersonMapper signpersonMapper;
	
	@PostConstruct
	public void initMapper() {
		super.setMapper(signpersonMapper);
	}
}
