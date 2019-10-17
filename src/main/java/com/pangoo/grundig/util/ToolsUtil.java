package com.pangoo.grundig.util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.util.StringUtils;

import redis.clients.jedis.Jedis;

public class ToolsUtil {

	/**
     * 函数功能说明 ： 获得文件名的后缀名. 修改者名字： 修改日期： 修改内容：
     * 
     * @参数： @param fileName
     * @参数： @return
     * @return String
     * @throws
     */
    public static String getExt(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    /**
     * 获取去掉横线的长度为32的UUID串.
     * 
     * @author WuShuicheng.
     * @return uuid.
     */
    public static String get32UUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 获取带横线的长度为36的UUID串.
     * 
     * @author WuShuicheng.
     * @return uuid.
     */
    public static String get36UUID() {
        return UUID.randomUUID().toString();
    }
	
	/**
	 * 根据年月日计算年龄,birthTimeString:"1994-11-14"
	 * @param birthTimeString
	 * @return
	 */
	public static int getAgeFromBirthTime(String birthTimeString) {
		// 先截取到字符串中的年、月、日
		String strs[] = birthTimeString.trim().split("-");
		int selectYear = Integer.parseInt(strs[0]);
		int selectMonth = Integer.parseInt(strs[1]);
		int selectDay = Integer.parseInt(strs[2]);
		// 得到当前时间的年、月、日
		Calendar cal = Calendar.getInstance();
		int yearNow = cal.get(Calendar.YEAR);
		int monthNow = cal.get(Calendar.MONTH) + 1;
		int dayNow = cal.get(Calendar.DATE);

		// 用当前年月日减去生日年月日
		int yearMinus = yearNow - selectYear;
		int monthMinus = monthNow - selectMonth;
		int dayMinus = dayNow - selectDay;

		int age = yearMinus;// 先大致赋值
		if (yearMinus < 0) {// 选了未来的年份
			age = 0;
		} else if (yearMinus == 0) {// 同年的，要么为1，要么为0
			if (monthMinus < 0) {// 选了未来的月份
				age = 0;
			} else if (monthMinus == 0) {// 同月份的
				if (dayMinus < 0) {// 选了未来的日期
					age = 0;
				} else if (dayMinus >= 0) {
					age = 1;
				}
			} else if (monthMinus > 0) {
				age = 1;
			}
		} else if (yearMinus > 0) {
			if (monthMinus < 0) {// 当前月>生日月
			} else if (monthMinus == 0) {// 同月份的，再根据日期计算年龄
				if (dayMinus < 0) {
				} else if (dayMinus >= 0) {
					age = age + 1;
				}
			} else if (monthMinus > 0) {
				age = age + 1;
			}
		}
		return age;
	}
	
	public static <T> void reflectDefaultValue(T t) throws Exception {
		if(null != t) {
			// 获取所有属性
			Field[] fields = t.getClass().getDeclaredFields();
			for(Field field : fields) {
				String fieldName = field.getName();
				String fieldType = field.getGenericType().toString().toLowerCase();
				String methodName = "get"+fieldName.substring(0, 1).toUpperCase()+fieldName.substring(1);
				Method method = t.getClass().getDeclaredMethod(methodName);
				if(null != method) {
					Object obj = method.invoke(t);
					if(null == obj) {
						field.setAccessible(true);
						if(fieldType.contains("integer")) {
							field.set(t, 0);
						}
						else if(fieldType.contains("string")) {
							field.set(t, "");
						}
						else if(fieldType.contains("date")) {
							field.set(t, new Date());
						}
						else {
							field.set(t, null);
						}
					}
				}
			}
			
		}
	}
}
