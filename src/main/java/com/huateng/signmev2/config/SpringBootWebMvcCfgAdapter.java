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
			"/signmelogin.html", "/login.do", "/signme.html","/mgr/signlog/queryForListByPerson",
			"/signme","/signmeout","/error","/testip.html","/testip/udp","/testip/nbtstat",
			"/testip/arp","/signmemac","/download.html","/signlate/top10","/queryByMac","/showyourlog.html",
				"/p2db.html","/top2.html"
		};
		registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/**").excludePathPatterns(notInters);
		super.addInterceptors(registry);
	}

}
