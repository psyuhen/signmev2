/**
 * 
 */
package com.huateng.signmev2.db;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sam.pan
 *
 */
public class DataSourceFactoryForBean {
    private static final Log LOGGER = LogFactory.getLog(DataSourceFactoryForBean.class);

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
	private @Setter DataSource datasource = null;

	/* 类名*/
	private @Setter @Getter String beanName;
	
	/* HikariConfig*/
	private @Setter @Getter HikariConfig hikariConfig;


	public DataSource getDataSource() {
		if(this.datasource != null) {
			return this.datasource;
		}
		
		if(hikariConfig == null){
			if (!StringUtils.isBlank(jndiName) && !jndiName.startsWith("${")) {
				Context c;
				try {
					c = new InitialContext();
					DataSource ds = (DataSource) c.lookup(jndiName);
					
					if(ds != null){
						HikariDataSource hikariDataSource = new HikariDataSource();
						hikariDataSource.setDataSourceJNDI(jndiName);
						hikariDataSource.setDataSource(ds);
						datasource = hikariDataSource;
					}
				} catch (NamingException e) {
					LOGGER.error(e.getMessage(), e);
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
				Context c;
				try {
					c = new InitialContext();
					DataSource jndiDS = (DataSource) c.lookup(jndiName);
					
					if (jndiDS != null) {
						hikariConfig.setDataSource(jndiDS);
						datasource = new HikariDataSource(hikariConfig);
					}
				} catch (NamingException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}else{
				datasource = new HikariDataSource(hikariConfig);
			}
		}
	
		return datasource;
	}
}
