package com.example.datn.service;

import com.example.datn.dto.request.RoleRequest;
import com.example.datn.dto.response.RoleResponse;
import com.example.datn.entity.Role;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.RoleMapper;
import com.example.datn.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    RoleMapper roleMapper;

    public List<RoleResponse> getAll() {

        return roleMapper.toListResponse(roleRepository.findAll());
    }

    public RoleResponse createRole(RoleRequest roleRequest) {

        Role role = roleMapper.toRole(roleRequest);

        Role created = roleRepository.save(role);

        return roleMapper.toRoleResponse(created);
    }

    public RoleResponse getRoleById(Integer id) {

        Role role = roleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Role id is not exists with given id: " + id)
        );

        return roleMapper.toRoleResponse(role);
    }

    public RoleResponse updateRole(Integer id, RoleRequest roleRequest) {

        Role role = roleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Role id is not exists with given id: " + id)
        );

        roleMapper.updateRole(role, roleRequest);

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public void deleteRole(Integer id) {

        roleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Role id is not exists with given id: " + id)
        );

        roleRepository.deleteById(id);
    }
}