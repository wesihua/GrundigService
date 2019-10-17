package com.pangoo.grundig.model;


import com.pangoo.grundig.exception.NormalException;

/**
 * 接口统一返回对象
 * @author weisihua
 * 2018年7月30日 下午2:38:44
 */
public class Result {

	/*
	 * 0:失败，1:成功
	 */
	private int code;
	
	/*
	 * 返回描述
	 */
	private String msg;
	
	/*
	 * 返回数据实体
	 */
	private Object data;
	
	public static Result SUCCESS = success();
	
	public static Result ERROR = fail();
	
	public Result() {}
	
	public Result(int code, String message, Object data) {
		this.code = code;
		this.msg = message;
		this.data = data;
	}
	
	public static Result success() {
		return new Result(1, "SUCCESS", null);
	}

	public static Result success(Object data) {
		return new Result(1, "SUCCESS", data);
	}
	
	public static Result fail() {
		return new Result(0, "FAILURE", null);
	}

	public static Result fail(String message) {
		return new Result(0, message, null);
	}
	
	public static Result fail(int code, String message) {
		return new Result(code, message, null);
	}
	
	public static Result fail(Exception e) {
		if(e instanceof NormalException) {
			//return new Result(0, e.getMessage(), null);
			return fail(e.getMessage());
		}
		else {
			return fail("操作失败！");
		}
	}
	
	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
}
