package com.example.datn.mapper;

import com.example.datn.dto.request.RoleRequest;
import com.example.datn.dto.response.RoleResponse;
import com.example.datn.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")

public interface RoleMapper {

    Role toRole(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);

    List<RoleResponse> toListResponse(List<Role> list);

    @Mapping(target = "id",ignore = true)
    void updateRole(@MappingTarget Role role, RoleRequest roleRequest);
}
