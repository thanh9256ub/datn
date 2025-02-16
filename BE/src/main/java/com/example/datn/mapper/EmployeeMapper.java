package com.example.datn.mapper;

import com.example.datn.dto.request.EmployeeRequest;
import com.example.datn.dto.response.EmployeeResponse;
import com.example.datn.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    Employee toEmployee(EmployeeRequest request);

    EmployeeResponse toEmployeeResponse(Employee employee);

    List<EmployeeResponse> toListResponses(List<Employee> list);

    @Mapping(target = "id",ignore = true)
    void updateEmployee(@MappingTarget Employee employee, EmployeeRequest request);


}
