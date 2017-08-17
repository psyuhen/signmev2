/**
 * 
 */
package com.huateng.signmev2.util;

import java.util.List;

import org.junit.Test;

/**
 * @author sam.pan
 *
 */
public class DateUtilTest {

	@Test
	public void testgetDays() {
		List<String> days = DateUtil.getDays("20170730", "20170812");
		
		System.err.println(days);
	}
}
