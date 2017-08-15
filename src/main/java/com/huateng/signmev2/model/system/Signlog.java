/**
 * 
 */
package com.huateng.signmev2.model.system;

import java.util.List;

import com.huateng.signmev2.model.BaseModel;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author sam.pan
 *
 */
@ToString
public class Signlog extends BaseModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private @Setter @Getter String log_id;
	private @Setter @Getter String sign_in_date;
	private @Setter @Getter String sign_in_start_date;
	private @Setter @Getter String sign_in_end_date;
	private @Setter @Getter String sign_in_time;
	private @Setter @Getter String ip;
	private @Setter @Getter String mac;
	private @Setter @Getter String name;
	private @Setter @Getter String sign_out_date;
	private @Setter @Getter String sign_out_start_date;
	private @Setter @Getter String sign_out_end_date;
	private @Setter @Getter String sign_out_time;
	private @Setter @Getter String late_time;
	private @Setter @Getter String early_time;
	private @Setter @Getter String ot_time;
	private @Setter @Getter String sign_flag;
	
	private @Setter @Getter List<String> sign_date_list;
}
