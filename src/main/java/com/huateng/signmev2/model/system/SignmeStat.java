/**
 * 
 */
package com.huateng.signmev2.model.system;

import com.huateng.signmev2.model.BaseModel;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author sam.pan
 *
 */
@ToString
public class SignmeStat extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private @Setter @Getter String mac;
	private @Setter @Getter String name;
	private @Setter @Getter String stat_date;
	private @Setter @Getter String sign_in;
	private @Setter @Getter String sign_out;
	private @Setter @Getter String sign_ot;
	private @Setter @Getter String stat_flag;
	
	
}
