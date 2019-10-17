package com.pangoo.grundig.util;

import java.security.MessageDigest;

public class MD5Util {

	public static String MD5Lower32(String source) {
		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");  
			md5.update((source).getBytes("UTF-8"));  
			byte b[] = md5.digest();  
			  
			int i;  
			StringBuffer buf = new StringBuffer("");  
			  
			for(int offset=0; offset<b.length; offset++){  
			    i = b[offset];  
			    if(i<0){  
			        i+=256;  
			    }  
			    if(i<16){  
			        buf.append("0");  
			    }  
			    buf.append(Integer.toHexString(i));  
			}  
			  
			return buf.toString(); 
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
		
	}
	
	public static String MD5Upper32(String source) {
		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");  
			md5.update((source).getBytes("UTF-8"));  
			byte b[] = md5.digest();  
			  
			int i;  
			StringBuffer buf = new StringBuffer("");  
			  
			for(int offset=0; offset<b.length; offset++){  
			    i = b[offset];  
			    if(i<0){  
			        i+=256;  
			    }  
			    if(i<16){  
			        buf.append("0");  
			    }  
			    buf.append(Integer.toHexString(i));  
			}  
			  
			return buf.toString().toUpperCase(); 
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
		
	}
	
	public static void main(String[] args) {
		System.out.println(MD5Upper32("123456"));
	}
}
