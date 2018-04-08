/**
 * 
 */
package com.huateng.signmev2.web.system;

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

import com.github.pagehelper.Page;
import com.huateng.signmev2.model.ResponseInfo;
import com.huateng.signmev2.model.system.Signperson;
import com.huateng.signmev2.service.system.SignpersonService;
import com.huateng.signmev2.util.HttpUtil;
import com.huateng.signmev2.util.Validator;

/**
 * @author sam.pan
 *
 */
@Controller
public class SignpersonController {
	private static final Log LOGGER = LogFactory.getLog(SignpersonController.class);
	private @Autowired SignpersonService signpersonService;
	
	@RequestMapping(value = "/signmeperson.html")
	public String hello(HttpServletRequest request) {
		return "signmeperson";
	}
	
	
	/**
	 * 查询签到人信息(分页)
	 * @param signperson
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signmeperson/queryForListPage", method = RequestMethod.POST)
	public com.huateng.signmev2.web.page.Page queryForListPage(Signperson signperson){
		Page<Signperson> list = (Page<Signperson>)this.signpersonService.queryForListPage(signperson);
		
		return new com.huateng.signmev2.web.page.Page(list);
	}
	
	/*校验*/
	private ResponseInfo validator(Signperson signperson){
		if(signperson == null){
			return ResponseInfo.fail("签到人信息为空!");
		}
		
		String mac = signperson.getMac();
		if(StringUtils.isBlank(mac)) {
			return ResponseInfo.fail("Mac地址为空!");
		}
		
		if(Validator.mysql(mac) > 20) {
			return ResponseInfo.fail("Mac地址长度超过了20位!");
		}
		
		String name = signperson.getName();
		if(StringUtils.isBlank(name)) {
			return ResponseInfo.fail("姓名为空!");
		}
		
		if(Validator.mysql(name) > 30) {
			return ResponseInfo.fail("姓名长度超过了30位!");
		}
		
		return ResponseInfo.success("校验成功");
	}
	
	/**
	 * 添加签到人信息
	 * @param t
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signmeperson/addperson", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> addPerson(Signperson t){
		String mac = t.getMac();
		try{
			ResponseInfo responseInfo = validator(t);
			if(ResponseInfo.FAILURE.equals(responseInfo.getStatus())){
				return HttpUtil.failure(responseInfo.getDesc());
			}
			
			int c = this.signpersonService.save(t);
			if(c <= 0) {
				return HttpUtil.failure("添加签到人["+mac+"]失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("添加签到人["+mac+"]失败!");
		}
		
		return HttpUtil.success("添加签到人["+mac+"]成功!");
	}
	/**
	 * 编辑签到人信息
	 * @param t
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signmeperson/updateperson", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> updatePerson(Signperson t){
		String mac = t.getMac();
		try{
			ResponseInfo responseInfo = validator(t);
			if(ResponseInfo.FAILURE.equals(responseInfo.getStatus())){
				return HttpUtil.failure(responseInfo.getDesc());
			}
			
			int c = this.signpersonService.update(t);
			if(c <= 0) {
				return HttpUtil.failure("更新签到人["+mac+"]失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("更新签到人["+mac+"]失败!");
		}
		
		return HttpUtil.success("更新签到人["+mac+"]成功!");
	}
	/**
	 * 删除签到人信息
	 * @param mac
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signmeperson/deleteperson", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> deletePerson(@RequestParam String mac){
		try{
			Signperson t = new Signperson();
			t.setMac(mac);
			int c = this.signpersonService.delete(t);
			if(c <= 0) {
				return HttpUtil.failure("删除签到人["+mac+"]失败!");
			}
		}catch(Exception e){
			LOGGER.error(e.getMessage(), e);
			return HttpUtil.failure("删除签到人["+mac+"]失败!");
		}
		
		return HttpUtil.success("删除签到人["+mac+"]成功!");
	}
}
