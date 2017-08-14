/**
 * 
 */
package com.huateng.signmev2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.huateng.signmev2.interceptor.LoginInterceptor;

/**
 * 增加拦截器
 * @author sam.pan
 *
 */
@Configuration
public class SpringBootWebMvcCfgAdapter extends WebMvcConfigurerAdapter {
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		String [] notInters= {
			"/signmev2/signmelogin.html", "/signmev2/login.do", "/signmev2/signme.html","/signmev2/mgr/signlog/queryForListByPerson",
			"/signmev2/signme","/signmev2/signmeout"
		};
		registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/**").excludePathPatterns(notInters);
		super.addInterceptors(registry);
	}

}
