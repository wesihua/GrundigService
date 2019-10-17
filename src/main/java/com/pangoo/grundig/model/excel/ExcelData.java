package com.pangoo.grundig.model.excel;

import java.util.ArrayList;

/**
 * excel表格数据集合，行的集合
 * @author weisihua
 * 2018年7月27日 下午1:40:49
 */
public class ExcelData extends ArrayList<ExcelRow> {

	private static final long serialVersionUID = 1L;
	
	public ExcelData() {}
	
	public ExcelData(int size) {
		super(size);
	}
}
