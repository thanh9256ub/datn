package com.example.datn.service;

import com.example.datn.dto.request.EmployeeRequest;
import com.example.datn.dto.response.ApiPagingResponse;
import com.example.datn.dto.response.EmployeeResponse;
import com.example.datn.entity.Employee;
import com.example.datn.entity.Role;
import com.example.datn.exception.ResourceNotFoundException;
import com.example.datn.mapper.EmployeeMapper;
import com.example.datn.repository.EmployeeRepository;
import com.example.datn.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Random;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    EmployeeMapper employeeMapper;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    EmailService emailService;

    public ApiPagingResponse<List<EmployeeResponse>> getAll(String search, Integer status,
                                                            int page, int pageSize) {
        List<EmployeeResponse> responseList = new ArrayList<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.Direction.DESC, "createdAt");
        Page<Employee> employeePage;
        if (search == null) search = "";
//        if (search == null || search.trim().isEmpty()) {
//            employeePage = employeeRepository.findAll(pageable);
//        } else
        employeePage = employeeRepository.searchEmployees(search.trim(), status, pageable);

        employeePage.get().forEach(employee -> responseList.add(new EmployeeResponse(employee)));
        return new ApiPagingResponse<>(
                HttpStatus.OK.value(),
                "Employee retrieved successfully",
                responseList,
                employeePage.getTotalPages()
        );
    }

    public EmployeeResponse createEmployee(EmployeeRequest employeeRequest) {
        Employee employee = employeeMapper.toEmployee(employeeRequest);
        employee.setEmployeeCode("NV.....");
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        employee.setStatus(1);
        Role role = roleRepository.findById(employeeRequest.getRoleId()).get();
        employee.setRole(role);

        String password = generatePassword();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        employee.setPassword(passwordEncoder.encode(password));

        Employee created = employeeRepository.save(employee);
        created.setEmployeeCode(generateEmployeeCode(created.getId()));
        employeeRepository.save(created);
        emailService.sendSimpleMessage(employee.getEmail(), "Password login", "Your password: " + password);
//        return employeeMapper.toEmployeeResponse(employee);
        return new EmployeeResponse(created);
    }

    public EmployeeResponse getEmployeeById(Integer id) {

        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

//        return employeeMapper.toEmployeeResponse(employee);
        return new EmployeeResponse(employee);
    }

    public EmployeeResponse updateEmployee(Integer id, EmployeeRequest employeeRequest) {

        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

        Role role = roleRepository.findById(employeeRequest.getRoleId()).orElse(null);
        if (Objects.nonNull(role))
            employee.setRole(role);

        employee.setFullName(employeeRequest.getFullName());
        employee.setGender(employeeRequest.getGender());
        employee.setBirthDate(employeeRequest.getBirthDate());
        employee.setPhone(employeeRequest.getPhone());
        employee.setAddress(employeeRequest.getAddress());
        employee.setEmail(employeeRequest.getEmail());
        employee.setUsername(employeeRequest.getUsername());
        employee.setStatus(employeeRequest.getStatus());
//        employeeMapper.updateEmployee(employee, employeeRequest);


        employee.setUpdatedAt(LocalDateTime.now());

//        return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
        return new EmployeeResponse(employeeRepository.save(employee));
    }

    public void deleteEmployee(Integer id) {

        employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

        employeeRepository.deleteById(id);
    }

    public EmployeeResponse updateEmployeeStatus(Integer id) {

        Employee employee = employeeRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee id is not exists with given id: " + id));

        employee.setStatus(0);

        return new EmployeeResponse(employeeRepository.save(employee));
    }

    private String generateEmployeeCode(Integer id) {
        return String.format("NV%05d", id);
    }

    private String generatePassword() {
        return String.format("%06d", new Random().nextInt(1000000));
    }
}
