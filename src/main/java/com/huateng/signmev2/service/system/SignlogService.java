/**
 * 
 */
package com.huateng.signmev2.service.system;

import org.mybatis.base.Service;

import com.huateng.signmev2.model.system.Signlog;

/**
 * @author sam.pan
 *
 */
public interface SignlogService extends Service<Signlog> {

	/**
	 * 判断某mac是否签到
	 * @param signInDate
	 * @param mac
	 * @return
	 */
	public boolean isSignIn(String signInDate, String mac);
	/**
	 * 签退
	 * @param t
	 * @return
	 */
	public int updateSignout(Signlog t);
}
