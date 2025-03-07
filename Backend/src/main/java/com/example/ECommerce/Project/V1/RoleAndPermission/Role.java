package com.example.ECommerce.Project.V1.RoleAndPermission;

import com.example.ECommerce.Project.V1.RoleAndPermission.Permission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.ECommerce.Project.V1.RoleAndPermission.Permission.*;

@Getter
@RequiredArgsConstructor
public enum Role {

    GUEST(
            Collections.singleton(GUEST_VIEW)
    ),
    USER(
            Set.of(USER_VIEW, USER_INSERT, USER_UPDATE, USER_DELETE)
    ),
    ADMIN(
            Set.of(ADMIN_VIEW, ADMIN_INSERT, ADMIN_UPDATE, ADMIN_DELETE,
                    STAFF_VIEW, STAFF_INSERT, STAFF_UPDATE, STAFF_DELETE,
                    MODERATOR_VIEW, MODERATOR_INSERT, MODERATOR_UPDATE, MODERATOR_DELETE)
    ),
    STAFF(
            Set.of(STAFF_VIEW, STAFF_INSERT, STAFF_UPDATE, STAFF_DELETE)
    ),
    MODERATOR(
            Set.of(MODERATOR_VIEW, MODERATOR_INSERT, MODERATOR_UPDATE)
    );

    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermissions()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    };
}
