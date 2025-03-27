package com.example.datn.repository;

import com.example.datn.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByUsername(String username);


    @Query("SELECT e FROM Employee e" +
            " WHERE (LOWER(e.fullName) LIKE LOWER(concat('%', :search, '%'))" +
            " OR LOWER(e.employeeCode) LIKE LOWER(concat('%', :search, '%')))" +
            " AND (:status is null OR e.status = :status)")
    Page<Employee> searchEmployees(@Param("search") String searchTerm,
                                   @Param("status") Integer status,
                                   Pageable pageable);
}
