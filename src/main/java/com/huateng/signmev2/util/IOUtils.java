/**
 * 
 */
package com.huateng.signmev2.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

/**
 * @author sam.pan
 *
 */
public class IOUtils {
	private static final Log LOGGER = LogFactory.getLog(IOUtils.class);
	/**
	 * 关闭流
	 * @param closeable
	 */
	public static void closeStream(Closeable closeable) {
		try{
			if(closeable != null){
				closeable.close();
			}
		}catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
	}

	/**
	 * 下载文件
	 * @param file 文件
	 * @param response
	 */
	public static void download(File file, HttpServletResponse response){
		Assert.notNull(file, "下载的文件对象不能为空");

		String fileName = file.getName();
		if(!file.exists()){
			LOGGER.error(fileName+":文件不存在");
			return;
		}

		try {
			fileName = URLEncoder.encode(fileName, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			LOGGER.error(e.getMessage(), e);
		}
		response.setHeader("content-type", "application/octet-stream");
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment;filename=" + fileName);

		byte[] buff = new byte[1024];
		BufferedInputStream bis = null;
		FileInputStream fis = null;
		OutputStream os = null;
		try {
			os = response.getOutputStream();
			fis = new FileInputStream(file);
			bis = new BufferedInputStream(fis);
			int i = bis.read(buff);
			while (i != -1) {
				os.write(buff, 0, buff.length);
				os.flush();
				i = bis.read(buff);
			}
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
		} finally {
			closeStream(bis);
			closeStream(fis);
		}
	}

	/**
	 * 文件下载（spring mvc的写法)
	 * @param fileName 文件名
	 * @param bytes 要下载的文件字节
	 * @return
	 */
	public static ResponseEntity<byte[]> download(String fileName, byte[]bytes){
		// 设置HTTP头信息
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.setContentDispositionFormData("attachment", fileName);

		return new ResponseEntity<byte[]>(bytes, headers, HttpStatus.OK);
	}
}
