
package com.huateng.signmev2.util;

import java.security.Key;
import java.security.MessageDigest;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;

import lombok.extern.slf4j.Slf4j;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 加密工具
 *
 * @author sam.pan
 */
@Slf4j
public class SecureUtil {

    private static final String DES_KEY = "SAM_PAN";

    private static final char[] HEX_DIGITS = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    private static Key key;

    static {
        try {
            KeyGenerator generator = KeyGenerator.getInstance("DES");
            generator.init(new SecureRandom(DES_KEY.getBytes()));
            key = generator.generateKey();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    /**
     * 单向加密
     *
     * @param algorithm 加密方式 MD5 SHA
     * @param plaintext 明文
     * @return 密文
     */
    public static String encode(String algorithm, String plaintext) {
        if (plaintext == null) {
            return null;
        }
        try {
            MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
            messageDigest.update(plaintext.getBytes());
            return getFormattedText(messageDigest.digest());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    /**
     * DES 加密
     *
     * @param plaintext 明文
     * @return 密文
     */
    public static String desEncode(String plaintext) {
        byte[] byteMi = null;
        byte[] byteMing = null;
        String strMi = "";
        BASE64Encoder base64en = new BASE64Encoder();
        try {
            byteMing = plaintext.getBytes("UTF8");
            byteMi = getDesOrEncCode(Cipher.ENCRYPT_MODE, byteMing);
            strMi = base64en.encode(byteMi);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            base64en = null;
            byteMing = null;
            byteMi = null;
        }
        return strMi;
    }


    /**
     * DES 解密
     *
     * @param plaintext 密文
     * @return 明文
     */
    public static String desDecode(String plaintext) {
        BASE64Decoder base64De = new BASE64Decoder();
        byte[] byteMing = null;
        byte[] byteMi = null;
        String strMing = "";
        try {
            byteMi = base64De.decodeBuffer(plaintext);
            byteMing = getDesOrEncCode(Cipher.DECRYPT_MODE, byteMi);
            strMing = new String(byteMing, "UTF8");
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            base64De = null;
            byteMing = null;
            byteMi = null;
        }
        return strMing;
    }

    private static byte[] getDesOrEncCode(int mode, byte[] abyte) {
        Cipher cipher;
        byte[] byteFina = null;
        try {
            cipher = Cipher.getInstance("DES");
            cipher.init(mode, key);
            byteFina = cipher.doFinal(abyte);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            cipher = null;
        }
        return byteFina;
    }

    private static String getFormattedText(byte[] bytes) {
        int len = bytes.length;
        StringBuilder buf = new StringBuilder(len * 2);
        for (int j = 0; j < len; j++) {
            buf.append(HEX_DIGITS[bytes[j] >> 4 & 0x0f]);
            buf.append(HEX_DIGITS[bytes[j] & 0x0f]);
        }
        return buf.toString();
    }
}
