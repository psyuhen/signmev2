/**
 * 
 */
package com.huateng.signmev2.web.system;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huateng.signmev2.model.ResponseInfo;
import com.huateng.signmev2.model.system.Datadict;
import com.huateng.signmev2.service.system.DatadictService;
import com.huateng.signmev2.util.HttpUtil;

/**
 * @author sam.pan
 *
 */
@Controller
public class DatadictController {
	private static final Log LOGGER = LogFactory.getLog(DatadictController.class);
	private @Autowired DatadictService datadictService;
	
	@RequestMapping(value = "/signmesettime.html")
	public String hello(HttpServletRequest request) {
		return "signmesettime";
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/mgr/signmesettime/query", method = RequestMethod.POST)
	public List<Datadict> query(){
		List<Datadict> list = new ArrayList<Datadict>();
		
		list.add(datadictService.queryByName("LATE_TIME"));
		list.add(datadictService.queryByName("EARLY_TIME"));
		list.add(datadictService.queryByName("OT_TIME"));
		return list;
	}
	
	/**
	 * 编辑签到人信息
	 * @param mac
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signmesettime/updateBatch", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> updateBatch(@RequestParam String late_time,@RequestParam String early_time, @RequestParam String ot_time){
		try{
			
			late_time = StringUtils.trimToEmpty(late_time);
			early_time = StringUtils.trimToEmpty(early_time);
			ot_time = StringUtils.trimToEmpty(ot_time);
			
			
			List<Datadict> list = new ArrayList<Datadict>();
			Datadict dd1 = new Datadict();
			dd1.setDd_name("LATE_TIME");
			dd1.setDd_id(late_time);
			list.add(dd1);
			
			Datadict dd2 = new Datadict();
			dd2.setDd_name("EARLY_TIME");
			dd2.setDd_id(early_time);
			list.add(dd2);
			
			
			Datadict dd3 = new Datadict();
			dd3.setDd_name("OT_TIME");
			dd3.setDd_id(ot_time);
			list.add(dd3);
			
			int c = this.datadictService.updateBatch(list);
			if(c <= 0) {
				return HttpUtil.failure("更新失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("更新失败!");
		}
		
		return HttpUtil.success("更新成功!");
	}
}
