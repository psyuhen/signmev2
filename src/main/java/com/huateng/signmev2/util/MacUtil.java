/**
 * 
 */
package com.huateng.signmev2.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author sam.pan
 *
 */
public class MacUtil {
	private static final Log LOG = LogFactory.getLog(MacUtil.class);
	/**
	 * 获取远程Mac地址，此方法只支持window下
	 * @param ip 远程IP
	 * @return Mac地址，获取不到返回 ""
	 */
	public static String getMac(String ip){
		String mac = "";
		UdpGetClientMacAddr add = new UdpGetClientMacAddr(ip);
		mac = add.getRemoteMacAddr();
		
		if(StringUtils.isNotBlank(mac)&&!StringUtils.equals(mac, "00-00-00-00-00-00")) {
			return mac;
		}
		
		InputStreamReader isr = null;
		BufferedReader inr = null;
		InputStreamReader isr1 = null;
		BufferedReader inr1 = null;
		try {
			Process process = Runtime.getRuntime().exec("nbtstat -A "+ ip);
			isr = new InputStreamReader(process.getInputStream(),"gbk");
			inr = new BufferedReader(isr);
			String str = null;
			while((str = inr.readLine()) != null){
				String key = "MAC 地址 = ";
				if(str.indexOf(key) > 1){
					mac = str.substring(str.indexOf(key) + key.length(), str.length());
					break;
				}
				key = "MAC Address";
				if(str.indexOf(key) > 1){
					mac = str.substring(str.indexOf(key) + 14, str.length());
					break;
				}
				LOG.info(str);
			}
			
			isr1 = new InputStreamReader(process.getErrorStream(),"gbk");
			inr1 = new BufferedReader(isr1);
			String str1 = null;
			while((str1 = inr1.readLine()) != null){
				LOG.info(str1);
			}
			process.waitFor();
		} catch (IOException e) {
			LOG.error(e.getMessage(), e);
		} catch (InterruptedException e) {
			LOG.error(e.getMessage(), e);
		}finally {
			IOUtils.closeStream(isr);
			IOUtils.closeStream(inr);
			IOUtils.closeStream(isr1);
			IOUtils.closeStream(inr1);
		}
		
		if("".equals(mac.trim())){
			return arp(ip);
		}
		LOG.info("Get Mac==>"+mac);
		return mac;
	}
	
	/**
	 * 通过Arp获取Mac地址
	 * @param ip 远程IP
	 * @return 返回Mac，获取不到返回""
	 */
	public static String arp(String ip){
		String mac = "";
		BufferedReader inr = null;
		InputStreamReader isr = null;
		try{
			Process process = Runtime.getRuntime().exec("arp -a "+ ip);
			isr = new InputStreamReader(process.getInputStream(),"gbk");
			inr = new BufferedReader(isr);
			String str = null;
			while((str = inr.readLine()) != null){
				LOG.info(str);
				if(str.contains(ip)){
					mac = str.split("\\s+")[2];
					break;
				}
			}
		}catch(Exception e){
			LOG.error(e.getMessage(), e);
		}finally {
			IOUtils.closeStream(isr);
			IOUtils.closeStream(inr);
		}
		
		return mac.trim().toUpperCase();
	}
}
