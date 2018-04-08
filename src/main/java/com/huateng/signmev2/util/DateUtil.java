package com.huateng.signmev2.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.time.DurationFormatUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import static org.apache.commons.lang3.StringUtils.split;

/**
 * 日期处理工具类 
 * @author ps
 * @since 1.0
 */
public class DateUtil {
	private static final Log LOGGER = LogFactory.getLog(DateUtil.class);

	/**
	 * 获取当前日期，默认格式为yyyyMMdd
	 * @return 当前日期
	 */
	public static String today(){
		return today("yyyyMMdd");
	}
	
	/**
	 * 获取前一天日期
	 * @return
	 */
	public static String yesterday(){
		Calendar instance = Calendar.getInstance();
		instance.add(Calendar.DAY_OF_MONTH, -1);
		return DateFormatUtils.format(instance.getTime(), "yyyyMMdd");
	}
	/**
	 * 获取当前日期
	 * @param format 日期格式
	 * @return 当前日期
	 */
	public static String today(String format){
		return DateFormatUtils.format(Calendar.getInstance(), format);
	}

	/**
	 * 获取当前日期时间，默认格式为yyyyMMddHHmmss
	 * @return 当前日期时间
	 */
	public static String currentTime(){
		return today("yyyyMMddHHmmss");
	}
	/**
	 * 获取当前时间，默认格式为HHmmss
	 * @return 当前日期时间
	 */
	public static String currentShortTime(){
		return today("HHmmss");
	}
	
	/**
	 * 封装{DateUtils.parseDate}方法
	 * @param str 转换的日期字符串，不能为空
	 * @param pattern 日期格式
	 * @return
	 * @see #parseDate(String, String[])
	 */
	public static Date parseDate(String str, String pattern){
		return parseDate(str, new String[]{pattern});
	}
	/**
	 * 封装{DateUtils.parseDate}方法
	 * @param str 转换的日期字符串，不能为空
	 * @param pattern 日期格式
	 * @param formatPattern 格式化日期
	 * @return
	 * @see #parseDate(String, String[])
	 */
	public static String formatDateString(String str, String pattern, String formatPattern){
		Date parseDate = parseDate(str, new String[]{pattern});
		return format(parseDate, formatPattern);
	}
	/**
	 * 封装{DateUtils.parseDate}方法
	 * @param str 转换的日期字符串，不能为空
	 * @param parsePatterns 日期格式
	 * @return
	 */
	public static Date parseDate(String str, String[] parsePatterns){
		Date date = null;
		try {
			date = DateUtils.parseDate(str, parsePatterns);
		} catch (ParseException e) {
			LOGGER.error("转换日期失败",e);
		}
		
		return date;
	}
	/**
	 * 转换Date为字符格式(当前时间)
	 * @param pattern 格式
	 * @return
	 */
	public static String format(String pattern) {
		return format(new Date(), pattern);
	}
	/**
	 * 转换Date为字符格式
	 * @param date 时间
	 * @param pattern 格式
	 * @return
	 */
	public static String format(Date date,String pattern) {
		return DateFormatUtils.format(date, pattern);
	}
	
	/**
	 * 转换Date为字符格式
	 * pattern 格式默认为yyyy-MM-dd HH:mm:ss
	 * @param date 时间
	 * @return
	 */
	public static String format(Date date) {
		return format(date, "yyyy-MM-dd HH:mm:ss");
	}
	/**
	 * 获取月份的最大天数
	 * @param month
	 * @return
	 */
	public static int getDayOfMonth(String month){
		month = month.substring(4, 6);
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.MONTH, Integer.parseInt(month) - 1);
		int days = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
		return days;
	}
	
	/**
	 * <pre>
	 * 获取两时间相差多少分钟
	 * </pre>
	 * @param startday 开始时间
	 * @param endday 结束时间
	 * @return 分钟
	 */
	public static int getDiffMins(Date startday,Date endday){     
        long sl=startday.getTime();
        long el=endday.getTime();       
        long ei=el-sl;           
        return (int)(ei/(60000));
    }
	
	/**
	 * <pre>
	 * 获取两时间相差多少秒
	 * </pre>
	 * @param startday 开始时间
	 * @param endday 结束时间
	 * @return 分钟
	 */
	public static int getDiffSeconds(Date startday,Date endday){     
        long sl=startday.getTime();
        long el=endday.getTime();       
        long ei=el-sl;           
        return (int)(ei/(1000));
    }
	
	/**
	 * <pre>
	 * 获取两时间相差多少秒
	 * </pre>
	 * @param startday 开始时间
	 * @param endday 结束时间
	 * @return 分钟
	 */
	public static int getDiffSeconds(String startday,String endday){  
		if(StringUtils.isBlank(startday) || StringUtils.isBlank(endday) ){
			return 0;
		}
		Date startDate = parseDate(startday,"yyyyMMddHHmmss");
		Date endDate = parseDate(endday,"yyyyMMddHHmmss");
		
		return getDiffSeconds(startDate,endDate);
    }
	
	/**
	 * 获取日期差
	 * @param startday
	 * @param endday
	 * @return
	 */
	public static int getDiffDays(Date startday,Date endday){
		long sl=startday.getTime();
        long el=endday.getTime();       
        long ei=el-sl;           
        return (int)(ei/(24*60*60*1000));
	}
	
	/**
	 * 获取当前日期后若干月份的日期
	 * @param month
	 * 				月份
	 * @return
	 * 				日期 yyyyMMdd
	 */
	@SuppressWarnings("finally")
	public static String getDiffDateByMonth(String month){
		String dateAfterMonths = null;
		try {
			int _month = Integer.parseInt(month);
			Calendar calendar = Calendar.getInstance(Locale.CHINA);
			calendar.add(Calendar.MONTH, _month);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			dateAfterMonths = sdf.format(calendar.getTime());
		} catch (NumberFormatException e) {
			LOGGER.error(e);
		}finally{
			return dateAfterMonths;
		}
	}
	/**
	 * 获取当前日期若干天后的日期
	 * @author shijunkai
	 * @param days
	 *            以天为单位的时间差
	 * @param pattern
	 *            返回时间的格式
	 * @return
	 */
	public static String getDateByAddDays(int days, String pattern) {
		if (StringUtils.isEmpty(pattern)) {
			pattern = "yyyyMMddHHmmss";
		}
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, days);
		return format(calendar.getTime(), pattern);
	}
	/**
	 * 获取指定日期若干天后的日期
	 * @author shijunkai
	 * @param startDate 开始日期
	 * @param days 以天为单位的时间差
	 * @param pattern 返回日期的格式
	 * @return
	 */
	public static String getDateByAddDays(Date startDate, int days, String pattern) {
		// 日期格式，默认为yyyyMMdd
		if (StringUtils.isBlank(pattern)) {
			pattern = "yyyyMMdd";
		}
		// 获取一个日历实例
		Calendar calendar = Calendar.getInstance();
		// 给日历赋值
		calendar.setTime(startDate);
		// 根据相差天数变更日历
		calendar.add(Calendar.DAY_OF_MONTH, days);
		// 返回格式化后的时间
		return format(calendar.getTime(), pattern);
	}
	
	/**
	 * 转换毫秒数为秒或者分或者小时
	 * 如:1000ms转换为1秒
	 * @param mills 毫秒数
	 * @return
	 */
	public static String convertMillsToTime(long mills){
		//秒，小时，天  
	    double sec = 0,hour = 0,day = 0;  
	    double min;
	    String innerText = "";//显示文本  
	    
	    sec = mills / 1000.0;
	    min = Math.floor(sec/60);//计算分  
	    sec = sec % 60;//计算秒  
	    if(min >= 60){//计算小时  
	        hour = Math.floor(min /60);  
	        min = min % 60;//重新计算分  
	    }
	    
	    if(min > 0){
	    	innerText = min+"分"+innerText;
	    }
	    
	    if(hour >= 24){//计算天  
	        day = Math.floor(hour /24);
	        hour = hour % 24;//重新计算小时  
	    }
	    
	    if(hour > 0){
	        innerText = hour+"小时"+innerText;
	    }
	      
	    if(day > 0){ 
	        innerText = day+"天"+innerText;
	    }
	    
	    return innerText+sec+"秒";
	}
	/**
	 * 转换纳秒数为秒或者分或者小时
	 * 如:1000000000ns转换为1秒
	 * @param nanos 毫秒数
	 * @return
	 */
	public static String convertNanosToTime(long nanos){
		long mills = nanos / 1000000;
		return convertMillsToTime(mills);
	}
	
	/**
	 * 获取两日期所有天数日期
	 * @param startDate 开始日期
	 * @param endDate 结束日期
	 * @return
	 */
	public static List<String> getDays(String startDate, String endDate){
		Date s = parseDate(startDate, "yyyyMMdd");
		Date e = parseDate(endDate, "yyyyMMdd");
		
		int d = getDiffDays(s, e);
		
		List<String> list = new ArrayList<String>();
		Calendar cal = Calendar.getInstance();
		cal.setTime(s);
		list.add(startDate);
		for (int i = 0; i < d; i++) {
			
			cal.add(Calendar.DAY_OF_MONTH, 1);
			
			list.add(format(cal.getTime(),"yyyyMMdd"));
		}
		
		return list;
	}
	
	
	/**
	 * 通过日期差，获取时间
	 * @param diffType  相差类型  11-小时，5-天，2-月，1-年
	 * @param diff
	 * @param format
	 * @return
	 */
	public static String getDateByDiff(int diffType, int diff, String format){
		
		format = StringUtils.isEmpty(format)?"yyyyMMdd":format;//格式化日期格式
		DateFormat dateFormat = new SimpleDateFormat(format);      //用于获得当前小时后一小时
		
		Calendar cal = Calendar.getInstance();
		cal.add(diffType, diff);
		Date date = cal.getTime(); //根据时间差获取时间
		String dateStr = dateFormat.format(date);//格式化时间
		
		return dateStr;
		
	}

	/**
	 * 判断字符串是否为日期
	 * @param str
	 * @param pattern
	 * @return
	 */
	public static boolean isDate(String str, String pattern) {
		Date date = parseDate(str, pattern);
		if (date == null) {
			return false;
		}
		return true;
	}
	
	/**
	 * 根据日期获取分区
	 * @param dateStr
	 * @return
	 */
	public static String getSubareaFlag(String dateStr){
		dateStr = StringUtils.isBlank(dateStr)?today():dateStr;
		Date date = parseDate(dateStr, "yyyyMMdd");
		Date standDate = parseDate("19700102","yyyyMMdd");
		int diffDay = getDiffDays(standDate,date);
		
		return String.valueOf(diffDay%91);
	}

	/**
	 * 进行日期加减运算
	 * @param calType： Calendar.YEAR  Calendar.MOUNTH  Calendar.DAY_OF_MOUNTH
	 * @param num
	 * @param basicDate
	 * @param format
	 * @return
	 */
	public static String calculateDate(int calType, int num, String basicDate, String format) {
		SimpleDateFormat df = new SimpleDateFormat(format);
		Date templeDate = null;
		try{
			templeDate = df.parse(basicDate);
		} catch(Exception e){
			LOGGER.error("日期格式错误！");
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(templeDate);
		/**
		 * Calendar.YEAR:对年加减
		 * Calendar.MOUNTH:对月加减
		 * Calendar.DAY_OF_MOUNTH:按月份对天数加减
		 */
		cal.add(calType, num);//日期加减
		return df.format(cal.getTime());
	}


	/**
	 * 计算当前年份与y的所有年份
	 * @param y 多少年
	 * @return 年份
	 */
	public static List<String> getYears(int y){
		List<String> list = new ArrayList<String>();
		Calendar cal = Calendar.getInstance();
		list.add("" + cal.get(Calendar.YEAR));
		for (int i = 0; i < (y-1); i++) {
			cal.add(Calendar.YEAR, -1);
			list.add("" + cal.get(Calendar.YEAR));
		}

		return list;
	}

	/**
	 * 比较两日期是否超过month
	 * @param startDt 开始日期
	 * @param endDt 结束日期
	 * @param month 月份
	 * @return 相差的月数
	 */
	public static boolean compareToMonth(String startDt, String endDt, int month){
		try{
			final Date start = DateUtils.parseDate(startDt, "yyyyMMdd");
			final Date end = DateUtils.parseDate(endDt, "yyyyMMdd");

			final String formatPeriod = DurationFormatUtils.formatPeriod(start.getTime(), end.getTime(), "M-d");

			final String[] splits = split(formatPeriod, "-");
			final int m = Integer.parseInt(splits[0]);
			final int d = Integer.parseInt(splits[1]);
			if(m > month){
				return true;
			}

			if(month == m && d > 0){
				return true;
			}

		}catch (ParseException e){
			LOGGER.error(e.getMessage(), e);
		}
		return false;
	}
}