package com.pangoo.grundig.model;

import java.util.List;

public class Page<T> {

	private int pageNumber = 1;
	
	private int pageSize = 10;
	
	private int totalCount;
	
	private List<T> data;

	public Page<T> pageData(List<T> data, int totalCount) {
		setTotalCount(totalCount);
		setData(data);
		return this;
	}
	/**
	 * 获取页数
	 * @return
	 */
	public int getPageCount() {
		return getTotalCount() % getPageSize() == 0 ? getTotalCount() / getPageSize() : getTotalCount() / getPageSize() + 1;
	}

	/**
	 * 获取当前行
	 * @return
	 */
	public int getOffset() {
		return (getPageNumber() - 1) * getPageSize();
	}

	public List<T> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}

	public int getPageNumber() {
		return pageNumber;
	}

	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}
}
