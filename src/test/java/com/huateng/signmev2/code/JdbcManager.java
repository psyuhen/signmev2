/**
 * ecpRulesProject
 * ����07:56:08
 * @author ��ȫ
 */
package com.huateng.signmev2.code;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.log4j.Logger;

/**
 * @author Administrator
 *
 */
public class JdbcManager {
	private static Logger logger = Logger.getLogger(JdbcManager.class);
	private static String driver = "";
	private static String user = "";
	private static String password = "";
	private static String url = "";
	private static Connection con;
	static{

		Properties props = null;
		try {
			props = new Properties();
			props.load(JdbcManager.class.getClassLoader().getResourceAsStream("application.properties"));

//			driver = "oracle.jdbc.OracleDriver";
			driver = "com.mysql.jdbc.Driver";
			user = props.getProperty("dataSource.user");
			password = props.getProperty("dataSource.password");
			url = props.getProperty("dataSource.url");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 获取连接
	 * @return
	 * @throws Exception
	 */
	public static Connection getConnection(){
		try{
			if (con==null || con.isClosed()) {
				Class.forName(driver).newInstance();
				con = DriverManager.getConnection(url, user, password);
			}
		}catch (Exception e) {
			logger.error("数据库连接异常", e);
		}
		return con;
	}
	/**
	 * 获取SQl的单条数据
	 * @param <E>
	 * @param sql
	 * @param dao
	 * @return
	 * @throws Exception
	 */
	public static <E> E  executeSql(String sql,AbstractDAO<E> dao) throws Exception {
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = getConnection().createStatement();
			rs = stmt.executeQuery(sql);
			if (rs.next()) {
				E t = dao.mapping(rs);
				return t;
			}else{
				return null;
			}
			
		} catch (SQLException e) {
			logger.error("查询异常，查询语句[" + sql + "]", e);
			return null;
		} finally {
			try {
				if (rs != null)
					rs.close();
			} catch (Exception e) {
				logger.error("rs关闭异常", e);
			}
			try {
				if (stmt != null)
					stmt.close();
			} catch (Exception e) {
				logger.error("statement关闭异常", e);
			}
		}
	}
	
	
	public static List<String> queryColumns(String table){
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = getConnection().createStatement();
//			rs = stmt.executeQuery("select * from "+ table + " where rownum = 1");
			rs = stmt.executeQuery("select * from "+ table + " limit 0");
			ResultSetMetaData metaData = rs.getMetaData();
			int columnCount = metaData.getColumnCount();
			for (int i = 1; i <= columnCount; i++) {
				String label = metaData.getColumnLabel(i);
				System.err.println(label);
			}
		} catch (SQLException e) {
			logger.error("查询表属性出错", e);
			return null;
		} finally {
			try {
				if (rs != null)
					rs.close();
			} catch (Exception e) {
				logger.error("rs关闭异常", e);
			}
			try {
				if (stmt != null)
					stmt.close();
			} catch (Exception e) {
				logger.error("statement关闭异常", e);
			}
		}
		
		return null;
	}
	public static List<String> queryColumns2(String table){
		List<String> list = new LinkedList<String>();
		try {
			DatabaseMetaData metaData1 = getConnection().getMetaData();
			ResultSet tables = metaData1.getColumns(null, "brlcp", table.toUpperCase(), "%");
			
			while(tables.next()){
				list.add(tables.getString(4).toLowerCase());
			}
		} catch (SQLException e) {
			logger.error("查询表属性出错", e);
			return null;
		} finally {
		}
		
		return list;
	}
	public static Map<String, Integer> queryColumns3(String table){
		Map<String, Integer> map = new HashMap<String, Integer>();
		try {
			DatabaseMetaData metaData1 = getConnection().getMetaData();
			ResultSet tables = metaData1.getColumns(null, "brlcp", table.toUpperCase(), "%");
			
			while(tables.next()){
				map.put(tables.getString(4).toLowerCase(), tables.getInt(7));
			}
		} catch (SQLException e) {
			logger.error("查询表属性出错", e);
			return null;
		} finally {
		}
		
		return map;
	}
	
	public static void main(String[] args) {
		Map<String, Integer> queryColumns3 = JdbcManager.queryColumns3("SHAM_AGG_config");
		System.err.println(queryColumns3);
	}
}

abstract class AbstractDAO<E> {
    /**
     * 回调函数mapping
     * @param rs
     * @return
     * @throws SQLException
     */
    public abstract E mapping(ResultSet rs) throws SQLException;
}