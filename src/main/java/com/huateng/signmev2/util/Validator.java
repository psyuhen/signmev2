/**
 * 
 */
package com.huateng.signmev2.util;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author sam.pan
 *
 */
public class Validator {
	private static final Log LOGGER = LogFactory.getLog(Validator.class);

	/**
	 * 获取mysql的长度跟字符长度一样
	 * @param chineses 中文字符
	 * @return 字符数
	 */
	public static int mysql(String chineses){
		if(StringUtils.isEmpty(chineses)){
			return 0;
		}
		chineses = StringUtils.trimToEmpty(chineses);
		return chineses.length();
	}

	/**
	 * 获取中文字符的字节数,默认为UTF8
	 * @param chineses 中文字符
	 * @return 字节数
	 */
	public static int charLength(String chineses){
		return charLength(chineses, "UTF-8");
	}
	/**
	 * 获取中文字符的字节数
	 * @param chineses 中文字符
	 * @param charset 编码
	 * @return 字节数
	 */
	public static int charLength(String chineses, String charset){
		if(StringUtils.isEmpty(chineses)){
			return 0;
		}
		int length = 0;
		try {
			length = chineses.getBytes(charset).length;
		} catch (UnsupportedEncodingException e) {
			LOGGER.error("不支持的字符集");
		}
		return length;
	}
	
	/**
	 * 判断chinese里面是否包括中文
	 * @param chineses
	 * @return
	 */
	public static boolean containsChinese(String chineses){
		String regex = "[\u4e00-\u9fa5]+";
		return contains(chineses, regex);
	}
	/**
	 * 判断chinese里面是否包括特殊字符
	 * @param inputs
	 * @return
	 */
	public static boolean containsInvalidChar(String inputs){
		String regex = "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]+";
		return contains(inputs, regex);
	}
	/**
	 * 判断inputs里面是否包含着regex
	 * @param inputs
	 * @param regex 正则表达式
	 * @return 包含为true，不包含为false
	 */
	public static boolean contains(String inputs, String regex){
		if(StringUtils.isEmpty(inputs)){
			return false;
		}
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(inputs);
		if(matcher.find()){
			return true;
		}
		
		return false;
	}
	/**
	 * 判断输入是否为IP地址
	 * @param source
	 * @return
	 */
	public static boolean isIPv4(String source){
		if(StringUtils.isEmpty(source)){
			return false;
		}
		String regex = "^(25[0-5]|2[0-4]\\d|1\\d\\d|[0]?[0-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[0]?[0-9]?\\d)){3}$";
		return source.matches(regex);
	}
	/**
	 * 判断输入是否是正确的网址
	 * @param source
	 * @return
	 */
	public static boolean isURL(String source) {
		if (StringUtils.isEmpty(source)) {
			return false;
		}
		String regex = "^(http|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?$";
		return source.matches(regex);
	}
	/**
	 * 判断字符串是否为手机号码
	 * @param source
	 * @return
	 */
	public static boolean isMobileNo(String source){
		if (StringUtils.isBlank(source)) {
			return false;
		}
		return source.matches("^1(\\d){10}$");
	}
	/**
	 * 判断字符串是否为身份证号码
	 * @param source
	 * @return
	 */
	public static boolean isID(String source){
		if (StringUtils.isBlank(source)) {
			return false;
		}

		Map<String, String> cityMap = new HashMap<String, String>();
		cityMap.put("11", "北京");
		cityMap.put("12", "天津");
		cityMap.put("13", "河北");
		cityMap.put("14", "山西");
		cityMap.put("15", "内蒙古");
		cityMap.put("21", "辽宁");
		cityMap.put("22", "吉林");
		cityMap.put("23", "黑龙江");
		cityMap.put("31", "上海");
		cityMap.put("32", "江苏");
		cityMap.put("33", "浙江");
		cityMap.put("34", "安徽");
		cityMap.put("35", "福建");
		cityMap.put("36", "江西");
		cityMap.put("37", "山东");
		cityMap.put("41", "河南");
		cityMap.put("42", "湖北");
		cityMap.put("43", "湖南");
		cityMap.put("44", "广东");
		cityMap.put("45", "广西");
		cityMap.put("46", "海南");
		cityMap.put("50", "重庆");
		cityMap.put("51", "四川");
		cityMap.put("52", "贵州");
		cityMap.put("53", "云南");
		cityMap.put("54", "西藏");
		cityMap.put("61", "陕西");
		cityMap.put("62", "甘肃");
		cityMap.put("63", "青海");
		cityMap.put("64", "宁夏");
		cityMap.put("65", "新疆");
		cityMap.put("71", "台湾");
		cityMap.put("81", "香港");
		cityMap.put("82", "澳门");
		cityMap.put("91", "国外");

		int iSum = 0;
		int len = source.length();
		String regex;
		int ret = 0;

		if (len == 15) {
			regex = "^(\\d{14})(\\d)$";
		} else if (len == 18) {
			regex = "^\\d{17}(\\d|x|X)$";
		} else {
			return false;
		}

		if (!source.matches(regex)) {
			return false;
		}

		source = source.replaceAll("(x|X)$", "a");
		String day;
		String month;
		String year;
		if (cityMap.get(source.substring(0, 2)) == null) {
			ret = 1;
		}

		if (len == 18) {
			day = source.substring(12, 14);
			month = source.substring(10, 12);
			year = source.substring(6, 10);
			if (!DateUtil.isDate(year + "" + month + "" + day, "yyyyMMdd")) {
				ret = 1;
			}

			for (int i = 17; i >= 0; i--) {
				iSum += (Math.pow(2, i) % 11) * Integer.parseInt(source.substring((17 - i), (18 - i)), 11);
			}

			if (iSum % 11 != 1) {
				ret = 1;
			}
		} else {
			int dayD = Integer.parseInt(source.substring(10, 12));
			int monthM = Integer.parseInt(source.substring(8, 10));
			if (monthM < 1 || monthM > 12) {
				ret = 1;
			}
			if (dayD < 1 || dayD > 31) {
				ret = 1;
			}
			if ((monthM == 4 || monthM == 6 || monthM == 9 || monthM == 11) && (dayD == 31)) {
				ret = 1;
			}
			if ((dayD == 30 || dayD == 31) && (monthM == 2)) {
				ret = 1;
			}
		}

		if (ret == 1) {
			return false;
		}

		return true;
	}
}
