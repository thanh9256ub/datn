package com.example.datn.service;

import com.example.datn.dto.request.EmployeeRequest;
import com.example.datn.dto.response.EmployeeResponse;
import com.example.datn.entity.Employee;
import com.example.datn.entity.Role;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.EmployeeMapper;
import com.example.datn.repository.EmployeeRepository;
import com.example.datn.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    EmployeeMapper employeeMapper;

    @Autowired
    RoleRepository roleRepository;


    public List<EmployeeResponse> getAll() {

        return employeeMapper.toListResponses(employeeRepository.findAll());
    }

    public EmployeeResponse createEmployee(EmployeeRequest employeeRequest) {

        Employee employee = employeeMapper.toEmployee(employeeRequest);
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());

        Role role = roleRepository.findById(employeeRequest.getRoleId()).get();
        employee.setRoLe(role);

        Employee created = employeeRepository.save(employee);

        return new EmployeeResponse(created);
    }

    public EmployeeResponse getEmployeeById(Integer id) {

        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

        return employeeMapper.toEmployeeResponse(employee);
    }

    public EmployeeResponse updateEmployee(Integer id, EmployeeRequest employeeRequest) {

        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

        employeeMapper.updateEmployee(employee, employeeRequest);

        return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
    }

    public void deleteEmployee(Integer id) {

        employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

        employeeRepository.deleteById(id);
    }
}
