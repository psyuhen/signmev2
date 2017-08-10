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

/**
 * 代码生成
 * @author sam.pan
 *
 */
public class CodeBornTest {
	String basePackage = CodeConfigTest.basePackage;
	String moduleId=CodeConfigTest.moduleId;
	/*model*/
	//子包
	String modelSubpackage = CodeConfigTest.modelSubpackage;
	String modelObject=CodeConfigTest.modelObject;
	String modelObjectLowercase=StringUtils.uncapitalize(modelObject);
	//mapper
	String mapperPackage = modelSubpackage;
	String mapperInterface= modelObject + "Mapper";
	String mapperInterfaceLowercase=StringUtils.uncapitalize(mapperInterface);
	//table
	String tableName=CodeConfigTest.tableName;
	String tableKey=CodeConfigTest.tableKey;
	String tableUKey=CodeConfigTest.tableUKey;
	String table=CodeConfigTest.table;
	//service
	String servicePackage=mapperPackage;
	String serviceInterface = modelObject + "Service";
	String serviceInterfaceLowcase = StringUtils.uncapitalize(serviceInterface);
	
	String author=CodeConfigTest.author;
	
	String requestParam=CodeConfigTest.requestParam;
	String jspPath=CodeConfigTest.jspPath;
	
	String cfrmPath = CodeConfigTest.cfrmPath;
	String templateDir = cfrmPath + "/resources/code";
	String []fieldNames = CodeConfigTest.fieldNames;
	
	String validate = CodeConfigTest.validate;
	
	String fieldSetterGetter = "";
	String fieldAll = "";
	String whereif = "";
	String insertf = "";
	String binsertf = "";
	String updates = "";
	{
		String pri = "private @Setter @Getter String ";
		String ifc = "<if test=\"{1} != null and {1} != ''\">AND {1} = #{{1},jdbcType=VARCHAR}</if>";
		String us = "<if test=\"{1} != null\">{1} = #{{1},jdbcType=VARCHAR},</if>";
		for (int i = 0; i < fieldNames.length; i++) {
			fieldSetterGetter += pri + fieldNames[i] + ";\r\n	";
			fieldAll += fieldNames[i] + ",";
			
			whereif += StringUtils.replace(ifc, "{1}", fieldNames[i]) + "\r\n			";
			
			insertf += "#{" + fieldNames[i] + ",jdbcType=VARCHAR},";
			binsertf += "#{item." + fieldNames[i] + ",jdbcType=VARCHAR},";
			updates += StringUtils.replace(us, "{1}", fieldNames[i]) + "\r\n	      	";
		}
		fieldAll = fieldAll.substring(0, fieldAll.length() - 1);
		insertf = insertf.substring(0, insertf.length() - 1);
		binsertf = binsertf.substring(0, binsertf.length() - 1);
	}
	
	String []repalces = {"base.package","mapper.package","mapper.interface","mapper.interface.lowercase",
			"model.object","model.object.lowercase","model.subpackage",
			"table.name","table.key","table.ukey","service.interface.lowercase",
			"service.package","service.interface","author","request.param","jsp.path",
			"field.content","table.en","field.all","wif.c","in.field","u.set","module_id",
			"bin.field","validate.field"
			};
	String []values = {basePackage,
			mapperPackage,mapperInterface,mapperInterfaceLowercase,
			modelObject,modelObjectLowercase,modelSubpackage,
			tableName,tableKey,tableUKey,serviceInterfaceLowcase,
			servicePackage,serviceInterface,author,requestParam,jspPath,
			fieldSetterGetter,table,fieldAll,whereif,insertf,updates,moduleId,
			binsertf,validate
	};
	public static void main(String[] args) {
		CodeBornTest t = new CodeBornTest();
		t.testCode();
	}
	
	
	
	public void testCode(){
		String baseDir = cfrmPath + "/java/com/huateng/xhcp";
		String subPath = StringUtils.replace(modelSubpackage, ".", "/");
		
		String xmlPath = cfrmPath + "/resources/com/huateng/xhcp/mapper";
		
		String []paths = {"service","service/imp","mapper","web","model","xml"};
		for (int i = 0; i < paths.length; i++) {
			File subPathf = null;
			if("xml".equals(paths[i])){
				subPathf = new File(xmlPath+ "/" + subPath + "/");
			}else{
				subPathf = new File(baseDir+ "/" + paths[i] + "/" + subPath);
			}
			
			if(!subPathf.exists()){
				subPathf.mkdirs();
			}
		}
		
		
		String service = baseDir+ "/service/" + subPath + "/" + serviceInterface +".java";
		String serviceImp = baseDir+ "/service/imp/" + subPath + "/" + serviceInterface +"Imp.java";
		String mapper = baseDir+ "/mapper/" + subPath + "/" + mapperInterface +".java";
		String controller = baseDir+ "/web/" + subPath + "/" + modelObject +"Controller.java";
		String model = baseDir+ "/model/" + subPath + "/" + modelObject +".java";
		String xml = xmlPath+ "/" + subPath + "/" + mapperInterface +".xml";
		
		try {
			readAndWrite(new File(templateDir + "/" +"Service.java"), new File(service));
			readAndWrite(new File(templateDir + "/" +"ServiceImp.java"), new File(serviceImp));
			readAndWrite(new File(templateDir + "/" +"Mapper.java"), new File(mapper));
			readAndWrite(new File(templateDir + "/" +"Controller.java"), new File(controller));
			readAndWrite(new File(templateDir + "/" +"Model.java"), new File(model));
			readAndWrite(new File(templateDir + "/" +"MapperXml.xml"), new File(xml));
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
