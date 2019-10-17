package com.pangoo.grundig.util;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.pangoo.grundig.model.excel.ExcelData;
import com.pangoo.grundig.model.excel.ExcelRow;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;

public class ExcelUtil {

	/**
	 * 导出excel
	 * @param headers 表头
	 * @param data 数据
	 * @param fileName 文件名，后缀 .xls或者.xlsx
	 */
	@SuppressWarnings("resource")
	public static void exportExcel(ExcelRow headers, ExcelData data, String fileName, HttpServletResponse response) throws IOException  {
		
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet sheet = wb.createSheet("信息表");
		
		Font font = wb.createFont();
		font.setBold(true);
		font.setFontHeight((short) 250);
		CellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		// 在excel表中添加表头
		HSSFRow heaeRow = sheet.createRow(0);
		for (int i = 0; i < headers.size(); i++) {
			HSSFCell cell = heaeRow.createCell(i);
			HSSFRichTextString text = new HSSFRichTextString(headers.get(i));
			cell.setCellValue(text);
			cell.setCellStyle(style);
		}
		// 添加数据
		if(null != data && data.size() > 0) {
			for(int i = 0; i < data.size(); i++) {
				HSSFRow dataRow = sheet.createRow(i+1);
				ExcelRow info = data.get(i);
				for(int j = 0; j < info.size(); j++) {
					dataRow.createCell(j).setCellValue(info.get(j));
				}
			}
		}
		response.setHeader("content-Type", "application/vnd.ms-excel");
		response.setHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(fileName, "utf-8"));
        response.flushBuffer();
		wb.write(response.getOutputStream());
	}
	
	/**
	 * 组装表头
	 * @param headers
	 * @return
	 */
	public static ExcelRow excelHeaders(String... headers) {
		ExcelRow row = new ExcelRow();
		for(int i = 0; i < headers.length; ++i)
			row.add(headers[i]);
		return row;
	}
	
	/**
	 * 组装表头
	 * @param headers
	 * @return
	 */
	public static ExcelRow excelHeaders4List(List<String> headers) {
		ExcelRow row = new ExcelRow();
		for(int i = 0; i < headers.size(); i++)
			row.add(headers.get(i));
		return row;
	}
}
