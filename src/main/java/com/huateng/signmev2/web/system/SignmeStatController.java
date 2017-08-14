/**
 * 
 */
package com.huateng.signmev2.web.system;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.huateng.signmev2.model.system.SignmeStat;
import com.huateng.signmev2.service.system.SignmeStatService;

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
}
