/**
 * 
 */
package com.huateng.signmev2.web.system;

import javax.servlet.http.HttpServletRequest;

import com.huateng.signmev2.model.system.Signlog;
import com.huateng.signmev2.util.IPUtil;
import com.huateng.signmev2.util.MacUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.github.pagehelper.Page;
import com.huateng.signmev2.model.ResponseInfo;
import com.huateng.signmev2.model.system.SignmeStat;
import com.huateng.signmev2.service.system.SignmeStatService;
import com.huateng.signmev2.util.HttpUtil;

import java.util.List;

/**
 * @author sam.pan
 *
 */
@Controller
public class SignmeStatController {

	private @Autowired SignmeStatService signmeStatService;
	
	@RequestMapping(value = "/signmestat.html")
	public String signmelogin(HttpServletRequest request) {
		
		return "signmestat";
	}
	
	/**
	 * 查询记录信息(分页)
	 * @param signmeStat
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

	/**
	 * 查询迟到Top 10
	 * @param startDt
	 * @param endDt
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/signlate/top10", method = RequestMethod.POST)
	public List<SignmeStat> queryForListByPerson(@RequestParam String startDt, @RequestParam String endDt, @RequestParam String topFlag, HttpServletRequest request){

		SignmeStat signmeStat = new SignmeStat();
		signmeStat.setB_start_date(startDt);
		signmeStat.setB_end_date(endDt);
		signmeStat.setTop_flag(topFlag);
		List<SignmeStat> list = this.signmeStatService.queryTopLateList(signmeStat);

		return list;
	}
}
