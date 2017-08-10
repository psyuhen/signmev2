/**
 * 
 */
package com.huateng.signmev2.model;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * @author pansen
 *
 */
public class BaseModel implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/*默认加上开始日期*/
	protected @Setter @Getter String b_start_date;
	/*默认加上结束日期*/
	protected @Setter @Getter String b_end_date;
	/*默认排序字段*/
	protected @Setter @Getter String b_order_name;
	/*默认排序(正序/倒序)*/
	protected @Setter @Getter String b_order_asc;
	
	/*分页用，开始*/
	protected @Setter @Getter int start;
	/*分页用，限制数量*/
	protected @Setter @Getter int limit;
}
