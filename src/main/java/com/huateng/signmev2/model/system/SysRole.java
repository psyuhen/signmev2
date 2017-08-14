/**
 * 
 */
package com.huateng.signmev2.model.system;

import java.util.List;

//import javax.persistence.Entity;
//import javax.persistence.FetchType;
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
public class SysRole {
   /* @Id@GeneratedValue
    private @Setter @Getter Integer id; // 编号
    private @Setter @Getter String role; // 角色标识程序中判断使用,如"admin",这个是唯一的:
    private @Setter @Getter String description; // 角色描述,UI界面显示使用
    private @Setter @Getter Boolean available = Boolean.FALSE; // 是否可用,如果不可用将不会添加给用户
 
    //角色 -- 权限关系：多对多关系;
    @ManyToMany(fetch= FetchType.EAGER)
    @JoinTable(name="SysRolePermission",joinColumns={@JoinColumn(name="roleId")},inverseJoinColumns={@JoinColumn(name="permissionId")})
    private @Setter @Getter List<SysPermission> permissions;
 
    // 用户 - 角色关系定义;
    @ManyToMany
    @JoinTable(name="SysUserRole",joinColumns={@JoinColumn(name="roleId")},inverseJoinColumns={@JoinColumn(name="uid")})
    private @Setter @Getter List<UserInfo> userInfos;// 一个角色对应多个用户
*/ }
