/**
 * 
 */
package com.huateng.signmev2.db;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import lombok.Getter;
import lombok.Setter;

/**
 * 重写DataSourceFactory
 * @author sam.pan
 *
 */
public class DataSourceFactory implements FactoryBean<DataSource>, InitializingBean, BeanNameAware, ApplicationContextAware{
	/* JNDI 名称*/
	private @Setter @Getter String jndiName = null;

	/* 驱动类名称*/
	private @Setter @Getter String driverClassName = null;

	/* Url*/
	private @Setter @Getter String url = null;

	/* 用户名*/
	private @Setter @Getter String username = null;

	/* 密码*/
	private @Setter @Getter String password = null;

	/* 数据源*/
	private DataSource datasource = null;

	/* 类名*/
	private @Setter @Getter String beanName;
	
	/* HikariConfig*/
	private @Setter @Getter HikariConfig hikariConfig;

	@SuppressWarnings("unused")
	private ApplicationContext applicationContext;

	public DataSourceFactory() {
		super();
	}

	public DataSource getObject() throws Exception {
		return datasource;
	}

	public Class<DataSource> getObjectType() {
		return DataSource.class;
	}

	public boolean isSingleton() {
		return true;
	}

	public void afterPropertiesSet() throws Exception {
		if(hikariConfig == null){
			if (!StringUtils.isBlank(jndiName) && !jndiName.startsWith("${")) {
				Context c = new InitialContext();
				DataSource ds = (DataSource) c.lookup(jndiName);
				
				if(ds != null){
					HikariDataSource hikariDataSource = new HikariDataSource();
					hikariDataSource.setDataSourceJNDI(jndiName);
					hikariDataSource.setDataSource(ds);
					datasource = hikariDataSource;
				}
			}else{
				Properties properties = new Properties();
				properties.setProperty("dataSourceClassName", driverClassName);
				properties.setProperty("dataSource.url", url);
				properties.setProperty("dataSource.user", username);
				properties.setProperty("dataSource.password", password);
				HikariDataSource bds = new HikariDataSource(new HikariConfig(properties));
				
				datasource = bds;
			}
		}else {
			String jndiName = hikariConfig.getDataSourceJNDI();
			if(!StringUtils.isBlank(jndiName)){
				Context c = new InitialContext();
				DataSource jndiDS = (DataSource) c.lookup(jndiName);
				
				if (jndiDS != null) {
					hikariConfig.setDataSource(jndiDS);
					datasource = new HikariDataSource(hikariConfig);
				}
			}else{
				datasource = new HikariDataSource(hikariConfig);
			}
		}
		
	}

	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}
}
