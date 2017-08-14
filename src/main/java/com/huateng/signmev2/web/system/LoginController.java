/**
 * 
 */
package com.huateng.signmev2.web.system;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author sam.pan
 *
 */
@Controller
@RequestMapping(value = "/signmev2")
public class LoginController {

	@Value("${system.username}")
	private String username;
	
	@Value("${system.password}")
	private String password;
	
	@RequestMapping(value = "/login.do", method = RequestMethod.POST)
	public String login(@RequestParam String username,@RequestParam String password,@RequestParam String blackUrl, HttpServletRequest request) {
		if(!StringUtils.equals(this.username, username)
				|| !StringUtils.equals(this.password, password)) {
			request.setAttribute("msg", "用户或密码不正确");
			request.setAttribute("blackUrl", blackUrl);
			return "signmelogin";
		}
		
		request.getSession().setAttribute("user","loginok");
		
		return "signmelink";
	}
}
