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
public class Signperson extends BaseModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private @Setter @Getter String mac;
	private @Setter @Getter String name;
}
