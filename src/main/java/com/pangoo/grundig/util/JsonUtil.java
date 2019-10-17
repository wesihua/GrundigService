package com.pangoo.grundig.util;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


public class JsonUtil {
	
	private static ObjectMapper objectMapper = new ObjectMapper();
	
	/**
	 * 把java对象,Map,list转换为json格式的String
	 * @param obj 对象
	 * @return String 对象的json串
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonGenerationException 
	 */
	public static <T> String bean2Json(T bean) {  
        try {  
        	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        	objectMapper.setDateFormat(formatter);
            return objectMapper.writeValueAsString(bean);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return "";  
    }
	
	/**
	 * 把json格式的ListString转换为java对象列表
	 * @param objectListString 目标对象列表的json串
	 * @param clazz 目标对象
	 * @return List 对象集合
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> json2List(String json, Class<T> beanClass) {  
        try {  
        	objectMapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);//设置可用单引号  
        	objectMapper.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);//设置字段可以不用双引号包括 
            return (List<T>)objectMapper.readValue(json, getCollectionType(List.class, beanClass));  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return null;  
    }  
	
	/**
	 * 把json格式的String转换为java对象,Map
	 * @param objectString 目标对象的json串
	 * @param clazz 目标对象
	 * @return 对象
	 */
	public static <T> T json2Bean(String json, Class<T> beanClass) {  
        try {  
        	objectMapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);//设置可用单引号  
        	objectMapper.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);//设置字段可以不用双引号包括
            return objectMapper.readValue(json, beanClass);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return null;  
    }
	
	public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {     
        return objectMapper.getTypeFactory().constructParametricType(collectionClass, elementClasses);     
    }   
	
	@SuppressWarnings("unchecked")
	public static Map<String,Object> json2Map(String jsonString) {
		try {
			return objectMapper.readValue(jsonString, Map.class);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	public static ObjectMapper getObjectMapper() {
		return objectMapper;
	}

}
