/**
 * 
 */
package com.huateng.signmev2.web.page;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * 生成jQuery DataTables中的数据格式
 * @author pansen
 *
 */
public class Page {
	private @Setter @Getter List<?> data;
	private @Setter @Getter int draw;
	private @Setter @Getter int recordsTotal;
	private @Setter @Getter int recordsFiltered;
	
	public Page(com.github.pagehelper.Page<?> list) {
		this.data = list.getResult();
		this.recordsTotal = (int)list.getTotal();
		this.recordsFiltered = (int)list.getTotal();
	}
	
	public Page(List<?> list, int total) {
		this.data = list;
		this.recordsTotal = total;
		this.recordsFiltered = total;
	}
}
