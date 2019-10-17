package com.pangoo.grundig.model.excel;

import com.pangoo.grundig.util.DateUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;

/**
 * excel表格行对象，用于存储行数据
 * 是cell的集合
 * @author weisihua 2018年7月27日 下午1:31:31
 */
public class ExcelRow extends ArrayList<String> {

	private static final long serialVersionUID = 1L;

	public boolean add(String data) {
		return super.add(data == null ? "" : data);
	}

	public boolean add(BigDecimal data) {
		return super.add(data == null ? "" : data + "");
	}

	public boolean add(int data) {
		return super.add(Integer.toString(data));
	}

	public boolean add(float data) {
		return super.add(Float.toString(data));
	}

	public boolean add(double data) {
		return super.add(Double.toString(data));
	}

	public boolean add(boolean data) {
		return super.add(data ? "是" : "否");
	}

	public boolean add(Date data) {
		return super.add(data == null ? "" : DateUtils.formatDate(data, "yyyy-MM-dd HH:mm:ss"));
	}
}
