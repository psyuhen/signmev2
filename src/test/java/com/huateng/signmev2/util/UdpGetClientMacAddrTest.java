/**
 * 
 */
package com.huateng.signmev2.util;

import org.junit.Test;

/**
 * @author sam.pan
 *
 */
public class UdpGetClientMacAddrTest {

	@Test
	public void testGetMac() {
		UdpGetClientMacAddr add = new UdpGetClientMacAddr("128.128.164.3");
//		UdpGetClientMacAddr add = new UdpGetClientMacAddr("128.128.166.100");
//		UdpGetClientMacAddr add = new UdpGetClientMacAddr("128.128.186.235");
		System.out.println(add.getRemoteMacAddr());
	}
}
