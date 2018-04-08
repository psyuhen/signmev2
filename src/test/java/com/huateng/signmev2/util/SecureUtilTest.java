package com.huateng.signmev2.util;

import org.junit.Assert;
import org.junit.Test;

/**
 * @version V1.0
 * @Project : signmev2
 * @Package : com.huateng.signmev2.util
 * @Description : TODO
 * @Author : sam.pan
 * @Create : 2018/1/4 18:06
 * @ModificationHistory Who      When        What
 * =============     ==============  ==============================
 */
public class SecureUtilTest {

    @Test
    public void testEncode(){
        final String root = SecureUtil.desEncode("1234");
        System.out.println(root);
        Assert.assertEquals("gBq4lgYvHSc=", root);
    }

    @Test
    public void testDecode(){
        final String root = SecureUtil.desDecode("gBq4lgYvHSc=");
        System.out.println(root);
        Assert.assertEquals("1234", root);
    }
}
