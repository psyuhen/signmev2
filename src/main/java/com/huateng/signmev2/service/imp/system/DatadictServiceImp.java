/**
 * 
 */
package com.huateng.signmev2.service.imp.system;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.mybatis.base.BaseService;
import org.springframework.stereotype.Service;

import com.huateng.signmev2.mapper.system.DatadictMapper;
import com.huateng.signmev2.model.system.Datadict;
import com.huateng.signmev2.service.system.DatadictService;

/**
 * @author sam.pan
 *
 */
@Service
public class DatadictServiceImp extends BaseService<Datadict> implements DatadictService {
	@Resource(type=DatadictMapper.class)
	private DatadictMapper datadictMapper;
	
	@PostConstruct
	public void initMapper() {
		super.setMapper(datadictMapper);
	}
	
	@Override
	public int updateBatch(List<Datadict> list) {
		
		if(list == null || list.isEmpty()) {
			return 0;
		}
		
		int number = 0;
		for (Datadict datadict : list) {
			number = number + datadictMapper.update(datadict);
		}
		
		return number;
	}

	@Override
	public Datadict queryByName(String dd_name) {
		Datadict t = new Datadict();
		t.setDd_name(dd_name);
		t.setDd_enabled("1");
		
		return datadictMapper.queryForObject(t);
	}
	
	
}
