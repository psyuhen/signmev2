/**
 * 
 */
package com.huateng.signmev2.web.system;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.huateng.signmev2.model.ResponseInfo;
import com.huateng.signmev2.model.system.SignmeStat;
import com.huateng.signmev2.service.system.SignmeStatService;
import com.huateng.signmev2.util.HttpUtil;

/**
 * @author sam.pan
 *
 */
@Controller
@RequestMapping(value = "/signmev2")
public class SignmeStatController {

	private @Autowired SignmeStatService signmeStatService;
	
	@RequestMapping(value = "/signmestat.html")
	public String signmelogin(HttpServletRequest request) {
		
		return "signmestat";
	}
	
	/**
	 * 查询记录信息(分页)
	 * @param signlog
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signmestat/queryForListPage", method = RequestMethod.POST)
	public com.huateng.signmev2.web.page.Page queryForListPage(SignmeStat signmeStat){
		Page<SignmeStat> list = (Page<SignmeStat>)this.signmeStatService.queryForListPage(signmeStat);
		
		return new com.huateng.signmev2.web.page.Page(list);
	}
	
	@ResponseBody
	@RequestMapping(value = "/proc/{curr_date}", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> testip(@PathVariable String curr_date){
		if(StringUtils.isBlank(curr_date)) {
			return HttpUtil.failure("批量日期为空");
		}
		
		try {
			signmeStatService.procSignmeStat(curr_date);
		}catch(Exception e) {
			return HttpUtil.failure(e.getMessage());
		}
		
		return HttpUtil.success("执行成功");
	}
}
