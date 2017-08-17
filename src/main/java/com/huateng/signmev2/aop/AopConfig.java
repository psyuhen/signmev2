/**
 * 
 */
package com.huateng.signmev2.aop;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.ImportResource;

/**
 * 增加Aop事务
 * @author sam.pan
 *
 */
@Configuration
@EnableAspectJAutoProxy
@ImportResource("classpath:aop-config.xml")
public class AopConfig {

}
