package com.huateng.signmev2.web.page;

import com.github.pagehelper.Page;
import com.huateng.signmev2.model.BaseModel;

/**
 * MyBatis - 通用分页
 * 
 * @author shijunkai
 *
 */
public class PageHelper {

	/**
	 * 开始分页
	 * 
	 * @param start 分页起始位置
	 * @param limit 分页大小
	 * @return
	 */
	public static Page<?> startPage(int start, int limit) {
		if(start == 0) {
			start = 1;
		}else {
			start = (start/limit) + 1;
		}
		
		return com.github.pagehelper.PageHelper.startPage(start, limit);
	}

	
	/**
	 * 分页
	 * @param baseModel
	 * @return
	 */
	public static Page<?> startPage(BaseModel baseModel){
		int start = baseModel.getStart();
		int limit = baseModel.getLimit();
		
		return startPage(start, limit);
	}
}
