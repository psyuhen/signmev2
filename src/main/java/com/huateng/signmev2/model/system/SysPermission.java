/**
 * 
 */
package com.huateng.signmev2.model.system;

import java.io.Serializable;
import java.util.List;

//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.JoinColumn;
//import javax.persistence.JoinTable;
//import javax.persistence.ManyToMany;

import lombok.Getter;
import lombok.Setter;

/**
 * @author sam.pan
 *
 */
//@Entity
public class SysPermission implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 2048388900737467294L;
	//@Id@GeneratedValue
    private @Setter @Getter Integer id;//主键.
    private @Setter @Getter String name;//名称.
    //@Column(columnDefinition="enum('menu','button')")
    private @Setter @Getter String resourceType;//资源类型，[menu|button]
    private @Setter @Getter String url;//资源路径.
    private @Setter @Getter String permission; //权限字符串,menu例子：role:*，button例子：role:create,role:update,role:delete,role:view
    private @Setter @Getter Long parentId; //父编号
    private @Setter @Getter String parentIds; //父编号列表
    private @Setter @Getter Boolean available = Boolean.FALSE;
    //@ManyToMany
    //@JoinTable(name="SysRolePermission",joinColumns={@JoinColumn(name="permissionId")},inverseJoinColumns={@JoinColumn(name="roleId")})
    private @Setter @Getter List<SysRole> roles;
 
 }
