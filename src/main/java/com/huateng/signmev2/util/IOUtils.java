/**
 * 
 */
package com.huateng.signmev2.util;

import java.io.Closeable;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author sam.pan
 *
 */
public class IOUtils {
	private static final Log LOGGER = LogFactory.getLog(IOUtils.class);
	/**
	 * 关闭流
	 * @param closeable
	 */
	public static void closeStream(Closeable closeable) {
		try{
			if(closeable != null){
				closeable.close();
			}
		}catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
	}
}
