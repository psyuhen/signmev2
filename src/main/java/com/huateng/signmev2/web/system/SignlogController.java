/**
 * 
 */
package com.huateng.signmev2.web.system;

import com.github.pagehelper.Page;
import com.huateng.signmev2.model.ResponseInfo;
import com.huateng.signmev2.model.system.Datadict;
import com.huateng.signmev2.model.system.Signlog;
import com.huateng.signmev2.model.system.Signperson;
import com.huateng.signmev2.service.system.DatadictService;
import com.huateng.signmev2.service.system.SignlogService;
import com.huateng.signmev2.service.system.SignpersonService;
import com.huateng.signmev2.util.*;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * @author sam.pan
 *
 */
@Controller
@RequestMapping(value = "/")
@CommonsLog
public class SignlogController {

	private @Autowired SignlogService signlogService;
	private @Autowired SignpersonService signpersonService;
	private @Autowired DatadictService datadictService;

	@Value("${client.64.path}")
	private String client64File;
	@Value("${client.32.path}")
	private String client32File;
	@Value("${client.jar.path}")
	private String clientJarFile;
	@Value("${client.server.path}")
	private String clientremoteserverFile;

	@Autowired
	private Environment env;

	@RequestMapping(value = "/signmelist.html")
	public String hello(HttpServletRequest request) {
		return "signmelist";
	}

	@RequestMapping(value = "")
	public String index(HttpServletRequest request) {
		return "forward:/signme.html";
	}
	
	@RequestMapping(value = "/signme.html")
	public String signmehtml(HttpServletRequest request) {
		checkSignIn(null,null, request);
		
		return "signme";
	}
	@RequestMapping(value = "/signmelink.html")
	public String signmelink(HttpServletRequest request) {
		
		return "signmelink";
	}
	@RequestMapping(value = "/signmelogin.html")
	public String signmelogin(HttpServletRequest request) {
		
		return "signmelogin";
	}
	@RequestMapping(value = "/testip.html")
	public String testip(HttpServletRequest request) {
		
		return "testip";
	}
	@RequestMapping(value = "/showyourlog.html")
	public String showyourlog(HttpServletRequest request) {

		return "showyourlog";
	}
	@RequestMapping(value = "/p2db.html")
	public String p2db(HttpServletRequest request) {
		request.setAttribute("dbPage", env.getProperty("db.page"));
		request.setAttribute("tftPage", env.getProperty("tft.page"));
		return "p2db";
	}

	@RequestMapping(value = "/download.html")
	public void downloadClient(@RequestParam String f, HttpServletRequest request, HttpServletResponse response) {

		File file = null;
		if(StringUtils.equals(f, "64")){
			file = new File(client64File);
		}else if(StringUtils.equals(f, "32")){
			file = new File(client32File);
		}else if(StringUtils.equals(f, "jar")){
			file = new File(clientJarFile);
		}else if(StringUtils.equals(f, "remoteserver")){
			file = new File(clientremoteserverFile);
		}

		IOUtils.download(file, response);
	}

	@ResponseBody
	@RequestMapping(value = "/testip/{type}", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> testip(@RequestParam String ip, @PathVariable String type){
		if(isBlank(ip)) {
			return HttpUtil.success("IP为空");
		}
		
		if(StringUtils.equals(type, "udp")) {
			return HttpUtil.success(MacUtil.udp(ip));
		}
		

		if(StringUtils.equals(type, "nbtstat")) {
			return HttpUtil.success(MacUtil.nbtstat(ip));
		}
		

		if(StringUtils.equals(type, "arp")) {
			return HttpUtil.success(MacUtil.arp(ip));
		}

		if(StringUtils.equals(type, "remoteserver")) {
			return HttpUtil.success(MacUtil.getRemoteMac(ip));
		}

		return HttpUtil.failure("未知测试类型");
	}
	/**
	 * 查询记录信息(分页)
	 * @param signlog
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signlog/queryForListPage", method = RequestMethod.POST)
	public com.huateng.signmev2.web.page.Page queryForListPage(Signlog signlog){
		Page<Signlog> list = (Page<Signlog>)this.signlogService.queryForListPage(signlog);
		
		return new com.huateng.signmev2.web.page.Page(list);
	}

	/**
	 * 查询个人的记录，开放给别人看
	 * @param signlog 查询条件
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/queryByMac", method = RequestMethod.POST)
	public com.huateng.signmev2.web.page.Page queryByMac(Signlog signlog){

		if(isBlank(signlog.getMac())){
			return null;
		}

		if(isBlank(signlog.getSign_in_start_date())){
			return null;
		}

		if(isBlank(signlog.getSign_in_end_date())){
			return null;
		}

		if(isBlank(signlog.getName())){
			return null;
		}

		if(isBlank(signlog.getSign_flag())){
			return null;
		}

		if(DateUtil.compareToMonth(signlog.getSign_in_start_date(), signlog.getSign_in_end_date(), 12)){
			log.warn("查询时间超过12个月");
			return null;
		}

		signlog.setLimit(100);

		Page<Signlog> signlogList = (Page<Signlog>)this.signlogService.queryForListPage(signlog);
		return new com.huateng.signmev2.web.page.Page(signlogList);
	}

	/**
	 * 查询一段时间记录信息
	 * @param startDt
	 * @param endDt
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/mgr/signlog/queryForListByPerson", method = RequestMethod.POST)
	public List<Signlog> queryForListByPerson(@RequestParam String startDt, @RequestParam String endDt,HttpServletRequest request){
		String remoteAddr = IPUtil.getRemoteHost(request);
		String mac = MacUtil.getMac(remoteAddr);
		
		if(isBlank(mac)) {
			mac = remoteAddr;
		}
		
		Signlog signlog = new Signlog();
		//signlog.setIp(remoteAddr);
		signlog.setMac(mac);
		
		signlog.setSign_in_start_date(startDt);
		signlog.setSign_in_end_date(endDt);
		
		List<Signlog> list = this.signlogService.queryForList(signlog);
		
		return list;
	}


	/**
	 * 根据Mac获取签到人信息，如果获取不到，返回null
	 * @param mac Mac
	 * @return
	 */
	private Signperson checkSignperson(String mac) {
		if(isBlank(mac)) {
			mac = "UNKNOWN";
		}
		
		try {
			Signperson sp = new Signperson();
			sp.setMac(mac);
			return signpersonService.queryForObject(sp);
		}catch(Exception e) {
			log.error("获取不到打卡人信息");
			log.error(e.getMessage(), e);
			return null;
		}
	}
	
	//检查是否签到
	private boolean checkSignIn(String remoteAddr, String mac, HttpServletRequest request) {
		if(isBlank(remoteAddr)) {
			remoteAddr = IPUtil.getRemoteHost(request);
		}
		
		if(isBlank(mac)) {
			mac = MacUtil.getMac(remoteAddr);
		}
		

		if(isBlank(mac)) {
			request.setAttribute("signtype", "1");
			request.setAttribute("signerror", "获取不到Mac地址,请下载客户端签到签退！");
			return false;
		}

		//先检查一下签到人有没有配置映射表了
		final Signperson signperson = checkSignperson(mac);
		if(signperson == null){
			request.setAttribute("signtype", "1");
			request.setAttribute("signerror", "根据MAC地址找不到打卡人信息,请先配置签到人信息");
			return false;
		}

		String now = DateUtil.today();
		
		Signlog signlog = new Signlog();
		signlog.setSign_in_date(now);
		signlog.setMac(mac);
		List<Signlog> list = signlogService.queryForList(signlog);
		if(!list.isEmpty()) {
			signlog = list.get(0);
			request.setAttribute("log_id", signlog.getLog_id());
			
			String signtype = "1";
			String signerror = "您已签到";
			String signtime = DateUtil.formatDateString(signlog.getSign_in_date()+signlog.getSign_in_time(),"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒");
			
			
			if(StringUtils.isNotBlank(signlog.getSign_out_date())) {
				signtype = "2";
				signerror="您已签退";
				signtime = DateUtil.formatDateString(signlog.getSign_out_date()+signlog.getSign_out_time(),"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒");
			}
			
			request.setAttribute("signname", signlog.getName());
			request.setAttribute("signtype", signtype);
			request.setAttribute("signerror", signerror);
			request.setAttribute("signtime", signtime);
			
			
			return true;
		}
		
		return false;
	}

	@ResponseBody
	@RequestMapping(value = "/signmemac", method = RequestMethod.POST)
	public ResponseEntity<ResponseInfo> signmemac(String mac, String remoteAddr){
		if(isBlank(mac)) {
			return HttpUtil.failure("MAC地址不能为空");
		}

		//先检查一下签到人有没有配置映射表了
		final Signperson signperson = checkSignperson(mac);
		if(signperson == null){
			return HttpUtil.failure("根据MAC地址找不到打卡人信息,请先配置签到人信息");
		}

		String now = DateUtil.today();
		String nowtime = DateUtil.currentShortTime();
		Signlog sl = new Signlog();
		sl.setSign_in_date(now);
		sl.setMac(mac);
		List<Signlog> list = signlogService.queryForList(sl);
		if(list.isEmpty()) {
			Datadict dd = new Datadict();
			dd.setDd_name("LATE_TIME");
			dd = datadictService.queryForObject(dd);
			String lateTime = dd.getDd_id();

			dd = new Datadict();
			dd.setDd_name("EARLY_TIME");
			dd = datadictService.queryForObject(dd);
			String earlyTime = dd.getDd_id();


			dd = new Datadict();
			dd.setDd_name("OT_TIME");
			dd = datadictService.queryForObject(dd);
			String otTime = dd.getDd_id();

			Signlog signlog = new Signlog();
			signlog.setSign_in_date(now);
			signlog.setSign_in_time(nowtime);
			signlog.setIp(remoteAddr);
			signlog.setMac(mac);
			signlog.setName((signperson==null || isBlank(signperson.getName()))? remoteAddr : signperson.getName());
			signlog.setLate_time(lateTime);
			signlog.setEarly_time(earlyTime);
			signlog.setOt_time(otTime);
			int c = signlogService.save(signlog);
			if(c > 0) {
				String msg = DateUtil.formatDateString(now+nowtime,"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒");
				if(nowtime.compareTo(lateTime) > 0) {
					msg += "[您已迟到了]";
				}
				return HttpUtil.success("打卡成功" + msg);
			}else {
				return HttpUtil.failure("打卡失败");
			}
		}


		final Signlog signlog1 = list.get(0);
		Signlog signlog = new Signlog();
		signlog.setSign_out_date(now);
		signlog.setSign_out_time(nowtime);
		signlog.setLog_id(signlog1.getLog_id());

		int c = signlogService.updateSignout(signlog);
		if(c > 0) {
			return HttpUtil.success("打卡成功:" + DateUtil.formatDateString(now+nowtime,"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒"));
		}else {
			return HttpUtil.failure("打卡失败");
		}
	}

	//签到
	@RequestMapping(value = "/signme")
	public String signme(HttpServletRequest request) {
		
		String remoteAddr = IPUtil.getRemoteHost(request);
		String mac = MacUtil.getMac(remoteAddr);
		if(isBlank(mac)) {
			request.setAttribute("signtype", "1");
			request.setAttribute("signerror", "获取不到Mac地址,请下载客户端签到签退！");
			return "signme";
		}
		
		if(checkSignperson(mac) == null) {
			request.setAttribute("signtype", "1");
			request.setAttribute("signerror", "根据Mac["+mac+"]获取不到打卡人信息,请先配置签到人信息");
			return "signme";
		}
		
		String now = DateUtil.today();
		String nowtime = DateUtil.currentShortTime();
		
		boolean isSignIn = checkSignIn(remoteAddr, mac, request);
		
		if(!isSignIn) {//未签到就插入签到数据
			Signperson sp = new Signperson();
			sp.setMac(mac);
			try {
				sp = signpersonService.queryForObject(sp);
			}catch (Exception e) {
				log.error(e.getMessage(), e);
				request.setAttribute("signerror", "获取不到打卡人信息,请先配置签到人信息");
				return "signme";
			}
			
			Datadict dd = new Datadict();
			dd.setDd_name("LATE_TIME");
			dd = datadictService.queryForObject(dd);
			String lateTime = dd.getDd_id();
			
			dd = new Datadict();
			dd.setDd_name("EARLY_TIME");
			dd = datadictService.queryForObject(dd);
			String earlyTime = dd.getDd_id();
			
			
			dd = new Datadict();
			dd.setDd_name("OT_TIME");
			dd = datadictService.queryForObject(dd);
			String otTime = dd.getDd_id();
			
			Signlog signlog = new Signlog();
			signlog.setSign_in_date(now);
			signlog.setSign_in_time(nowtime);
			signlog.setIp(remoteAddr);
			signlog.setMac(isBlank(mac)?remoteAddr:mac);
			signlog.setName((sp==null || isBlank(sp.getName()))? remoteAddr : sp.getName());
			signlog.setLate_time(lateTime);
			signlog.setEarly_time(earlyTime);
			signlog.setOt_time(otTime);
			
			int c = signlogService.save(signlog);
			request.setAttribute("signname", signlog.getName());
			if(c > 0) {
				request.setAttribute("signtype", "2");
				request.setAttribute("signtime", DateUtil.formatDateString(now+nowtime,"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒"));
				if(nowtime.compareTo(lateTime) > 0) {
					request.setAttribute("signerror", "您已迟到了");
				}
			}else {
				request.setAttribute("signerror", "签到失败");
			}
		}else {
			String log_id = (String)request.getAttribute("log_id");
			
			Signlog signlog = new Signlog();
			signlog.setSign_out_date(now);
			signlog.setSign_out_time(nowtime);
			signlog.setLog_id(log_id);
			
			int c = signlogService.updateSignout(signlog);
			request.setAttribute("signtype", "2");
			if(c > 0) {
				request.setAttribute("signtime", DateUtil.formatDateString(now+nowtime,"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒"));
			}else {
				request.setAttribute("signerror", "签退失败");
			}
		}
		
		
		return "signme";
	}
	
	/**
	 * 签退
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/signmeout")
	public String signmeout(HttpServletRequest request) {
		
		String remoteAddr = IPUtil.getRemoteHost(request);
		String mac = MacUtil.getMac(remoteAddr);
		if(isBlank(mac)) {
			request.setAttribute("signerror", "获取不到Mac地址,请下载客户端签到签退！");
			return "signme";
		}
		
		
		if(checkSignperson(mac) == null) {
			request.setAttribute("signerror", "根据Mac["+mac+"]获取不到打卡人信息,请先配置签到人信息");
			return "signme";
		}
		

		String now = DateUtil.today();
		String nowtime = DateUtil.currentShortTime();
		
		boolean isSignIn = checkSignIn(remoteAddr, mac, request);
		
		if(isSignIn) {//已签到
			String log_id = (String)request.getAttribute("log_id");
			
			Signlog signlog = new Signlog();
			signlog.setSign_out_date(now);
			signlog.setSign_out_time(nowtime);
			signlog.setLog_id(log_id);
			
			int c = signlogService.updateSignout(signlog);
			if(c > 0) {
				request.setAttribute("signtype", "2");
				request.setAttribute("signtime", DateUtil.formatDateString(now+nowtime,"yyyyMMddHHmmss","yyyy年MM月dd日HH时mm分ss秒"));
			}else {
				request.setAttribute("signerror", "签退失败");
			}
			
		}else {//未签到，跳转到签到页面
			request.setAttribute("signtype", "1");
			return "forward:signme.html";
		}
		
		
		return "signme";
	}
}
