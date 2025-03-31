package com.example.datn.repository;

import com.example.datn.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer> {
    @Query("SELECT c FROM Cart c WHERE c.customer.id = :customerId")
    Optional<Cart> findByCustomerId(@Param("customerId") Integer customerId);

}
