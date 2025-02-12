package com.example.ECommerce.Project.V1.RoleAndPermission;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Permission {

    ADMIN_VIEW("admin:viewData"),
    ADMIN_INSERT("admin:insertData"),
    ADMIN_UPDATE("admin:updateData"),
    ADMIN_DELETE("admin:deleteData"),

    GUEST_VIEW("guest:viewData"),
    GUEST_INSERT("guest:insertData"),
    GUEST_UPDATE("guest:updateData"),
    GUEST_DELETE("guest:deleteData"),

    USER_VIEW("user:viewData"),
    USER_INSERT("user:insertData"),
    USER_UPDATE("user:updateData"),
    USER_DELETE("user:deleteData"),

    STAFF_VIEW("staff:viewData"),
    STAFF_INSERT("staff:insertData"),
    STAFF_UPDATE("staff:updateData"),
    STAFF_DELETE("staff:deleteData"),

    MODERATOR_VIEW("moderator:viewData"),
    MODERATOR_INSERT("moderator:insertData"),
    MODERATOR_UPDATE("moderator:updateData"),
    MODERATOR_DELETE("moderator:deleteData");

    private final String permissions;
}
