/**
 * 
 */
package com.huateng.signmev2.code;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import org.apache.commons.lang3.StringUtils;

import com.huateng.signmev2.util.DateUtil;

/**
 * 代码生成
 * @author sam.pan
 *
 */
public class CodeWebBornTest {
	String moduleId=CodeConfigTest.moduleId;
	/*model*/
	//子包
	String modelSubpackage = CodeConfigTest.modelSubpackage;
	String modelObject=CodeConfigTest.modelObject;
	String modelObjectLowercase=StringUtils.uncapitalize(modelObject);
	//table
	String tableName=CodeConfigTest.tableName;
	String tableKey=CodeConfigTest.tableKey;
	String table=CodeConfigTest.table;
	String tableKeyName=CodeConfigTest.tableKeyName;
	String author=CodeConfigTest.author;
	String requestParam=CodeConfigTest.requestParam;
	String jspPath=CodeConfigTest.jspPath;
	//条件
	String condition = CodeConfigTest.condition;
	String addField = CodeConfigTest.add_fields;
	String jsvalidate = CodeConfigTest.jsvalidate;
	//字段中文：主要是放到table中的tableHeaders
	String []tableHeaders = CodeConfigTest.tableHeaders;
	String []columnNames = CodeConfigTest.columnNames;
	String tableTitle = "";
	String tableRender = "";
	{
		for (int i = 0; i < tableHeaders.length; i++) {
			tableTitle += "\"" + tableHeaders[i] + "\",";
			tableRender += "\"" + columnNames[i] + "\",";
		}
		tableTitle = tableTitle.substring(0, tableTitle.length() - 1);
		tableRender = tableRender.substring(0, tableRender.length() - 1);
	}
	
	
	String cfrmPath = CodeConfigTest.cfrmPath;
	String templateDir = cfrmPath + "/resources/code";
	String mgrPath = cfrmPath + "/webapp/WEB-INF/mgr";
	
	String []repalces = {
			"model.object","model.object.lowercase","model.package",
			"table.name","table.key","table.key.name",
			"author","request.param","jsp.path",
			"table.en","module_id","condition.content",
			"table.title","table.render","now.time","add.field","jsvalidate.field"
	};
	String []values = {
			modelObject,modelObjectLowercase,modelSubpackage,
			tableName,tableKey,tableKeyName,
			author,requestParam,jspPath,
			table,moduleId,condition,
			tableTitle,tableRender, DateUtil.format("yyyy-MM-dd HH:mm:ss"),addField,jsvalidate
	};
	public static void main(String[] args) {
		CodeWebBornTest t = new CodeWebBornTest();
		t.testCode();
	}
	
	
	
	public void testCode(){
		String subPath = StringUtils.replace(modelSubpackage, ".", "/");
		
		String []paths = {"jsp","js"};
		for (int i = 0; i < paths.length; i++) {
			File subPathf = new File(mgrPath+ "/" + paths[i] + "/" + subPath);
			
			if(!subPathf.exists()){
				subPathf.mkdirs();
			}
		}
		
		
		String listjsp = mgrPath+ "/jsp/" + subPath + "/" + modelObject +"List.jsp";
		String listjs = mgrPath+ "/js/" + subPath + "/" + modelObject +"List.js";
		String addjsp = mgrPath+ "/jsp/" + subPath + "/" + modelObject +"Add.jsp";
		String addjs = mgrPath+ "/js/" + subPath + "/" + modelObject +"Add.js";
		
		try {
			readAndWrite(new File(templateDir + "/" +"List_jsp"), new File(listjsp));
			readAndWrite(new File(templateDir + "/" +"List_js"), new File(listjs));
			readAndWrite(new File(templateDir + "/" +"Add_jsp"), new File(addjsp));
			readAndWrite(new File(templateDir + "/" +"Add_js"), new File(addjs));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void readAndWrite(File file, File dest) throws IOException{
		FileInputStream fis = new FileInputStream(file);
		InputStreamReader isr = new InputStreamReader(fis);
		BufferedReader br = new BufferedReader(isr);
		
		FileOutputStream fos = new FileOutputStream(dest);
		OutputStreamWriter osw = new OutputStreamWriter(fos);
		BufferedWriter bw = new BufferedWriter(osw);
		
		String line = null;
		while((line = br.readLine()) != null){
			String line2 = repalceAll(line);
			bw.write(line2);
			bw.newLine();
		}
		bw.flush();
		
		fis.close();
		isr.close();
		br.close();
		fos.close();
		osw.close();
		bw.close();
	}
	
	public String repalceAll(String line){
		
		if(StringUtils.isBlank(line)){
			return line;
		}
		
		for (int i = 0,len = repalces.length; i < len; i++) {
			line = StringUtils.replace(line, "{"+repalces[i]+"}", values[i]);
		}
		
		return line;
	}

}
