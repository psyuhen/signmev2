/**
 * 
 */
package com.huateng.signmev2.web.system;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.apachecommons.CommonsLog;

/**
 * @author sam.pan
 *
 */
@Controller
@CommonsLog
public class LoginController {

	@Value("${system.username}")
	private String username;
	
	@Value("${system.password}")
	private String password;
	
	@RequestMapping(value = "/login.do", method = RequestMethod.POST)
	public String login(@RequestParam String username,@RequestParam String password,@RequestParam String blackUrl, 
			HttpServletRequest request, HttpServletResponse response) {
		if(!StringUtils.equals(this.username, username)
				|| !StringUtils.equals(this.password, password)) {
			request.setAttribute("msg", "用户或密码不正确");
			request.setAttribute("blackUrl", blackUrl);
			return "signmelogin";
		}
		
		request.getSession().setAttribute("user","loginok");
		
		/* 返回之前的url*/
		if(!StringUtils.isBlank(blackUrl)){
			try {
				response.sendRedirect(request.getContextPath() + blackUrl);
			} catch (IOException e) {
				log.error(e.getMessage(), e);
			}
		}
		
		return "signmelink";
	}
}
