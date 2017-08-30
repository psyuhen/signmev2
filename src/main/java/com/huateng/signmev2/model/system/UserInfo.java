/**
 * 
 */
package com.huateng.signmev2.model.system;

import java.io.Serializable;
import java.util.List;
//
//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.FetchType;
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.JoinColumn;
//import javax.persistence.JoinTable;
//import javax.persistence.ManyToMany;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author sam.pan
 *
 */
//@Entity
@ToString
public class UserInfo implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = -3138924437753999107L;
	//@Id
    //@GeneratedValue
    private @Setter @Getter Integer uid;
    //@Column(unique =true)
    private @Setter @Getter String username;//帐号
    private @Setter @Getter String name;//名称（昵称或者真实姓名，不同系统不同定义）
    private @Setter @Getter String password; //密码;
    private @Setter @Getter String salt;//加密密码的盐
    private @Setter @Getter byte state;//用户状态,0:创建未认证（比如没有激活，没有输入验证码等等）--等待验证的用户 , 1:正常状态,2：用户被锁定.
    //@ManyToMany(fetch= FetchType.EAGER)//立即从数据库中进行加载数据;
    //@JoinTable(name = "SysUserRole", joinColumns = { @JoinColumn(name = "uid") }, inverseJoinColumns ={@JoinColumn(name = "roleId") })
    private @Setter @Getter List<SysRole> roleList;// 一个用户具有多个角色
    
    /**
     * 密码盐.
     * @return
     */
    public String getCredentialsSalt(){
       return this.username+this.salt;
    }
 
 }
