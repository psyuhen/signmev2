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
public class Datadict extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private @Setter @Getter String dd_name;
	private @Setter @Getter String dd_id;
	private @Setter @Getter String dd_text;
	private @Setter @Getter String dd_desc;
	private @Setter @Getter String dd_flag;
	private @Setter @Getter String dd_order;
	private @Setter @Getter String dd_enabled;
}
