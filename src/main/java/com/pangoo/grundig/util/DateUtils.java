package com.pangoo.grundig.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 日期工具类
 * 
 * @author healy
 * 
 */
public class DateUtils {

	public static List<String> getMonthBetweenDateStr(String minDate, String maxDate) throws ParseException{  
        List<String> listDate = new ArrayList<String>();
        Calendar startCalendar = Calendar.getInstance();  
        Calendar endCalendar = Calendar.getInstance();  
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");  
        Date startDate = df.parse(minDate);  
        startCalendar.setTime(startDate);  
        Date endDate = df.parse(maxDate);  
        endCalendar.setTime(endDate);  
        listDate.add(df.format(endCalendar.getTime()));
        while(true){  
        	endCalendar.add(Calendar.DAY_OF_MONTH, -1);  
            if(startCalendar.getTimeInMillis() < endCalendar.getTimeInMillis()){  
                listDate.add(df.format(endCalendar.getTime()));  
            }else{  
                break;  
            }  
        }  
        if (!maxDate.equals(minDate)) {
        	listDate.add(df.format(startCalendar.getTime()));
        }
        return listDate;  
    }
	
	/**
	 * 根据String日期和该日期的格式返回date日期 - yyyy-MM-dd
	 * 
	 */
	public static Date parseDate(String str, String parsePatterns) {
		SimpleDateFormat formatter = new SimpleDateFormat(parsePatterns);
		try {
			return formatter.parse(str);
		} catch (ParseException e) {
			logger.error("", e);;
			return null;
		}
	}
	
	/**
	 * 字符串智能化转日期
	 * 
	 * @param dateStr
	 * @return
	 */
	public static Date parseDate(String dateStr) {
		SimpleDateFormat formatter = null;
		if (dateStr == null) {
			return null;
		} else if (dateStr.length() == 7) {
			//默认为当月1号
			dateStr+="-01";
			formatter = new SimpleDateFormat("yyyy-MM-dd");
		}else if(dateStr.length() == 8) {
			formatter = new SimpleDateFormat("yyyyMMdd");
		}
		else if (dateStr.length() == 10) {
			formatter = new SimpleDateFormat("yyyy-MM-dd");
		} else if (dateStr.length() == 16) {
			formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		} else if (dateStr.length() == 19) {
			formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		} else if (dateStr.length() > 19) {
			formatter = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);
		} else {
			return null;
		}
		try {
			return formatter.parse(dateStr);
		} catch (ParseException e) {
			logger.error("", e);;
			return null;
		}
	}
	
	/**
	 * 将日期转换为指定的串格式
	 * yyyyMMdd HHmmss -24小时制
	 * yyyyMMdd hhmmss -12小时制
	 */
	public static String formatDate(Date date,String formatPatterns) {
		SimpleDateFormat f = new SimpleDateFormat(formatPatterns);
		return f.format(date);
	}
	
	public static String formatDate(Date date) {
		SimpleDateFormat f = new SimpleDateFormat();
		return f.format(date);
	}
	
	/**
	 * 计算 second 秒后的时间
	 * 
	 * @param date
	 * @param second
	 * @return
	 */
	public static Date addSecond(Date date, int second) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		;
		calendar.add(Calendar.SECOND, second);
		return calendar.getTime();
	}

	/**
	 * 计算 minute 分钟后的时间
	 * 
	 * @param date
	 * @param minute
	 * @return
	 */
	public static Date addMinute(Date date, int minute) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MINUTE, minute);
		return calendar.getTime();
	}

	/**
	 * 计算 hour 小时后的时间
	 * 
	 * @param date
	 * @param minute
	 * @return
	 */
	public static Date addHour(Date date, int hour) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.HOUR, hour);
		return calendar.getTime();
	}

	/**
	 * 计算 day 天后的时间
	 * 
	 * @param date
	 * @param day
	 * @return
	 */
	public static Date addDay(Date date, int day) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, day);
		return calendar.getTime();
	}
	
	/**
	 * 计算month月后的时间
	 * 
	 * @param date
	 * @return
	 */
	public static Date addMonth(Date date, int month) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, month);
		return calendar.getTime();
	}
	
	/**
	 * 计算year年后的时间
	 * 
	 * @param date
	 * @return
	 */
	public static Date addYear(Date date, int year) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.YEAR, year);
		return calendar.getTime();
	}
	
	/**
	 * 取得月天数
	 * 
	 * @param date
	 * @return
	 */
	public static int getDayOfMonth(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		return c.getActualMaximum(Calendar.DAY_OF_MONTH);
	}
	
	/**
	 * 得到month的终止时间点.
	 * 
	 * @param date
	 * @return
	 */
	public static Date getMonthEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.add(Calendar.MONTH, 1);
		calendar.add(Calendar.MILLISECOND, -1);
		return calendar.getTime();
	}
	
	/**
	 * 得到当月起始时间
	 * 
	 * @param date
	 * @return
	 */
	public static Date getMonthStart(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}
	
	/**
	 * 得到当前年起始时间
	 * 
	 * @param date
	 * @return
	 */
	public static Date getYearStart(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR));
		calendar.set(Calendar.MONTH, 0);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}

	/**
	 * 得到当前年最后一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getYearEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR));
		calendar.set(Calendar.MONTH, 11);
		calendar.set(Calendar.DAY_OF_MONTH, 31);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}
	
	public static Date getDayStart(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		Date start = calendar.getTime();
		return start;
	}

	public static Date getDayEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);

		calendar.add(Calendar.DAY_OF_MONTH, 1);
		calendar.add(Calendar.SECOND, -1);
		Date end = calendar.getTime();
		return end;
	}

	public static Timestamp DateStringToTimestamp(String dateStr) {
		return Timestamp.valueOf(dateStr);
	}
	
	public static String TimestampToDateString(Timestamp tmp) {
		return SHORT_DATE_FORMAT.format(tmp);
	}

	public static Timestamp DateToTimestamp(Date date) {
		return Timestamp.valueOf(FORMAT_TIME.format(date));
	}
	
	public static Date TimestampToDate(Timestamp tmp) {
		return tmp;
	}

	public static String getCurTime() {
		return FORMAT_TIME.format(new Date());
	}
	
	public static String getCurDate6Bit() {
		return DATE_FORMAT_6.format(new Date());
	}
	
	public static String getCurDate() {
		return SHORT_DATE_FORMAT.format(new Date());
	}
	
	public static String getCurYear() {
		return YEAR_FORMAT.format(new Date());
	}
	
	public static Date now() {
		return new Date();
	}
	
	public static Timestamp addToNow(int addition) {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MINUTE, addition);
		return new Timestamp(calendar.getTimeInMillis());
	}
	
	public static Timestamp addToNow(int addition,int type) {
		Calendar calendar = Calendar.getInstance();
		calendar.add(type, addition);
		return new Timestamp(calendar.getTimeInMillis());
	}

	/**
	 * 取得两个日期之间的日数
	 * 
	 * @return t1到t2间的日数，如果t2 在 t1之后，返回正数，否则返回负数
	 */
	public static long daysBetween(java.sql.Timestamp t1, java.sql.Timestamp t2) {
		return (t2.getTime() - t1.getTime()) / DAY_MILLI;
	}


	public static final long DAY_MILLI = 24 * 60 * 60 * 1000; // 一天的MilliSecond

	private static Logger logger = LoggerFactory.getLogger(DateUtils.class);

	// Global SimpleDateFormat object
	public static final SimpleDateFormat YEAR_FORMAT = new SimpleDateFormat("yyyy");
	public static final SimpleDateFormat SHORT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
	public static final SimpleDateFormat FORMAT_TIME = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	public static final SimpleDateFormat DATE_FORMAT_6 = new SimpleDateFormat("yyyyMMdd");

	public static void main(String[] args) throws Exception {
//		String date1 = "2017-03-01";
//		String date2 = "2017-03-02";
//		System.out.println(formatDate(parseDate("20180304000000"),"yyyy-MM-dd"));
	}
}
