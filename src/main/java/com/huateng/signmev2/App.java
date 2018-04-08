package com.huateng.signmev2;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.sql.DataSource;

import com.huateng.signmev2.util.SecureUtil;
import org.apache.ibatis.io.VFS;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.mybatis.xmlhotrefresh.spring.HotDeploySqlSessionFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import com.github.pagehelper.PageInterceptor;
import com.huateng.signmev2.db.DataSourceFactoryForBean;
import com.zaxxer.hikari.HikariConfig;

/**
 * Hello world!
 *
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan
@EnableTransactionManagement
public class App {
	
	
	@Bean(name = "localeResolver")
	public LocaleResolver localeResolverBean() {
		return new SessionLocaleResolver();
	}
	
	@Bean(name = "messageSource")
	public ResourceBundleMessageSource resourceBundleMessageSource() {
		ResourceBundleMessageSource source = new ResourceBundleMessageSource();
		source.setDefaultEncoding("utf-8");
		source.setBasename("messages");
		return source;
	}
	
	@Bean
	public HikariConfig hikariConfig() throws Exception{
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		Resource resource = resolver.getResource("classpath:hikari.properties");
		Properties loadProperties = PropertiesLoaderUtils.loadProperties(resource);
		String pwd = loadProperties.getProperty("dataSource.password");
		loadProperties.put("dataSource.password", SecureUtil.desDecode(pwd));
		HikariConfig hikari = new HikariConfig(loadProperties);
		return hikari;
	}
	
	//DataSource配置
    @Bean
    public DataSource dataSource() throws Exception{
    	DataSourceFactoryForBean dsf = new DataSourceFactoryForBean();
    	dsf.setHikariConfig(hikariConfig());
        return dsf.getDataSource();
    }
    
    //提供SqlSeesion
    @Bean
    public SqlSessionFactory sqlSessionFactory() throws Exception {
 
    	VFS.addImplClass(SpringBootVFS.class);
    	
    	HotDeploySqlSessionFactoryBean sqlSessionFactoryBean = new HotDeploySqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource());
        sqlSessionFactoryBean.setTypeAliasesPackage("com.huateng.signmev2.model");
        sqlSessionFactoryBean.setTypeHandlersPackage("com.huateng.signmev2.handler");
        
        PageInterceptor pageInterceptor = new PageInterceptor();
        Properties p = new Properties();
//        p.put("dialect", "mysql");
        p.put("reasonable", "false");
        pageInterceptor.setProperties(p);
        sqlSessionFactoryBean.setPlugins(new Interceptor[]{
        		pageInterceptor
        });
 
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
 
        sqlSessionFactoryBean.setMapperLocations(resolver.getResources("classpath*:mybatis/**/*.xml"));
 
        return sqlSessionFactoryBean.getObject();
    }
 
    @Bean
    public PlatformTransactionManager transactionManager() throws Exception{
        return new DataSourceTransactionManager(dataSource());
    }
 
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer(){
    	MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
    	mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
    	mapperScannerConfigurer.setBasePackage("com.huateng.signmev2.mapper");
    	
    	return mapperScannerConfigurer;
    }
	
    
    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
    	FilterRegistrationBean frb = new FilterRegistrationBean();
    	HiddenHttpMethodFilter hhmf = new HiddenHttpMethodFilter();
    	frb.setFilter(hhmf);
    	List<String> urlPatterns = new ArrayList<String>();
    	urlPatterns.add("/signmev2/testput");
    	frb.setUrlPatterns(urlPatterns);
    	return frb;
    }
	
	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
}
