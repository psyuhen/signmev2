/**
 * 
 */
package com.huateng.signmev2.model;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sam.pan
 *
 */
public class ResponseInfo implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String SUCCESS = "0";
	public static final String FAILURE = "1";

	private @Getter @Setter String status = "";//成功或者失败0-成功，1-失败
	private @Getter @Setter String desc = "";//成功或者失败的描述信息
	private @Getter @Setter Object dataObj = null;//需要返回给前端的数据
	
	/**
	 * 
	 */
	public ResponseInfo() {
		this("", "", null);
	}
	
	/**
	 * dataObj 默认为null
	 * @param status 成功或者失败
	 * @param desc 成功或者失败的描述信息
	 */
	public ResponseInfo(String status,String desc) {
		this(status, desc, null);
	}
	
	/**
	 * @param status 成功或者失败
	 * @param desc 成功或者失败的描述信息
	 * @param dataObj 需要返回给前端的数据
	 */
	public ResponseInfo(String status,String desc,Object dataObj) {
		this.status = status;
		this.desc = desc;
		this.dataObj = dataObj;
	}
	/**
	 * 生成失败的ResponseInfo
	 * @param desc 失败的描述信息
	 * @param dataObj 需要返回给前端的数据
	 * @return
	 */
	public static ResponseInfo fail(String desc,Object dataObj){
		return new ResponseInfo(FAILURE, desc, dataObj);
	}
	
	/**
	 * 生成失败的ResponseInfo
	 * @param desc 失败的描述信息
	 * @return
	 */
	public static ResponseInfo fail(String desc){
		return fail(desc, null);
	}
	
	/**
	 * 生成成功的ResponseInfo
	 * @param desc 成功的描述信息
	 * @param dataObj 需要返回给前端的数据
	 * @return
	 */
	public static ResponseInfo success(String desc,Object dataObj){
		return new ResponseInfo(SUCCESS, desc, dataObj);
	}
	
	/**
	 * 生成成功的ResponseInfo
	 * @param desc 成功的描述信息
	 * @return
	 */
	public static ResponseInfo success(String desc){
		return success(desc, null);
	}

}
